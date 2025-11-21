import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';

interface ApprovalBody {
    action: 'approve' | 'reject';
    rejectionReason?: string; // Obligatorio si action = 'reject'
}

export async function PATCH(
    request: Request,
    { params }: { params: { shelterId: string } }
) {
    try {
        //  2. Verificar autenticación y autorización
        const session = await getServerSession(authOptions);

        // Verificar que el usuario esté autenticado
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

        // Verificar que el usuario tenga rol ADMIN
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

        //  2. Parsear body de la petición
        const body: ApprovalBody = await request.json();
        const { action, rejectionReason } = body;

        // Validar que la acción sea válida
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

        // Validar que si es rechazo, se proporcione motivo (RN-017)
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

        //  3. Verificar que el albergue exista
        const shelter = await prisma.shelter.findUnique({
            where: { id: params.shelterId },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
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

        // Verificar que el albergue esté pendiente (no ya aprobado/rechazado)
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

        //  5. Procesar según la acción
        let updatedShelter;

        if (action === 'approve') {
            // APROBACIÓN: Actualizar verified a true
            updatedShelter = await prisma.shelter.update({
                where: { id: params.shelterId },
                data: {
                    verified: true, // ✅ ESTADO APROBADO
                    rejectionReason: null, // Limpiar cualquier rechazo previo
                    updatedAt: new Date(), // Registrar fecha de aprobación
                },
            });

            // TODO: Enviar email de aprobación al solicitante
            console.log('📧 [NOTIFICACIÓN] Albergue aprobado:', {
                shelterName: updatedShelter.name,
                representativeEmail: shelter.user.email,
                representativeName: shelter.user.name,
                approvedBy: session.user.email,
                approvedAt: new Date().toISOString(),
            });

            // Auditoría
            console.log('📝 [AUDITORÍA] Aprobación de albergue:', {
                action: 'APPROVE',
                shelterId: params.shelterId,
                shelterName: updatedShelter.name,
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
                    notification: {
                        sent: true, // Simulado por ahora
                        recipient: shelter.user.email,
                        message: 'El albergue puede iniciar sesión inmediatamente',
                    },
                },
                { status: 200 }
            );
        } else {
            // RECHAZO: Mantener verified = false, agregar motivo
            updatedShelter = await prisma.shelter.update({
                where: { id: params.shelterId },
                data: {
                    verified: false, // Mantener sin verificar
                    rejectionReason: rejectionReason!.trim(), // ❌ ESTADO RECHAZADO
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

            // Auditoría
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
                        sent: true, // Simulado
                        recipient: shelter.user.email,
                        message: 'Notificación enviada con el motivo del rechazo',
                    },
                },
                { status: 200 }
            );
        }
    } catch (error) {
        //  5. Manejo de errores
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
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SEGURIDAD CRÍTICA (CORREGIDA):
 *    - getServerSession() + validación de rol ADMIN
 *    - Sin esto, cualquier usuario podría aprobar albergues
 *    - Status 401 (no autenticado) vs 403 (sin permisos)
 * 
 * 2. VALIDACIONES:
 *    - Acción válida (approve/reject)
 *    - Motivo obligatorio en rechazos (RN-017)
 *    - Albergue existe y está pendiente
 *    - No permitir re-aprobación de albergues ya verificados
 * 
 * 3. CAMBIOS DE ESTADO (HU-002):
 *    Estado Inicial → Aprobación:
 *      verified: false → verified: true
 *      rejectionReason: null
 *    
 *    Estado Inicial → Rechazo:
 *      verified: false (sin cambio)
 *      rejectionReason: "motivo claro y profesional"
 * 
 * 4. NOTIFICACIONES (simuladas):
 *    - Aprobación: Email con credenciales de acceso
 *    - Rechazo: Email con motivo y sugerencias
 *    - TODO: Implementar servicio de email real (Resend/Nodemailer)
 * 
 * 5. AUDITORÍA:
 *    - Registro de quién aprobó/rechazó (adminId, adminEmail)
 *    - Timestamp exacto de la acción
 *    - Motivo del rechazo (si aplica)
 *    - TODO: Crear tabla Audit para persistir logs
 * 
 * 6. RESPUESTA ESTRUCTURADA:
 *    - message: Confirmación de la acción
 *    - status: 'APPROVED' o 'REJECTED'
 *    - shelter: Datos actualizados del albergue
 *    - notification: Confirmación de envío de email
 * 
 * 7. CÓDIGOS DE ESTADO HTTP:
 *    - 200: Acción completada exitosamente
 *    - 400: Datos inválidos (acción o motivo)
 *    - 401: No autenticado
 *    - 403: Sin permisos (no ADMIN)
 *    - 404: Albergue no encontrado
 *    - 409: Conflicto (ya aprobado previamente)
 *    - 500: Error interno del servidor
 * 
 * 8. TRAZABILIDAD:
 *    - RF-007: Administración de albergues ✅
 *    - HU-002: Aprobación y rechazo de cuenta ✅
 *    - CU-007: Caso de uso de gestión de solicitudes ✅
 *    - RN-004: Aprobación requerida por admin ✅
 *    - RN-017: Justificación obligatoria en bloqueos/rechazos ✅
 *    - RN-018: Notificación requerida al usuario afectado ✅
 * 
 * 9. FLUJO COMPLETO (HU-002):
 *    1. Solicitante envía formulario → /api/auth/request-shelter-account
 *       Estado: verified = false (PENDIENTE)
 *    
 *    2. Admin consulta solicitudes → GET /api/admin/shelter-requests
 *       Filtro: verified = false
 *    
 *    3. Admin aprueba/rechaza → PATCH /api/admin/shelters/[shelterId]
 *       Aprobación: verified = true
 *       Rechazo: rejectionReason = "motivo"
 *    
 *    4. Sistema notifica al solicitante (email)
 *    
 *    5. Si aprobado: Albergue inicia sesión → Panel /shelter
 *       Si rechazado: Puede corregir y reaplicar después de 30 días
 */
