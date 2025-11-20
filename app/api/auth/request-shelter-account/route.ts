import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';
import { shelterApplicationSchema } from '@/lib/validations/user.schema';
import { hashPassword } from '@/lib/auth/password';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos con Zod
    const validatedData = shelterApplicationSchema.parse(body);

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(validatedData.password);

    // Crear usuario y albergue en una transacción
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        phone: validatedData.phone,
        municipality: validatedData.municipality,
        address: validatedData.address,
        idNumber: validatedData.idNumber,
        birthDate: new Date(validatedData.birthDate),
        role: 'SHELTER',
        shelter: {
          create: {
            name: validatedData.shelterName,
            municipality: validatedData.shelterMunicipality,
            address: validatedData.shelterAddress,
            description: validatedData.shelterDescription,
            contactWhatsApp: validatedData.contactWhatsApp,
            contactInstagram: validatedData.contactInstagram,
            // approvalStatus se pone en PENDING por defecto en el schema
          },
        },
      },
      include: {
        shelter: true,
      },
    });

    // Aquí iría la notificación al administrador (email, webhook, etc.)
    // TODO: Implementar notificación al administrador
    console.log(`Nueva solicitud de albergue: ${user.email} - ${user.shelter?.name}`);

    return NextResponse.json(
      {
        message: 'Solicitud de cuenta enviada exitosamente. Queda en estado "Pendiente de aprobación".',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      // Errores de validación
      const fieldErrors = error.issues.reduce((acc, err) => {
        const field = err.path.join('.');
        acc[field] = err.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(
        {
          message: 'Validación fallida. Por favor revisa los campos marcados.',
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    console.error('Error en POST /api/auth/request-shelter-account:', error);

    return NextResponse.json(
      { message: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
