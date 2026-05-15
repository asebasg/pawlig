/**
 * Descripción: Utilidad para exportar datos genéricos a formato PDF.
 * Requiere: Librerías jspdf, jspdf-autotable y tipos en types/report.types.ts
 * Implementa: HU-011, HU-012.
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ExportOptions } from "@/types/report.types";

export function generatePdf<T>(options: ExportOptions<T>): Buffer {
  const { data, headers, title = "Reporte PawLig", subtitle } = options;

  // Crear documento
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Título
  doc.setFontSize(20);
  doc.text(title, 14, 22);

  // Subtítulo / Metadata
  doc.setFontSize(11);
  doc.setTextColor(100);
  const metadataText = subtitle ? subtitle : `Generado el: ${format(new Date(), "dd/MM/yyyy HH:mm")}`;
  doc.text(metadataText, 14, 30);

  // Preparar datos para autoTable
  const head = [headers.map((h) => h.label)];
  const body = data.map((item) =>
    headers.map((h) => {
      const val = item[h.key];
      if (val instanceof Date) return format(val, "dd/MM/yyyy HH:mm");
      if (val === null || val === undefined) return "";
      return String(val);
    })
  );

  // Generar tabla
  autoTable(doc, {
    head,
    body,
    startY: 40,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] }, // Color primary
    styles: { fontSize: 9 },
  });

  // Retornar como Buffer (para NodeJS API Routes)
  return Buffer.from(doc.output("arraybuffer"));
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Genera un PDF estructurado en base a los datos provistos y sus cabeceras,
 * renderizado con jspdf-autotable.
 *
 * Lógica Clave:
 * - El formato es landscape por defecto para acomodar tablas anchas.
 * - Convierte el PDF resultante en un Buffer para enviarlo desde una API route
 *   de Next.js al cliente.
 *
 * Dependencias Externas:
 * - jspdf: Para el documento PDF base.
 * - jspdf-autotable: Para renderizar de manera robusta arrays como tablas.
 *
 */
