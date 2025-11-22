"use client";

import { useState, useCallback, useEffect } from "react";
import { Municipality } from "@prisma/client";

// Temporary PetSize enum until Prisma regenerates properly
enum PetSize {
  PEQUEÑO = "PEQUEÑO",
  MEDIANO = "MEDIANO",
  GRANDE = "GRANDE",
}

interface PetFilterProps {
  onFilterChange: (filters: FilterState) => void;
  species: string[];
}

export interface FilterState {
  species?: string;
  size?: PetSize;
  municipality?: Municipality;
}

export function PetFilter({ onFilterChange, species }: PetFilterProps) {
  const [filters, setFilters] = useState<FilterState>({});

  const handleSpeciesChange = useCallback((value: string) => {
    const newFilters = { ...filters, species: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleSizeChange = useCallback((value: string) => {
    const newFilters = { ...filters, size: value ? (value as PetSize) : undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleMunicipalityChange = useCallback((value: string) => {
    const newFilters = { ...filters, municipality: value ? (value as Municipality) : undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    onFilterChange({});
  }, [onFilterChange]);

  const municipalities = [
    "MEDELLIN",
    "BELLO",
    "ITAGUI",
    "ENVIGADO",
    "SABANETA",
    "LA_ESTRELLA",
    "CALDAS",
    "COPACABANA",
    "GIRARDOTA",
    "BARBOSA",
  ] as Municipality[];

  const sizes = ["PEQUEÑO", "MEDIANO", "GRANDE"] as PetSize[];

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Filtrar Mascotas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Species Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especie
          </label>
          <select
            value={filters.species || ""}
            onChange={(e) => handleSpeciesChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Todas las especies</option>
            {species.map((sp) => (
              <option key={sp} value={sp}>
                {sp.charAt(0).toUpperCase() + sp.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamaño
          </label>
          <select
            value={filters.size || ""}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Todos los tamaños</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Municipality Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Municipio
          </label>
          <select
            value={filters.municipality || ""}
            onChange={(e) => handleMunicipalityChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">Todos los municipios</option>
            {municipalities.map((mun) => (
              <option key={mun} value={mun}>
                {mun.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Limpiar Filtros
        </button>
      )}
    </div>
  );
}
