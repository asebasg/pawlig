/**
 * GET /api/admin/metrics/sales/export
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getVendorTopProducts } from "@/lib/services/vendor-metrics.service";
import { VendorMetricsFilters, ExportOptions, TopProductData } from "@/types/report.types";
import { z } from "zod";
import { Municipality, UserRole } from "@prisma/client";
import { generateCsv } from "@/lib/utils/export-csv";
import { generateExcel } from "@/lib/utils/export-excel";
import { generatePdf } from "@/lib/utils/export-pdf";

const exportQuerySchema = z.object({
  format: z.enum(["csv", "excel", "pdf"]),
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

    const validation = exportQuerySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Parámetros de exportación inválidos", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { format, ...filters } = validation.data;
    const products = await getVendorTopProducts(null, filters as VendorMetricsFilters);

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `reporte-ventas-globales-${timestamp}`;

    const exportOptions: ExportOptions<TopProductData> = {
      data: products,
      headers: [
        { key: "name", label: "Producto" },
        { key: "unitsSold", label: "Unidades Vendidas Globales" },
        { key: "revenue", label: "Ingresos Globales (COP)" },
      ],
      filename,
      title: "Reporte Global de Productos Más Vendidos",
      subtitle: "Panel Administrativo - PawLig",
    };

    switch (format) {
      case "csv": {
        const csvContent = generateCsv(exportOptions);
        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}.csv"`,
          },
        });
      }
      case "excel": {
        const buffer = await generateExcel(exportOptions);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
          },
        });
      }
      case "pdf": {
        const buffer = generatePdf(exportOptions);
        return new NextResponse(new Uint8Array(buffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}.pdf"`,
          },
        });
      }
      default:
        return NextResponse.json({ error: "Formato no soportado" }, { status: 400 });
    }
  } catch {
    return NextResponse.json(
      { error: "Error interno durante la exportación" },
      { status: 500 }
    );
  }
}
