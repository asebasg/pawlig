"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

/**
 * Descripción: Selector de municipios para filtrar albergues en el mapa.
 * Requiere: Lista de municipios del Valle de Aburrá definida en el enum de Prisma.
 * Implementa: ISSUE-91 (Filtro por municipio).
 */

const MUNICIPALITIES = [
  { value: "ALL", label: "Todos los municipios" },
  { value: "MEDELLIN", label: "Medellín" },
  { value: "BELLO", label: "Bello" },
  { value: "ITAGUI", label: "Itagüí" },
  { value: "ENVIGADO", label: "Envigado" },
  { value: "SABANETA", label: "Sabaneta" },
  { value: "LA_ESTRELLA", label: "La Estrella" },
  { value: "CALDAS", label: "Caldas" },
  { value: "COPACABANA", label: "Copacabana" },
  { value: "GIRARDOTA", label: "Girardota" },
  { value: "BARBOSA", label: "Barbosa" },
];

interface MunicipalityFilterProps {
  onFilterChange: (value: string) => void;
}

export function MunicipalityFilter({ onFilterChange }: MunicipalityFilterProps) {
  return (
    <div className="flex items-center">
      <Select defaultValue="ALL" onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px] h-14 bg-white/90 backdrop-blur-md border-2 border-transparent focus:ring-primary shadow-xl rounded-2xl transition-all duration-300">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-primary" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] uppercase tracking-tighter font-bold text-muted-foreground/60">Municipio</span>
              <SelectValue placeholder="Filtrar por..." />
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-2xl shadow-2xl border-border/40 backdrop-blur-lg">
          {MUNICIPALITIES.map((m) => (
            <SelectItem 
              key={m.value} 
              value={m.value}
              className="py-3 focus:bg-primary/10 rounded-xl transition-colors cursor-pointer"
            >
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Filtro basado en el componente Radix UI Select.
 *
 * Lógica Clave:
 * - Se añade un label interno "Municipio" en el trigger para mejorar la 
 *   jerarquía visual de la información.
 * - Estética: Bordes muy redondeados (rounded-2xl) para coincidir con el 
 *   resto de la nueva interfaz de albergues.
 *
 */
