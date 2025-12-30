import { prisma } from '@/lib/utils/db';
import { PetStatus, Municipality, Sex, Prisma } from '@prisma/client';

export interface PetFilters {
  species?: string;
  municipality?: Municipality;
  status?: PetStatus;
  age?: number;
  sex?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export async function getPetsWithFilters(filters: PetFilters) {
  const {
    species,
    municipality,
    status = 'AVAILABLE',
    age,
    sex,
    search,
    page = 1,
    limit = 20,
  } = filters;

  const where: Prisma.PetWhereInput = {
    status,
  };

  if (species) where.species = species;
  if (sex) where.sex = sex as Sex;
  if (age) where.age = { lte: age };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { breed: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (municipality) {
    where.shelter = { municipality };
  }

  try {
    const [pets, total] = await Promise.all([
      prisma.pet.findMany({
        where,
        include: {
          shelter: {
            select: {
              id: true,
              name: true,
              municipality: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pet.count({ where }),
    ]);

    return {
      data: pets,
      pagination: {
        page,
        limit,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('[getPetsWithFilters] Error:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        totalCount: 0,
        totalPages: 0,
      },
    };
  }
}



export async function getPetById(id: string) {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return null;
  }

  return await prisma.pet.findUnique({
    where: { id },
    include: {
      shelter: {
        select: {
          id: true,
          name: true,
          municipality: true,
          address: true,
          description: true,
          contactWhatsApp: true,
          contactInstagram: true,
        },
      },
      adoptions: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
}

export async function getSimilarPets(petId: string, shelterId: string, species: string, limit = 6) {
  return await prisma.pet.findMany({
    where: {
      id: { not: petId },
      status: 'AVAILABLE',
      OR: [
        { shelterId },
        { species },
      ],
    },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      age: true,
      sex: true,
      status: true,
      images: true,
      shelter: {
        select: {
          id: true,
          name: true,
          municipality: true,
        },
      },
    },
    take: limit,
  });
}

export async function checkIsFavorited(userId: string, petId: string) {
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
