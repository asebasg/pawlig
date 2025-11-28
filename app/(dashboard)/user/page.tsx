import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import UserStats from '@/components/dashboard/user-stats';
import FavoritesSection from '@/components/dashboard/favorites-section';
import AdoptionsSection from '@/components/dashboard/adoptions-section';
import { getAdoptionStats } from '@/lib/services/adoption.service';
import { prisma } from '@/lib/utils/db';

export const metadata = {
  title: 'Mi Panel de Adopción - PawLig',
  description: 'Gestiona tus mascotas favoritas y solicitudes de adopción',
};

export const revalidate = 60;

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/user');
  }

  if (session.user.role !== UserRole.ADOPTER && session.user.role !== UserRole.ADMIN) {
    redirect('/unauthorized?reason=adopter_only');
  }

  const stats = await getAdoptionStats(session.user.id);
  const favoritesCount = await prisma.favorite.count({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
                PawLig
              </a>
              <p className="text-sm text-gray-600 mt-1">Panel de Adoptante</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Hola, <span className="font-semibold">{session.user.name}</span>
              </span>
              <a href="/adopciones" className="text-sm text-gray-600 hover:text-purple-600 font-medium">
                Explorar mascotas
              </a>
              <a href="/api/auth/signout" className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">
                Cerrar sesión
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Panel de Adopción</h1>
          <p className="text-lg text-gray-600">Gestiona tus mascotas favoritas y realiza seguimiento a tus solicitudes de adopción</p>
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

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">&copy; 2025 PawLig - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
}
