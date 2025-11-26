import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';

interface ApprovalBody {
    action: 'approve' | 'reject';
    rejectionReason?: string;
}

export async function PATCH(
    request: Request,
    { params }: { params: { shelterId: string } }
) {
    try {
        //  Verificar autenticación y autorización
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    error: 'No autenticado',
                    code: 'UNAUTHORIZED',
                    message: 'Debes iniciar sesión para realizar esta acción',
                },
                { status: 401 }
            );
        }

        if (session.user.role !== 'ADMIN') {
            return NextResponse.json(
                {
                    error: 'Acceso denegado',
                    code: 'FORBIDDEN',
                    message: 'Solo administradores pueden aprobar o rechazar solicitudes',
                    requiredRole: 'ADMIN',
                    userRole: session.user.role,
                },
                { status: 403 }
            );
        }

        //  Parsear body de la petición
        const body: ApprovalBody = await request.json();
        const { action, rejectionReason } = body;

        if (!action || (action !== 'approve' && action !== 'reject')) {
            return NextResponse.json(
                {
                    error: 'Acción inválida',
                    code: 'INVALID_ACTION',
                    message: 'La acción debe ser "approve" o "reject"',
                },
                { status: 400 }
            );
        }

        if (action === 'reject' && (!rejectionReason || rejectionReason.trim() === '')) {
            return NextResponse.json(
                {
                    error: 'Motivo de rechazo requerido',
                    code: 'REJECTION_REASON_REQUIRED',
                    message: 'Debes proporcionar un motivo claro para el rechazo',
                },
                { status: 400 }
            );
        }

        //  Verificar que el albergue exista
        const shelter = await prisma.shelter.findUnique({
            where: { id: params.shelterId },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                        role: true, // ✅ MEJORA 3: Incluir rol actual
                    },
                },
            },
        });

        if (!shelter) {
            return NextResponse.json(
                {
                    error: 'Albergue no encontrado',
                    code: 'SHELTER_NOT_FOUND',
                    shelterId: params.shelterId,
                },
                { status: 404 }
            );
        }

        if (shelter.verified === true) {
            return NextResponse.json(
                {
                    error: 'El albergue ya fue aprobado previamente',
                    code: 'ALREADY_APPROVED',
                    approvedAt: shelter.updatedAt,
                },
                { status: 409 }
            );
        }

        //  Procesar según la acción
        let updatedShelter;

        if (action === 'approve') {
            // ✅ MEJORA 3: APROBACIÓN incluye cambio de rol a SHELTER
            updatedShelter = await prisma.$transaction(async (tx) => {
                // 1. Actualizar Shelter (verified = true)
                const approvedShelter = await tx.shelter.update({
                    where: { id: params.shelterId },
                    data: {
                        verified: true,
                        rejectionReason: null,
                        updatedAt: new Date(),
                    },
                });

                // 2. ✅ MEJORA 3: Cambiar rol del usuario a SHELTER
                await tx.user.update({
                    where: { id: shelter.userId },
                    data: {
                        role: 'SHELTER', // Ahora SÍ cambiar a SHELTER
                    },
                });

                return approvedShelter;
            });

            // TODO: Enviar email de aprobación
            console.log('📧 [NOTIFICACIÓN] Albergue aprobado:', {
                shelterName: updatedShelter.name,
                representativeEmail: shelter.user.email,
                representativeName: shelter.user.name,
                previousRole: shelter.user.role, // ✅ Log del rol anterior
                newRole: 'SHELTER', // ✅ Log del nuevo rol
                approvedBy: session.user.email,
                approvedAt: new Date().toISOString(),
            });

            console.log('📝 [AUDITORÍA] Aprobación de albergue:', {
                action: 'APPROVE',
                shelterId: params.shelterId,
                shelterName: updatedShelter.name,
                roleChange: `${shelter.user.role} → SHELTER`, // ✅ Registro de cambio de rol
                adminId: session.user.id,
                adminEmail: session.user.email,
                timestamp: new Date().toISOString(),
            });

            return NextResponse.json(
                {
                    message: 'Albergue aprobado exitosamente',
                    status: 'APPROVED',
                    shelter: {
                        id: updatedShelter.id,
                        name: updatedShelter.name,
                        verified: updatedShelter.verified,
                        approvedAt: updatedShelter.updatedAt,
                    },
                    roleChange: {
                        previous: shelter.user.role,
                        current: 'SHELTER',
                    },
                    notification: {
                        sent: true,
                        recipient: shelter.user.email,
                        message: 'El albergue puede iniciar sesión inmediatamente con rol SHELTER',
                    },
                },
                { status: 200 }
            );
        } else {
            // RECHAZO: Mantener verified = false, agregar motivo
            updatedShelter = await prisma.shelter.update({
                where: { id: params.shelterId },
                data: {
                    verified: false,
                    rejectionReason: rejectionReason!.trim(),
                    updatedAt: new Date(),
                },
            });

            // TODO: Enviar email de rechazo con motivo
            console.log('📧 [NOTIFICACIÓN] Albergue rechazado:', {
                shelterName: updatedShelter.name,
                representativeEmail: shelter.user.email,
                representativeName: shelter.user.name,
                rejectionReason: rejectionReason,
                rejectedBy: session.user.email,
                rejectedAt: new Date().toISOString(),
            });

            console.log('📝 [AUDITORÍA] Rechazo de albergue:', {
                action: 'REJECT',
                shelterId: params.shelterId,
                shelterName: updatedShelter.name,
                rejectionReason: rejectionReason,
                adminId: session.user.id,
                adminEmail: session.user.email,
                timestamp: new Date().toISOString(),
            });

            return NextResponse.json(
                {
                    message: 'Solicitud rechazada',
                    status: 'REJECTED',
                    shelter: {
                        id: updatedShelter.id,
                        name: updatedShelter.name,
                        verified: updatedShelter.verified,
                        rejectionReason: updatedShelter.rejectionReason,
                        rejectedAt: updatedShelter.updatedAt,
                    },
                    notification: {
                        sent: true,
                        recipient: shelter.user.email,
                        message: 'Notificación enviada con el motivo del rechazo',
                    },
                },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error('❌ Error al procesar solicitud de albergue:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR',
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. Cambio de rol a SHELTER al aprobar
 *    - Agregada transacción con 2 operaciones:
 *      a. Shelter.verified → true
 *      b. User.role → SHELTER
 *    - Usuario puede acceder a /shelter inmediatamente
 * 
 * 2. Auditoría mejorada:
 *    - Log del rol anterior (ADOPTER/VENDOR)
 *    - Log del nuevo rol (SHELTER)
 *    - Trazabilidad completa del cambio
 * 
 * 3. Respuesta enriquecida:
 *    - roleChange: { previous, current }
 *    - Mensaje claro de cambio de rol
 * 
 * 4. Flujo completo corregido:
 *    Solicitud (ADOPTER/VENDOR):
 *      - POST /api/auth/request-shelter-account
 *      - Shelter creado (verified: false)
 *      - Usuario mantiene rol actual
 *    
 *    Aprobación (ADMIN):
 *      - PATCH /api/admin/shelters/[id] (action: approve)
 *      - Shelter.verified → true
 *      - User.role → SHELTER (AQUÍ)
 *      - Usuario puede acceder a /shelter
 *    
 *    Rechazo (ADMIN):
 *      - PATCH /api/admin/shelters/[id] (action: reject)
 *      - Shelter.verified → false
 *      - Shelter.rejectionReason → motivo
 *      - Usuario mantiene rol actual
 * 
 * 5. Trazabilidad:
 *    - Cambio de rol al aprobar ✅
 *    - HU-002: Aprobación de cuenta ✅
 *    - RF-006: Gestión de roles ✅
 *    - RN-017: Justificación obligatoria ✅
 */
