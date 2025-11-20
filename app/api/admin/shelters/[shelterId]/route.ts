import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { shelterId: string } }
) {
  try {
    const body = await request.json();
    const { action, rejectionReason } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { message: 'Acción inválida. Debe ser "approve" o "reject"' },
        { status: 400 }
      );
    }

    // Validar que si es rechazo, hay una razón
    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { message: 'Se requiere una razón de rechazo' },
        { status: 400 }
      );
    }

    // Buscar el albergue
    const shelter = await prisma.shelter.findUnique({
      where: { id: params.shelterId },
      include: { user: true },
    });

    if (!shelter) {
      return NextResponse.json(
        { message: 'Albergue no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar estado
    const updatedShelter = await prisma.shelter.update({
      where: { id: params.shelterId },
      data: {
        approvalStatus: action === 'approve' ? 'APPROVED' : 'REJECTED',
        verified: action === 'approve',
        rejectionReason: action === 'reject' ? rejectionReason : null,
      },
    });

    // TODO: Enviar email de notificación al usuario
    // TODO: Implementar logging de auditoría
    console.log(`Solicitud de ${shelter.user.email} - ${action === 'approve' ? 'APROBADA' : 'RECHAZADA'}`);

    return NextResponse.json({
      message: `Solicitud ${action === 'approve' ? 'aprobada' : 'rechazada'} correctamente`,
      shelter: updatedShelter,
    });
  } catch (error) {
    console.error('Error en PATCH /api/admin/shelters/[shelterId]:', error);
    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
