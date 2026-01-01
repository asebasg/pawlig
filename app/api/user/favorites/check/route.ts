import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ favorites: [] });
    }

    const body = await request.json();
    const { petIds } = body;

    if (!Array.isArray(petIds)) {
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        petId: { in: petIds },
      },
      select: {
        petId: true,
      },
    });

    return NextResponse.json({
      favorites: favorites.map(f => f.petId),
    });
  } catch (error) {
    console.error('[POST /api/user/favorites/check] Error:', error);
    return NextResponse.json({ favorites: [] });
  }
}
