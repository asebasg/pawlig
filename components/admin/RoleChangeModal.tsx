"use client";

import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { CRITICAL_ROLE_CHANGES } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * Descripción: Modal de confirmación para cambios de rol de usuario que implican riesgos o pérdida de datos.
 * Requiere: Propiedades de rol actual, nuevo rol y estado de apertura.
 * Implementa: Salvaguarda de integridad de datos en gestión de usuarios.
 */

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  newRole: UserRole;
  userName: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export function RoleChangeModal({
  isOpen,
  onClose,
  currentRole,
  newRole,
  userName,
  onConfirm,
  isLoading,
}: RoleChangeModalProps) {

  const changeKey = `${currentRole}_TO_${newRole}` as keyof typeof CRITICAL_ROLE_CHANGES;
  const details = CRITICAL_ROLE_CHANGES[changeKey];

  if (!details && isOpen) {
    // Si la transicion no es crítica, no debería mostrarse este modal.
    // Podríamos retornar null, pero si isOpen es true, algo raro pasa.
    // De todos modos, para mantener lógica anterior:
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader className="flex flex-row items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
          <DialogTitle className="text-xl font-bold text-foreground">
            Confirmación de cambio crítico
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 text-muted-foreground text-center">
          <p>{details?.message.replace("este usuario", `"${userName}"`)}</p>
          <p className="mt-2 font-semibold text-red-700 text-center">{details?.warning}</p>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Confirmando..." : "Sí, confirmar cambio"}
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
 * **Descripción General:**
 * Este componente define un modal de confirmación usando `Dialog` de shadcn/ui.
 * Se muestra antes de realizar un cambio de rol considerado "crítico".
 *
 * **Lógica Clave:**
 * - Renderizado Condicional: Usa la primitiva Dialog `open={isOpen}`.
 * - Mensajes Dinámicos: Utiliza `CRITICAL_ROLE_CHANGES` para obtener los mensajes.
 * - Estado de Carga: Gestiona `isLoading` para deshabilitar botones.
 *
 * **Dependencias Externas:**
 * - `@/components/ui/dialog`: Componente base de modal.
 * - `@/components/ui/button`: Para los botones de acción.
 * - `lucide-react`: Para el icono de advertencia.
 */
