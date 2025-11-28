'use client';

import { useEffect, useState } from 'react';
import { Heart, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import FavoritePetCard from '@/components/cards/favorite-pet-card';
import { getUserFavorites, type Favorite } from '@/lib/services/favorite.service';

interface FavoritesSectionProps {
  userId: string;
  onCountChange?: (count: number) => void;
}

export default function FavoritesSection({ userId, onCountChange }: FavoritesSectionProps) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/adopter/favorites?limit=4');
      const data = await response.json();
      setFavorites(data.favorites || []);
      onCountChange?.(data.total || 0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    loadFavorites();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Aún no tienes mascotas favoritas</h3>
        <p className="text-gray-600 mb-6">Explora la galería y guarda tus mascotas preferidas</p>
        <Link
          href="/adopciones"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Explorar mascotas disponibles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Mis Favoritos</h2>
        </div>
        <Link
          href="/user/favorites"
          className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((fav) => (
          <FavoritePetCard
            key={fav.id}
            favoriteId={fav.id}
            pet={{
              id: fav.pet.id,
              name: fav.pet.name,
              age: fav.pet.age,
              municipality: fav.pet.shelter.municipality,
              images: fav.pet.images,
              shelter: { name: fav.pet.shelter.name },
            }}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
