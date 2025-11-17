import { NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';
import { hashPassword } from '@/lib/auth/password';
import { registerUserSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

/**
 * POST /api/auth/register
 * Endpoint para registrar un nuevo usuario adoptante (RF-001, HU-001)
 */

export async function POST(request: Request) {
    try {
        //  Parsear el body de la petición
        const body = await request.json();

        //  Validar datos con Zod (type-safe validation)
        // Si falla, lanza ZodError con detalles específicos
        const validatedData = registerUserSchema.parse(body);

        //  Verificar si el email ya existe en la base de datos
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este correo ya esta registrado' },
                { status: 409 } // 409 = conflict
            );
        }

        //  Hashear la contraseña antes de almacenarla (RNF-002)
        // Usa bcrypt con 12 salt rounds
        const hashedPassword = await hashPassword(validatedData.password);

        //  Crear el usuario en MongoDB
        const newUser = await prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
                name: validatedData.name,
                phone: validatedData.phone,
                municipality: validatedData.municipality,
                address: validatedData.address,
                idNumber: validatedData.idNumber,
                birthDate: new Date(validatedData.birthDate),
                role: 'ADOPTER', // Por defecto, todos los registros son adoptantes
            },
            select: {
                // Solo se retornan los campos seguros sin la contraseña
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        //  Retornar respuesta exitosa
        return NextResponse.json(
            {
                message: 'Usuario registrado exitosamente',
                user: newUser,
            },
            { status: 201 } // 201 = created
        );
    } catch (error) {

        //  Error de validaciones de Zod
        if (error instanceof ZodError) {
    return NextResponse.json(
        {
            error: 'Datos inválidos',
            details: error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        },
        { status: 400 } // 400 Bad Request
    );
}

        //  Error de Prisma (ej. violación de constraint único)
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                { error: 'El correo o número de identificación ya están registrados' },
                { status: 409 },
            );
        }

        //  Error genérico del servidor
        console.error('Error en el registro:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 } // 500 Internal Server Error
        );
    }
}