"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Modal informativo que aparece cuando un formulario queda inactivo durante el
 * tiempo máximo permitido. Informa al usuario que el contenido pendiente fue
 * descartado y le ofrece reiniciar la experiencia.
 */

interface FormTimeoutModalProps {
  /** Controla la visibilidad del modal. */
  isOpen: boolean;
}

export function FormTimeoutModal({ isOpen }: FormTimeoutModalProps) {
  if (!isOpen) return null;

  const handleAcknowledge = () => {
    window.location.reload();
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="timeout-modal-title"
      aria-describedby="timeout-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-gray-100">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-50">
            <Clock className="w-6 h-6 text-amber-500" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="timeout-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              Tiempo límite alcanzado
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              El formulario estuvo inactivo por 10 minutos
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p
            id="timeout-modal-description"
            className="text-sm text-gray-600 leading-relaxed"
          >
            Por seguridad, las imágenes que habías subido fueron{" "}
            <strong>eliminadas automáticamente</strong> de nuestro servidor ya
            que el formulario no se completó en el tiempo límite. Puedes volver
            a empezar recargando la página.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-end">
          <Button
            id="timeout-modal-acknowledge"
            type="button"
            onClick={handleAcknowledge}
            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]"
          >
            Entendido — Reiniciar
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
 * Este modal es deliberadamente simple: no necesita un flujo de cancelación
 * porque el estado del formulario ya fue descartado antes de mostrarlo.
 * Cualquier cambio visual o de copy debe mantener el mensaje claro y directo.
 */
