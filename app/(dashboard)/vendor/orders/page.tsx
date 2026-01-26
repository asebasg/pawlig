import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from "@/lib/utils/db";
import Image from 'next/image';


/**
 * Resumen: Página placeholder para la gestión de pedidos del vendedor.
 * 
 * ! Actualmente muestra un mensaje de "en construcción".
 * Implementa validación de sesión y rol de vendedor.
 */

export const metadata = {
    title: "Mis Pedidos",
    description: "Gestión de pedidos para vendedores",
};

export default async function VendorOrdersPage() {
    const session = await getServerSession(authOptions)
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/vendor/orders");
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
            <Link href="/vendor" className="inline-flex items-center gap-2 mb-6 mt-4 text-primary hover:text-purple-700 text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Mis Pedidos</h1>
            <p className="text-muted-foreground dark:text-muted-foreground/50 mb-4">Gestiona y visualiza tus órdenes de compra de tus productos</p>
            <div className="flex flex-col p-8 border rounded-lg bg-muted items-center text-center justify-center">
                <p className="text-lg text-muted-foreground">Esta sección está en desarrollo</p>
                <p className="text-sm text-muted-foreground/50 mt-2 mb-10">Pronto podrás visualizar y gestionar tus pedidos aquí</p>
                <Image
                    src='/images/under_construction.png'
                    alt="En construcción..."
                    width={350}
                    height={350}
                    className="object-cover pointer-events-none"
                />

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
