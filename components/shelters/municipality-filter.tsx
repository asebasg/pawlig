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
    <Select defaultValue="ALL" onValueChange={onFilterChange}>
      <SelectTrigger className="w-full bg-white border-gray-200">
        <SelectValue placeholder="Seleccionar municipio..." />
      </SelectTrigger>
      <SelectContent>
        {MUNICIPALITIES.map((m) => (
          <SelectItem key={m.value} value={m.value}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
