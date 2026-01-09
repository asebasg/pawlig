"use client";

import { SlidersHorizontal, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Resumen:
 * Componente de filtros para el catálogo de mascotas en adopción.
 * Permite filtrar por especie, municipio, edad máxima y sexo.
 */

const SPECIES_OPTIONS = [
  { value: "all", label: "Todas las especies" },
  { value: "Perro", label: "Perros" },
  { value: "Gato", label: "Gatos" },
  { value: "Otro", label: "Otros" },
];

const MUNICIPALITIES = [
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

const AGE_OPTIONS = [
  { value: "all", label: "Cualquier edad" },
  { value: "1", label: "Hasta 1 año" },
  { value: "3", label: "Hasta 3 años" },
  { value: "5", label: "Hasta 5 años" },
  { value: "10", label: "Hasta 10 años" },
];

const SEX_OPTIONS = [
  { value: "all", label: "Cualquier sexo" },
  { value: "Macho", label: "Macho" },
  { value: "Hembra", label: "Hembra" },
];

interface PetFilterProps {
  filters: {
    species: string;
    municipality: string;
    age: string;
    sex: string;
  };
  searchQuery: string;
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export default function PetFilter({
  filters,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClearFilters,
}: PetFilterProps) {
  const hasActiveFilters =
    searchQuery ||
    filters.species !== "" ||
    filters.municipality !== "" ||
    filters.age !== "" ||
    filters.sex !== "";

  return (
    <div className="space-y-6">
      {/* Header con título y reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Búsqueda por texto */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            placeholder="Buscar por nombre o raza..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Especie */}
      <div className="space-y-3">
        <Label>Especie</Label>
        <RadioGroup
          value={filters.species || "all"}
          onValueChange={(val) => onFilterChange("species", val === "all" ? "" : val)}
        >
          {SPECIES_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label
                htmlFor={option.value}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Municipio */}
      <div className="space-y-2">
        <Label htmlFor="municipality">Municipio</Label>
        <Select
          value={filters.municipality || "all"}
          onValueChange={(val) => onFilterChange("municipality", val === "all" ? "" : val)}
        >
          <SelectTrigger id="municipality">
            <SelectValue placeholder="Todos los municipios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los municipios</SelectItem>
            {MUNICIPALITIES.map((mun) => (
              <SelectItem key={mun.value} value={mun.value}>
                {mun.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Edad máxima */}
      <div className="space-y-2">
        <Label htmlFor="age">Edad máxima</Label>
        <Select
          value={filters.age || "all"}
          onValueChange={(val) => onFilterChange("age", val === "all" ? "" : val)}
        >
          <SelectTrigger id="age">
            <SelectValue placeholder="Cualquier edad" />
          </SelectTrigger>
          <SelectContent>
            {AGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sexo */}
      <div className="space-y-3">
        <Label>Sexo</Label>
        <RadioGroup
          value={filters.sex || "all"}
          onValueChange={(val) => onFilterChange("sex", val === "all" ? "" : val)}
        >
          {SEX_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <RadioGroupItem value={option.value} id={`sex-${option.value}`} />
              <Label
                htmlFor={`sex-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente de filtros para el catálogo de mascotas en adopción. 
 * Actúa como un componente controlado (controlled component).
 *
 * Lógica Clave:
 * - Estado Controlado:
 *   No maneja estado interno; recibe los valores actuales y funciones de cambio mediante props.
 *   Esto permite que el componente padre (PetGalleryClient) coordine los filtros con la API.
 * 
 * - Sincronización:
 *   Los cambios se notifican inmediatamente al padre, quien decide cómo aplicarlos.
 * 
 * - Especies y Sexo:
 *   Usa RadioGroup para permitir selección única de forma más visual.
 * 
 * - Municipio y Edad:
 *   Usa Select para opciones con múltiples valores o listas largas.
 * 
 * - Limpiar Filtros:
 *   Botón "Limpiar" delegando la acción al padre mediante onClearFilters.
 *
 * Dependencias Externas:
 * - lucide-react: Iconos SlidersHorizontal, X
 * - shadcn/ui: Button, Label, RadioGroup, Select
 */

