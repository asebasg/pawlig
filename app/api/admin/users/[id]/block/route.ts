import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

/**
 * PUT /api/admin/users/{id}/block
 * Descripción: Bloquea o desbloquea una cuenta de usuario.
 * Requiere: Autenticación como ADMIN.
 * Implementa: HU-014 (Gestión de usuarios).
 */
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import z from "zod";

//  Validación de entrada
const BlockUserSchema = z.object({
    action: z.enum(["BLOCK", "UNBLOCK"]),
    reason: z.string().min(10).max(500).trim()
});

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        //  Validar autenticación y autorización
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        if (session.user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 }
            );
        }

        const userId = params.id;

        // Validar ObjectId
        if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
            return NextResponse.json(
                { error: "ID invalido" },
                { status: 400 }
            );
        }

        // Prevenir auto-bloqueo
        if (session.user.id === userId) {
            return NextResponse.json(
                { error: "No puedes bloquear tu propia cuenta" },
                { status: 400 }
            );
        }

        // Validar body
        const body = await request.json();
        const validation = BlockUserSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validation.error.flatten().fieldErrors
                },
                { status: 400 }
            );
        }

        const { action, reason } = validation.data;

        // Verificar que el usuario exista
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true
            }
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Prevenir bloqueos de otros admins
        if (targetUser.role === UserRole.ADMIN) {
            return NextResponse.json(
                { error: "No puedes bloquear a otro administrador" },
                { status: 403 }
            );
        }

        // Validar estado actual
        if (action === "BLOCK" && !targetUser.isActive) {
            return NextResponse.json(
                { error: "El usuario ya esta bloqueado" },
                { status: 400 }
            );
        }

        if (action === "UNBLOCK" && targetUser.isActive) {
            return NextResponse.json(
                { error: "El usuario ya esta activo" },
                { status: 400 }
            );
        }

        // Obtener IP y user agent para auditoria
        const ipAddress =
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            request.headers.get("x-real-ip") ||
            "unknown";

        const userAgent = request.headers.get("user-agent") || "unknown";

        // Ejecutar bloqueo/desbloqueo con auditoria
        const result = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    isActive: action === "UNBLOCK",
                    blockedAt: action === "BLOCK" ? new Date() : null,
                    blockedBy: action === "BLOCK" ? session.user.id : null,
                    blockReason: action === "BLOCK" ? reason : null
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    blockedAt: true,
                    blockReason: true
                }
            });

            await tx.userAudit.create({
                data: {
                    action: action,
                    reason: reason,
                    oldValue: action === "BLOCK" ? "ACTIVE" : "BLOCKED",
                    newValue: action === "BLOCK" ? "BLOCKED" : "ACTIVE",
                    adminId: session.user.id,
                    userId: userId,
                    ipAddress: ipAddress,
                    userAgent: userAgent
                }
            });

            return updatedUser;
        });

        // TODO: Enviar notificación por email (RN-018)
        // await sendBlockNotificationEmail({ ... });

        return NextResponse.json({
            success: true,
            message: action === "BLOCK"
                ? "Usuario bloqueado exitosamente"
                : "Usuario desbloqueado exitosamente",
            data: result
        });

    } catch (error) {
        console.error("[API /admin/users/[id]/block] Error:", error);
        return NextResponse.json(
            { error: "Error al procesar la acción" },
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
 * Este endpoint es una herramienta de moderación para administradores que
 * permite bloquear o desbloquear la cuenta de un usuario. Es una operación
 * sensible que actualiza el estado del usuario y registra la acción en la
 * tabla de auditoría.
 *
 * Lógica Clave:
 * - 'Autorización de Administrador': Se verifica rigurosamente que el
 *   solicitante sea un administrador ('ADMIN'). Además, se implementan
 *   salvaguardas críticas para prevenir que un administrador se bloquee a
 *   sí mismo o bloquee a otro administrador.
 * - 'Validación de Entrada con Zod': El cuerpo de la solicitud se valida
 *   con 'BlockUserSchema' para asegurar que la acción sea 'BLOCK' o 'UNBLOCK'
 *   y que se proporcione una razón ('reason') con la longitud adecuada.
 * - 'Transacción Atómica': La operación de actualización del usuario y la
 *   creación del registro de auditoría se envuelven en una transacción de
 *   Prisma ('$transaction'). Esto garantiza la atomicidad: o ambas
 *   operaciones se completan con éxito, o ninguna lo hace. Esto es
 *   fundamental para mantener la integridad de los datos y un registro de
 *   auditoría fiable.
 * - 'Registro de Auditoría Detallado': Se captura información contextual
 *   importante como la dirección IP y el 'User-Agent' del administrador
 *   que realiza la acción. Estos datos se almacenan en el registro de
 *   auditoría para una trazabilidad completa.
 *
 * Dependencias Externas:
 * - 'next-auth': Para la autenticación y la validación del rol de 'ADMIN'.
 * - 'zod': Para una validación estricta y segura del cuerpo de la
 *   solicitud.
 * - '@prisma/client': Para interactuar con la base de datos, especialmente
 *   para ejecutar la transacción de bloqueo/desbloqueo.
 *
 */
