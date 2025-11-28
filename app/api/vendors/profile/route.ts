import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { vendorProfileUpdateSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

/**
 * PUT /api/vendors/profile
 * Actualizar perfil de vendor
 * Requiere: Usuario autenticado con rol VENDOR
 * Implementa: HU-003 (Actualización de perfil)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'Solo vendors pueden acceder a este recurso' },
        { status: 403 }
      );
    }

    // Validar cuenta activa
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isActive: true },
    });

    if (!user?.isActive) {
      return NextResponse.json(
        { error: 'Cuenta bloqueada. Contacta al administrador' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = vendorProfileUpdateSchema.parse(body);

    const updatedVendor = await prisma.vendor.update({
      where: { userId: session.user.id },
      data: {
        businessName: validatedData.businessName,
        businessPhone: validatedData.businessPhone,
        description: validatedData.description,
        logo: validatedData.logo,
        municipality: validatedData.municipality,
        address: validatedData.address,
      },
      select: {
        id: true,
        businessName: true,
        businessPhone: true,
        description: true,
        logo: true,
        municipality: true,
        address: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Perfil actualizado exitosamente',
        vendor: updatedVendor,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue: any) => {
        const field = issue.path[0];
        if (typeof field === 'string') {
          fieldErrors[field] = issue.message;
        }
      });

      return NextResponse.json(
        {
          error: 'Errores de validación',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Perfil de vendor no encontrado' },
        { status: 404 }
      );
    }

    console.error('Error updating vendor profile:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/vendors/profile
 * Obtener información del perfil del vendor autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'Solo vendors pueden acceder a este recurso' },
        { status: 403 }
      );
    }

    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        businessName: true,
        businessPhone: true,
        description: true,
        logo: true,
        municipality: true,
        address: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Perfil de vendor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}
