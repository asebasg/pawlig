import { prisma } from '@/lib/utils/db';

export interface Favorite {
  id: string;
  userId: string;
  petId: string;
  createdAt: Date;
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    age: number | null;
    sex: string | null;
    status: string;
    images: string[];
    shelter: {
      id: string;
      name: string;
      municipality: string;
    };
  };
}

export async function getUserFavorites(userId: string, limit?: number): Promise<Favorite[]> {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
      pet: {
        status: 'AVAILABLE',
      },
    },
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
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return favorites as any;
}

export async function addFavorite(userId: string, petId: string) {
  return await prisma.favorite.create({
    data: {
      userId,
      petId,
    },
  });
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  await prisma.favorite.delete({
    where: {
      id: favoriteId,
    },
  });
}

export async function isFavorite(userId: string, petId: string): Promise<boolean> {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_petId: {
        userId,
        petId,
      },
    },
  });
  return !!favorite;
}
