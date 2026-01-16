"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { roleUpdateSchema, RoleUpdateInput } from "@/lib/validations/user.schema";
import { isCriticalRoleChange } from "@/lib/constants";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RoleChangeModal } from "./RoleChangeModal";
import { Shield, Save } from "lucide-react";
import Loader from '@/components/ui/loader';

/**
 * Descripción: Muestra el historial de auditoría de acciones realizadas sobre un usuario.
 * Requiere: Lista de registros de auditoría (AuditRecord[]).
 * Implementa: Registro histórico de gestión administrativa.
 */

type UserData = {
  id: string;
  name: string;
  role: UserRole;
};

interface UserViewClientProps {
  user: UserData;
}

export default function UserViewClient({ user }: UserViewClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors, isDirty },
  } = useForm<RoleUpdateInput>({
    resolver: zodResolver(roleUpdateSchema),
    defaultValues: {
      newRole: user.role,
      reason: "",
    },
  });

  const selectedRole = watch("newRole");

  const onSubmit = async (data: RoleUpdateInput) => {
    setIsLoading(true);
    const toastId = toast.loading("Actualizando rol...");

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo actualizar el rol");
      }

      toast.success("Rol actualizado correctamente", { id: toastId });

      // Actualización optimista de la UI
      reset({ ...data }); // Resetea el form state a los nuevos valores
      router.refresh(); // Refresca los Server Components en la página

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const { newRole } = getValues();
    if (user.role === newRole) return; // No hacer nada si el rol no ha cambiado

    if (isCriticalRoleChange(user.role, newRole)) {
      setShowConfirmationModal(true);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleConfirmRoleChange = () => {
    setShowConfirmationModal(false);
    handleSubmit(onSubmit)();
  };


  return (
    <>
      <Card accentColor="purple">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Gestión de Roles</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRoleChangeRequest} className="space-y-4">
            <Controller
              name="newRole"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="newRole">Rol del Usuario</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="newRole">
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Input
                  label="Razón del cambio (requerido)"
                  id="reason"
                  placeholder="Especifique por qué se cambia el rol..."
                  {...field}
                  disabled={isLoading}
                  className={errors.reason ? "border-pink-600" : ""}
                />
              )}
            />
            {errors.reason && <p className="text-sm text-pink-600">{errors.reason.message}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty || isLoading}>
                {isLoading ? (
                  <Loader />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <RoleChangeModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        currentRole={user.role}
        newRole={selectedRole}
        userName={user.name}
        onConfirm={handleConfirmRoleChange}
        isLoading={isLoading}
      />
    </>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este es el Client Component principal para la vista de detalle de usuario.
 * Se encarga de la interactividad, específicamente la gestión del formulario
 * para cambiar roles, la comunicación con la API y la orquestación de la
 * retroalimentación al usuario (modales y toasts).
 *
 * **Lógica Clave:**
 * - Gestión de Formulario con `react-hook-form`:
 *   - Se utiliza `zodResolver` para integrar la validación de `roleUpdateSchema`.
 *   - El estado `isDirty` es crucial para habilitar el botón de "Guardar"
 *     solo cuando se han realizado cambios, mejorando la UX.
 * - Flujo de Envío con Confirmación:
 *   - Al intentar guardar, `handleRoleChangeRequest` intercepta el evento.
 *   - Utiliza `isCriticalRoleChange` para decidir si la acción requiere una
 *     confirmación extra. Si es así, muestra el `RoleChangeModal`. Si no,
 *     procede directamente con el envío.
 * - Comunicación con la API y Retroalimentación:
 *   - La función `onSubmit` es asíncrona y maneja la llamada `fetch` al
 *     endpoint PUT.
 *   - Se utiliza `sonner` para dar retroalimentación inmediata sobre el
 *     proceso (loading, success, error), mejorando la percepción del
 *     rendimiento por parte del usuario.
 * - Actualización Optimista y Sincronización:
 *   - En caso de éxito, `router.refresh()` es llamado. Esta es una
 *     característica potente de Next.js App Router que vuelve a buscar los
 *     datos de los Server Components en la página actual sin una recarga
 *     completa, mostrando la información actualizada.
 *   - `reset({ ...data })` actualiza el estado `defaultValues` del formulario,
 *     de modo que `isDirty` se vuelve `false` hasta que se realice un nuevo
 *     cambio.
 *
 * **Dependencias Externas:**
 * - `react-hook-form` y `@hookform/resolvers/zod`: Para una gestión robusta
 *   y validada de formularios.
 * - `sonner`: Para mostrar notificaciones (toasts) no intrusivas.
 * - `@/lib/constants`: Para la lógica que determina si un cambio es crítico.
 * - Componentes UI: `Card`, `Button`, `Select`, `Input`, `RoleChangeModal`.
 *
 */
