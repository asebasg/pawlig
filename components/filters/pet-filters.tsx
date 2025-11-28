'use client';

import { Municipality } from '@prisma/client';

interface PetFiltersProps {
  filters: {
    species: string;
    municipality: string;
    age: string;
    sex: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const MUNICIPALITIES = [
  { value: 'MEDELLIN', label: 'Medellín' },
  { value: 'BELLO', label: 'Bello' },
  { value: 'ITAGUI', label: 'Itagüí' },
  { value: 'ENVIGADO', label: 'Envigado' },
  { value: 'SABANETA', label: 'Sabaneta' },
  { value: 'LA_ESTRELLA', label: 'La Estrella' },
  { value: 'CALDAS', label: 'Caldas' },
  { value: 'COPACABANA', label: 'Copacabana' },
  { value: 'GIRARDOTA', label: 'Girardota' },
  { value: 'BARBOSA', label: 'Barbosa' },
];

export default function PetFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: PetFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-6">
        {/* Especie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especie
          </label>
          <select
            value={filters.species}
            onChange={(e) => onFilterChange('species', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            <option value="Perro">Perros</option>
            <option value="Gato">Gatos</option>
            <option value="Otro">Otros</option>
          </select>
        </div>

        {/* Municipio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Municipio
          </label>
          <select
            value={filters.municipality}
            onChange={(e) => onFilterChange('municipality', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            {MUNICIPALITIES.map((mun) => (
              <option key={mun.value} value={mun.value}>
                {mun.label}
              </option>
            ))}
          </select>
        </div>

        {/* Edad aproximada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edad máxima
          </label>
          <select
            value={filters.age}
            onChange={(e) => onFilterChange('age', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Cualquier edad</option>
            <option value="1">Hasta 1 año</option>
            <option value="3">Hasta 3 años</option>
            <option value="5">Hasta 5 años</option>
            <option value="10">Hasta 10 años</option>
          </select>
        </div>

        {/* Sexo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sexo
          </label>
          <select
            value={filters.sex}
            onChange={(e) => onFilterChange('sex', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Cualquiera</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
        </div>
      </div>
    </div>
  );
}
