"use client";

import { Municipality } from "@prisma/client";

/**
 * Descripción: Componente de UI para filtrar mascotas en el catálogo público por
 *              especie, municipio, edad y sexo.
 * Requiere: Un objeto 'filters' con el estado actual y funciones 'callback' para
 *           manejar los cambios y la limpieza de los filtros.
 * Implementa: HU-005 (Búsqueda y filtrado de mascotas).
 */

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
            onChange={(e) => onFilterChange("species", e.target.value)}
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
            onChange={(e) => onFilterChange("municipality", e.target.value)}
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
            onChange={(e) => onFilterChange("age", e.target.value)}
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
            onChange={(e) => onFilterChange("sex", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Cualquiera</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
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
 * Este componente presenta una interfaz de usuario cohesiva que permite a los
 * usuarios refinar la búsqueda de mascotas en la galería principal. Funciona como
 * un componente controlado, delegando la gestión del estado de los filtros a su
 * componente padre.
 *
 * Lógica Clave:
 * - 'onFilterChange': Cada vez que un usuario selecciona una opción, esta función
 *   'callback' se invoca con la clave del filtro ('species', 'municipality', etc.)
 *   y el nuevo valor, permitiendo al componente padre actualizar el estado.
 * - 'onClearFilters': Proporciona una manera sencilla para que el usuario
 *   restablezca todos los filtros a sus valores por defecto a través de un
 *   único 'callback'.
 * - 'MUNICIPALITIES': Se utiliza una constante local para poblar las opciones de
 *   municipios, manteniendo la lista desacoplada de la base de datos para
 *   mejorar el rendimiento del renderizado en el cliente.
 *
 * Dependencias Externas:
 * - '@prisma/client': Se utiliza para el tipado de 'Municipality', asegurando
 *   consistencia con el esquema de la base de datos.
 *
 */
