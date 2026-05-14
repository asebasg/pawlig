/**
 * GET /api/shelter/reports/adoptions
 * Descripción: Obtiene métricas y reportes de adopciones para el albergue autenticado.
 * Requiere: Sesión activa con rol SHELTER y shelterId.
 * Implementa: HU-011.
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

    if (!session || session.user.role !== UserRole.SHELTER || !session.user.shelterId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const shelterId = session.user.shelterId;
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
    const result = await getAdoptionMetrics(shelterId, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET_SHELTER_METRICS]", error);
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
 * Endpoint seguro para obtener los datos agregados y listado de adopciones.
 *
 * Lógica Clave:
 * - Uso de Zod para la validación estricta de parámetros de la URL.
 * - Validación de sesión por rol y existencia de shelterId.
 *
 */
