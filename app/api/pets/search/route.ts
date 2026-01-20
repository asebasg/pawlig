import { NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';
import { petSearchSchema, petSearchQuerySchema } from '@/lib/validations/pet-search.schema';
import { ZodError } from 'zod';
import { Municipality, Prisma } from '@prisma/client';

/**
 * Endpoint para búsqueda y filtrado de mascotas
 * Implementa RF-010, HU-006, CU-005
 * 
 * CAPA 2 DE VALIDACIÓN (API):
 * - Valida query params con Zod
 * - Sanitiza inputs antes de consultar BD
 * - Retorna errores estructurados
 */

export async function GET(request: Request) {
  try {
    //  1. Extraer query params de la URL
    const { searchParams } = new URL(request.url);
    const queryParams = {
      species: searchParams.get('species') || undefined,
      municipality: searchParams.get('municipality') || undefined,
      sex: searchParams.get('sex') || undefined,
      minAge: searchParams.get('minAge') || undefined,
      maxAge: searchParams.get('maxAge') || undefined,
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    //  2. VALIDACIÓN CAPA 2: Convertir y validar query params
    const transformedParams = petSearchQuerySchema.parse(queryParams);

    //  2. VALIDACIÓN CAPA 2: Validar con schema principal
    const validatedData = petSearchSchema.parse(transformedParams);

    //  3. Construir filtros dinámicos para Prisma
    const filters: Prisma.PetWhereInput = {
      status: validatedData.status, // Siempre filtra por estado (default: AVAILABLE)
    };

    // Filtro: Especie (case-insensitive)
    if (validatedData.species) {
      filters.species = {
        contains: validatedData.species,
        mode: 'insensitive',
      };
    }

    // Filtro: Municipio del albergue
    if (validatedData.municipality) {
      filters.shelter = {
        municipality: validatedData.municipality as Municipality,
      };
    }

    // Filtro: Sexo
    if (validatedData.sex) {
      filters.sex = validatedData.sex;
    }

    // Filtro: Rango de edad
    if (validatedData.minAge !== undefined || validatedData.maxAge !== undefined) {
      filters.age = {};
      if (validatedData.minAge !== undefined) {
        filters.age.gte = validatedData.minAge; // Mayor o igual
      }
      if (validatedData.maxAge !== undefined) {
        filters.age.lte = validatedData.maxAge; // Menor o igual
      }
    }

    //  5. Calcular paginación
    const page = validatedData.page;
    const limit = validatedData.limit;
    const skip = (page - 1) * limit;

    //  6. Consultar base de datos con Prisma (CAPA 3 DE VALIDACIÓN)
    const [pets, totalCount] = await Promise.all([
      prisma.pet.findMany({
        where: filters,
        include: {
          shelter: {
            select: {
              id: true,
              name: true,
              municipality: true,
              contactWhatsApp: true,
              contactInstagram: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Más recientes primero
        },
        skip,
        take: limit,
      }),
      prisma.pet.count({ where: filters }),
    ]);

    //  7. Calcular metadata de paginación
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    //  8. Retornar respuesta estructurada
    return NextResponse.json(
      {
        success: true,
        data: pets,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          species: validatedData.species,
          municipality: validatedData.municipality,
          sex: validatedData.sex,
          minAge: validatedData.minAge,
          maxAge: validatedData.maxAge,
          status: validatedData.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores de validación de Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros de búsqueda inválidos',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 } // 400 Bad Request
      );
    }

    // Error de Prisma
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('Error de Prisma en búsqueda:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al consultar mascotas',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Error genérico del servidor
    console.error('Error en búsqueda de mascotas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. VALIDACIÓN DE 3 CAPAS:
 *    - Capa 1 (Cliente): pet-filter.tsx valida antes de enviar
 *    - Capa 2 (API): Este endpoint valida con Zod (líneas 32-36)
 *    - Capa 3 (BD): Prisma valida tipos (línea 69)
 * 
 * 2. FILTROS DINÁMICOS:
 *    - Solo agrega filtros si están presentes en la request
 *    - Evita queries innecesarias con campos vacíos
 * 
 * 3. PERFORMANCE (RNF-001):
 *    - Promise.all para consultar pets y count simultáneamente
 *    - Índices en Prisma (status, species, shelterId, createdAt)
 *    - Paginación para evitar cargar todos los registros
 * 
 * 4. RESPUESTA ESTRUCTURADA:
 *    - data: Array de mascotas con información del albergue
 *    - pagination: Metadata para navegación de páginas
 *    - filters: Filtros aplicados (útil para debugging)
 * 
 * 5. ERRORES ESTRUCTURADOS:
 *    - code: Identificador único del error
 *    - details: Array con errores campo por campo (Zod)
 *    - success: false para indicar fallo
 * 
 * 6. SEGURIDAD:
 *    - Validación estricta de todos los inputs
 *    - No expone stack traces en producción
 *    - Sanitización automática por Prisma (previene SQL injection)
 */
