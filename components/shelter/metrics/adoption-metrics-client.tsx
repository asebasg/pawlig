"use client";

import { useState, useEffect } from "react";
import { AdoptionReportFilters, AdoptionReportData } from "@/types/report.types";
import { AdoptionFilters } from "./adoption-filters";
import { AdoptionTable } from "./adoption-table";
import { AdoptionCharts } from "./adoption-charts";
import { ExportButtons } from "./export-buttons";
import Loader from "@/components/ui/loader";

export function AdoptionMetricsClient() {
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

        const response = await fetch(`/api/shelter/reports/adoptions?${params.toString()}`);
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
          <h2 className="text-3xl font-bold text-gray-800">Total Adopciones: <span className="text-primary">{total}</span></h2>
        </div>
        <ExportButtons filters={filters} />
      </div>

      <AdoptionFilters filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Listado de Adopciones</h3>
            <AdoptionTable adoptions={adoptions} />
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
 * Cliente principal para la gestión de métricas de adopciones. Orquesta filtros,
 * tablas y gráficos.
 * 
 * Lógica Clave:
 * - Realiza data fetching dinámico cuando los filtros cambian.
 * - Muestra UI states (loading, empty, success).
 */
