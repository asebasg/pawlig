"use client";

/**
 * Hook de protección para formularios con imágenes pendientes de guardar.
 * Detecta abandono del formulario, inactividad prolongada y navegación interna
 * para limpiar recursos en Cloudinary antes de que queden huérfanos.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ImageUploadItem } from "@/types/upload.types";
import { extractPublicId } from "@/lib/utils/cloudinary-helpers";

// ---------------------------------------------------------------------------
// CONSTANTES
// ---------------------------------------------------------------------------

/** Ruta del endpoint de limpieza en lote. */
const CLEANUP_ENDPOINT = "/api/cloudinary/cleanup";

/** Tiempo de inactividad en ms antes de bloquear el formulario (10 minutos). */
const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

// ---------------------------------------------------------------------------
// TIPOS DEL HOOK
// ---------------------------------------------------------------------------

/**
 * Tipo de la intención de navegación pendiente.
 * - "push": el usuario pulsó el botón Cancelar interno → navegar a `destination`.
 * - "back": el usuario pulsó el botón Atrás del navegador → ejecutar history.back().
 */
type PendingNavigation =
  | { type: "push"; destination: string }
  | { type: "back" };

export interface UseUnsavedImagesGuardReturn {
  /**
   * Marca el formulario como enviado correctamente.
   * Debe invocarse cuando el guardado en el servidor ya terminó para evitar que
   * los mecanismos de protección limpien recursos que ya quedaron persistidos.
   */
  markAsSubmitted: () => void;

  /** Ref interno del estado de submit. Expuesto para lecturas síncronas. */
  hasSubmittedSuccessfullyRef: React.RefObject<boolean>;

  /**
   * Solicita una navegación controlada por el guardia.
   * Si existen imágenes pendientes, muestra un modal de confirmación antes de
   * continuar; de lo contrario, navega de inmediato.
   *
   * @param destination - Ruta de destino cuando la navegación es interna.
   */
  requestNavigation: (destination?: string) => void;

  /** Controla la visibilidad del modal de confirmación de abandono. */
  showLeaveModal: boolean;

  /** Cierra el modal sin navegar ni borrar nada. */
  onCancelLeave: () => void;

  /** Ejecuta la limpieza vía fetch y navega al destino pendiente. */
  onConfirmLeave: () => Promise<void>;

  /**
   * Registra actividad del usuario y reinicia el temporizador de inactividad.
   * Se suele invocar desde los eventos de interacción del formulario y cuando una
   * imagen termina de cargarse correctamente.
   */
  registerActivity: () => void;

  /**
   * true cuando el formulario debe deshabilitarse por expiración de inactividad.
   * Los campos input/select/textarea y el botón submit deben leer este flag.
   */
  isLocked: boolean;

  /** Controla la visibilidad del modal de tiempo límite. */
  showTimeoutModal: boolean;
}

export interface UseUnsavedImagesGuardOptions {
  /** Lista completa de ítems de imagen con su ciclo de vida. */
  imageItems: ImageUploadItem[];
  /**
   * Setter del estado imageItems del formulario.
   * El hook lo llama con [] al confirmar navegación o al expirar el temporizador,
   * para que el beforeunload no haga una doble limpieza.
   */
  setImageItems: (items: ImageUploadItem[]) => void;
}

// ---------------------------------------------------------------------------
// HELPERS INTERNOS
// ---------------------------------------------------------------------------

/**
 * Construye el payload JSON para el endpoint de limpieza.
 * Filtra solo items con status "success", cloudinaryUrl válida y publicId derivable.
 */
function buildCleanupPayload(
  imageItems: ImageUploadItem[]
): Array<{ url: string }> {
  return imageItems
    .filter(
      (item): item is ImageUploadItem & { cloudinaryUrl: string } =>
        item.status === "success" && item.cloudinaryUrl !== null
    )
    .filter((item) => extractPublicId(item.cloudinaryUrl) !== null)
    .map((item) => ({ url: item.cloudinaryUrl }));
}

/**
 * Envía el payload de limpieza usando navigator.sendBeacon.
 * Usado para beforeunload (la página puede cerrarse antes de que fetch resuelva).
 * El Blob debe especificar type "application/json" para que Next.js parsee el body.
 */
