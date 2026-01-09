"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  onFiltersChange?: (filters: Record<string, string>) => void;
}

export function PetFilter({ onFiltersChange }: PetFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [species, setSpecies] = useState(
    searchParams.get("species") || "all"
  );
  const [municipality, setMunicipality] = useState(
    searchParams.get("municipality") || "all"
  );
  const [age, setAge] = useState(
    searchParams.get("age") || "all"
  );
  const [sex, setSex] = useState(
    searchParams.get("sex") || "all"
  );

  const updateURL = (filters: Record<string, string>) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      }
    });

    router.push(`/adopcion?${params.toString()}`, { scroll: false });
  };

  const handleApplyFilters = () => {
    const filters = {
      species: species !== "all" ? species : "",
      municipality: municipality !== "all" ? municipality : "",
      age: age !== "all" ? age : "",
      sex: sex !== "all" ? sex : "",
    };

    updateURL(filters);
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  const handleResetFilters = () => {
    setSpecies("all");
    setMunicipality("all");
    setAge("all");
    setSex("all");

    router.push("/adopcion", { scroll: false });
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const hasActiveFilters =
    species !== "all" ||
    municipality !== "all" ||
    age !== "all" ||
    sex !== "all";

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
            onClick={handleResetFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Especie */}
      <div className="space-y-3">
        <Label>Especie</Label>
        <RadioGroup value={species} onValueChange={setSpecies}>
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
        <Select value={municipality} onValueChange={setMunicipality}>
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
        <Select value={age} onValueChange={setAge}>
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
        <RadioGroup value={sex} onValueChange={setSex}>
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

      {/* Botón aplicar filtros */}
      <Button onClick={handleApplyFilters} className="w-full">
        Aplicar Filtros
      </Button>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente de filtros para el catálogo de mascotas en adopción. Maneja estado local
 * de filtros y sincroniza con URL query params para persistencia.
 *
 * Lógica Clave:
 * - Sincronización con URL:
 *   Los filtros se sincronizan con query params en la URL mediante useSearchParams.
 *   Al aplicar filtros, se actualiza la URL con router.push().
 *   Esto permite compartir enlaces con filtros aplicados y persistencia al recargar.
 * 
 * - Estado Local:
 *   Cada filtro tiene su propio useState para manejar cambios antes de aplicar.
 *   Los cambios no se aplican inmediatamente, sino al hacer clic en "Aplicar Filtros".
 * 
 * - Especies y Sexo:
 *   Usa RadioGroup para permitir selección única de forma más visual.
 *   Proporciona mejor UX que un Select para opciones limitadas.
 * 
 * - Municipio y Edad:
 *   Usa Select para opciones múltiples o cuando el espacio es limitado.
 *   Mantiene consistencia con otros componentes del sistema.
 * 
 * - Validaciones:
 *   Valores vacíos o "all" no se incluyen en query params.
 *   Esto mantiene URLs limpias y fáciles de compartir.
 * 
 * - Limpiar Filtros:
 *   Botón "Limpiar" visible solo cuando hay filtros activos.
 *   Resetea todos los estados y limpia query params de la URL.
 *
 * Dependencias Externas:
 * - next/navigation: useRouter, useSearchParams para manejo de URL
 * - lucide-react: Iconos SlidersHorizontal, X
 * - shadcn/ui: Button, Label, RadioGroup, Select
 */
