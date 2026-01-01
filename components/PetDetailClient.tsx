'use client';

import { useState } from 'react';
import {
  Heart,
  MapPin,
  Calendar,
  Info,
  MessageSquare,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PetCard from './cards/pet-card';
import Badge from './ui/badge';
import Loader from '@/components/ui/loader'

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  status: 'AVAILABLE' | 'IN_PROCESS' | 'ADOPTED';
  description: string;
  requirements: string | null;
  images: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
    address: string;
    description: string | null;
    contactWhatsApp: string | null;
    contactInstagram: string | null;
  };
  adoptions: Array<{
    id: string;
    status: string;
  }>;
}

interface SimilarPet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  status: 'AVAILABLE' | 'IN_PROCESS' | 'ADOPTED';
  images: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
  };
}

interface PetDetailClientProps {
  pet: Pet;
  isFavorited: boolean;
  userSession: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  similarPets: SimilarPet[];
}

/**
 * Componente Cliente: Detalle de Mascota
 * 
 * Características:
 * - Galería de imágenes con navegación
 * - Información completa de mascota
 * - Sistema de favoritos
 * - Botón de solicitud de adopción
 * - Información del albergue
 * - Recomendaciones de mascotas similares
 */
export default function PetDetailClient({
  pet,
  isFavorited: initialIsFavorited,
  userSession,
  similarPets,
}: PetDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingAdoption, setIsLoadingAdoption] = useState(false);
  const [adoptionSuccess, setAdoptionSuccess] = useState(false);

  const images = pet.images || [];
  const hasMultipleImages = images.length > 1;

  // Navegación de galería
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Manejar favoritos
  const handleFavoriteClick = async () => {
    if (!userSession) {
      window.location.href = `/login?callbackUrl=/adopciones/${pet.id}`;
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

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // Manejar solicitud de adopción
  const handleAdoptionRequest = async () => {
    if (!userSession) {
      window.location.href = `/login?callbackUrl=/adopciones/${pet.id}`;
      return;
    }

    try {
      setIsLoadingAdoption(true);

      const response = await fetch('/api/user/adoptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petId: pet.id,
          message: null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 409) {
          alert('Ya tienes una solicitud de adopción para esta mascota');
        } else {
          alert(error.error || 'Error al crear solicitud');
        }
        return;
      }

      setAdoptionSuccess(true);
      setTimeout(() => {
        window.location.href = '/user';
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear solicitud de adopción');
    } finally {
      setIsLoadingAdoption(false);
    }
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Galería de imágenes */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6">
          {/* Imagen Principal */}
          <div className="relative h-96 bg-gray-200">
            {images.length > 0 ? (
              <Image
                src={images[currentImageIndex]}
                alt={pet.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin foto disponible
              </div>
            )}

            {/* Controles de galería */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>

                {/* Indicador de posición */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Miniaturas de galería */}
          {hasMultipleImages && (
            <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 transition ${
                    idx === currentImageIndex ? 'border-purple-600' : 'border-gray-200'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información de la mascota */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{pet.name}</h1>
              <Badge status={pet.status} />
            </div>
            <button
              onClick={handleFavoriteClick}
              disabled={isLoadingFavorite}
              className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
            >
              <Heart
                className={`w-6 h-6 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
            {/* Especie */}
            <div className="text-center">
              <Info className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Especie</p>
              <p className="font-semibold text-gray-900">{pet.species}</p>
            </div>

            {/* Raza */}
            <div className="text-center">
              <Info className="w-5 h-5 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Raza</p>
              <p className="font-semibold text-gray-900">{pet.breed || 'No especificada'}</p>
            </div>

            {/* Edad */}
            {pet.age && (
              <div className="text-center">
                <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Edad</p>
                <p className="font-semibold text-gray-900">
                  {pet.age} año{pet.age !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Sexo */}
            {pet.sex && (
              <div className="text-center">
                <Info className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Sexo</p>
                <p className="font-semibold text-gray-900">{pet.sex}</p>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Sobre {pet.name}</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {pet.description}
            </p>
          </div>

          {/* Requisitos */}
          {pet.requirements && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Requisitos de Adopción</h3>
              <p className="text-blue-800 whitespace-pre-wrap">{pet.requirements}</p>
            </div>
          )}
        </div>
      </div>

      {/* Panel Lateral - Albergue e Información */}
      <div className="lg:col-span-1">
        {/* Card de Albergue */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-20">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Albergue</h3>
            <Link href={`#`} className="text-purple-600 hover:text-purple-700 font-semibold text-lg">
              {pet.shelter.name}
            </Link>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{pet.shelter.municipality}</span>
            </div>
          </div>

          {/* Dirección */}
          {pet.shelter.address && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Ubicación</p>
              <p className="text-sm text-gray-900">{pet.shelter.address}</p>
            </div>
          )}

          {/* Descripción del Albergue */}
          {pet.shelter.description && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Acerca del Albergue</p>
              <p className="text-sm text-gray-700 line-clamp-3">{pet.shelter.description}</p>
            </div>
          )}

          {/* Contacto */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 mb-3">Contactar Albergue</p>
            <div className="flex flex-col gap-2">
              {pet.shelter.contactWhatsApp && (
                <a
                  href={`https://wa.me/${pet.shelter.contactWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              {pet.shelter.contactInstagram && (
                <a
                  href={`https://instagram.com/${pet.shelter.contactInstagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium text-sm"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              )}
            </div>
          </div>

          {/* CTA - Solicitar Adopción */}
          {pet.status === 'AVAILABLE' ? (
            <button
              onClick={handleAdoptionRequest}
              disabled={isLoadingAdoption || adoptionSuccess}
              className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                adoptionSuccess
                  ? 'bg-green-100 text-green-800'
                  : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
              }`}
            >
              {isLoadingAdoption && <Loader />}
              {adoptionSuccess ? '¡Solicitud enviada!' : 'Solicitar Adopción'}
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-700 text-center font-semibold">
              No disponible para adoptar
            </div>
          )}

          {/* Postulaciones */}
          {pet.adoptions.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                {pet.adoptions.length} postulación{pet.adoptions.length !== 1 ? 'es' : ''} recibida{pet.adoptions.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mascotas Similares */}
      {similarPets.length > 0 && (
        <div className="lg:col-span-3 mt-12 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Otras mascotas que podrían interesarte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarPets.map((similarPet) => (
              <PetCard
                key={similarPet.id}
                pet={{
                  ...similarPet,
                  description: '',
                }}
                userSession={userSession}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * 
 * ✅ Galería de imágenes con navegación
 * ✅ Indicador de posición de imagen
 * ✅ Miniaturas de galería
 * ✅ Sistema de favoritos
 * ✅ Botón de solicitud de adopción
 * ✅ Información completa de mascota
 * ✅ Información del albergue
 * ✅ Enlaces de contacto (WhatsApp, Instagram)
 * ✅ Requisitos de adopción
 * ✅ Mascotas similares
 * ✅ Diseño responsive
 * ✅ Animaciones y transiciones
 * ✅ Manejo de estados y errores
 * 
 * REQUERIMIENTOS CUMPLIDOS:
 * - HU-005: Galería pública detallada ✅
 * - RF-005: Sistema de favoritos ✅
 * - Solicitud de adopción ✅
 */