function sendCleanupBeacon(images: Array<{ url: string }>): boolean {
  const body = JSON.stringify({ images });
  const blob = new Blob([body], { type: "application/json" });
  return navigator.sendBeacon(CLEANUP_ENDPOINT, blob);
}

/**
 * Llama al endpoint de limpieza vía fetch await-able.
 * Usado cuando la pestaña sigue abierta y podemos esperar la respuesta.
 *
 * @throws Error si la respuesta HTTP no es ok.
 */
async function fetchCleanup(images: Array<{ url: string }>): Promise<void> {
  const response = await fetch(CLEANUP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ images }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ||
        `Error ${response.status} al limpiar imágenes`
    );
  }
}

// ---------------------------------------------------------------------------
// HOOK PRINCIPAL
// ---------------------------------------------------------------------------

/**
 * Hook que vigila las imágenes subidas en un formulario y gestiona su eliminación
 * de Cloudinary si el usuario abandona la página o queda inactivo 10 minutos.
 *
 * Uso básico en el formulario consumidor:
 *
 *   const {
 *     markAsSubmitted,
 *     requestNavigation,
 *     registerActivity,
 *     isLocked,
 *     showLeaveModal, onCancelLeave, onConfirmLeave,
 *     showTimeoutModal,
 *   } = useUnsavedImagesGuard({ imageItems, setImageItems });
 *
 *   // Formulario: registrar actividad via bubbling
 *   <form onInput={registerActivity} ...>
 *
 *   // Botón Cancelar:
 *   <button onClick={() => requestNavigation("/shelter/pets")} disabled={isLocked}>
 *
 *   // Al final del JSX:
 *   <LeaveFormConfirmModal isOpen={showLeaveModal} onCancel={onCancelLeave} onConfirm={onConfirmLeave} />
 *   <FormTimeoutModal isOpen={showTimeoutModal} />
 */
