/**
 * GET /api/vendor/metrics/products
 * Descripción: Obtiene el top de productos más vendidos para el vendedor autenticado.
 * Requiere: Sesión activa con rol VENDOR y vendorId.
 * Implementa: HU-012.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getVendorTopProducts } from "@/lib/services/vendor-metrics.service";
import { VendorMetricsFilters } from "@/types/report.types";
import { z } from "zod";
import { Municipality, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/utils/db";

const querySchema = z.object({
  period: z.enum(["week", "month", "3months", "6months", "year", "custom"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  municipality: z.nativeEnum(Municipality).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      redirect("/login?callbackUrl=/vendor");
    }

    if (session.user.role !== UserRole.VENDOR) {
      redirect("/unauthorized?reason=vendor_only");
    }

    const vendorId = session.user.vendorId as string;
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: { id: true, verified: true },
    });

    if (!vendor?.verified) {
      redirect("/unauthorized?reason=vendor_not_verified");
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

    const products = await getVendorTopProducts(vendorId, validation.data as VendorMetricsFilters);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[GET_VENDOR_TOP_PRODUCTS]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
