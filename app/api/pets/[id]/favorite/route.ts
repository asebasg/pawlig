import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para agregar favoritos' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const petId = params.id;

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
