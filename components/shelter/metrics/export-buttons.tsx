"use client";

import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, FileSpreadsheet } from "lucide-react";
import { AdoptionReportFilters } from "@/types/report.types";

interface ExportButtonsProps {
  filters: AdoptionReportFilters;
}

export function ExportButtons({ filters }: ExportButtonsProps) {
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    const params = new URLSearchParams();
    params.set("format", format);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.municipality) params.set("municipality", filters.municipality);
    if (filters.status) params.set("status", filters.status);
    
    window.open(`/api/shelter/reports/adoptions/export?${params.toString()}`, "_blank");
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={() => handleExport("excel")}>
        <FileSpreadsheet className="w-4 h-4 mr-2" />
        Exportar Excel
      </Button>
      <Button variant="outline" className="border-red-600 text-red-700 hover:bg-red-50" onClick={() => handleExport("pdf")}>
        <FileText className="w-4 h-4 mr-2" />
        Exportar PDF
      </Button>
      <Button variant="outline" className="border-gray-600 text-gray-700 hover:bg-gray-50" onClick={() => handleExport("csv")}>
        <DownloadCloud className="w-4 h-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Componente para generar reportes en múltiples formatos usando window.open
 * para iniciar la descarga automáticamente.
 */
