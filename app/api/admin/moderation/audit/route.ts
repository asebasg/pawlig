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

    let startDate: Date | undefined;
    if (startDateStr) {
      startDate = new Date(startDateStr);
      if (!startDateStr.includes("T")) {
        startDate.setUTCHours(0, 0, 0, 0);
      }
    }

    let endDate: Date | undefined;
    if (endDateStr) {
      endDate = new Date(endDateStr);
      if (!endDateStr.includes("T")) {
        endDate.setUTCHours(23, 59, 59, 999);
      }
    }

    const auditLogs = await moderationService.getAuditLogs({
      skip,
      take,
      startDate,
      endDate,
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