export function useUnsavedImagesGuard({
  imageItems,
  setImageItems,
}: UseUnsavedImagesGuardOptions): UseUnsavedImagesGuardReturn {
  const router = useRouter();

  // -------------------------------------------------------------------------
  // Ref para identificar si el envío ya terminó con éxito.
  // -------------------------------------------------------------------------
  const hasSubmittedSuccessfullyRef = useRef<boolean>(false);

  const markAsSubmitted = useCallback(() => {
    hasSubmittedSuccessfullyRef.current = true;
  }, []);

  // -------------------------------------------------------------------------
  // Estado del modal y la navegación pendiente.
  // -------------------------------------------------------------------------
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Intención de navegación guardada en ref para acceso síncrono en onConfirmLeave.
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);

  // Evita insertar el centinela de historial más de una vez.
  const sentinelPushedRef = useRef<boolean>(false);

  // -------------------------------------------------------------------------
  // Estado de bloqueo por inactividad.
  // -------------------------------------------------------------------------
  const [isLocked, setIsLocked] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  // Ref del setTimeout del temporizador de inactividad.
  // Se guarda en ref para poder limpiarlo/reiniciarlo sin re-renders.
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // -------------------------------------------------------------------------
  // Reinicio del temporizador tras actividad del usuario.
  // -------------------------------------------------------------------------
  const registerActivity = useCallback(() => {
    // Si el formulario ya está bloqueado o el submit fue exitoso, no hacer nada.
    if (isLocked || hasSubmittedSuccessfullyRef.current) return;

    // Limpiar el timer anterior.
    if (inactivityTimerRef.current !== null) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Arrancar un nuevo timer de 10 minutos.
    inactivityTimerRef.current = setTimeout(async () => {
      // Solo actuar si hay imágenes sin guardar y no se hizo submit.
      if (hasSubmittedSuccessfullyRef.current) return;

      const images = buildCleanupPayload(imageItems);

      // 1. Bloquear el formulario de inmediato para impedir nuevas interacciones.
      setIsLocked(true);

      // 2. Limpiar imágenes vía fetch (la pestaña sigue abierta).
      if (images.length > 0) {
        try {
          await fetchCleanup(images);
        } catch (error) {
          console.error("[useUnsavedImagesGuard] Error en limpieza por inactividad:", error);
          // No bloqueamos el flujo — el modal se muestra igual.
        }
      }

      // 3. Silenciar el guardia de beforeunload para evitar doble limpieza.
      hasSubmittedSuccessfullyRef.current = true;
      setImageItems([]);

      // 4. Mostrar el modal de tiempo límite.
      setShowTimeoutModal(true);
    }, INACTIVITY_TIMEOUT_MS);
  }, [isLocked, imageItems, setImageItems]);

  // Limpiar el timer al desmontar el componente.
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current !== null) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Interceptación de navegación hacia atrás.
  // -------------------------------------------------------------------------
  useEffect(() => {
    const hasUnsaved = buildCleanupPayload(imageItems).length > 0;
    if (!hasUnsaved || hasSubmittedSuccessfullyRef.current) return;

    if (!sentinelPushedRef.current) {
      history.pushState(null, "", location.href);
      sentinelPushedRef.current = true;
    }

    const handlePopState = () => {
      if (hasSubmittedSuccessfullyRef.current) return;
      const images = buildCleanupPayload(imageItems);
      if (images.length === 0) return;

      history.pushState(null, "", location.href);
      pendingNavigationRef.current = { type: "back" };
      setShowLeaveModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [imageItems]);

  // -------------------------------------------------------------------------
  // Protección ante cierre o recarga de la pestaña.
  // -------------------------------------------------------------------------
  useEffect(() => {
    /**
     * LIMITACIÓN DOCUMENTADA (plataforma web, no de diseño):
     * sendBeacon se dispara ANTES de que el usuario confirme el diálogo nativo.
     * Si cancela el cierre, las imágenes ya se habrán enviado a borrar.
     * Este handler cubre también recarga (F5/Ctrl+R).
     */
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasSubmittedSuccessfullyRef.current) return;
      const images = buildCleanupPayload(imageItems);
      if (images.length === 0) return;
      sendCleanupBeacon(images);
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [imageItems]);

  // -------------------------------------------------------------------------
  // Solicitud de navegación controlada.
  // -------------------------------------------------------------------------
  const requestNavigation = useCallback(
    (destination?: string) => {
      const images = buildCleanupPayload(imageItems);

      if (images.length === 0 || hasSubmittedSuccessfullyRef.current) {
        destination ? router.push(destination) : router.back();
        return;
      }

      pendingNavigationRef.current = destination
        ? { type: "push", destination }
        : { type: "back" };
      setShowLeaveModal(true);
    },
    [imageItems, router]
  );

  // -------------------------------------------------------------------------
  // Cierre del modal sin abandonar el formulario.
  // -------------------------------------------------------------------------
  const onCancelLeave = useCallback(() => {
    pendingNavigationRef.current = null;
    setShowLeaveModal(false);
  }, []);

  // -------------------------------------------------------------------------
  // Confirmación del abandono y limpieza de recursos pendientes.
  // -------------------------------------------------------------------------
  const onConfirmLeave = useCallback(async () => {
    const images = buildCleanupPayload(imageItems);

    if (images.length > 0) {
      try {
        await fetchCleanup(images);
      } catch (error) {
        console.error("[useUnsavedImagesGuard] Error en limpieza al confirmar:", error);
        toast.error("No se pudieron eliminar las imágenes del servidor. Continuando...");
      }
    }

    // Vaciar estado y silenciar beforeunload para evitar doble limpieza.
    setImageItems([]);
    hasSubmittedSuccessfullyRef.current = true;
    setShowLeaveModal(false);

    const pending = pendingNavigationRef.current;
    pendingNavigationRef.current = null;

    if (pending?.type === "push") {
      router.push(pending.destination);
    } else {
      history.back();
    }
  }, [imageItems, setImageItems, router]);

  // -------------------------------------------------------------------------
  // RETORNO DEL HOOK
  // -------------------------------------------------------------------------
  return {
    markAsSubmitted,
    hasSubmittedSuccessfullyRef,
    requestNavigation,
    showLeaveModal,
    onCancelLeave,
    onConfirmLeave,
    registerActivity,
    isLocked,
    showTimeoutModal,
  };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE MANTENIMIENTO
 * ---------------------------------------------------------------------------
 *
 * Este hook centraliza la Protección del formulario frente a escenarios como
 * cierre de pestaña, recarga, navegación interna o inactividad prolongada.
 * Mantener su lógica simple ayuda a evitar que los recursos pendientes queden
 * huérfanos en Cloudinary.
 */
