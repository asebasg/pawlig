import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole, Prisma, AdoptionStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver solicitudes' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const statusParam = req.nextUrl.searchParams.get('status');

    const whereClause: Prisma.AdoptionWhereInput = {
      adopterId: userId,
    };

    if (statusParam && Object.values(AdoptionStatus).includes(statusParam as AdoptionStatus)) {
      whereClause.status = statusParam as AdoptionStatus;
    }

    const adoptions = await prisma.adoption.findMany({
      where: whereClause,
      include: {
        pet: {
          include: {
            shelter: {
              select: {
                id: true,
                name: true,
                municipality: true,
                contactWhatsApp: true,
                contactInstagram: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const transformedAdoptions = adoptions.map((adoption) => ({
      id: adoption.id,
      petId: adoption.pet.id,
      petName: adoption.pet.name,
      petSpecies: adoption.pet.species,
      petBreed: adoption.pet.breed,
      petAge: adoption.pet.age,
      petSex: adoption.pet.sex,
      petImages: adoption.pet.images,
      shelter: adoption.pet.shelter,
      status: adoption.status,
      message: adoption.message,
      createdAt: adoption.createdAt,
      updatedAt: adoption.updatedAt,
      isRecent: isRecentUpdate(adoption.updatedAt),
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedAdoptions,
        total: transformedAdoptions.length,
        stats: {
          pending: adoptions.filter((a) => a.status === 'PENDING').length,
          approved: adoptions.filter((a) => a.status === 'APPROVED').length,
          rejected: adoptions.filter((a) => a.status === 'REJECTED').length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo solicitudes de adopción:', error);
    return NextResponse.json(
      { error: 'Error al obtener solicitudes de adopción' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para realizar una solicitud' },
        { status: 401 }
      );
    }

    if (session.user.role === UserRole.SHELTER) {
      return NextResponse.json(
        { error: 'Los albergues no pueden solicitar adopciones' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { petId, message } = body;

    if (!petId || typeof petId !== 'string') {
      return NextResponse.json(
        { error: 'ID de mascota inválido' },
        { status: 400 }
      );
    }

    if (message && (typeof message !== 'string' || message.length > 500)) {
      return NextResponse.json(
        { error: 'Mensaje debe ser una cadena de hasta 500 caracteres' },
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
        {
          error: 'Ya tienes una solicitud de adopción para esta mascota',
          status: existingAdoption.status,
        },
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
      include: {
        pet: {
          include: {
            shelter: {
              select: {
                id: true,
                name: true,
                municipality: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Solicitud de adopción enviada exitosamente',
        adoption: {
          id: adoption.id,
          petId: adoption.pet.id,
          petName: adoption.pet.name,
          shelter: adoption.pet.shelter,
          status: adoption.status,
          createdAt: adoption.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando solicitud de adopción:', error);
    return NextResponse.json(
      { error: 'Error al crear solicitud de adopción' },
      { status: 500 }
    );
  }
}

function isRecentUpdate(updatedAt: Date): boolean {
  const now = new Date();
  const diffInMs = now.getTime() - updatedAt.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours < 24;
}
