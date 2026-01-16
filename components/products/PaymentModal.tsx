"use client";

import { CreditCard, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-200">
          <div className="p-3 rounded-full bg-sky-100">
            <CreditCard className="w-10 h-10 text-sky-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Finalizar Compra
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-amber-100">
              <ShieldAlert className="w-16 h-16 text-amber-500" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Aviso Importante</h3>
          <p className="text-gray-600">
            Esta es una <span className="font-bold">transacción simulada</span>. No se procesarán pagos reales y no se solicitará información bancaria.
          </p>
          <p className="mt-4 text-gray-600">
            Consulta nuestros <a href="/terms" className="text-purple-700 font-semibold underline">Términos y Condiciones</a> para más información.
          </p>
        </div>

        <DialogFooter className="flex gap-3 pt-2 sm:justify-between w-full">
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
            variant="default"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Procesando..." : "Comprar"}
          </Button>
        </DialogFooter>
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
