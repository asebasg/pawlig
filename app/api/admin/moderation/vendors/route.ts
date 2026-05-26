import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { moderationService } from "@/lib/services/moderation.service";
import { UserRole } from "@prisma/client";

/**
 * PATH /api/admin/moderation/vendors
 * Descripción: Endpoint GET para consultar negocios pendientes.
 * Requiere: Sesión autenticada con rol ADMIN.
 * Implementa: HU-ModerationHub
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const vendors = await moderationService.getPendingVendors();
    return NextResponse.json(vendors, { status: 200 });
  } catch (error: unknown) {
    console.error("[MODERATION_VENDORS_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
