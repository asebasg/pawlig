"use client";

import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { CRITICAL_ROLE_CHANGES, isCriticalRoleChange } from "@/lib/constants";

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
  if (!isOpen) return null;

  const changeKey = `${currentRole}_TO_${newRole}` as keyof typeof CRITICAL_ROLE_CHANGES;
  const details = CRITICAL_ROLE_CHANGES[changeKey];

  if (!details) {
    // Si por alguna razón el modal se abre para un cambio no crítico, no mostrar nada.
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-4" />
          <h2 className="text-xl font-bold text-gray-800">Confirmación de Cambio Crítico</h2>
        </div>
        <div className="mt-4 text-gray-600">
          <p>{details.message.replace("este usuario", `"${userName}"`)}</p>
          <p className="mt-2 font-semibold text-red-700">{details.warning}</p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Confirmando..." : "Sí, confirmar cambio"}
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
 * **Descripción General:**
 * Este componente define un modal de confirmación que se muestra antes de
 * realizar un cambio de rol considerado "crítico" (ej. promover a ADMIN o
 * degradar un rol con permisos importantes). Su propósito es prevenir
 * acciones accidentales con consecuencias de seguridad o funcionales altas.
 *
 * **Lógica Clave:**
 * - Renderizado Condicional: El modal solo se renderiza si la prop `isOpen`
 *   es `true`, una práctica estándar para controlar la visibilidad.
 * - Mensajes Dinámicos: Utiliza el objeto `CRITICAL_ROLE_CHANGES` importado
 *   desde `lib/constants` para obtener los mensajes (título y advertencia)
 *   específicos para la transición de rol que se está realizando. Esto hace
 *   al modal reutilizable y centraliza la lógica de los mensajes.
 * - Estado de Carga: El modal gestiona un estado `isLoading` para deshabilitar
 *   los botones durante la llamada a la API. Esto previene envíos múltiples
 *   y proporciona retroalimentación visual al usuario.
 *
 * **Dependencias Externas:**
 * - `@/components/ui/button`: Para los botones de acción.
 * - `lucide-react`: Para el icono de advertencia.
 * - `@/lib/constants`: Para obtener los mensajes de advertencia de los
 *   cambios de rol críticos.
 *
 */
