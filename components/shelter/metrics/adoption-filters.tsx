"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Municipality, AdoptionStatus } from "@prisma/client";
import { AdoptionReportFilters } from "@/types/report.types";

interface AdoptionFiltersProps {
  filters: AdoptionReportFilters;
  onChange: (filters: AdoptionReportFilters) => void;
}

export function AdoptionFilters({ filters, onChange }: AdoptionFiltersProps) {
  const handleReset = () => {
    onChange({});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-gray-100">
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
      <div className="space-y-2">
        <Label htmlFor="municipality">Municipio</Label>
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
      <div className="space-y-2">
        <Label htmlFor="status">Estado</Label>
        <Select 
          value={filters.status || "ALL"} 
          onValueChange={(val) => onChange({ ...filters, status: val === "ALL" ? undefined : val as AdoptionStatus })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            {Object.values(AdoptionStatus).map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={handleReset} className="w-full h-10 border-gray-200">
        Limpiar Filtros
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
 * Componente para filtrar las métricas de adopciones del albergue.
 * 
 * Lógica Clave:
 * - Filtros controlados que propagan cambios al cliente principal.
 * - Soporte para restablecer los valores por defecto.
 */
