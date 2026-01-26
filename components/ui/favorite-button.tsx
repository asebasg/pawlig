'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
    petId: string;
    initialIsFavorited: boolean;
    userSession: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | null;
}

/**
 * Componente: FavoriteButton
 * 
 * Botón de favoritos reutilizable para mascotas.
 * Maneja la lógica de autenticación y toggle de favoritos.
 */
export function FavoriteButton({ petId, initialIsFavorited, userSession }: FavoriteButtonProps) {
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
    const [isFav, setIsFav] = useState(initialIsFavorited);

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userSession) {
            window.location.href = `/login?callbackUrl=/adopciones`;
            return;
        }

        try {
            setIsLoadingFavorite(true);

            const response = await fetch(`/api/pets/${petId}/favorite`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Error al actualizar favorito');
            }

            const data = await response.json();
            setIsFav(data.isFavorited);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar favorito');
        } finally {
            setIsLoadingFavorite(false);
        }
    };

    return (
        <button
            onClick={handleFavoriteClick}
            disabled={isLoadingFavorite}
            className="absolute top-0 right-0 p-2 bg-card rounded-full shadow-sm hover:bg-muted transition disabled:opacity-50 z-20 group/heart"
            title={isFav ? 'Remover de favoritos' : 'Agregar a favoritos'}
            type="button"
        >
            <Heart
                className={`w-5 h-5 transition-all ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                    } group-hover/heart:scale-110`}
            />
        </button>
    );
}
