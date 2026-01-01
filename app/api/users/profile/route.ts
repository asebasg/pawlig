import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { registerUserSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

/**
 * PUT /api/users/profile
 * Actualizar perfil de usuario adoptante
 * Requiere: Usuario autenticado
 * Implementa: HU-003 (Actualización de perfil)
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

    // Verificar que la cuenta esté activa (seguridad adicional)
    if (session.user.isActive === false) {
      return NextResponse.json(
        { error: 'Cuenta bloqueada. No puedes actualizar tu perfil.' },
        { status: 403 }
      );
    }

    // Parsear datos del request
    const body = await request.json();

    // Crear schema de validación para actualización (sin password ni email)
    const updateUserSchema = registerUserSchema.pick({
      name: true,
      phone: true,
      municipality: true,
      address: true,
      idNumber: true,
      birthDate: true,
    });

    // Validar datos con Zod (incluye validación de edad 18+)
    const validatedData = updateUserSchema.parse(body);

    // Actualizar usuario en MongoDB
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        municipality: validatedData.municipality,
        address: validatedData.address,
        idNumber: validatedData.idNumber,
        birthDate: new Date(validatedData.birthDate),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        municipality: true,
        address: true,
        idNumber: true,
        birthDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Perfil actualizado exitosamente',
        user: updatedUser,
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

    // Manejo de error: usuario no encontrado
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el perfil' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users/profile
 * Obtener información del perfil del usuario autenticado
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

    // Obtener perfil del usuario
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        municipality: true,
        address: true,
        idNumber: true,
        birthDate: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Error al obtener el perfil' },
      { status: 500 }
    );
  }
}
