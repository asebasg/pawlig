import { prisma } from '@/lib/utils/db';
import { PetStatus, Municipality } from '@prisma/client';

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

  const where: any = {
    status,
  };

  if (species) where.species = species;
  if (sex) where.sex = sex;
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este servicio centraliza toda la lógica de negocio relacionada con la
 * obtención de datos de mascotas. Se encarga de interactuar con la base
 * de datos a través de Prisma para realizar consultas complejas, aplicar
 * filtros, paginación y obtener datos específicos de las mascotas.
 *
 * **Lógica Clave:**
 * - `getPetsWithFilters`: Es la función más compleja. Construye una consulta
 *   dinámica a la base de datos basada en múltiples filtros opcionales como
 *   especie, municipio, edad, etc. Utiliza `Promise.all` para ejecutar
 *   la consulta de datos y el conteo total en paralelo, optimizando el
 *   rendimiento. Devuelve un objeto con los datos y la información de
 *   paginación.
 * - `getPetById`: Obtiene una mascota por su ID. Incluye una validación
 *   rápida del formato del ID para evitar consultas innecesarias a la base
 *   de datos. Realiza un `join` con el albergue y las adopciones para
 *   proveer información contextual completa.
 * - `getSimilarPets`: Busca mascotas similares basándose en el albergue o
 *   la especie, excluyendo la mascota actual. Esta función es clave para
 *   las recomendaciones en la página de detalles de una mascota.
 * - `checkIsFavorited`: Proporciona una comprobación de estado simple y
 *   eficiente para saber si un usuario ha marcado una mascota como favorita,
 *   usando el índice único `userId_petId`.
 *
 * **Dependencias Externas:**
 * - `@prisma/client`: El cliente de Prisma se utiliza como ORM para todas
 *   las interacciones con la base de datos. Las consultas están fuertemente
 *   tipadas gracias a los modelos definidos en `schema.prisma`.
 *
 */
