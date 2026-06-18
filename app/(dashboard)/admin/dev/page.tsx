import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/utils/db";
import DevDashboardClient from "@/components/admin/DevDashboardClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Descripción: Página del panel de desarrollo para administradores. Valida el rol y renderiza el cliente del dashboard.
 * Requiere: Sesión activa y rol de ADMIN.
 * Implementa: Panel de desarrollo (/admin/dev).
 */

export const metadata = {
  title: "Dashboard de Desarrollo",
  description:
    "Panel de desarrollo para pruebas, depuración y gestión de recursos en el entorno de desarrollo.",
};

export default async function DevDashboardPage() {
  const session = await getServerSession(authOptions);
  // Verificar autenticación, rol y verificación de rol
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/unauthorized?reason=admin_only");
  }

  // Obtener id del admin
  const adminId = session.user.id as string;
  const admin = await prisma.user.findUnique({
    where: { id: adminId as string },
    select: { id: true, role: true },
  });

  if (!admin || admin.role !== UserRole.ADMIN) {
    redirect("/unauthorized?reason=admin_only");
  }

  return (
    <main className="container mx-auto py-8 px-4 space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 mb-2 text-primary hover:brightness-75 transition-all text-base font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Dashboard
      </Link>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Dashboard del Desarrollador
        </h1>
        <p className="text-lg text-gray-600">
          Bienvenido a la sección más ~secreta~ de{" "}
          <span className="text-primary font-bold">PawLig</span>.<br />
          Gestiona pruebas, depuración y gestión de recursos en el entorno de
          desarrollo
        </p>
      </div>

      <DevDashboardClient
        userSession={{
          id: session.user.id || "",
          name: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role || UserRole.ADMIN,
        }}
      />
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Página de servidor (Server Component) para la ruta del dashboard de desarrollo.
 *
 * Lógica Clave:
 * - Autenticación y Autorización: Utiliza getServerSession y verifica que el rol del
 *   usuario y su registro en base de datos coincidan con UserRole.ADMIN. Redirige a
 *   /unauthorized en caso contrario.
 * - Renderizado: Pasa la información básica de sesión al componente cliente DevDashboardClient.
 *
 * Dependencias Externas:
 * - next-auth: Para el manejo de sesión del lado del servidor.
 * - @prisma/client: Para la verificación del rol de usuario en la base de datos.
 *
 */
