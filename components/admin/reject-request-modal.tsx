"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  title: string;
  targetName: string;
}

export function RejectRequestModal({ isOpen, onClose, onConfirm, title, targetName }: RejectRequestModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 5) return;

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
          <div className="p-3 rounded-full bg-red-100">
            <AlertTriangle className="w-10 h-10 text-red-600" />
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
              Motivo del rechazo <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ejemplo: No cumple con los requisitos de infraestructura..."
              rows={3}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={loading}
              required
              minLength={5}
              maxLength={500}
            />
            <p className="mt-1 text-sm text-gray-500">
              Mínimo 5 caracteres ({reason.length}/500)
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
              disabled={loading || reason.trim().length < 5}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Rechazar solicitud"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
