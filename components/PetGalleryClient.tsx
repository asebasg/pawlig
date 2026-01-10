'use client';

import { useState, useEffect, useCallback } from 'react';
import { PetCard } from './cards/pet-card';
import { FavoriteButton } from '@/components/ui/favorite-button';
import Loader from '@/components/ui/loader';
import PetFilter from '@/components/filters/pet-filter';
import { AlertCircle, FishOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PetStatus } from '@prisma/client';
import Link from 'next/link';

/**
 * Componente: PetGalleryClient
 * Descripción: Gestiona la visualización, filtrado y búsqueda de mascotas disponibles para adopción.
 * Requiere: Sesión de usuario (opcional para visualización, obligatoria para favoritos).
 * Implementa: HU-006 (Filtro y búsqueda), RF-010 (Búsqueda y filtrado), RF-005 (Sistema de favoritos).
 */


interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  status: PetStatus;
  description: string;
  images: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
  };
  isFavorited?: boolean;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PetGalleryClientProps {
  userSession: UserSession | null;
}



export default function PetGalleryClient({ userSession }: PetGalleryClientProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filters, setFilters] = useState({
    species: '',
    municipality: '',
    age: '',
    sex: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ species: '', municipality: '', age: '', sex: '' });
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Cargar mascotas desde API
  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      // Solo agregar filtros si tienen valor
      if (filters.species) params.append('species', filters.species);
      if (filters.municipality) params.append('municipality', filters.municipality);
      if (filters.age) params.append('age', filters.age);
      if (filters.sex) params.append('sex', filters.sex);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('status', 'AVAILABLE');
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/pets?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Error al cargar mascotas');
      }

      const data = await response.json();
      const petsData = data.data || [];

      // Si hay usuario autenticado, verificar favoritos
      if (userSession?.id && petsData.length > 0) {
        const petIds = petsData.map((p: Pet) => p.id);
        try {
          const favResponse = await fetch('/api/user/favorites/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ petIds }),
          });

          if (favResponse.ok) {
            const favData = await favResponse.json();
            petsData.forEach((pet: Pet) => {
              pet.isFavorited = favData.favorites?.includes(pet.id) || false;
            });
          }
        } catch (e) {
          console.error('Error checking favorites:', e);
        }
      }

      setPets(petsData);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, searchQuery, userSession?.id]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchPets();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchPets, currentPage]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar de Filtros - Izquierda en desktop, arriba en móvil */}
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
          {/* Contador de resultados */}
          {!loading && (
            <div className="mb-4 text-sm text-gray-600">
              <span className="font-semibold">{totalCount === 0 ? (
                'No se encontraron mascotas'
              ) : (
                `${totalCount} mascota${totalCount !== 1 ? 's' : ''} encontrada${totalCount !== 1 ? 's' : ''}`
              )}</span>
            </div>
          )}

          {/* Componente de Filtros */}
          <PetFilter
            filters={filters}
            searchQuery={searchQuery}
            onFilterChange={handleFilterChange}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />
        </div>
      </aside>

      {/* Contenido Principal - Derecha en desktop, abajo en móvil */}
      <main className="flex-1 min-w-0">
        {/* Galería de mascotas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <Loader />
              <p className="text-gray-500">Cargando mascotas</p>
            </div>
          ) : error ? (
            <div className="col-span-full bg-white rounded-lg border p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Error al cargar mascotas
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => fetchPets()}
                className="bg-purple-600 hover:bg-purple-700 mx-auto"
              >
                Reintentar
              </Button>
            </div>
          ) : pets.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg border border-purple-100 p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FishOff className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                No se encontraron mascotas
              </h3>
              <p className="text-purple-600 mb-6">
                Intenta ajustar los filtros para ver más resultados
              </p>
              <Button
                onClick={handleClearFilters}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50 mx-auto"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                accentColor="none"
                imageOverlay={
                  <FavoriteButton
                    petId={pet.id}
                    initialIsFavorited={pet.isFavorited || false}
                    userSession={userSession}
                  />
                }
                footer={
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href={`/adopciones/${pet.id}`}>Ver detalles</Link>
                  </Button>
                }
              />
            ))
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Anterior
            </button>

            <span className="text-gray-600">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Siguiente
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente es el cliente principal para la galería de mascotas. Centraliza la 
 * lógica de obtención de datos desde la API, el manejo de filtros y la paginación.
 *
 * Lógica Clave:
 * - fetchPets: Realiza peticiones GET a /api/pets construyendo dinámicamente los 
 *   query params según el estado de los filtros y la página actual.
 * - Debounce: Implementa un retraso de 500ms en la búsqueda por texto para reducir
 *   el número de peticiones innecesarias al servidor.
 * - Favoritos: Si el usuario está autenticado, verifica qué mascotas están marcadas
 *   como favoritas mediante una petición POST a /api/user/favorites/check.
 *
 * Dependencias Externas:
 * - Lucide React: Utilizado para la iconografía de la interfaz (AlertCircle, FishOff, etc).
 * - API /api/pets: Endpoint principal para obtener el listado de mascotas.
 *
 */