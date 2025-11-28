import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { updatePetSchema, updatePetStatusSchema } from '@/lib/validations/pet.schema';
import { ZodError } from 'zod';

/**
 * Endpoints para detalle y edición de mascotas
 * Implementa HU-005, TAREA-014
 * 
 * GET /api/pets/[id] - Obtener detalle de mascota
 * PUT /api/pets/[id] - Editar mascota (solo propietario del albergue)
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar ID
    if (!params.id) {
      return NextResponse.json(
        {
          error: 'ID de mascota requerido',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // 2. Obtener sesión (opcional para GET)
    const session = await getServerSession(authOptions);

    // 3. Buscar mascota por ID
    const pet = await prisma.pet.findUnique({
      where: { id: params.id },
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
            verified: true,
          },
        },
        // Contar favoritos totales
        _count: {
          select: { favorites: true },
        },
      },
    });

    // 4. Verificar que mascota existe
    if (!pet) {
      return NextResponse.json(
        {
          error: 'Mascota no encontrada',
          code: 'PET_NOT_FOUND',
          petId: params.id,
        },
        { status: 404 }
      );
    }

    // 5. Verificar si usuario autenticado tiene mascota en favoritos
    let isFavorite = false;
    if (session?.user?.id) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_petId: {
            userId: session.user.id,
            petId: params.id,
          },
        },
      });
      isFavorite = !!favorite;
    }

    // 6. Retornar respuesta con datos completos
    return NextResponse.json(
      {
        message: 'Detalle de mascota obtenido exitosamente',
        data: {
          ...pet,
          isFavorite,
          totalFavorites: pet._count.favorites,
          _count: undefined, // Remover _count interno
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al obtener detalle de mascota:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener mascota',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar ID
    if (!params.id) {
      return NextResponse.json(
        {
          error: 'ID de mascota requerido',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    // 2. Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'No autenticado',
          code: 'UNAUTHORIZED',
          message: 'Debes iniciar sesión para editar una mascota',
        },
        { status: 401 }
      );
    }

    // 3. Verificar rol (solo SHELTER puede editar)
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        {
          error: 'Acceso denegado',
          code: 'FORBIDDEN',
          message: 'Solo SHELTER puede editar mascotas',
        },
        { status: 403 }
      );
    }

    // 4. Buscar mascota
    const pet = await prisma.pet.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        shelterId: true,
      },
    });

    // 5. Verificar que mascota existe
    if (!pet) {
      return NextResponse.json(
        {
          error: 'Mascota no encontrada',
          code: 'PET_NOT_FOUND',
          petId: params.id,
        },
        { status: 404 }
      );
    }

    // 6. Verificar que el usuario es propietario del albergue
    const shelter = await prisma.shelter.findFirst({
      where: {
        id: pet.shelterId,
        userId: session.user.id,
      },
      select: { id: true },
    });

    if (!shelter) {
      return NextResponse.json(
        {
          error: 'No tienes permiso',
          code: 'UNAUTHORIZED_EDIT',
          message: 'Solo el propietario del albergue puede editar esta mascota',
        },
        { status: 403 }
      );
    }

    // 7. Parsear y validar datos
    const body = await request.json();
    const validatedData = updatePetSchema.parse(body);

    // 8. Actualizar mascota
    const updatedPet = await prisma.pet.update({
      where: { id: params.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.species && { species: validatedData.species }),
        ...(validatedData.breed !== undefined && { breed: validatedData.breed }),
        ...(validatedData.age !== undefined && { age: validatedData.age }),
        ...(validatedData.sex !== undefined && { sex: validatedData.sex }),
        ...(validatedData.description && { description: validatedData.description }),
        ...(validatedData.requirements !== undefined && { requirements: validatedData.requirements }),
        ...(validatedData.images && { images: validatedData.images }),
      },
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
    });

    // 9. Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: 'Mascota actualizada exitosamente',
        code: 'PET_UPDATED',
        data: updatedPet,
      },
      { status: 200 }
    );
  } catch (error) {
    // Manejo de errores de validación Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
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
      console.error('Error de Prisma al actualizar mascota:', error);
      return NextResponse.json(
        {
          error: 'Error al actualizar mascota',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Error genérico del servidor
    console.error('Error al actualizar mascota:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/pets/[id]
 * Actualizar solo el estado de la mascota
 * 
 * CRITERIO DE ACEPTACIÓN:
 * "Cuando cambio estado de 'Disponible' a 'Adoptado',
 *  entonces se retira de resultados de búsqueda activos"
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar ID
    if (!params.id) {
      return NextResponse.json(
        { error: 'ID de mascota requerido', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // 2. Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // 3. Verificar rol (solo SHELTER)
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        { error: 'Acceso denegado', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // 4. Buscar mascota y verificar propiedad
    const pet = await prisma.pet.findUnique({
      where: { id: params.id },
      select: { id: true, shelterId: true, name: true, status: true },
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Mascota no encontrada', code: 'PET_NOT_FOUND' },
        { status: 404 }
      );
    }

    // 5. Verificar que el usuario es propietario del albergue
    const shelter = await prisma.shelter.findFirst({
      where: { id: pet.shelterId, userId: session.user.id },
      select: { id: true },
    });

    if (!shelter) {
      return NextResponse.json(
        { error: 'No tienes permiso', code: 'UNAUTHORIZED_EDIT' },
        { status: 403 }
      );
    }

    // 6. Parsear y validar datos
    const body = await request.json();
    const validatedData = updatePetStatusSchema.parse(body);

    // 7. Actualizar estado
    const updatedPet = await prisma.pet.update({
      where: { id: params.id },
      data: { status: validatedData.status },
      select: {
        id: true,
        name: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: `Estado de ${pet.name} actualizado a ${updatedPet.status}`,
        code: 'STATUS_UPDATED',
        data: updatedPet,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error al actualizar estado de mascota:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pets/[id]
 * Eliminar mascota permanentemente
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar ID
    if (!params.id) {
      return NextResponse.json(
        { error: 'ID de mascota requerido', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // 2. Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'SHELTER') {
      return NextResponse.json(
        { error: 'Acceso denegado', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // 3. Buscar mascota y verificar propiedad
    const pet = await prisma.pet.findUnique({
      where: { id: params.id },
      select: { id: true, shelterId: true, name: true },
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Mascota no encontrada', code: 'PET_NOT_FOUND' },
        { status: 404 }
      );
    }

    const shelter = await prisma.shelter.findFirst({
      where: { id: pet.shelterId, userId: session.user.id },
      select: { id: true },
    });

    if (!shelter) {
      return NextResponse.json(
        { error: 'No tienes permiso', code: 'UNAUTHORIZED_EDIT' },
        { status: 403 }
      );
    }

    // 4. Eliminar mascota
    await prisma.pet.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      {
        message: `Mascota "${pet.name}" eliminada exitosamente`,
        code: 'PET_DELETED',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar mascota:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * GET /api/pets/[id]:
 * 1. Endpoint público (sin autenticación requerida)
 * 2. Retorna información completa de la mascota
 * 3. Si usuario autenticado: incluye isFavorite
 * 4. Incluye información del albergue propietario
 * 5. Retorna count de favoritos totales
 * 
 * PUT /api/pets/[id]:
 * 1. Solo SHELTER puede editar
 * 2. Solo propietario del albergue puede editar SU mascota
 * 3. Todos los campos son opcionales (PATCH-like)
 * 4. Se validan con Zod antes de actualizar
 * 5. Solo actualiza campos que vienen en el request
 * 6. Incluye datos del shelter en respuesta
 * 
 * PATCH /api/pets/[id]:
 * 1. Solo SHELTER puede cambiar estado
 * 2. Solo propietario del albergue
 * 3. Valida con updatePetStatusSchema
 * 4. Actualiza solo campo status
 * 
 * DELETE /api/pets/[id]:
 * 1. Solo SHELTER puede eliminar
 * 2. Solo propietario del albergue
 * 3. Eliminación permanente (considerar soft delete en producción)
 * 
 * AUTORIZACIÓN:
 * - GET: Público
 * - PUT, PATCH, DELETE: Requiere SHELTER + propietario del albergue
 * 
 * IMÁGENES:
 * - URLs de Cloudinary
 * - Se reemplazan completamente si se envían
 */
