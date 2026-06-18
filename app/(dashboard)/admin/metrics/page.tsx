import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminDashboardTabs } from "@/components/admin/metrics/admin-dashboard-tabs";

/**
 * Resumen: Página para las métricas y reportes globales (Administrador).
 * 
 * Implementa validación de sesión y rol de admin.
 */

export const metadata = {
    title: "Métricas Globales",
    description: "Panel de información de métricas globales de adopciones",
};

export default async function AdminMetricsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login?callbackUrl=/admin/metrics");
    }

    if (session.user.role !== UserRole.ADMIN) {
        redirect("/unauthorized?reason=admin_only");
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Link href="/admin" className="inline-flex items-center gap-2 mb-2 text-primary hover:brightness-75 transition-all text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
            </Link>
            
            <div>
                <h1 className="text-2xl font-bold font-poppins text-gray-800">Métricas y Reportes Globales</h1>
                <p className="text-gray-500 mb-6">Analiza el impacto global de adopciones de todos los albergues registrados.</p>
            </div>
            
            <AdminDashboardTabs />
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Renderiza el panel de métricas para el administrador.
 * Muestra métricas de todas las adopciones del sistema de los diferentes albergues.
 *
 */
