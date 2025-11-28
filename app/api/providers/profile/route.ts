import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { vendorProfileUpdateSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

/**
 * @deprecated Esta ruta está deprecada. Usa /api/vendors/profile en su lugar.
 * PUT /api/providers/profile
 * Actualizar perfil de proveedor (vendor)
 * Requiere: Usuario autenticado con rol VENDOR
 * Implementa: HU-003 (Actualización de perfil)
 * 
 * NOTA: Esta ruta se mantiene por compatibilidad hacia atrás.
 * Se recomienda migrar a /api/vendors/profile
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticación
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar rol de proveedor
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'Solo vendedores pueden acceder a este recurso' },
        { status: 403 }
      );
    }

    // Verificar que la cuenta esté activa (seguridad adicional)
    if (session.user.isActive === false) {
      return NextResponse.json(
        { error: 'Cuenta bloqueada. No puedes actualizar tu perfil.' },
        { status: 403 }
      );
    }

    // Parsear datos del request
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = vendorProfileUpdateSchema.parse(body);

    // Actualizar perfil del proveedor
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
    // Manejo de errores de validación Zod
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

    // Manejo de error: perfil no encontrado
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Perfil de vendedor no encontrado' },
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
 * @deprecated Esta ruta está deprecada. Usa /api/vendors/profile en su lugar.
 * GET /api/providers/profile
 * Obtener información del perfil del proveedor autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar autenticación
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar rol de proveedor
    if (session.user.role !== 'VENDOR') {
      return NextResponse.json(
        { error: 'Solo vendedores pueden acceder a este recurso' },
        { status: 403 }
      );
    }

    // Obtener perfil del proveedor
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
        { error: 'Perfil de vendedor no encontrado' },
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
