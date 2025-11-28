import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const petId = params.id;

    if (!/^[0-9a-fA-F]{24}$/.test(petId)) {
      return NextResponse.json(
        { error: 'ID de mascota inválido' },
        { status: 400 }
      );
    }

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
          userId: session.user.id,
          petId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });

      return NextResponse.json({
        success: true,
        message: 'Mascota removida de favoritos',
        isFavorited: false,
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          petId,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Mascota agregada a favoritos',
        isFavorited: true,
      });
    }
  } catch (error) {
    console.error('[POST /api/pets/[id]/favorite] Error:', error);
    return NextResponse.json(
      { error: 'Error al actualizar favorito' },
      { status: 500 }
    );
  }
}
