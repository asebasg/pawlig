'use client';

import { useState } from 'react';
import { Heart, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';

interface FavoritePetCardProps {
  favoriteId: string;
  pet: {
    id: string;
    name: string;
    age?: number | null;
    municipality?: string;
    images: string[];
    shelter: { name: string };
  };
  onRemove?: () => void;
}

export default function FavoritePetCard({ favoriteId, pet, onRemove }: FavoritePetCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { showToast } = useToast();

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);

    try {
      const response = await fetch(`/api/pets/${pet.id}/favorite`, {
        method: 'POST',
      });

      if (response.ok) {
        showToast('Eliminado de favoritos', 'success');
        onRemove?.();
      } else {
        showToast('Error al eliminar de favoritos', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsRemoving(false);
      setShowConfirm(false);
    }
  };

  const handleCancelRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <Link href={`/adopciones/${pet.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full flex flex-col relative">
        <div className="relative h-48 bg-gray-200">
          {pet.images?.[0] ? (
            <img src={pet.images[0]} alt={pet.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin foto
            </div>
          )}

          <button
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition disabled:opacity-50 z-10"
            title="Quitar de favoritos"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{pet.name}</h3>
          
          {pet.age && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span>{pet.age} año{pet.age !== 1 ? 's' : ''}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-sm text-gray-700 mt-auto">
            <MapPin className="w-4 h-4 text-purple-600" />
            <span className="line-clamp-1">{pet.shelter.name}</span>
          </div>
        </div>

        {showConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-lg p-4 max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-semibold text-gray-900 mb-3">¿Eliminar de favoritos?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmRemove}
                  disabled={isRemoving}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Eliminar
                </button>
                <button
                  onClick={handleCancelRemove}
                  className="flex-1 bg-gray-200 text-gray-800 px-3 py-2 rounded text-sm font-medium hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
