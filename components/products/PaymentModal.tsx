"use client";

import { CreditCard, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PaymentModal
 * Descripción: Modal para informar al usuario sobre una transacción simulada.
 * Implementa: Flujo de compra simulado.
 */

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: PaymentModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Encabezado */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="p-3 rounded-full bg-sky-100">
                <CreditCard className="w-10 h-10 text-sky-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Finalizar Compra</h2>
        </div>

        {/* Cuerpo del Contenido */}
        <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
                <ShieldAlert className="w-16 h-16 text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aviso Importante</h3>
            <p className="text-gray-600">
                Esta es una transacción simulada. No se procesarán pagos reales y no se solicitará información bancaria.
            </p>
        </div>

        {/* Pie de Página (Acciones) */}
        <div className="flex gap-4 p-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 gap-2 bg-sky-600 hover:bg-sky-700 text-white"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Procesando..." : "Comprar"}
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
 * Este componente renderiza un modal que informa al usuario que la transacción
 * es simulada. Está diseñado para ser genérico y reutilizable en diferentes
 * flujos de compra de la aplicación.
 *
 * Lógica Clave:
 * - El modal se muestra u oculta basado en la prop `isOpen`.
 * - Los botones de acción ("Cancelar", "Comprar") están deshabilitados
 *   cuando la prop `isLoading` es `true` para prevenir interacciones múltiples.
 * - Los callbacks `onClose` y `onConfirm` son proporcionados por el componente
 *   padre para manejar la lógica de negocio.
 *
 * Dependencias Externas:
 * - lucide-react: Para la iconografía (CreditCard, ShieldAlert, Loader2).
 * - @/components/ui/button: Componente de botón reutilizable de la UI.
 *
 */
