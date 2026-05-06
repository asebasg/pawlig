'use client';

import { useEffect, useState } from 'react';
import { Heart, Search, HeartPlus } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import { PetCard, PetCardData } from '@/components/cards/pet-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * GET /api/adopter/favorites
 * POST /api/pets/[id]/favorite
 * Descripción: Muestra y gestiona la lista de mascotas marcadas como favoritas por el adoptante.
 * Requiere: Sesión de usuario válida.
 * Implementa: HU-004 (Visualización del Panel de Usuario), RF-005 (Sistema de favoritos).
 */

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  status: string;
  description: string;
  images: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
    contactWhatsApp?: string;
    contactInstagram?: string;
  };
  addedToFavoritesAt: string;
}

export default function FavoritesSection() {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Cargar favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/user/favorites');

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Sesión expirada');
          }
          throw new Error('Error al cargar favoritos');
        }

        const data = await response.json();
        setFavorites(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Remover de favoritos
  const handleRemoveFavorite = async (petId: string) => {
    try {
      setRemovingId(petId);
      const response = await fetch(`/api/pets/${petId}/favorite`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al remover de favoritos');
      }

      // Actualizar estado local
      setFavorites(favorites.filter((pet) => pet.id !== petId));
    } catch (err) {
      console.error('Error:', err);
      setError('Error al remover de favoritos');
    } finally {
      setRemovingId(null);
    }
  };

  // Filtrar favoritos por búsqueda
  const filteredFavorites = favorites.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pet.shelter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="mb-2">
        <h2 className="flex flex-inline items-center text-2xl font-bold text-gray-900 mb-2">
          <HeartPlus size={26} className="mr-2" />
          Mis Mascotas Favoritas
        </h2>
        <p className="text-gray-600">
          {favorites.length === 0
            ? 'Aún no has marcado ninguna mascota como favorita'
            : `Tienes ${favorites.length} mascota${favorites.length !== 1 ? 's' : ''} favorita${favorites.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Búsqueda */}
      {favorites.length > 0 && (
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar en favoritos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>
      )}

      {/* Estados */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader />
          <p className="text-gray-500">Cargando favoritos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-purple-600 hover:underline"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No tienes mascotas favoritas</p>
          <p className="text-sm text-gray-400 mb-4">
            Explora nuestro catálogo y marca tus mascotas favoritas
          </p>
          <Link
            href="/adopciones"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Explorar mascotas
          </Link>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron resultados para: {searchQuery}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((pet) => {
            const petData: PetCardData = {
              id: pet.id,
              name: pet.name,
              images: pet.images,
              species: pet.species,
              breed: pet.breed,
              age: pet.age,
              sex: pet.sex,
              shelter: pet.shelter,
            };

            return (
              <PetCard
                key={pet.id}
                pet={petData}
                accentColor="none"
                imageOverlay={
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFavorite(pet.id);
                    }}
                    disabled={removingId === pet.id}
                    className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition disabled:opacity-50 z-20 group/heart"
                    title="Remover de favoritos"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500 transition-transform group-hover/heart:scale-110" />
                  </button>
                }
                footer={
                  <Button asChild variant="default">
                    <Link href={`/adopciones/${pet.id}`}>Ver detalles</Link>
                  </Button>
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Esta sección permite al usuario gestionar sus mascotas favoritas, permitiendo
 * búsqueda rápida y eliminación de intereses directamente desde el dashboard.
 *
 * Lógica Clave:
 * - Sincronización Local: Al remover un favorito, se actualiza el estado local 
 *   inmediatamente para reflejar el cambio sin recargar la página.
 * - Búsqueda de Texto: Filtra localmente el array de favoritos por nombre, especie, 
 *   raza o nombre del albergue.
 * - PetCard Reutilizable: Utiliza el componente estándar de tarjeta con un overlay 
 *   específico para la acción de remover.
 *
 * Dependencias Externas:
 * - lucide-react: Iconos Heart, Search, HeartPlus.
 * - @/components/ui: Loader, Button.
 *
 */
