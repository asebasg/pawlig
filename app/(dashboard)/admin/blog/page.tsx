import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { BlogTable } from "@/components/admin/blog/blog-table";

/**
 * Resumen: Página para la gestión y administración del blog (Administrador).
 * 
 * Implementa validación de sesión y rol de admin.
 */

export const metadata = {
  title: "Gestión de Artículos",
  description: "Panel de gestión global de posts para el blog",
};

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/admin/blog");
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect("/unauthorized?reason=admin_only");
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Fallback: framer-motion no disponible en Server Component */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 mb-2 text-primary hover:brightness-75 active:scale-[0.97] transition-all text-base font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-800 dark:text-zinc-100">
            Gestión de Artículos
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mb-6 sm:mb-0">
            Crea, edita y administra los artículos del blog.
          </p>
        </div>
        {/* Fallback: framer-motion no disponible en Server Component */}
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-90 active:scale-[0.97] transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Nuevo Artículo
        </Link>
      </div>

      <BlogTable />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Renderiza el panel de gestión del blog para el administrador.
 * Muestra el listado de artículos y opciones para administrarlos.
 *
 * Lógica Clave:
 * - Validación de sesión en el servidor y verificación estricta del rol ADMIN.
 * - Redirección a login con callbackUrl o a /unauthorized si no cuenta con privilegios.
 * - Renderizado de la tabla de artículos con BlogTable y acceso directo a creación de artículos.
 *
 * Dependencias Externas:
 * - next-auth: Manejo y verificación de sesión del servidor.
 * - @prisma/client: Enums de roles de usuario (UserRole).
 * - lucide-react: Iconografía de navegación (ArrowLeft) y acción (PlusCircle).
 *
 */
