import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/utils/db';
import PetCard from '@/components/cards/pet-card';

export const metadata: Metadata = {
  title: 'Mis Favoritos - PawLig',
  description: 'Todas tus mascotas favoritas',
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login?callbackUrl=/user/favorites');
  }

  if (session.user.role !== UserRole.ADOPTER) {
    redirect('/unauthorized?reason=adopter_only');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      pet: {
        include: {
          shelter: {
            select: {
              id: true,
              name: true,
              municipality: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Favoritos</h1>
        <p className="text-gray-600">{favorites.length} mascota{favorites.length !== 1 ? 's' : ''} guardada{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">No tienes mascotas favoritas</p>
          <a href="/adopciones" className="text-purple-600 hover:text-purple-700 font-semibold">
            Explorar mascotas →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <PetCard
              key={fav.id}
              pet={{
                ...fav.pet,
                description: fav.pet.description || '',
              }}
              userSession={{
                id: session.user.id,
                name: session.user.name || '',
                email: session.user.email || '',
                role: session.user.role,
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
