import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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