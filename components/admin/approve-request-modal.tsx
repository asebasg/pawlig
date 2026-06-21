"use client";

import React, { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AiRefineButton } from "@/components/ui/ai-refine-button";

/**
 * Descripción: Modal de confirmación para aprobar solicitudes de albergues y vendors.
 * Requiere: Props de título, nombre del solicitante y callbacks onClose y onConfirm.
 * Implementa: ISSUE-147
 */

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  title: string;
  targetName: string;
}

export function ApproveRequestModal({ isOpen, onClose, onConfirm, title, targetName }: ApproveRequestModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) return;

    try {
      setLoading(true);
      await onConfirm(reason.trim());
      setReason("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader className="flex flex-col items-center gap-4 border-b border-gray-200 pb-6">
          <div className="p-3 rounded-full bg-green-100">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg text-left p-3">
            <p className="text-sm text-gray-600 font-bold">Solicitante:</p>
            <p className="font-semibold text-gray-900">{targetName}</p>
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de la aprobación <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ejemplo: Cumple con todos los requisitos de infraestructura y documentación..."
                rows={4}
                className="text-black w-full px-4 py-2 pb-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                disabled={loading}
                required
                minLength={10}
                maxLength={500}
              />
              <AiRefineButton
                currentText={reason}
                onRefined={setReason}
                type="moderation"
                disabled={loading}
                className="absolute bottom-2 right-2 h-8 text-green-700 hover:text-green-800 transition-colors"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Mínimo 10 caracteres ({reason.length}/500)
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-left w-full">
            <p className="text-sm text-green-800 break-words whitespace-normal font-medium">
              <strong>Nota:</strong> Esta acción se registrará en el historial de auditoría y el solicitante será notificado.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 10}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Aprobar solicitud"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Modal de confirmación de aprobaciones administrativas. Estructuralmente similar
 * a RejectRequestModal, pero con paleta de colores verde para reflejar accion positiva.
 *
 * Lógica Clave:
 * - Obliga al admin a ingresar una razon formal de minimo 10 caracteres antes de aprobar.
 * - Integra AiRefineButton para formalizar la razon con IA (tipo moderation).
 * - El boton de confirmacion permanece deshabilitado hasta cumplir la validacion.
 *
 * Dependencias Externas:
 * - @/components/ui/dialog: Para la estructura del modal.
 * - @/components/ui/ai-refine-button: Boton reutilizable de IA.
 * - lucide-react: Para los iconos.
 *
 */
