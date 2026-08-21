"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

/**
 * Modal de confirmación usado cuando el usuario intenta abandonar un formulario
 * con contenido pendiente de guardar. Advierte sobre la pérdida de recursos y
 * ofrece una última oportunidad para cancelar la acción.
 * Utiliza el sistema de diseño estandarizado de diálogos con backdrop oscuro (bg-black/80).
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
      setIsLeaving(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <AlertDialogContent className="sm:max-w-md bg-white p-0 overflow-hidden gap-0 rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <AlertDialogHeader className="flex flex-row items-center gap-4 p-6 border-b border-gray-100 space-y-0 text-left">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
            <AlertTriangle className="w-6 h-6 text-red-600" aria-hidden="true" />
          </div>
          <div>
            <AlertDialogTitle
              id="leave-modal-title"
              className="text-lg font-bold text-gray-900"
            >
              ¿Abandonar el formulario?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-0.5">
              Tienes imágenes subidas sin guardar
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

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
            className="border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl"
          >
            Quedarme aquí
          </Button>
          <Button
            id="leave-modal-confirm"
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLeaving}
            className="min-w-[140px] rounded-xl"
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
      </AlertDialogContent>
    </AlertDialog>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este componente utiliza AlertDialog de UI para garantizar un overlay consistente
 * con bg-black/80 y backdrop-blur-sm en todo el ecosistema de PawLig.
 */
