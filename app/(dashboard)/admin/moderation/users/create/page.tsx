import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import CreateUserForm from "@/components/forms/create-user-form";

/**
 * /admin/moderation/users/create
 * Descripción: Página protegida que renderiza el formulario de alta manual de
 *   usuarios. Solo accesible para administradores. Sin lógica de datos propia:
 *   delega todo al componente cliente CreateUserForm.
 * Requiere: Sesión activa con role === "ADMIN".
 * Implementa: ISSUE-174
 */

export const metadata = {
  title: "Crear usuario | Administración",
  description: "Formulario administrativo para el alta manual de usuarios en PawLig.",
};

export default async function CreateUserPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/moderation/users/create");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/unauthorized?reason=admin_only");
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Crear usuario</h1>
        <p className="text-gray-500 mt-1">
          Alta manual de un nuevo usuario en el sistema. La contraseña se genera automáticamente.
        </p>
      </div>

      <CreateUserForm />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Server Component de entrada para la ruta /admin/moderation/users/create.
 * Aplica el mismo patron de proteccion que AdminDashboardPage: getServerSession
 * + redirect() como guard doble (sin sesion → login, sin rol ADMIN → /unauthorized).
 * No contiene logica de datos ni props al cliente; es una capa de seguridad pura
 * que envuelve el formulario interactivo.
 *
 * Logica Clave:
 * - Guard de sesion: redirect a /login con callbackUrl para que el usuario
 *   regrese a esta ruta tras autenticarse.
 * - Guard de rol: redirect a /unauthorized con reason=admin_only para
 *   diferenciarlo de otros errores de autorizacion en el front.
 * - No se reutiliza requireRole() de lib/auth porque ese helper usa redirect()
 *   internamente y no esta adaptado para pasar callbackUrl especificas.
 *
 * Dependencias Externas:
 * - next-auth: getServerSession para obtencion de la sesion en Server Components.
 * - @/lib/auth/auth-options: Configuracion de autenticacion compartida.
 * - @prisma/client: Enum UserRole para la comparacion de rol.
 * - @/components/forms/create-user-form: Formulario cliente de alta de usuarios.
 *
 */
