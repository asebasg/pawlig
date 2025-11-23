'use client';

import { useState } from 'react';
import { Municipality } from '@prisma/client';
import { petSearchSchema, PetSearchInput } from '@/lib/validations/pet-search.schema';
import { ZodError } from 'zod';

interface PetFilterProps {
  onSearch: (filters: PetSearchInput) => void;
  isLoading?: boolean;
}

export default function PetFilter({ onSearch, isLoading = false }: PetFilterProps) {
  // Estados del formulario
  const [filters, setFilters] = useState<Partial<PetSearchInput>>({
    species: '',
    municipality: undefined,
    sex: undefined,
    minAge: undefined,
    maxAge: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   *  Maneja cambios en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Conversión de tipos según el campo
    let parsedValue: any = value;

    if (name === 'minAge' || name === 'maxAge') {
      // Convertir a número si es un campo de edad
      parsedValue = value === '' ? undefined : parseInt(value, 10);
    } else if (value === '') {
      // Campos vacíos = undefined
      parsedValue = undefined;
    }

    setFilters((prev) => ({ ...prev, [name]: parsedValue }));

    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Maneja el envío del formulario
   * CAPA 1 DE VALIDACIÓN: Valida con Zod antes de enviar
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      //  VALIDACIÓN CAPA 1: Validar con Zod
      const validatedData = petSearchSchema.parse({
        ...filters,
        // Valores por defecto para campos opcionales
        page: 1, // Siempre resetear a página 1 en nueva búsqueda
        limit: 20,
        status: 'AVAILABLE', // Solo mascotas disponibles
      });

      //  Validación exitosa: enviar al padre (página)
      onSearch(validatedData);
    } catch (error) {
      // ❌ Error de validación: mostrar errores campo por campo
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const field = issue.path[0];
          if (typeof field === 'string') {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  /**
   * Limpia todos los filtros
   */
  const handleReset = () => {
    setFilters({
      species: '',
      municipality: undefined,
      sex: undefined,
      minAge: undefined,
      maxAge: undefined,
    });
    setErrors({});

    //  Buscar sin filtros (todas las mascotas disponibles)
    onSearch({
      page: 1,
      limit: 20,
      status: 'AVAILABLE',
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Filtros de búsqueda</h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Especie */}
      <div>
        <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-2">
          Especie
        </label>
        <input
          type="text"
          id="species"
          name="species"
          value={filters.species || ''}
          onChange={handleChange}
          placeholder="Ej: Perro, Gato"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
            errors.species ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.species && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.species}
          </p>
        )}
      </div>

      {/* Municipio */}
      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-2">
          Municipio
        </label>
        <select
          id="municipality"
          name="municipality"
          value={filters.municipality || ''}
          onChange={handleChange}
          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        >
          <option value="">Todos los municipios</option>
          <option value={Municipality.MEDELLIN}>Medellín</option>
          <option value={Municipality.BELLO}>Bello</option>
          <option value={Municipality.ITAGUI}>Itagüí</option>
          <option value={Municipality.ENVIGADO}>Envigado</option>
          <option value={Municipality.SABANETA}>Sabaneta</option>
          <option value={Municipality.LA_ESTRELLA}>La Estrella</option>
          <option value={Municipality.CALDAS}>Caldas</option>
          <option value={Municipality.COPACABANA}>Copacabana</option>
          <option value={Municipality.GIRARDOTA}>Girardota</option>
          <option value={Municipality.BARBOSA}>Barbosa</option>
        </select>
      </div>

      {/* Sexo */}
      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
          Sexo
        </label>
        <select
          id="sex"
          name="sex"
          value={filters.sex || ''}
          onChange={handleChange}
          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        >
          <option value="">Todos</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
      </div>

      {/* Rango de edad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-700 mb-2">
            Edad mínima
          </label>
          <input
            type="number"
            id="minAge"
            name="minAge"
            value={filters.minAge ?? ''}
            onChange={handleChange}
            min="0"
            max="30"
            placeholder="0"
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.minAge ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.minAge && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.minAge}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700 mb-2">
            Edad máxima
          </label>
          <input
            type="number"
            id="maxAge"
            name="maxAge"
            value={filters.maxAge ?? ''}
            onChange={handleChange}
            min="0"
            max="30"
            placeholder="30"
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
              errors.maxAge ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.maxAge && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {errors.maxAge}
            </p>
          )}
        </div>
      </div>

      {/* Botón de búsqueda */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Buscando...
          </span>
        ) : (
          'Buscar mascotas'
        )}
      </button>
    </form>
  );
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. VALIDACIÓN CAPA 1 (Cliente):
 *    - Valida con Zod antes de enviar al API (línea 76)
 *    - Muestra errores campo por campo inmediatamente
 *    - Previene requests inválidos al servidor
 * 
 * 2. CONVERSIÓN DE TIPOS:
 *    - Edad: string → number (línea 47)
 *    - Campos vacíos: string → undefined (línea 50)
 *    - Municipio/Sexo: enum válido o undefined
 * 
 * 3. UX MEJORADA:
 *    - Botón "Limpiar filtros" visible siempre
 *    - Feedback visual de loading
 *    - Errores desaparecen al editar el campo
 * 
 * 4. ACCESIBILIDAD:
 *    - role="alert" en mensajes de error
 *    - Labels asociados con inputs (htmlFor/id)
 *    - Disabled state en loading
 * 
 * 5. INTEGRACIÓN CON PÁGINA:
 *    - onSearch callback recibe filtros validados
 *    - isLoading prop para sincronizar estado
 *    - Resetear a página 1 en nueva búsqueda
 */
