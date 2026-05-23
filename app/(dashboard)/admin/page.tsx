import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/utils/db';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

export const metadata = {
    title: 'Dashboard del Administrador',
    description: 'Panel de control centralizado para la gestión global de la plataforma, usuarios y métricas de impacto.',
};

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions)
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard del Administrador</h1>
                <p className="text-lg text-gray-600">Gestiona la plataforma, usuarios y métricas de impacto</p>
            </div>

            <AdminDashboardClient userSession={{
                id: session.user.id || '',
                name: session.user.name || '',
                email: session.user.email || '',
                role: session.user.role || UserRole.ADMIN,
            }} />
        </main>
    );
}
