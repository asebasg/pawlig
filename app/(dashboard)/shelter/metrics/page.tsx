import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import UnderConstruction from "@/components/layout/under-construction";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from "@/lib/utils/db";

/**
 * Resumen: Página placeholder para la gestión de pedidos del vendedor.
 * 
 * ! Actualmente muestra un mensaje de "en construcción".
 * Implementa validación de sesión y rol de vendedor.
 */

export const metadata = {
    title: "Métricas de Adopciones",
    description: "Panel de información de tus métricas de adopciones",
};

export default async function ShelterMetricsPage() {
    const session = await getServerSession(authOptions)
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/shelter/metrics");
    }

    if (session.user.role !== UserRole.SHELTER) {
        redirect("/unauthorized?reason=shelter_only");
    }

    // Obtener id de SHELTER
    const shelterId = session.user.shelterId as string;
    const shelter = await prisma.shelter.findUnique({
        where: { id: shelterId as string },
        select: { id: true, verified: true },
    });

    if (!shelter?.verified) {
        redirect("/unauthorized?reason=shelter_not_verified");
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/shelter" className="inline-flex items-center gap-2 mb-6 mt-4 text-purple-600 hover:text-purple-700 text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Métricas de Adopciones</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Panel de información de tus métricas de adopciones</p>
            <UnderConstruction />
        </div>
    );
}

/**
 * Notas de Implementación:
 * - Se reutiliza la lógica de protección de rutas de shelter/products.
 * - Por ahora es un placeholder visual.
 * - Futura implementación requerirá service de orders y componentes visuales.
 */
