/**
 * Descripción: Utilidad para exportar datos genéricos a formato CSV.
 * Requiere: Tipos definidos en types/report.types.ts
 * Implementa: HU-011, HU-012.
 */

import { ExportOptions } from "@/types/report.types";
import { format } from "date-fns";

export function generateCsv<T>(options: ExportOptions<T>): string {
  const { data, headers } = options;

  // Generar fila de cabeceras
  const headerRow = headers.map((h) => `"${h.label}"`).join(",");

  // Generar filas de datos
  const dataRows = data.map((item) => {
    return headers
      .map((h) => {
        const value = item[h.key];
        
        // Formatear fechas
        if (value instanceof Date) {
          return `"${format(value, "dd/MM/yyyy HH:mm")}"`;
        }
        
        // Manejar nulos o indefinidos
        if (value === null || value === undefined) {
          return '""';
        }

        // Escapar comillas dobles en strings
        if (typeof value === "string") {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return `"${String(value)}"`;
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Convierte un array de objetos T en un string en formato CSV.
 *
 * Lógica Clave:
 * - Escapa comillas dobles internamente y envuelve todos los valores en comillas
 *   para prevenir errores con comas dentro del contenido.
 * - Formatea objetos Date automáticamente.
 *
 */
