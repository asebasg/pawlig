import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/pets/[id]/favorite
 * Toggle para agregar o remover una mascota de los favoritos del usuario
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - RF-005: Sistema de favoritos
 * 
 * Casos de uso:
 * 1. Agregar mascota a favoritos (no existe relación)
 * 2. Remover mascota de favoritos (existe relación)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para agregar favoritos' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const petId = params.id;

    // Validar que la mascota existe
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true },
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Mascota no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si ya existe el favorito
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_petId: {
          userId,
          petId,
        },
      },
    });

    let result;
    let message: string;

    if (existingFavorite) {
      // Remover de favoritos
      result = await prisma.favorite.delete({
        where: {
          userId_petId: {
            userId,
            petId,
          },
        },
      });
      message = 'Mascota removida de favoritos';
    } else {
      // Agregar a favoritos
      result = await prisma.favorite.create({
        data: {
          userId,
          petId,
        },
      });
      message = 'Mascota agregada a favoritos';
    }

    return NextResponse.json(
      {
        success: true,
        message,
        isFavorite: !existingFavorite,
        favorite: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en toggle de favorito:', error);

    return NextResponse.json(
      { error: 'Error al actualizar favorito' },
      { status: 500 }
    );
  }
}
