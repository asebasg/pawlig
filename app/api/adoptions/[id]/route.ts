import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { adoptionStatusChangeSchema } from '@/lib/validations/adoption.schema';
import { ZodError } from 'zod';

/**
 * PATCH /api/adoptions/{id}
 * Descripción: Actualiza el estado de una postulación de adopción (Aprobada/Rechazada).
 * Requiere: Autenticación como SHELTER y ser propietario de la mascota.
 * Implementa: TAREA-024 (Cambio de estado de postulación).
 */

/**
 * Endpoint para cambiar estado de postulación
 * Implementa TAREA-024
 * 
 * PATCH /api/adoptions/[id]
 * - Aprobar o rechazar postulación
 * - Actualizar estado de mascota automáticamente
 * - Solo SHELTER propietario del albergue
 */

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar ID
    if (!params.id) {
      return NextResponse.json(
        {
          error: 'ID de postulación requerido',
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
          message: 'Debes iniciar sesión para cambiar el estado de una postulación',
        },
        { status: 401 }
      );
    }

    // 3. Verificar rol (solo SHELTER)
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        {
          error: 'Acceso denegado',
          code: 'FORBIDDEN',
          message: 'Solo SHELTER puede cambiar el estado de postulaciones',
        },
        { status: 403 }
      );
    }

    // 4. Obtener albergue del usuario
    const shelter = await prisma.shelter.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!shelter) {
      return NextResponse.json(
        {
          error: 'Sin albergue',
          code: 'SHELTER_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // 5. Buscar postulación
    const adoption = await prisma.adoption.findUnique({
      where: { id: params.id },
      include: {
        pet: {
          select: {
            id: true,
            shelterId: true,
            status: true,
          },
        },
        adopter: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // 6. Verificar que postulación existe
    if (!adoption) {
      return NextResponse.json(
        {
          error: 'Postulación no encontrada',
          code: 'ADOPTION_NOT_FOUND',
          adoptionId: params.id,
        },
        { status: 404 }
      );
    }

    // 7. Verificar que el albergue es propietario de la mascota
    if (adoption.pet.shelterId !== shelter.id) {
      return NextResponse.json(
        {
          error: 'No tienes permiso',
          code: 'UNAUTHORIZED_EDIT',
          message: 'No eres propietario de esta mascota',
        },
        { status: 403 }
      );
    }

    // 8. Parsear y validar datos
    const body = await request.json();
    const validatedData = adoptionStatusChangeSchema.parse(body);

    // 9. Usar transacción para actualizar adoption y pet state
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar estado de postulación
      const updatedAdoption = await tx.adoption.update({
        where: { id: params.id },
        data: {
          status: validatedData.status,
          message: validatedData.rejectionReason || null,
        },
        include: {
          pet: true,
          adopter: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      // Actualizar estado de mascota automáticamente
      let petStatusUpdate: string | null = null;

      if (validatedData.status === 'APPROVED') {
        // Si se aprueba: cambiar a IN_PROCESS
        petStatusUpdate = 'IN_PROCESS';
        await tx.pet.update({
          where: { id: adoption.pet.id },
          data: { status: 'IN_PROCESS' },
        });

        // Verificar si hay otras postulaciones APPROVED para esta mascota
        // Si hay múltiples APPROVED, cambiarse a ADOPTED
        const approvedCount = await tx.adoption.count({
          where: {
            petId: adoption.pet.id,
            status: 'APPROVED',
          },
        });

        // Solo una adopción puede estar aprobada: cambiar a ADOPTED
        if (approvedCount === 1) {
          await tx.pet.update({
            where: { id: adoption.pet.id },
            data: { status: 'ADOPTED' },
          });
          petStatusUpdate = 'ADOPTED';
        }
      } else if (validatedData.status === 'REJECTED') {
        // Si se rechaza: verificar si hay otras postulaciones APPROVED
        const hasApprovedAdoption = await tx.adoption.findFirst({
          where: {
            petId: adoption.pet.id,
            status: 'APPROVED',
            id: { not: params.id }, // Excluir la actual
          },
        });

        // Si no hay APPROVED, mantener en AVAILABLE
        if (!hasApprovedAdoption) {
          petStatusUpdate = 'AVAILABLE';
          // Solo cambiar si la mascota está en IN_PROCESS y no hay otra aprobada
          if (adoption.pet.status === 'IN_PROCESS') {
            await tx.pet.update({
              where: { id: adoption.pet.id },
              data: { status: 'AVAILABLE' },
            });
          }
        }
      }

      return {
        adoption: updatedAdoption,
        petStatusUpdate,
      };
    });

    // 10. Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: 'Postulación actualizada exitosamente',
        code: 'ADOPTION_UPDATED',
        data: {
          adoptionId: result.adoption.id,
          status: result.adoption.status,
          petStatusUpdate: result.petStatusUpdate,
          adopter: result.adoption.adopter,
          pet: {
            id: result.adoption.pet.id,
            name: result.adoption.pet.name,
            newStatus: result.petStatusUpdate,
          },
          updatedAt: result.adoption.updatedAt,
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
      console.error('Error de Prisma al cambiar estado de postulación:', error);
      return NextResponse.json(
        {
          error: 'Error al cambiar estado de postulación',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Error genérico del servidor
    console.error('Error al cambiar estado de postulación:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint maneja la lógica para que un albergue apruebe o rechace
 * una postulación de adopción. Es una operación crítica que no solo
 * actualiza el estado de la postulación, sino que también orquesta el
 * cambio de estado de la mascota asociada.
 *
 * Lógica Clave:
 * - Autorización Múltiple: Antes de cualquier operación, se realizan
 *   múltiples verificaciones de seguridad: que el usuario esté autenticado,
 *   que su rol sea 'SHELTER', y que el albergue sea el propietario de la
 *   mascota implicada en la postulación.
 * - Transacción Atómica: La lógica principal está envuelta en una
 *   transacción de Prisma ('$transaction'). Esto es fundamental para
 *   garantizar la consistencia de los datos, ya que la actualización de
 *   la postulación y la de la mascota deben ocurrir juntas (o ninguna de
 *   las dos).
 * - Orquestación de Estados: El estado de la mascota se actualiza
 *   automáticamente en función del nuevo estado de la postulación.
 *   - Si una postulación es 'APPROVED', la mascota pasa a 'ADOPTED'.
 *   - Si es 'REJECTED', se verifica si existen otras postulaciones
 *     aprobadas. Si no hay ninguna, la mascota vuelve a 'AVAILABLE'.
 *   Esto previene que una mascota quede en un estado inconsistente.
 *
 * Dependencias Externas:
 * - 'next-auth': Se usa para la autenticación y obtención de la sesión
 *   del usuario para las validaciones de rol y propiedad.
 * - 'zod': Valida que el cuerpo de la solicitud contenga un estado
 *   válido y una razón de rechazo si es necesaria.
 * - '@prisma/client': Utilizado para todas las operaciones de base de
 *   datos, incluyendo la transacción que asegura la atomicidad.
 *
 */
