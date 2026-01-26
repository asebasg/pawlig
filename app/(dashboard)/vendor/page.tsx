import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import VendorDashboardClient from '@/components/vendor/VendorDashboardClient';
import { prisma } from '@/lib/utils/db';

export const metadata = {
    title: 'Dashboard del Vendedor',
    description: 'Panel de control para gestionar tus productos, pedidos y ver estadísticas de ventas.',
};

export default async function VendorDashboardPage() {
    const session = await getServerSession(authOptions)
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/vendor");
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard del Vendedor</h1>
                <p className="text-lg text-muted-foreground">Gestiona tus productos, pedidos y ver estadísticas de ventas</p>
            </div>

            <VendorDashboardClient userSession={{
                id: session.user.id || '',
                name: session.user.name || '',
                email: session.user.email || '',
                role: session.user.role || UserRole.VENDOR,
            }} />
        </main>
    );
}
