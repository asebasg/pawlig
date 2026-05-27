import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { moderationService } from "@/lib/services/moderation.service";
import { UserRole } from "@prisma/client";

/**
 * PATH /api/admin/moderation/shelters
 * Descripción: Endpoint GET para consultar albergues pendientes.
 * Requiere: Sesión autenticada con rol ADMIN.
 * Implementa: HU-ModerationHub
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let shelters;
    if (status === "approved") {
      shelters = await moderationService.getApprovedShelters();
    } else if (status === "rejected") {
      shelters = await moderationService.getRejectedShelters();
    } else {
      shelters = await moderationService.getPendingShelters();
    }

    return NextResponse.json(shelters, { status: 200 });
  } catch (error: unknown) {
    console.error("[MODERATION_SHELTERS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
