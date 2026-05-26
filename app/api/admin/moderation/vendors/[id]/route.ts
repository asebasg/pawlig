import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { moderationService } from "@/lib/services/moderation.service";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const moderationSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reason: z.string().optional(),
});

/**
 * PATH /api/admin/moderation/vendors/[id]
 * Descripción: Endpoint PATCH para procesar la aprobación o rechazo de solicitudes de negocios.
 * Requiere: Sesión autenticada con rol ADMIN.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = moderationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Payload inválido", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { action, reason } = parsed.data;

    let result;
    if (action === "APPROVE") {
      result = await moderationService.approveVendor(
        params.id,
        session.user.id,
        session.user.email!
      );
    } else {
      if (!reason || reason.trim() === "") {
        return NextResponse.json(
          { error: "El motivo de rechazo es obligatorio." },
          { status: 400 }
        );
      }
      result = await moderationService.rejectVendor(
        params.id,
        session.user.id,
        session.user.email!,
        reason
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("[MODERATION_VENDOR_PATCH]", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: msg },
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
 * Endpoint que intercepta la decisión del administrador sobre un negocio.
 *
 * Lógica Clave:
 * - Se delega toda la responsabilidad transaccional a moderationService.
 * - Solo administradores pueden ejecutar esta acción.
 */
