'use client';

import { useEffect, useState } from 'react';
import { Heart, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import Image from 'next/image'

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

interface FavoritesSectionProps {
  userId: string;
}

/**
 * Componente: Sección de Mascotas Favoritas
 * 
 * Características:
 * - Lista todas las mascotas marcadas como favoritas por el usuario
 * - Permite remover mascotas de favoritos
 * - Muestra información del albergue y contacto
 * - Estado de carga y errores
 * - Redirección a detalles de mascota
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - Ver mascotas favoritas guardadas
 */
export default function FavoritesSection({ userId }: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cargar favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/adopter/favorites');

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ❤️ Mis Mascotas Favoritas
        </h2>
        <p className="text-gray-600">
          {favorites.length === 0
            ? 'Aún no has marcado ninguna mascota como favorita'
            : `Tienes ${favorites.length} mascota${favorites.length !== 1 ? 's' : ''} favorita${favorites.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Búsqueda */}
      {favorites.length > 0 && (
        <div className="mb-6">
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
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
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
          {filteredFavorites.map((pet) => (
            <FavoriteCard
              key={pet.id}
              pet={pet}
              onRemove={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Componente: Tarjeta de Mascota Favorita
 */
interface FavoriteCardProps {
  pet: Pet;
  onRemove: (petId: string) => void;
}

function FavoriteCard({ pet, onRemove }: FavoriteCardProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    await onRemove(pet.id);
    setRemoving(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg overflow-hidden border border-purple-100 hover:shadow-md transition">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-200">
        {pet.images && pet.images.length > 0 ? (
          <Image
            src={pet.images[0]}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin foto
          </div>
        )}

        {/* Botón para remover */}
        <button
          onClick={handleRemove}
          disabled={removing}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
          title="Remover de favoritos"
        >
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {pet.name}
        </h3>

        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p className="font-medium">
            {pet.species} {pet.breed && `• ${pet.breed}`}
          </p>
          {pet.age && (
            <p>
              {pet.age} año{pet.age !== 1 ? 's' : ''}
              {pet.sex && ` • ${pet.sex}`}
            </p>
          )}
        </div>

        {/* Albergue */}
        <div className="bg-white rounded-lg p-2 mb-3 border border-gray-200">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{pet.shelter.name}</p>
              <p className="text-gray-600">{pet.shelter.municipality}</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <Link
          href={`/adopciones/${pet.id}`}
          className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

/**
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * 
 * ✅ Carga asincrónica de favoritos
 * ✅ Búsqueda/filtro en tiempo real
 * ✅ Remover mascotas de favoritos con botón corazón
 * ✅ Información detallada de mascota y albergue
 * ✅ Estado de carga y errores
 * ✅ Mensaje si no hay favoritos (con CTA)
 * ✅ Responsive design (1-3 columnas)
 * ✅ Iconos y diseño visual coherente
 * ✅ Actualización dinámica del estado local
 */
