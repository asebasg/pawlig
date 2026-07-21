"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

/**
 * Modal informativo que aparece cuando un formulario queda inactivo durante el
 * tiempo máximo permitido. Informa al usuario que el contenido pendiente fue
 * descartado y le ofrece reiniciar la experiencia.
 * Utiliza el sistema de diseño estandarizado de diálogos con backdrop oscuro (bg-black/80).
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
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md bg-white p-0 overflow-hidden gap-0 rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <AlertDialogHeader className="flex flex-row items-center gap-4 p-6 border-b border-gray-100 space-y-0 text-left">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-50">
            <Clock className="w-6 h-6 text-amber-500" aria-hidden="true" />
          </div>
          <div>
            <AlertDialogTitle
              id="timeout-modal-title"
              className="text-lg font-bold text-gray-900 text-center"
            >
              Tiempo límite alcanzado
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-0.5 text-center">
              Has estado inactivo durante 10 minutos
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Body */}
        <div className="p-6">
          <p
            id="timeout-modal-description"
            className="text-sm text-gray-600 leading-relaxed"
          >
            Por motivos de seguridad y para proteger su información, la sesión ha
            expirado. Los archivos y datos cargados temporalmente han sido
            eliminados de nuestros servidores. Le solicitamos reiniciar el proceso
            para completar su formulario de manera segura.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-end">
          <Button
            id="timeout-modal-acknowledge"
            type="button"
            onClick={handleAcknowledge}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Entendido
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este modal utiliza AlertDialog de UI para garantizar un overlay consistente
 * con bg-black/80 y backdrop-blur-sm en todo el ecosistema de PawLig.
 * No necesita un flujo de cancelación porque el estado del formulario ya fue
 * descartado antes de mostrarlo.
 */
