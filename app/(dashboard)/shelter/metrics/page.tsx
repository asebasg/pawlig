import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from "@/lib/utils/db";
import { AdoptionMetricsClient } from "@/components/shelter/metrics/adoption-metrics-client";

/**
 * Resumen: Página para las métricas y reportes de adopciones del albergue.
 * 
 * Implementa validación de sesión y rol de albergue, y carga el cliente de métricas.
 */

export const metadata = {
    title: "Métricas de Adopciones | PawLig",
    description: "Panel de información de tus métricas de adopciones",
};

export default async function ShelterMetricsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login?callbackUrl=/shelter/metrics");
    }

    if (session.user.role !== UserRole.SHELTER) {
        redirect("/unauthorized?reason=shelter_only");
    }

    const shelterId = session.user.shelterId as string;
    const shelter = await prisma.shelter.findUnique({
        where: { id: shelterId },
        select: { id: true, verified: true },
    });

    if (!shelter?.verified) {
        redirect("/unauthorized?reason=shelter_not_verified");
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Link href="/shelter" className="inline-flex items-center gap-2 mb-2 text-primary hover:text-purple-700 text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
            </Link>
            
            <div>
                <h1 className="text-2xl font-bold font-poppins text-gray-800">Métricas y Reportes de Adopciones</h1>
                <p className="text-gray-500 mb-6">Analiza el impacto de tu albergue y exporta reportes detallados.</p>
            </div>
            
            <AdoptionMetricsClient />
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Renderiza el panel de métricas para un albergue.
 *
 * Lógica Clave:
 * - Autenticación y Autorización en Server Component.
 * - Verifica que el albergue esté validado en base de datos.
 *
 */
