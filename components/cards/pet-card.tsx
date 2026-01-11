'use client';

import * as React from 'react';
import Image from 'next/image';
import { MapPin, Info, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// ==========================================
// Tipos de Datos Normalizados
// ==========================================

export interface PetCardData {
  id: string;
  name: string;
  images: string[];
  species: string;
  breed?: string | null;
  age?: number | null;
  sex?: string | null;
  shelter: {
    name: string;
    municipality: string;
  };
  status?: string;
}

// ==========================================
// Props del Componente
// ==========================================

export interface PetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Datos de la mascota normalizados */
  pet: PetCardData;
  /** Relación de aspecto de la imagen principal */
  aspectRatio?: 'square' | 'video' | 'portrait';
  /** Color de acento para el borde superior (usando variantes de Card) */
  accentColor?: 'default' | 'teal' | 'orange' | 'purple' | 'red' | 'blue' | 'green' | 'none';
  /** Contenido opcional para superponer en la imagen (ej: botón de favoritos, badges de estado) */
  imageOverlay?: React.ReactNode;
  /** Contenido del pie de página (ej: botones de acción) */
  footer?: React.ReactNode;
  /** Clases adicionales para el contenedor de la imagen */
  imageClassName?: string;
}

/**
 * Componente: PetCard
 * 
 * Tarjeta estandarizada para mostrar información de mascotas.
 * Utiliza los componentes base de shadcn/ui (Card) y soporta personalización flexible.
 */
export function PetCard({
  pet,
  aspectRatio = 'square',
  accentColor = 'purple',
  imageOverlay,
  footer,
  className,
  imageClassName,
  ...props
}: PetCardProps) {

  // Configuración de aspecto de imagen
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <Link href={`/adopciones/${pet.id}`} className="block h-full">
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col",
          className
        )}
        accentColor={accentColor}
        {...props}
      >
        {/* Contenedor de Imagen y Overlays (Flush to edges) */}
        <div className="relative overflow-hidden w-full">
          <div className={cn("relative w-full", aspectRatioClasses[aspectRatio], imageClassName)}>
            {pet.images && pet.images.length > 0 ? (
              <Image
                src={pet.images[0]}
                alt={pet.name}
                fill
                className="object-cover transition-transform duration-500 pointer-events-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-200">
                Sin foto disponible
              </div>
            )}

            {/* Slot para contenido sobre la imagen (badges, favoritos) */}
            {imageOverlay && (
              <div className="absolute inset-0 z-10 p-3 pointer-events-none">
                <div className="w-full h-full relative pointer-events-auto">
                  {imageOverlay}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content: Información de la mascota */}
        <CardContent className="p-4 flex-1 flex flex-col gap-3">
          {/* Título y Especie */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {pet.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Info className="w-4 h-4" />
              <span className="line-clamp-1">
                {pet.species} {pet.breed && `• ${pet.breed}`}
              </span>
            </div>
          </div>

          {/* Detalles: Edad y Sexo */}
          <div className="flex flex-wrap gap-2">
            {pet.age !== null && pet.age !== undefined && (
              <Badge variant="secondary" className="font-normal bg-secondary/50 text-secondary-foreground hover:bg-secondary/60">
                <Calendar className="w-3 h-3 mr-1" />
                {pet.age} año{pet.age !== 1 ? 's' : ''}
              </Badge>
            )}
            {pet.sex && (
              <Badge variant="outline" className="font-normal border-gray-200 text-gray-600">
                {pet.sex}
              </Badge>
            )}
          </div>

          {/* Ubicación (Bottom aligned within content) */}
          <div className="mt-auto pt-2 flex items-center gap-1.5 text-sm text-gray-600 font-medium border-t border-gray-50">
            <MapPin className={cn(
              "w-4 h-4",
              // Ajustar color del icono según el acento si se desea, por ahora estático o dinámico
              accentColor === 'purple' ? 'text-purple-600' :
                accentColor === 'orange' ? 'text-orange-600' :
                  accentColor === 'teal' ? 'text-teal-600' :
                    accentColor === 'green' ? 'text-green-600' :
                      accentColor === 'red' ? 'text-red-600' :
                        accentColor === 'blue' ? 'text-blue-600' :
                          'text-primary'
            )} />
            <span className="line-clamp-1">{pet.shelter.name}, {pet.shelter.municipality}</span>
          </div>
        </CardContent>

        {/* Footer: Acciones */}
        {footer && (
          <CardFooter className="p-4 pt-0 mt-auto">
            {footer}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
