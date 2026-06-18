import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModerationTabs } from "@/components/admin/moderation-tabs";

/**
 * /app/(dashboard)/admin/moderation/layout.tsx
 * Descripción: Layout del módulo de moderación. Provee la estructura base,
 * título y barra de pestañas para navegar entre Albergues, Negocios y Auditoría.
 * Requiere: Sesión ADMIN (verificada en cada page.tsx y api route).
 * Implementa: HU-ModerationHub (ISSUE_134)
 */
export default function ModerationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen py-6 w-full">
      <Link href="/admin" className="inline-flex items-center gap-2 mb-4 text-primary hover:brightness-75 transition-all font-semibold">
        <ArrowLeft className="w-4 h-4" />
        Volver al Dashboard
      </Link>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Moderation Hub
        </h1>
        <p className="mt-2 text-gray-600">
          Revisa solicitudes de albergues, negocios y supervisa la auditoría del sistema
        </p>
      </div>

      <ModerationTabs />

      {children}
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Layout compartido para el módulo de moderación, diseñado para coincidir visualmente
 * con el panel de Gestión de Usuarios.
 *
 * Lógica Clave:
 * - Centraliza el diseño base del dashboard.
 * - Utiliza ModerationTabs (Client Component) para el menú de navegación elegante.
 *
 */
