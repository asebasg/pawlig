"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserRole, Municipality } from "@prisma/client";
import { Copy, Check, ShieldAlert, UserPlus } from "lucide-react";

import { createUserByAdminSchema, CreateUserByAdminInput } from "@/lib/validations/user.schema";
import { AddressInput } from "@/components/ui/address-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

/**
 * POST /api/admin/users
 * Descripción: Formulario administrativo de alta de usuarios. Genera la contraseña
 *   en el servidor, sin login automático. Exclusivo para administradores.
 * Requiere: Sesión activa con role === "ADMIN" (garantizada por la página padre).
 * Implementa: ISSUE-174
 */

// Etiquetas legibles por rol
const ROLE_LABELS: Record<UserRole, string> = {
  ADOPTER: "Adoptante",
  SHELTER: "Albergue",
  VENDOR: "Vendedor",
  ADMIN: "Administrador",
};

// Respuesta exitosa del endpoint POST /api/admin/users
interface CreateUserSuccessResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  tempPassword: string;
}

// Respuesta de error estructurada del endpoint
interface ApiErrorResponse {
  error: string;
  code?: string;
  suggestion?: string;
  details?: Array<{ field: string; message: string }>;
}

export default function CreateUserForm() {
  const router = useRouter();

  // Estado del modal de confirmación (solo para rol ADMIN)
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  // Estado del modal de credenciales temporales post-creación
  const [tempCredentials, setTempCredentials] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserByAdminInput>({
    resolver: zodResolver(createUserByAdminSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      municipality: Municipality.MEDELLIN,
      address: "",
      idNumber: "",
      birthDate: "",
      role: UserRole.ADOPTER,
      reason: "",
    },
  });

  const selectedRole = watch("role");
  const isAdminRole = selectedRole === UserRole.ADMIN;

  // ── Envío real al endpoint ──────────────────────────────────────────────────
  const submitToApi = async (data: CreateUserByAdminInput) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData: CreateUserSuccessResponse & ApiErrorResponse =
        await response.json();

      if (!response.ok) {
        if (responseData.code === "EMAIL_ALREADY_EXISTS") {
          toast.error("El correo ya está registrado en el sistema", {
            description: responseData.suggestion,
          });
          return;
        }

        if (responseData.code === "ACCOUNT_BLOCKED") {
          toast.error("El correo pertenece a una cuenta bloqueada", {
            description: responseData.suggestion,
          });
          return;
        }

        if (responseData.code === "VALIDATION_ERROR" && responseData.details) {
          const firstDetail = responseData.details[0];
          toast.error(`Error de validación: ${firstDetail?.message ?? responseData.error}`);
          return;
        }

        throw new Error(responseData.error || "Error al crear el usuario");
      }

      // Mostrar modal de credenciales temporales (solo una vez)
      if (responseData.tempPassword) {
        setTempCredentials({
          email: responseData.user.email,
          password: responseData.tempPassword,
          name: responseData.user.name,
        });
      } else {
        // Flujo sin tempPassword (cuando el email esté operativo)
        toast.success(`Usuario ${responseData.user.name} creado exitosamente`);
        router.push("/admin/moderation/users");
        router.refresh();
      }
    } catch (error) {
      console.error("[CreateUserForm] Error:", error);
      toast.error(error instanceof Error ? error.message : "Error inesperado al crear el usuario");
    }
  };

  // ── Handler del form: intercepta si el rol es ADMIN para confirmar ──────────
  const onSubmit = async (data: CreateUserByAdminInput) => {
    if (isAdminRole) {
      setShowAdminConfirm(true);
      return;
    }
    await submitToApi(data);
  };

  // ── Confirmación desde el AlertDialog (rol ADMIN) ───────────────────────────
  const handleConfirmAdminCreation = async () => {
    setShowAdminConfirm(false);
    await submitToApi(getValues());
  };

  // ── Copiar contraseña al portapapeles ───────────────────────────────────────
  const handleCopyPassword = async () => {
    if (!tempCredentials) return;
    await navigator.clipboard.writeText(tempCredentials.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Cerrar modal de credenciales y redirigir ────────────────────────────────
  const handleCredentialsClose = () => {
    setTempCredentials(null);
    toast.success("Usuario creado exitosamente");
    router.push("/admin/moderation/users");
    router.refresh();
  };

  return (
    <>
      {/* ── Modal de confirmación para rol ADMIN ─────────────────────────── */}
      <AlertDialog open={showAdminConfirm} onOpenChange={setShowAdminConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              Confirmar creación de Administrador
            </AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de crear un usuario con rol{" "}
              <strong>ADMINISTRADOR</strong>. Este rol otorga acceso completo al
              panel de control, auditoría y gestión de usuarios. ¿Estás seguro
              de continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAdminCreation}
              className="bg-red-600 hover:bg-red-700"
            >
              Sí, crear Administrador
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Modal de credenciales temporales ─────────────────────────────── */}
      <AlertDialog
        open={!!tempCredentials}
        onOpenChange={(open) => { if (!open) handleCredentialsClose(); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-700">
              <UserPlus className="w-5 h-5" />
              Usuario creado exitosamente
            </AlertDialogTitle>
            <AlertDialogDescription>
              Comparte estas credenciales con{" "}
              <strong>{tempCredentials?.name}</strong>. La contraseña temporal
              solo se muestra una vez.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 my-2">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Correo electrónico</p>
              <p className="text-sm font-mono bg-gray-100 rounded px-3 py-2 text-gray-800 select-all">
                {tempCredentials?.email}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Contraseña temporal</p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-sm font-mono bg-gray-100 rounded px-3 py-2 text-gray-800 select-all">
                  {tempCredentials?.password}
                </p>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="flex-shrink-0 p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                  aria-label="Copiar contraseña"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction onClick={handleCredentialsClose}>
              Entendido, ir al listado
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Formulario principal ──────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
        id="create-user-form"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="create-user-email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            id="create-user-email"
            aria-invalid={errors.email ? "true" : "false"}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Nombre completo */}
        <div>
          <label
            htmlFor="create-user-name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            id="create-user-name"
            aria-invalid={errors.name ? "true" : "false"}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Juan Pérez"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="create-user-phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="create-user-phone"
            aria-invalid={errors.phone ? "true" : "false"}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="3001234567"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Municipio */}
        <div>
          <label
            htmlFor="create-user-municipality"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Municipio <span className="text-red-500">*</span>
          </label>
          <select
            {...register("municipality")}
            id="create-user-municipality"
            aria-invalid={errors.municipality ? "true" : "false"}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
          >
            <option value={Municipality.MEDELLIN}>Medellín</option>
            <option value={Municipality.BELLO}>Bello</option>
            <option value={Municipality.ITAGUI}>Itagüí</option>
            <option value={Municipality.ENVIGADO}>Envigado</option>
            <option value={Municipality.SABANETA}>Sabaneta</option>
            <option value={Municipality.LA_ESTRELLA}>La Estrella</option>
            <option value={Municipality.CALDAS}>Caldas</option>
            <option value={Municipality.COPACABANA}>Copacabana</option>
            <option value={Municipality.GIRARDOTA}>Girardota</option>
            <option value={Municipality.BARBOSA}>Barbosa</option>
          </select>
          {errors.municipality && (
            <p className="text-red-500 text-sm mt-1">{errors.municipality.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label
            htmlFor="create-user-address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Dirección <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <AddressInput
                value={field.value}
                onChange={field.onChange}
                error={!!errors.address}
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Número de identificación */}
        <div>
          <label
            htmlFor="create-user-idNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de identificación <span className="text-red-500">*</span>
          </label>
          <input
            {...register("idNumber")}
            type="text"
            id="create-user-idNumber"
            aria-invalid={errors.idNumber ? "true" : "false"}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.idNumber ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="1234567890"
          />
          {errors.idNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.idNumber.message}</p>
          )}
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label
            htmlFor="create-user-birthDate"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha de nacimiento <span className="text-red-500">*</span>
          </label>
          <input
            {...register("birthDate")}
            type="date"
            id="create-user-birthDate"
            aria-invalid={errors.birthDate ? "true" : "false"}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
              .toISOString()
              .split("T")[0]}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.birthDate ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">El usuario debe ser mayor de 18 años</p>
        </div>

        {/* Rol */}
        <div>
          <label
            htmlFor="create-user-role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rol <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as UserRole)}
              >
                <SelectTrigger
                  id="create-user-role"
                  className={`w-full ${errors.role ? "border-red-500" : ""}`}
                  aria-invalid={errors.role ? "true" : "false"}
                >
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Justificación — solo visible si rol === ADMIN */}
        {isAdminRole && (
          <div>
            <label
              htmlFor="create-user-reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Justificación para rol ADMIN{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="p-3 mb-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Asignar el rol Administrador otorga acceso total al sistema.
                Documenta el motivo de esta decisión (mínimo 10 caracteres).
              </p>
            </div>
            <textarea
              {...register("reason")}
              id="create-user-reason"
              rows={3}
              aria-invalid={errors.reason ? "true" : "false"}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none ${
                errors.reason ? "border-red-500" : "border-amber-300"
              }`}
              placeholder="Ej: Empleado del equipo técnico que requiere acceso completo para gestión interna."
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
            )}
          </div>
        )}

        {/* Nota informativa de contraseña */}
        <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700">
          La contraseña temporal se generará automáticamente y se mostrará al
          confirmar la creación. No se enviará por email hasta que el servicio
          de correo esté disponible.
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          id="create-user-submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
              Creando usuario...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Crear usuario
            </span>
          )}
        </button>
      </form>
    </>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Formulario administrativo de alta manual de usuarios. Basado en register-form.tsx
 * con las siguientes diferencias clave: sin campo password (generado en servidor),
 * sin signIn() post-creacion, con selector de rol y flujo de confirmación para ADMIN.
 *
 * Lógica Clave:
 * - Selector de rol: usa el componente Select de @/components/ui/select con
 *   Controller de react-hook-form, mismo patrón que UserViewClient.tsx.
 * - Campo reason condicional: se renderiza solo cuando selectedRole === ADMIN,
 *   observado con watch(). El schema Zod lo valida server-side adicionalmente.
 * - AlertDialog de confirmación: intercepta el submit cuando role === ADMIN.
 *   El formulario llama a setShowAdminConfirm(true) en lugar de submitToApi().
 *   La confirmación real se dispara desde handleConfirmAdminCreation() via getValues().
 * - Modal de credenciales temporales: post-creación exitosa, si la respuesta
 *   incluye tempPassword, se muestra un AlertDialog con los datos de acceso y
 *   un botón de copia al portapapeles. Solo se muestra una vez; al cerrarlo
 *   se ejecuta router.push + router.refresh() para actualizar el listado.
 * - Manejo de errores: códigos de error específicos (EMAIL_ALREADY_EXISTS,
 *   ACCOUNT_BLOCKED, VALIDATION_ERROR) con mensajes contextuales via sonner.
 *
 * Dependencias Externas:
 * - react-hook-form + zod: Gestion de estado del formulario y validacion cliente.
 * - @prisma/client: Enums UserRole y Municipality para tipado y opciones.
 * - sonner: Notificaciones toast para errores y confirmacion de exito.
 * - lucide-react: Iconografia (UserPlus, ShieldAlert, Copy, Check).
 * - @/components/ui/select: Componente Select para el picklist de roles.
 * - @/components/ui/alert-dialog: Dialogo de confirmacion ADMIN y credenciales.
 * - @/components/ui/address-input: Input de dirección reutilizado de register-form.
 *
 */
