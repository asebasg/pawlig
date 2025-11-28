'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Pet } from '@prisma/client';
import PetCard from '@/components/PetCard';

interface FavoritesSectionProps {
  onFavoriteRemoved?: () => void;
}

interface FavoritePet extends Pet {
  shelter: {
    name: string;
    municipality: string;
  };
}

/**
 * Sección de mascotas favoritas en el dashboard de adoptante
 * Muestra:
 * - Grid de mascotas favoritas
 * - Opción de quitar de favoritos
 * - Enlace a detalle
 * - Mensaje si no hay favoritos
 */
export default function FavoritesSection({ onFavoriteRemoved }: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<FavoritePet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFavorites, setTotalFavorites] = useState(0);

  useEffect(() => {
    fetchFavorites();
  }, [currentPage, pageSize]);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/adopter/favorites?page=${currentPage}&limit=${pageSize}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar favoritos');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
      setTotalFavorites(data.total || 0);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (petId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/pets/${petId}/favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al quitar de favoritos');
      }

      // Actualizar lista local
      setFavorites((prev) => prev.filter((pet) => pet._id !== petId));
      setTotalFavorites((prev) => Math.max(0, prev - 1));

      // Callback al padre
      onFavoriteRemoved?.();
    } catch (err) {
      console.error('Error:', err);
      alert('Error al quitar de favoritos. Intenta de nuevo.');
    }
  };

  const totalPages = Math.ceil(totalFavorites / pageSize);

  // Estado: Cargando
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Error
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error al cargar favoritos</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchFavorites}
              className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Sin favoritos
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="mb-4">
          <Heart className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin mascotas favoritas</h2>
        <p className="text-gray-600 mb-6">
          Aún no has agregado mascotas a favoritos. Explora la galería y agrega tus favoritas.
        </p>
        <Link
          href="/adopciones"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Explorar mascotas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Estado: Mostrar favoritos
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Mis Favoritos
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {totalFavorites} mascota{totalFavorites !== 1 ? 's' : ''} guardada{totalFavorites !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid de favoritos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {favorites.map((pet) => (
          <div key={pet._id} className="relative">
            <Link href={`/adopciones/${pet._id}`}>
              <PetCard pet={pet} initialIsFavorited={true} />
            </Link>

            {/* Botón para quitar de favoritos (superpuesto) */}
            <button
              onClick={(e) => handleRemoveFavorite(pet._id, e)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition z-10"
              title="Quitar de favoritos"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. STATES:
 *    - favorites: Array de mascotas favoritas
 *    - isLoading: Mientras carga datos
 *    - error: Mensaje de error
 *    - currentPage: Página actual de paginación
 *    - pageSize: Mascotas por página (12)
 *    - totalFavorites: Total de favoritos para calcular paginación
 * 
 * 2. API CALL:
 *    - GET /api/adopter/favorites?page=X&limit=12
 *    - Response: { favorites: Pet[], total: number }
 * 
 * 3. ITERACCIÓN:
 *    - Click en PetCard: Navega a /adopciones/[id]
 *    - Click en corazón rojo: Quita de favoritos
 *      - POST /api/pets/[id]/favorite
 *      - Remueve de lista local
 *      - Notifica al padre
 * 
 * 4. COMPONENTES UTILIZADOS:
 *    - PetCard: Tarjeta de mascota existente
 *    - Iconos de Lucide: Heart, ArrowRight, AlertCircle, Loader2
 * 
 * 5. RESPONSIVIDAD:
 *    - Mobile: 1 columna
 *    - Tablet: 2 columnas (md:grid-cols-2)
 *    - Desktop: 3 columnas (lg:grid-cols-3)
 * 
 * 6. PAGINACIÓN:
 *    - 12 mascotas por página
 *    - Botones Anterior/Siguiente
 *    - Números de página activos
 *    - Deshabilitados en extremos
 * 
 * 7. MENSAJES:
 *    - Loading: "Cargando favoritos..."
 *    - Error: Muestra error con botón retry
 *    - Empty: "Sin mascotas favoritas" con link a galería
 *    - Success: Grid de mascotas con contador
 */
