"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdoptionStatus } from "@prisma/client";
import { toast } from "sonner";

/**
 * COMPONENTE: ApprovalModal
 * Descripción: Modal para confirmar la aprobación o el rechazo de una postulación.
 * Requiere: -
 * Implementa: HU-007, RF-011
 */

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: AdoptionStatus, reason?: string) => Promise<void>;
  status: AdoptionStatus;
  petName: string;
  adopterName: string;
}

export function ApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  status,
  petName,
  adopterName,
}: ApprovalModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApproved = status === AdoptionStatus.APPROVED;

  const handleConfirm = async () => {
    if (!isApproved && (!reason || reason.length < 5)) {
      toast.error("Por favor, ingresa una razón válida para el rechazo (mín. 5 caracteres).");
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirm(status, isApproved ? undefined : reason);
      onClose();
      setReason("");
    } catch (error: unknown) {
      console.error("Error en ApprovalModal:", error);
      toast.error("Ocurrió un error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={isApproved ? "text-teal-600" : "text-pink-600"}>
            {isApproved ? "Confirmar Aprobación" : "Confirmar Rechazo"}
          </DialogTitle>
          <DialogDescription>
            {isApproved
              ? `¿Estás seguro de aprobar la solicitud de ${adopterName} para adoptar a ${petName}?`
              : `¿Por qué deseas rechazar la solicitud de ${adopterName} para ${petName}?`}
          </DialogDescription>
        </DialogHeader>

        {!isApproved && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reason">Motivo del rechazo</Label>
              <textarea
                id="reason"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                placeholder="Indica la razón para informar al adoptante..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        {isApproved && (
          <div className="py-4">
            <p className="text-sm text-gray-500 bg-teal-50 p-3 rounded-lg border border-teal-100">
              Al aprobar esta solicitud, la mascota pasará a estado <strong>&quot;En Proceso&quot;</strong> y las demás postulaciones pendientes serán rechazadas automáticamente.
            </p>
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={isApproved ? "bg-teal-600 hover:bg-teal-700" : "bg-pink-600 hover:bg-pink-700"}
          >
            {isSubmitting ? "Procesando..." : isApproved ? "Aprobar" : "Rechazar"}
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
 * Este modal gestiona la confirmación de acciones críticas sobre las postulaciones.
 *
 * Lógica Clave:
 * - Validación Condicional: El campo de 'razón' solo es obligatorio y visible
 *   cuando el estado es 'REJECTED'.
 * - Feedback Visual: Cambia colores y textos según la acción (Aprobación vs Rechazo)
 *   para evitar errores del usuario.
 * - Tipado: Utiliza el enum 'AdoptionStatus' de Prisma para consistencia total.
 *
 * Dependencias Externas:
 * - components/ui/dialog: Basado en Radix UI para accesibilidad.
 * - sonner: Para notificaciones de error locales.
 *
 */
