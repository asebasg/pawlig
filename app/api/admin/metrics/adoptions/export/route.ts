/**
 * GET /api/admin/metrics/adoptions/export
 * Descripción: Exporta reportes de todas las adopciones en formato CSV, Excel o PDF.
 * Requiere: Sesión activa con rol ADMIN.
 * Implementa: HU-011 (Exportación).
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getAdoptionMetrics } from "@/lib/services/adoption-report.service";
import { AdoptionReportFilters, ExportOptions, AdoptionReportData } from "@/types/report.types";
import { z } from "zod";
import { AdoptionStatus, Municipality, UserRole } from "@prisma/client";
import { generateCsv } from "@/lib/utils/export-csv";
import { generateExcel } from "@/lib/utils/export-excel";
import { generatePdf } from "@/lib/utils/export-pdf";

const exportQuerySchema = z.object({
  format: z.enum(["csv", "excel", "pdf"]),
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

    const validation = exportQuerySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Parámetros de exportación inválidos", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { format, ...filters } = validation.data;
    const { adoptions } = await getAdoptionMetrics(null, filters as AdoptionReportFilters);

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `adopciones_globales_${timestamp}`;

    const exportOptions: ExportOptions<AdoptionReportData> = {
      data: adoptions,
      headers: [
        { key: "adoptionDate", label: "Fecha" },
        { key: "petName", label: "Mascota" },
        { key: "shelterName", label: "Albergue" },
        { key: "adopterName", label: "Adoptante" },
        { key: "municipality", label: "Municipio" },
        { key: "status", label: "Estado" },
      ],
      filename,
      title: "Reporte Global de Adopciones",
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
  } catch (error) {
    console.error("[EXPORT_ADMIN_ADOPTIONS]", error);
    return NextResponse.json(
      { error: "Error interno durante la exportación" },
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
 * Endpoint para exportar la métrica global a diferentes formatos desde el panel de admin.
 *
 */
