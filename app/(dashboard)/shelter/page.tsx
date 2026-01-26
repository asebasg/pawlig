import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/utils/db';
import ShelterDashboardClient from '@/components/shelter/ShelterDashboardClient';

export const metadata = {
    title: 'Dashboard del Albergue',
    description: 'Panel de control para gestionar tus mascotas, postulaciones y ver estadísticas de adopciones.',
};

export default async function ShelterDashboardPage() {
    const session = await getServerSession(authOptions)
    // Verificar autenticación, rol y verificación de rol
    if (!session || !session.user) {
        redirect("/login?callbackUrl=/shelter");
    }

    if (session.user.role !== UserRole.SHELTER) {
        redirect("/unauthorized?reason=shelter_only");
    }

    // Obtener id de shelter
    const shelterId = session.user.shelterId as string;
    const shelter = await prisma.shelter.findUnique({
        where: { id: shelterId as string },
        select: { id: true, verified: true },
    });

    if (!shelter?.verified) {
        redirect("/unauthorized?reason=shelter_not_verified");
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard del Albergue</h1>
                <p className="text-lg text-muted-foreground">Gestiona tus mascotas, postulaciones y ver estadísticas de adopciones</p>
            </div>

            <ShelterDashboardClient userSession={{
                id: session.user.id || '',
                name: session.user.name || '',
                email: session.user.email || '',
                role: session.user.role || UserRole.SHELTER,
            }} />
        </main>
    );
}
