"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Municipality } from "@prisma/client";
import { VendorMetricsFilters, TimePeriod } from "@/types/report.types";

interface MetricsFiltersProps {
  filters: VendorMetricsFilters;
  onChange: (filters: VendorMetricsFilters) => void;
}

export function MetricsFilters({ filters, onChange }: MetricsFiltersProps) {
  const handleReset = () => {
    onChange({ period: "month" });
  };

  const periods: { label: string; value: TimePeriod }[] = [
    { label: "Última Semana", value: "week" },
    { label: "Último Mes", value: "month" },
    { label: "Últimos 3 Meses", value: "3months" },
    { label: "Últimos 6 Meses", value: "6months" },
    { label: "Último Año", value: "year" },
    { label: "Personalizado", value: "custom" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="space-y-2">
        <Label htmlFor="period">Período</Label>
        <Select 
          value={filters.period || "month"} 
          onValueChange={(val) => onChange({ ...filters, period: val as TimePeriod })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un período" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filters.period === "custom" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="startDate">Fecha Inicio</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={filters.startDate || ""} 
              onChange={(e) => onChange({ ...filters, startDate: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Fecha Fin</Label>
            <Input 
              id="endDate" 
              type="date" 
              value={filters.endDate || ""} 
              onChange={(e) => onChange({ ...filters, endDate: e.target.value })} 
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="municipality">Municipio de Envío</Label>
        <Select 
          value={filters.municipality || "ALL"} 
          onValueChange={(val) => onChange({ ...filters, municipality: val === "ALL" ? undefined : val as Municipality })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los municipios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los municipios</SelectItem>
            {Object.values(Municipality).map((mun) => (
              <SelectItem key={mun} value={mun}>{mun}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleReset} className="w-full h-10 border-gray-200">
        Restablecer
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
 * Filtros de tiempo dinámicos y municipio para las métricas de ventas.
 */
