import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';

// GET - Listar todas las solicitudes de albergue
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // PENDING, APPROVED, REJECTED

    // Construir filtro
    const where: any = {};
    if (status) {
      where.approvalStatus = status;
    }

    // Obtener solicitudes
    const shelters = await prisma.shelter.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            municipality: true,
            address: true,
            idNumber: true,
            birthDate: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      count: shelters.length,
      shelters,
    });
  } catch (error) {
    console.error('Error en GET /api/admin/shelter-requests:', error);
    return NextResponse.json(
      { message: 'Error al obtener solicitudes' },
      { status: 500 }
    );
  }
}
