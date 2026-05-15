/**
 * GET /api/admin/metrics/adoptions
 * Descripción: Obtiene métricas y reportes de adopciones para el administrador (todos los albergues).
 * Requiere: Sesión activa con rol ADMIN.
 * Implementa: HU-011 (Versión Global Admin).
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getAdoptionMetrics } from "@/lib/services/adoption-report.service";
import { AdoptionReportFilters } from "@/types/report.types";
import { z } from "zod";
import { AdoptionStatus, Municipality, UserRole } from "@prisma/client";

const querySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  municipality: z.nativeEnum(Municipality).optional(),
  status: z.nativeEnum(AdoptionStatus).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = querySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Parámetros inválidos", details: validation.error.issues },
        { status: 400 }
      );
    }

    const filters: AdoptionReportFilters = validation.data;
    // Pasa null como shelterId para obtener todas las adopciones
    const result = await getAdoptionMetrics(null, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET_ADMIN_METRICS_ADOPTIONS]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
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
 * Endpoint seguro para obtener los datos agregados y listado de todas las adopciones.
 * Exclusivo para administradores.
 *
 * Lógica Clave:
 * - Se envía null a getAdoptionMetrics para bypassear el filtro de shelterId.
 *
 */
