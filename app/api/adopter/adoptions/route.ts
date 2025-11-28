import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (session.user.role !== UserRole.ADOPTER) {
      return NextResponse.json(
        { error: 'Solo los adoptantes pueden solicitar adopciones' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { petId, message } = body;

    if (!petId || !/^[0-9a-fA-F]{24}$/.test(petId)) {
      return NextResponse.json(
        { error: 'ID de mascota inválido' },
        { status: 400 }
      );
    }

    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      select: { id: true, status: true, name: true },
    });

    if (!pet) {
      return NextResponse.json(
        { error: 'Mascota no encontrada' },
        { status: 404 }
      );
    }

    if (pet.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Esta mascota no está disponible para adopción' },
        { status: 400 }
      );
    }

    const existingAdoption = await prisma.adoption.findUnique({
      where: {
        adopterId_petId: {
          adopterId: session.user.id,
          petId,
        },
      },
    });

    if (existingAdoption) {
      return NextResponse.json(
        { error: 'Ya tienes una solicitud de adopción para esta mascota' },
        { status: 409 }
      );
    }

    const adoption = await prisma.adoption.create({
      data: {
        adopterId: session.user.id,
        petId,
        message: message || null,
        status: 'PENDING',
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Solicitud de adopción creada exitosamente',
        adoptionId: adoption.id,
        status: adoption.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/adopter/adoptions] Error:', error);
    return NextResponse.json(
      { error: 'Error al crear solicitud de adopción' },
      { status: 500 }
    );
  }
}
