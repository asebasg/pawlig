/**
 * GET /api/admin/metrics/sales
 * Descripción: Obtiene métricas generales de ventas globales para el administrador.
 * Requiere: Sesión activa con rol ADMIN.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getVendorMetrics } from "@/lib/services/vendor-metrics.service";
import { z } from "zod";
import { Municipality, UserRole } from "@prisma/client";

const querySchema = z.object({
  period: z.enum(["week", "month", "3months", "6months", "year", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  municipality: z.nativeEnum(Municipality).optional(),
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

    const metrics = await getVendorMetrics(null, validation.data);

    return NextResponse.json(metrics);
  } catch (error) {
    console.error("[GET_ADMIN_SALES_METRICS]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
