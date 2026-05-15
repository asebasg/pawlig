"use client";

import { useState, useEffect } from "react";
import { AdoptionReportFilters, AdoptionReportData } from "@/types/report.types";
import { AdoptionFilters } from "@/components/shelter/metrics/adoption-filters";
import { AdoptionTable } from "@/components/shelter/metrics/adoption-table";
import { AdoptionCharts } from "@/components/shelter/metrics/adoption-charts";
import { ExportButtons } from "@/components/shelter/metrics/export-buttons";
import Loader from "@/components/ui/loader";

export function AdminMetricsClient() {
  const [filters, setFilters] = useState<AdoptionReportFilters>({});
  const [adoptions, setAdoptions] = useState<AdoptionReportData[]>([]);
  const [total, setTotal] = useState(0);
  const [byMunicipality, setByMunicipality] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.startDate) params.set("startDate", filters.startDate);
        if (filters.endDate) params.set("endDate", filters.endDate);
        if (filters.municipality) params.set("municipality", filters.municipality);
        if (filters.status) params.set("status", filters.status);

        const response = await fetch(`/api/admin/metrics/adoptions?${params.toString()}`);
        if (!response.ok) throw new Error("Error fetching data");

        const result = await response.json();
        setAdoptions(result.adoptions || []);
        setTotal(result.total || 0);
        setByMunicipality(result.byMunicipality || {});
      } catch (error) {
        console.error("Error cargando métricas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Total Adopciones Globales: <span className="text-primary">{total}</span></h2>
        </div>
        <ExportButtons filters={filters} exportUrl="/api/admin/metrics/adoptions/export" />
      </div>

      <AdoptionFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Listado de Adopciones (Todos los Albergues)</h3>
            <AdoptionTable adoptions={adoptions} isAdmin={true} />
          </div>
          <div className="space-y-4">
            <AdoptionCharts byMunicipality={byMunicipality} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Cliente principal para la gestión de métricas de adopciones globales (admin).
 * Reutiliza componentes del albergue pero apunta a endpoints globales.
 */
