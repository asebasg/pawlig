import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTE: AdoptionConfirmModal
 * Descripción: Modal para confirmar la solicitud de adopción, advirtiendo al usuario y permitiendo enviar un mensaje.
 * Requiere: -
 * Implementa: HU-007
 */

interface AdoptionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => Promise<void>;
  petName: string;
  shelterName: string;
}

export function AdoptionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  petName,
  shelterName,
}: AdoptionConfirmModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(message.trim() || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Solicitar adopción
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-start gap-4 p-4 bg-purple-50 text-purple-900 rounded-xl mb-6 border border-purple-100">
            <AlertCircle className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900">Compromiso de Adopción</h3>
              <p className="text-sm text-purple-800 mt-1">
                Estás a punto de solicitar la adopción de <strong>{petName}</strong> del albergue <strong>{shelterName}</strong>. 
                Una mascota es una responsabilidad para toda la vida. Por favor, asegúrate de tener el tiempo, los recursos y el espacio necesarios.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-semibold text-gray-700">
              Mensaje para el albergue (Opcional)
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Cuéntale al albergue por qué te gustaría adoptar, tu experiencia con mascotas..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-sm text-gray-900"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">{message.length}/500</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white min-w-[140px]"
          >
            {isSubmitting ? "Enviando..." : "Confirmar solicitud"}
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
 * Descripción General:
 * Modal de confirmación para iniciar el proceso de adopción.
 *
 * Lógica Clave:
 * - Evita doble sumisión desactivando botones (isSubmitting).
 * - Permite al usuario enviar un mensaje opcional.
 *
 */
