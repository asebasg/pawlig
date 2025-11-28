import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { updatePetStatusSchema } from '@/lib/validations/pet.schema';
import { ZodError } from 'zod';

/**
 * Endpoint para cambiar estado de mascota
 * Implementa HU-005, TAREA-014
 * 
 * PUT /api/pets/[id]/status
 * - Cambiar estado (AVAILABLE, IN_PROCESS, ADOPTED)
 * - Solo propietario del albergue
 */

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
          message: 'Debes iniciar sesión para cambiar el estado de una mascota',
        },
        { status: 401 }
      );
    }

    // 3. Verificar rol (solo SHELTER puede cambiar estado)
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        {
          error: 'Acceso denegado',
          code: 'FORBIDDEN',
          message: 'Solo SHELTER puede cambiar el estado de mascotas',
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
        status: true,
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
          message: 'Solo el propietario del albergue puede cambiar el estado de esta mascota',
        },
        { status: 403 }
      );
    }

    // 7. Parsear y validar datos
    const body = await request.json();
    const validatedData = updatePetStatusSchema.parse(body);

    // 8. Validación: No permitir cambios inválidos de estado
    const allowedTransitions: Record<string, string[]> = {
      AVAILABLE: ['IN_PROCESS', 'ADOPTED'],
      IN_PROCESS: ['AVAILABLE', 'ADOPTED'],
      ADOPTED: ['AVAILABLE'], // Raramente se abre una adopción, pero permitimos volver a AVAILABLE
    };

    const currentStatus = pet.status;
    const newStatus = validatedData.status;

    if (currentStatus === newStatus) {
      return NextResponse.json(
        {
          error: 'Estado igual',
          code: 'NO_STATUS_CHANGE',
          message: `La mascota ya está en estado ${currentStatus}`,
          currentStatus,
        },
        { status: 400 }
      );
    }

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        {
          error: 'Transición de estado inválida',
          code: 'INVALID_STATUS_TRANSITION',
          message: `No puedes cambiar de ${currentStatus} a ${newStatus}`,
          currentStatus,
          attemptedStatus: newStatus,
          allowedTransitions: allowedTransitions[currentStatus] || [],
        },
        { status: 400 }
      );
    }

    // 9. Actualizar estado
    const updatedPet = await prisma.pet.update({
      where: { id: params.id },
      data: {
        status: newStatus,
      },
      include: {
        shelter: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 10. Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: 'Estado de mascota actualizado exitosamente',
        code: 'PET_STATUS_UPDATED',
        data: {
          petId: updatedPet.id,
          petName: updatedPet.name,
          previousStatus: currentStatus,
          newStatus: updatedPet.status,
          shelter: updatedPet.shelter,
          changeReason: validatedData.changeReason || null,
          changedAt: updatedPet.updatedAt,
        },
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
      console.error('Error de Prisma al cambiar estado de mascota:', error);
      return NextResponse.json(
        {
          error: 'Error al cambiar estado de mascota',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Error genérico del servidor
    console.error('Error al cambiar estado de mascota:', error);
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
 * 📚 NOTAS TÉCNICAS:
 * 
 * ENDPOINT:
 * - PUT /api/pets/[id]/status
 * - Separado de PUT /api/pets/[id] para mayor granularidad
 * - Requiere autenticación y rol SHELTER
 * 
 * VALIDACIÓN DE ESTADO:
 * - Estados permitidos: AVAILABLE, IN_PROCESS, ADOPTED
 * - Transiciones permitidas:
 *   * AVAILABLE → IN_PROCESS, ADOPTED
 *   * IN_PROCESS → AVAILABLE, ADOPTED
 *   * ADOPTED → AVAILABLE (rara, pero permitida)
 * 
 * AUTORIZACIÓN:
 * - Solo SHELTER
 * - Solo propietario del albergue
 * 
 * RESPUESTA:
 * - 200 OK: Estado cambiado exitosamente
 * - 400 Bad Request: Datos inválidos o transición no permitida
 * - 401 Unauthorized: No autenticado
 * - 403 Forbidden: No es SHELTER o no es propietario
 * - 404 Not Found: Mascota no existe
 * - 500 Internal Server Error: Error de BD
 * 
 * CAMBIO_RAZÓN:
 * - Campo opcional para documentar razón del cambio
 * - Útil para auditoría
 * 
 * INFORMACIÓN RETORNADA:
 * - petId, petName: Información de la mascota
 * - previousStatus, newStatus: Estados antes y después
 * - shelter: Información del albergue
 * - changeReason: Razón del cambio (si proporcionada)
 * - changedAt: Timestamp del cambio
 */
