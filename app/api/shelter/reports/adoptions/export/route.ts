/**
 * GET /api/shelter/reports/adoptions/export
 * Descripción: Exporta las métricas de adopciones en el formato solicitado.
 * Requiere: Sesión activa con rol SHELTER y shelterId. Query format (csv, excel, pdf).
 * Implementa: HU-011.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { getAdoptionMetrics } from "@/lib/services/adoption-report.service";
import { AdoptionReportFilters, AdoptionReportData } from "@/types/report.types";
import { generateCsv } from "@/lib/utils/export-csv";
import { generateExcel } from "@/lib/utils/export-excel";
import { generatePdf } from "@/lib/utils/export-pdf";
import { z } from "zod";
import { AdoptionStatus, Municipality, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/utils/db";

const querySchema = z.object({
  format: z.enum(["csv", "excel", "pdf"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  municipality: z.nativeEnum(Municipality).optional(),
  status: z.nativeEnum(AdoptionStatus).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      redirect("/login?callbackUrl=/shelter");
    }

    if (session.user.role !== UserRole.SHELTER) {
      redirect("/unauthorized?reason=shelter_only");
    }

    const shelterId = session.user.shelterId as string;
    const shelter = await prisma.shelter.findUnique({
      where: { id: shelterId },
      select: { id: true, verified: true },
    });

    if (!shelter?.verified) {
      redirect("/unauthorized?reason=shelter_not_verified");
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

    const { format, ...filters } = validation.data;
    const { adoptions } = await getAdoptionMetrics(shelterId, filters as AdoptionReportFilters);

    const headers: { key: keyof AdoptionReportData; label: string }[] = [
      { key: "adoptionDate", label: "Fecha" },
      { key: "adopterName", label: "Adoptante" },
      { key: "petName", label: "Mascota" },
      { key: "municipality", label: "Municipio" },
      { key: "status", label: "Estado" },
    ];

    const exportOptions = {
      data: adoptions,
      headers,
      title: "Reporte de Adopciones",
      subtitle: `Albergue ID: ${shelterId}`,
    };

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `adopciones_reporte_${dateStr}`;

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
    }
  } catch (error) {
    console.error("[GET_SHELTER_EXPORT]", error);
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
 * Endpoint que responde con un archivo binario/texto según el formato pedido.
 *
 * Lógica Clave:
 * - Validar formato.
 * - Usar tipado fuerte `keyof AdoptionReportData` para inyectar headers
 *   a la utilidad genérica de exportación, evitando casteos inseguros con "any".
 *
 */
