"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Modal de confirmación usado cuando el usuario intenta abandonar un formulario
 * con contenido pendiente de guardar. Advierte sobre la pérdida de recursos y
 * ofrece una última oportunidad para cancelar la acción.
 */

interface LeaveFormConfirmModalProps {
  /** Controla la visibilidad del modal. */
  isOpen: boolean;
  /** Callback para cerrar el modal sin navegar ni borrar nada. */
  onCancel: () => void;
  /** Callback asíncrono que ejecuta la limpieza y la navegación. */
  onConfirm: () => Promise<void>;
}

export function LeaveFormConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
}: LeaveFormConfirmModalProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLeaving(true);
    try {
      await onConfirm();
    } finally {
      // Solo reseteamos isLeaving si el componente sigue montado.
      // Si onConfirm navega (desmonta el árbol), este setter es un no-op seguro.
      setIsLeaving(false);
    }
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="leave-modal-title"
      aria-describedby="leave-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-100">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
            <AlertTriangle className="w-6 h-6 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="leave-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              ¿Abandonar el formulario?
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Tienes imágenes subidas sin guardar
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div
            id="leave-modal-description"
            className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100"
          >
            <AlertTriangle
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-sm text-red-800 leading-relaxed">
              Si abandonas ahora, las imágenes que subiste serán{" "}
              <strong>eliminadas permanentemente</strong> de nuestro servidor.
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-end gap-3">
          <Button
            id="leave-modal-cancel"
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLeaving}
            className="border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            Quedarme aquí
          </Button>
          <Button
            id="leave-modal-confirm"
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLeaving}
            className="min-w-[140px]"
          >
            {isLeaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Eliminando...
              </>
            ) : (
              "Sí, abandonar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este componente debe mantenerse simple y accesible. Si se cambian los textos,
 * los estilos o el flujo de confirmación, conviene preservar el comportamiento
 * de bloqueo del botón principal durante la operación asíncrona.
 */
