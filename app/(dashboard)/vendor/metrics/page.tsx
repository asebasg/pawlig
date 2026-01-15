import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Button } from '@/components/ui/button';
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
    title: "Métricas de Ventas",
    description: "Panel de información de tus métricas de productos",
};

export default async function VendorMetricsPage() {
    const session = await getServerSession(authOptions)
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/vendor/metrics");
    }

    if (session.user.role !== UserRole.VENDOR) {
        redirect("/unauthorized?reason=vendor_only");
    }

    // Obtener id de VENDOR
    const vendorId = session.user.vendorId as string;
    const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId as string },
        select: { id: true, verified: true },
    });

    if (!vendor?.verified) {
        redirect("/unauthorized?reason=vendor_not_verified");
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Link href="/vendor" className="inline-flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700 text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Métricas de Ventas</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Panel de información de tus métricas de productos</p>
            <div className="p-8 border rounded-lg bg-gray-50 text-center">
                <p className="text-lg text-gray-600">Esta sección está en desarrollo.</p>
                <p className="text-sm text-gray-400 mt-2">Pronto podrás visualizar y gestionar tus métricas aquí.</p>
                <Button asChild className="mt-6">
                    <Link href="/vendor">Volver al Dashboard</Link>
                </Button>
            </div>
        </div>
    );
}

/**
 * Notas de Implementación:
 * - Se reutiliza la lógica de protección de rutas de vendor/products.
 * - Por ahora es un placeholder visual.
 * - Futura implementación requerirá service de orders y componentes visuales.
 */
