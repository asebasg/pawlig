import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

/**
 * GET /api/shelters/adoptions
 * Descripción: Obtiene las postulaciones de adopción para el albergue autenticado.
 * Requiere: Autenticación como SHELTER.
 * Implementa: TAREA-024 (Gestión de postulaciones).
 */
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { adoptionQueryStringSchema } from '@/lib/validations/adoption.schema';
import { ZodError } from 'zod';

/**
 * Endpoint para obtener postulaciones de un albergue
 * Implementa TAREA-024
 * 
 * GET /api/shelters/adoptions
 * - Obtener lista de postulaciones del albergue autenticado
 * - Filtros: status, petId, paginación
 * - Solo SHELTER puede acceder a sus postulaciones
 */

export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'No autenticado',
          code: 'UNAUTHORIZED',
          message: 'Debes iniciar sesión para ver postulaciones',
        },
        { status: 401 }
      );
    }

    // 2. Verificar rol (solo SHELTER)
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        {
          error: 'Acceso denegado',
          code: 'FORBIDDEN',
          message: 'Solo SHELTER puede ver sus postulaciones',
          userRole: session.user.role,
        },
        { status: 403 }
      );
    }

    // 3. Obtener datos del albergue
    const shelter = await prisma.shelter.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!shelter) {
      return NextResponse.json(
        {
          error: 'Sin albergue',
          code: 'SHELTER_NOT_FOUND',
          message: 'No se encontró un albergue asociado a tu cuenta',
        },
        { status: 404 }
      );
    }

    // 4. Extraer y validar query params
    const { searchParams } = new URL(request.url);
    const queryParams = {
      status: searchParams.get('status') || undefined,
      petId: searchParams.get('petId') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    const validatedParams = adoptionQueryStringSchema.parse(queryParams);

    // 5. Construir filtros
    const where: any = {
      pet: {
        shelterId: shelter.id,
      },
    };

    if (validatedParams.status) {
      where.status = validatedParams.status;
    }

    if (validatedParams.petId) {
      where.petId = validatedParams.petId;
    }

    // 6. Calcular paginación
    const page = validatedParams.page;
    const limit = validatedParams.limit;
    const skip = (page - 1) * limit;

    // 7. Consultar base de datos
    const [adoptions, totalCount] = await Promise.all([
      prisma.adoption.findMany({
        where,
        include: {
          adopter: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              municipality: true,
              address: true,
              createdAt: true,
            },
          },
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              breed: true,
              age: true,
              sex: true,
              images: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.adoption.count({ where }),
    ]);

    // 8. Calcular metadata de paginación
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // 9. Retornar respuesta estructurada
    return NextResponse.json(
      {
        success: true,
        data: adoptions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
        filters: {
          status: validatedParams.status || 'all',
          petId: validatedParams.petId || null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores de validación Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Parámetros inválidos',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Error de Prisma
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('Error de Prisma al obtener postulaciones:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Error al consultar postulaciones',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Error genérico del servidor
    console.error('Error al obtener postulaciones:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. AUTENTICACIÓN Y AUTORIZACIÓN:
 *    - Solo SHELTER puede acceder
 *    - Usuario debe tener albergue registrado
 *    - Solo ve sus propias postulaciones
 * 
 * 2. FILTROS DISPONIBLES:
 *    - status: PENDING, APPROVED, REJECTED
 *    - petId: Filtrar por mascota específica
 *    - Paginación: page, limit
 * 
 * 3. DATOS RETORNADOS:
 *    - Información del adoptante (nombre, email, teléfono, ubicación)
 *    - Información de la mascota
 *    - Estado de la postulación
 *    - Timestamps
 * 
 * 4. PAGINACIÓN:
 *    - Default: 20 postulaciones por página
 *    - Máximo: 50 por página
 *    - Metadatos: totalCount, totalPages, hasNextPage, hasPrevPage
 * 
 * 5. PERFORMANCE:
 *    - Promise.all para findMany + count simultáneos
 *    - Índices en Adoption para status, createdAt
 *    - Selección selectiva de campos
 * 
 * 6. RESPUESTA ESTRUCTURADA:
 *    - data: Array de postulaciones
 *    - pagination: Metadatos de navegación
 *    - filters: Filtros aplicados (útil para frontend)
 *    - success: Flag de éxito
 */

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint permite a un albergue autenticado ('SHELTER') obtener una
 * lista paginada y filtrada de las postulaciones de adopción que ha
 * recibido para sus mascotas. Es una herramienta fundamental para que los
 * albergues gestionen el proceso de adopción.
 *
 * Lógica Clave:
 * - 'Autorización de Albergue': El acceso está estrictamente limitado a
 *   usuarios con el rol 'SHELTER'. Se verifica que el usuario autenticado
 *   tenga un albergue asociado en la base de datos.
 * - 'Validación de Parámetros de Consulta': Los parámetros de la URL
 *   ('status', 'petId', 'page', 'limit') se validan usando el esquema
 *   'adoptionQueryStringSchema' de Zod. Esto asegura que los filtros y la
 *   paginación sean válidos antes de construir la consulta.
 * - 'Consulta Segura y Eficiente':
 *   - La consulta principal se filtra automáticamente por el 'shelterId'
 *     del usuario autenticado, garantizando que un albergue solo pueda ver
 *     sus propias postulaciones.
 *   - Se utiliza 'Promise.all' para ejecutar la consulta de datos y la de
 *     conteo total en paralelo, mejorando el rendimiento.
 * - 'Inclusión de Datos Relacionados': La consulta incluye datos del
 *   'adopter' y de la 'pet' asociados a cada postulación. Se utiliza 'select'
 *   para devolver solo los campos necesarios y evitar exponer datos
 *   sensibles (como la contraseña del adoptante).
 *
 * Dependencias Externas:
 * - 'next-auth': Para la autenticación y la obtención de la sesión del
 *   usuario para verificar el rol y el ID del albergue.
 * - 'zod': Para validar y parsear los parámetros de consulta de la URL.
 * - '@prisma/client': Para interactuar con la base de datos y realizar la
 *   consulta de las postulaciones.
 *
 */
