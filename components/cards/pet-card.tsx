'use client';

/**
 * Componente: Pet Card
 * Descripción: Muestra una tarjeta de vista previa para una mascota.
 * Requiere: -
 * Implementa: Lógica para marcar/desmarcar como favorito.
 */
import { useState } from 'react';
import { Heart, MapPin, Calendar, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Badge from '@/components/ui/badge';
import { PetStatus } from '@prisma/client';

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

export default function PetCard({
  pet,
  userSession,
  isFavorited = false,
  onFavoriteChange,
}: PetCardProps) {
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isFav, setIsFav] = useState(isFavorited);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userSession) {
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

      const data = await response.json();
      setIsFav(data.isFavorited);
      onFavoriteChange?.(data.isFavorited);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar favorito');
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  return (
    <Link href={`/adopciones/${pet.id}`} className="block h-full">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="relative h-56 bg-gray-200 overflow-hidden group">
          {pet.images && pet.images.length > 0 ? (
            <Image
              src={pet.images[0]}
              alt={pet.name}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin foto disponible
            </div>
          )}

          <div className="absolute top-3 left-3">
            <Badge status={pet.status} />
          </div>

          <button
            onClick={handleFavoriteClick}
            disabled={isLoadingFavorite}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition disabled:opacity-50 z-10"
            title={isFav ? 'Remover de favoritos' : 'Agregar a favoritos'}
            type="button"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFav ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {pet.name}
          </h3>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
            <Info className="w-4 h-4" />
            <span>
              {pet.species}
              {pet.breed && ` • ${pet.breed}`}
            </span>
          </div>

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

          <div className="flex items-center gap-1 text-sm text-gray-700 font-medium mb-4 mt-auto">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="line-clamp-1">{pet.shelter.name}</span>
          </div>

          <div className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition text-sm text-center">
            Ver Detalles
          </div>
        </div>
      </div>
    </Link>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente es una 'client component' que renderiza una tarjeta de
 * vista previa para una mascota. Es un componente fundamental en los
 * listados de mascotas y está diseñado para ser visualmente atractivo y
 * funcional, incluyendo una acción para marcar como favorito.
 *
 * Lógica Clave:
 * - 'Gestión del Estado de Favorito':
 *   - El componente maneja un estado local ('isFav') para el corazón de
 *     favorito, lo que permite una respuesta visual inmediata al clic del
 *     usuario.
 *   - La función 'handleFavoriteClick' es asíncrona y se comunica con el
 *     endpoint de la API ('/api/pets/{pet.id}/favorite') para persistir
 *     el cambio en la base de datos.
 *   - 'Manejo de Sesión': Si un usuario no autenticado intenta marcar
 *     una mascota como favorita, es redirigido a la página de login con
 *     un 'callbackUrl' para que pueda volver a la página actual después
 *     de iniciar sesión.
 * - 'Optimización de Imágenes con next/image':
 *   - Se utiliza el componente 'Image' de Next.js para optimizar la carga
 *     de la imagen de la mascota. El atributo 'fill' y 'sizes' asegura que
 *     la imagen sea responsiva y se cargue en el tamaño más adecuado para
 *     el viewport del usuario.
 * - 'Componente Reutilizable':
 *   - Acepta la prop 'isFavorited' para inicializar el estado del corazón,
 *     lo que permite que el estado inicial se pase desde un componente
 *     padre que ya ha consultado los favoritos del usuario.
 *   - El callback 'onFavoriteChange' permite notificar al componente padre
 *     cuando el estado de favorito cambia, facilitando la sincronización
 *     del estado a nivel superior si es necesario.
 *
 * Dependencias Externas:
 * - 'lucide-react': Para los íconos utilizados en la tarjeta.
 * - 'next/link' y 'next/image': Para la navegación optimizada y la
 *   carga de imágenes.
 * - '@prisma/client' (indirectamente a través del tipo 'PetStatus'): Para
 *   el tipado del estado de la mascota.
 *
 */
