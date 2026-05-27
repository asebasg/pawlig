import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import z from "zod";
import { revalidatePath } from "next/cache";
import { sendUserBlockStatusEmail } from "@/lib/services/email.service";

//  Validación de entrada
const BlockUserSchema = z.object({
  action: z.enum(["BLOCK", "UNBLOCK"]),
  reason: z.string().min(10).max(500).trim(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    //  Validar autenticación y autorización
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const userId = params.id;

    // Validar ObjectId
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      return NextResponse.json({ error: "ID invalido" }, { status: 400 });
    }

    // Prevenir auto-bloqueo
    if (session.user.id === userId) {
      return NextResponse.json(
        { error: "No puedes bloquear tu propia cuenta" },
        { status: 400 },
      );
    }

    // Validar body
    const body = await request.json();
    const validation = BlockUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
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
        isActive: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Prevenir bloqueos de otros admins
    if (targetUser.role === UserRole.ADMIN) {
      return NextResponse.json(
        { error: "No puedes bloquear a otro administrador" },
        { status: 403 },
      );
    }

    // Validar estado actual
    if (action === "BLOCK" && !targetUser.isActive) {
      return NextResponse.json(
        { error: "El usuario ya esta bloqueado" },
        { status: 400 },
      );
    }

    if (action === "UNBLOCK" && targetUser.isActive) {
      return NextResponse.json(
        { error: "El usuario ya esta activo" },
        { status: 400 },
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
          blockReason: action === "BLOCK" ? reason : null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          blockedAt: true,
          blockReason: true,
        },
      });

      await tx.systemAuditLog.create({
        data: {
          category: "USER_MANAGEMENT",
          action: action,
          actorId: session.user.id,
          actorEmail: session.user.email as string,
          resourceType: "USER",
          resourceId: userId,
          before: JSON.stringify({ isActive: action === "BLOCK" }),
          after: JSON.stringify({ isActive: action === "UNBLOCK" }),
          reason: reason,
          ipAddress: ipAddress,
          userAgent: userAgent,
          requestId: crypto.randomUUID(),
        },
      });

      return updatedUser;
    });

    // Invalidar caché para reflejar los cambios en la UI (Issue 101)
    revalidatePath(`/admin/users/${userId}/view`);
    revalidatePath("/admin/users");

    // Enviar notificación por email (RN-018)
    sendUserBlockStatusEmail({
      to: targetUser.email,
      userName: targetUser.name,
      action: action,
      reason: action === "BLOCK" ? reason : undefined,
    }).catch((err) => console.error("Error enviando email de bloqueo:", err));

    return NextResponse.json({
      success: true,
      message:
        action === "BLOCK"
          ? "Usuario bloqueado exitosamente"
          : "Usuario desbloqueado exitosamente",
      data: result,
    });
  } catch (error) {
    console.error("[API /admin/users/[id]/block] Error:", error);
    return NextResponse.json(
      { error: "Error al procesar la acción" },
      { status: 500 },
    );
  }
}
