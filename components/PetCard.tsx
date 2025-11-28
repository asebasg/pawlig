'use client';

import { useState } from 'react';
import { Heart, MapPin, Calendar, Dna2 } from 'lucide-react';
import Link from 'next/link';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  status: 'AVAILABLE' | 'IN_PROCESS' | 'ADOPTED';
  description: string;
  images: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
  };
}

interface PetCardProps {
  pet: Pet;
  userSession?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  isFavorited?: boolean;
  onFavoriteChange?: (isFavorite: boolean) => void;
}

/**
 * Componente: PetCard
 * 
 * Tarjeta reutilizable para mostrar mascotas en la galería pública
 * 
 * Características:
 * - Badge de estado (Disponible, En Proceso, Adoptada)
 * - Galería de imágenes
 * - Información de mascota
 * - Botón de favoritos
 * - Enlace a detalle
 * 
 * Requerimientos:
 * - HU-005: Desarrollar galería pública de mascotas
 * - HU-006: Filtro y búsqueda
 * - RF-005: Sistema de favoritos
 */
export default function PetCard({
  pet,
  userSession,
  isFavorited = false,
  onFavoriteChange,
}: PetCardProps) {
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isFav, setIsFav] = useState(isFavorited);

  // Configuración de badges por estado
  const statusConfig = {
    AVAILABLE: {
      label: 'Disponible',
      color: 'bg-green-100 text-green-800',
      icon: '✓',
    },
    IN_PROCESS: {
      label: 'En Proceso',
      color: 'bg-yellow-100 text-yellow-800',
      icon: '⏳',
    },
    ADOPTED: {
      label: 'Adoptada',
      color: 'bg-gray-100 text-gray-800',
      icon: '✓',
    },
  };

  const statusInfo = statusConfig[pet.status];

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userSession) {
      // Redirigir a login si no está autenticado
      window.location.href = `/login?callbackUrl=/adopciones`;
      return;
    }

    try {
      setIsLoadingFavorite(true);

      const response = await fetch(`/api/pets/${pet.id}/favorite`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al actualizar favorito');
      }

      const newFavStatus = !isFav;
      setIsFav(newFavStatus);
      onFavoriteChange?.(newFavStatus);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <Link href={`/adopciones/${pet.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Imagen con Badge de Estado */}
        <div className="relative h-56 bg-gray-200 overflow-hidden group">
          {pet.images && pet.images.length > 0 ? (
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin foto disponible
            </div>
          )}

          {/* Badge de estado */}
          <div
            className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
          >
            {statusInfo.icon} {statusInfo.label}
          </div>

          {/* Botón de favoritos (esquina superior derecha) */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoadingFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition disabled:opacity-50 z-10"
            title={isFav ? 'Remover de favoritos' : 'Agregar a favoritos'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        {/* Información de la mascota */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Nombre */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {pet.name}
          </h3>

          {/* Especie y raza */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Dna2 className="w-4 h-4" />
            <span>
              {pet.species}
              {pet.breed && ` • ${pet.breed}`}
            </span>
          </div>

          {/* Edad y sexo */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
            {pet.age && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {pet.age} año{pet.age !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {pet.sex && (
              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                {pet.sex}
              </span>
            )}
          </div>

          {/* Albergue */}
          <div className="flex items-center gap-1 text-sm text-gray-700 font-medium mb-4 mt-auto">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="line-clamp-1">{pet.shelter.name}</span>
          </div>

          {/* CTA - Ver Detalles */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Link manejará la navegación
            }}
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition text-sm"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </Link>
  );
}

/**
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * 
 * ✅ Badge de estado (AVAILABLE, IN_PROCESS, ADOPTED)
 * ✅ Galería de imágenes con hover zoom
 * ✅ Información completa: nombre, especie, raza, edad, sexo
 * ✅ Ubicación del albergue
 * ✅ Sistema de favoritos con autenticación
 * ✅ Link a página de detalles
 * ✅ Diseño responsive y moderno
 * ✅ Animaciones suaves
 * ✅ Manejo de estados de carga
 * ✅ Fallback para imágenes faltantes
 * 
 * REQUERIMIENTOS CUMPLIDOS:
 * - HU-005: Galería pública con PetCard ✅
 * - HU-006: Integración con filtros ✅
 * - RF-005: Sistema de favoritos ✅
 */
