/**
 * Descripcion: Suite de pruebas unitarias para el hook useUnsavedImagesGuard.
 * Requiere: jsdom, fake timers de Vitest, mocks de next/navigation y cloudinary-helpers.
 * Implementa: Cobertura de los flujos de navegacion, inactividad, beforeunload y popstate.
 */

import { renderHook, act } from "@testing-library/react";
import { useUnsavedImagesGuard } from "./use-unsaved-images-guard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ImageUploadItem } from "@/types/upload.types";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/lib/utils/cloudinary-helpers", () => ({
  extractPublicId: vi.fn((url: string) =>
    url.includes("pawlig") ? "pawlig/test" : null
  ),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

// ---------------------------------------------------------------------------
// HELPERS DE TEST
// ---------------------------------------------------------------------------

const CLOUDINARY_URL = "https://res.cloudinary.com/demo/image/upload/pawlig/test.png";
const INACTIVITY_MS = 10 * 60 * 1000;

function makeImageItem(overrides: Partial<ImageUploadItem> = {}): ImageUploadItem {
  return {
    id: "img-1",
    file: new File([""], "test.png"),
    status: "success",
    cloudinaryUrl: CLOUDINARY_URL,
    error: null,
    previewUrl: "blob:test",
    ...overrides,
  };
}

function makeRouter() {
  return {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// SUITE PRINCIPAL
// ---------------------------------------------------------------------------

describe("useUnsavedImagesGuard", () => {
  let mockRouter: ReturnType<typeof makeRouter>;
  const mockSetImageItems = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter = makeRouter();
    vi.mocked(useRouter).mockReturnValue(
      mockRouter as unknown as ReturnType<typeof useRouter>
    );

    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    Object.defineProperty(navigator, "sendBeacon", {
      writable: true,
      value: vi.fn(() => true),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // -------------------------------------------------------------------------
  // ESTADO INICIAL
  // -------------------------------------------------------------------------

  describe("estado inicial", () => {
    it("debe retornar los valores por defecto correctos", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({ imageItems: [], setImageItems: mockSetImageItems })
      );

      expect(result.current.showLeaveModal).toBe(false);
      expect(result.current.isLocked).toBe(false);
      expect(result.current.showTimeoutModal).toBe(false);
      expect(result.current.hasSubmittedSuccessfullyRef.current).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // requestNavigation
  // -------------------------------------------------------------------------

  describe("requestNavigation", () => {
    it("debe navegar con push directamente si no hay imágenes pendientes", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({ imageItems: [], setImageItems: mockSetImageItems })
      );

      act(() => {
        result.current.requestNavigation("/shelter/pets");
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/shelter/pets");
      expect(result.current.showLeaveModal).toBe(false);
    });

    it("debe llamar router.back() directamente si no hay imágenes y no se pasa destino", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({ imageItems: [], setImageItems: mockSetImageItems })
      );

      act(() => {
        result.current.requestNavigation();
      });

      expect(mockRouter.back).toHaveBeenCalled();
      expect(result.current.showLeaveModal).toBe(false);
    });

    it("debe abrir el modal de abandono si hay imágenes pendientes", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation("/shelter/pets");
      });

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(result.current.showLeaveModal).toBe(true);
    });

    it("debe abrir el modal con tipo back si no se pasa destino y hay imágenes", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation();
      });

      expect(result.current.showLeaveModal).toBe(true);
      expect(mockRouter.back).not.toHaveBeenCalled();
    });

    it("debe navegar directamente si markAsSubmitted fue llamado previamente", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.markAsSubmitted();
        result.current.requestNavigation("/shelter/pets");
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/shelter/pets");
      expect(result.current.showLeaveModal).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // onCancelLeave
  // -------------------------------------------------------------------------

  describe("onCancelLeave", () => {
    it("debe cerrar el modal sin navegar ni limpiar imágenes", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation("/shelter/pets");
      });

      expect(result.current.showLeaveModal).toBe(true);

      act(() => {
        result.current.onCancelLeave();
      });

      expect(result.current.showLeaveModal).toBe(false);
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(mockSetImageItems).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // onConfirmLeave
  // -------------------------------------------------------------------------

  describe("onConfirmLeave", () => {
    it("debe llamar fetch, limpiar estado y navegar con push al confirmar", async () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation("/shelter/pets");
      });

      await act(async () => {
        await result.current.onConfirmLeave();
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockSetImageItems).toHaveBeenCalledWith([]);
      expect(result.current.showLeaveModal).toBe(false);
      expect(mockRouter.push).toHaveBeenCalledWith("/shelter/pets");
    });

    it("debe ejecutar history.back() si la navegación pendiente es de tipo back", async () => {
      const historyBackSpy = vi.spyOn(history, "back").mockImplementation(() => {});

      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation();
      });

      await act(async () => {
        await result.current.onConfirmLeave();
      });

      expect(historyBackSpy).toHaveBeenCalled();
      expect(mockRouter.push).not.toHaveBeenCalled();

      historyBackSpy.mockRestore();
    });

    it("debe mostrar toast de error y continuar navegando si fetch falla", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation("/shelter/pets");
      });

      await act(async () => {
        await result.current.onConfirmLeave();
      });

      expect(toast.error).toHaveBeenCalled();
      expect(mockSetImageItems).toHaveBeenCalledWith([]);
      expect(mockRouter.push).toHaveBeenCalledWith("/shelter/pets");
    });

    it("no debe llamar fetch si no hay imágenes con URL válida", async () => {
      const itemSinUrl = makeImageItem({ cloudinaryUrl: null, status: "pending" });

      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [itemSinUrl],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.requestNavigation("/shelter/pets");
      });

      await act(async () => {
        await result.current.onConfirmLeave();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // registerActivity e inactividad
  // -------------------------------------------------------------------------

  describe("registerActivity e inactividad", () => {
    it("debe bloquear el formulario y mostrar el modal tras 10 minutos de inactividad", async () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.registerActivity();
      });

      expect(result.current.isLocked).toBe(false);

      await act(async () => {
        vi.advanceTimersByTime(INACTIVITY_MS);
        await Promise.resolve();
      });

      expect(result.current.isLocked).toBe(true);
      expect(result.current.showTimeoutModal).toBe(true);
      expect(mockSetImageItems).toHaveBeenCalledWith([]);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("debe reiniciar el temporizador al registrar actividad nuevamente", async () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.registerActivity();
      });

      // Avanzar 9 minutos y registrar actividad de nuevo
      act(() => {
        vi.advanceTimersByTime(9 * 60 * 1000);
        result.current.registerActivity();
      });

      // Avanzar 9 minutos más (18 min totales desde el inicio, pero solo 9 desde el reinicio)
      await act(async () => {
        vi.advanceTimersByTime(9 * 60 * 1000);
        await Promise.resolve();
      });

      // No debe haberse bloqueado aún
      expect(result.current.isLocked).toBe(false);
    });

    it("no debe iniciar el temporizador si el formulario ya está bloqueado", async () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      // Bloquear el formulario por inactividad
      act(() => {
        result.current.registerActivity();
      });

      await act(async () => {
        vi.advanceTimersByTime(INACTIVITY_MS);
        await Promise.resolve();
      });

      expect(result.current.isLocked).toBe(true);
      vi.clearAllMocks();

      // Intentar registrar actividad con el formulario bloqueado
      act(() => {
        result.current.registerActivity();
      });

      await act(async () => {
        vi.advanceTimersByTime(INACTIVITY_MS);
        await Promise.resolve();
      });

      // fetch no debe haberse llamado de nuevo
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("no debe ejecutar la limpieza si markAsSubmitted fue llamado antes del timeout", async () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.registerActivity();
        result.current.markAsSubmitted();
      });

      await act(async () => {
        vi.advanceTimersByTime(INACTIVITY_MS);
        await Promise.resolve();
      });

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result.current.isLocked).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // beforeunload
  // -------------------------------------------------------------------------

  describe("beforeunload", () => {
    it("debe llamar sendBeacon y prevenir el cierre si hay imágenes pendientes", () => {
      renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      const event = new Event("beforeunload") as BeforeUnloadEvent;
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      act(() => {
        window.dispatchEvent(event);
      });

      expect(navigator.sendBeacon).toHaveBeenCalledWith(
        "/api/cloudinary/cleanup",
        expect.any(Blob)
      );
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("no debe llamar sendBeacon si no hay imágenes con URL válida", () => {
      renderHook(() =>
        useUnsavedImagesGuard({ imageItems: [], setImageItems: mockSetImageItems })
      );

      act(() => {
        window.dispatchEvent(new Event("beforeunload"));
      });

      expect(navigator.sendBeacon).not.toHaveBeenCalled();
    });

    it("no debe llamar sendBeacon si el submit fue exitoso", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        result.current.markAsSubmitted();
      });

      act(() => {
        window.dispatchEvent(new Event("beforeunload"));
      });

      expect(navigator.sendBeacon).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // popstate (navegación hacia atrás del navegador)
  // -------------------------------------------------------------------------

  describe("popstate", () => {
    it("debe abrir el modal de abandono al detectar popstate con imágenes pendientes", () => {
      vi.spyOn(history, "pushState").mockImplementation(() => {});

      const { result } = renderHook(() =>
        useUnsavedImagesGuard({
          imageItems: [makeImageItem()],
          setImageItems: mockSetImageItems,
        })
      );

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      expect(result.current.showLeaveModal).toBe(true);
    });

    it("no debe abrir el modal si no hay imágenes pendientes al detectar popstate", () => {
      const { result } = renderHook(() =>
        useUnsavedImagesGuard({ imageItems: [], setImageItems: mockSetImageItems })
      );

      act(() => {
        window.dispatchEvent(new PopStateEvent("popstate"));
      });

      expect(result.current.showLeaveModal).toBe(false);
    });
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripcion General:
 * Pruebas unitarias del hook useUnsavedImagesGuard que cubre los flujos de
 * navegacion controlada, inactividad, cierre de pestaña y popstate.
 *
 * Logica Clave:
 * - Se usan fake timers de Vitest para simular el timeout de 10 minutos sin
 *   esperar tiempo real en la suite.
 * - navigator.sendBeacon se redefine como writable en cada beforeEach para
 *   garantizar aislamiento entre tests.
 * - history.pushState y history.back se espian con mockImplementation vacia
 *   para evitar errores de JSDOM con la API de historial.
 *
 * Dependencias Externas:
 * - @testing-library/react: renderHook y act para interactuar con el hook.
 * - vitest: fake timers, mocks y spies.
 *
 */
