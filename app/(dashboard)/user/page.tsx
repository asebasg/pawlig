import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import UserStats from '@/components/dashboard/user-stats';
import FavoritesSection from '@/components/dashboard/favorites-section';
import AdoptionsSection from '@/components/dashboard/adoptions-section';
import { getAdoptionStats } from '@/lib/services/adoption.service';
import { prisma } from '@/lib/utils/db';

export const metadata: Metadata = {
  title: 'Mi Panel - PawLig',
  description: 'Panel de control para adoptantes',
};

export const revalidate = 60;

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/user');
  }

  if (session.user.role !== 'ADOPTER') {
    const roleRedirects: Record<string, string> = {
      ADMIN: '/admin',
      SHELTER: '/shelter',
      VENDOR: '/vendor',
    };
    redirect(roleRedirects[session.user.role] || '/adopciones');
  }

  const stats = await getAdoptionStats(session.user.id);
  const favoritesCount = await prisma.favorite.count({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {session.user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Bienvenido a tu panel de control</p>
        </div>

        <div className="mb-8">
          <UserStats
            favoritesCount={favoritesCount}
            pendingAdoptions={stats.pending}
            approvedAdoptions={stats.approved}
            rejectedAdoptions={stats.rejected}
          />
        </div>

        <div className="space-y-8">
          <FavoritesSection userId={session.user.id} />
          <AdoptionsSection userId={session.user.id} />
        </div>
      </main>
    </div>
  );
}
