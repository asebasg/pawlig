/**
 * Descripción: Utilidad para exportar datos genéricos a formato Excel (XLSX).
 * Requiere: Librería exceljs y tipos definidos en types/report.types.ts
 * Implementa: HU-011, HU-012.
 */

import ExcelJS from "exceljs";
import { ExportOptions } from "@/types/report.types";

export async function generateExcel<T>(options: ExportOptions<T>): Promise<Buffer> {
  const { data, headers, title = "Reporte" } = options;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PawLig";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Datos");

  // Definir columnas
  sheet.columns = headers.map((h) => ({
    header: h.label,
    key: h.key as string,
    width: 20, // Ancho por defecto
  }));

  // Estilo de la cabecera
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F46E5" }, // Color primary aproximado
  };

  // Agregar datos
  data.forEach((item) => {
    const rowData: Record<string, unknown> = {};
    headers.forEach((h) => {
      rowData[h.key as string] = item[h.key];
    });
    sheet.addRow(rowData);
  });

  // Generar buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Utiliza exceljs para generar un buffer XLSX que puede ser enviado por el servidor.
 *
 * Lógica Clave:
 * - Aplica estilos básicos a las cabeceras para mejorar la legibilidad.
 * - Soporta la misma interfaz genérica ExportOptions<T> que CSV.
 *
 * Dependencias Externas:
 * - exceljs: Utilizado para la construcción del workbook.
 *
 */
