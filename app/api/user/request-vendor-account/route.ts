import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole } from '@prisma/client';
import { hashPassword } from '@/lib/auth/password';
import { vendorApplicationSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

export async function POST(request: Request) {
    try {
        //  Verificar sesión activa
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    error: 'No autenticado',
                    code: 'UNAUTHORIZED',
                    message: 'Debes iniciar sesión para solicitar una cuenta de vendedor',
                },
                { status: 401 }
            );
        }

        //  Solo ADOPTER puede solicitar cuenta de vendedor
        const allowedRoles: UserRole[] = [UserRole.ADOPTER];
        if (!allowedRoles.includes(session.user.role as UserRole)) {
            return NextResponse.json(
                {
                    error: 'No autorizado',
                    code: 'FORBIDDEN',
                    message: 'Solo usuarios adoptantes pueden solicitar cuentas de vendedor',
                    currentRole: session.user.role,
                },
                { status: 403 }
            );
        }

        //  1. Parsear el body de la petición
        const body = await request.json();

        //  2. Validar datos con Zod
        const validatedData = vendorApplicationSchema.parse(body);

        //  3. Verificar si el usuario actual ya tiene una solicitud de vendedor (o es vendor)
        // Check if Vendor record exists for this user
        const existingVendorRequest = await prisma.vendor.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        if (existingVendorRequest) {
            if (existingVendorRequest.verified) {
                return NextResponse.json(
                    { error: 'Ya eres un vendedor verificado', code: 'ALREADY_VENDOR' },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                {
                    error: 'Ya tienes una solicitud de vendedor pendiente',
                    code: 'PENDING_REQUEST_EXISTS',
                    message: 'Tu solicitud está siendo revisada por un administrador',
                },
                { status: 409 }
            );
        }

        //  4. Hashear la contraseña (si se envió una nueva, aunque el form la pide, 
        //     podríamos optar por solo validarla si es cambio, pero aquí asumimos 
        //     que es confirmación o actualización)
        //     NOTA: El formulario pide password. Si es la misma, se re-hashea.
        const hashedPassword = await hashPassword(validatedData.password);

        //  5. Transacción: Actualizar User y Crear Vendor
        const newVendorAccount = await prisma.$transaction(async (tx) => {
            // Actualizar usuario existente con nuevos datos (SIN cambiar rol)
            // Se actualizan datos personales para asegurar consistencia
            const user = await tx.user.update({
                where: { id: session.user.id },
                data: {
                    password: hashedPassword,
                    name: validatedData.name,
                    phone: validatedData.phone,
                    municipality: validatedData.municipality,
                    address: validatedData.address,
                    idNumber: validatedData.idNumber,
                    birthDate: new Date(validatedData.birthDate),
                    // Mantener rol actual (ADOPTER)
                },
            });

            // Crear registro de vendedor (sin verificar)
            const vendor = await tx.vendor.create({
                data: {
                    businessName: validatedData.businessName,
                    businessPhone: validatedData.businessPhone,
                    description: validatedData.businessDescription,
                    municipality: validatedData.businessMunicipality,
                    address: validatedData.businessAddress,
                    verified: false, // Pendiente de aprobación
                    userId: user.id,
                },
            });

            return { user, vendor };
        });

        //  6. Retornar respuesta exitosa
        return NextResponse.json(
            {
                message: 'Solicitud enviada exitosamente',
                code: 'REQUEST_SUBMITTED',
                data: {
                    businessName: newVendorAccount.vendor.businessName,
                    status: 'pending',
                },
            },
            { status: 201 }
        );
    } catch (error) {
        // Manejar errores de validación de Zod
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Datos inválidos',
                    code: 'VALIDATION_ERROR',
                    details: error.issues.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        // Error genérico del servidor
        console.error('Error en solicitud de vendedor:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR',
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}
