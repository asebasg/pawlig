import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { moderationService } from "@/lib/services/moderation.service";
import { UserRole } from "@prisma/client";

/**
 * PATH /api/admin/moderation/audit
 * Descripción: Endpoint GET para consultar el log de auditoría del Moderation Hub.
 * Requiere: Sesión autenticada con rol ADMIN. Soporta filtros opcionales.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "50");
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    const auditLogs = await moderationService.getAuditLogs({
      skip,
      take,
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
    });

    return NextResponse.json(auditLogs, { status: 200 });
  } catch (error: unknown) {
    console.error("[MODERATION_AUDIT_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
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
 * Endpoint para proveer al frontend los registros de auditoría almacenados.
 *
 * Lógica Clave:
 * - Recupera los eventos más recientes usando moderationService.
 * - Soporta paginación básica y filtrado por rango de fechas vía query params.
 */
