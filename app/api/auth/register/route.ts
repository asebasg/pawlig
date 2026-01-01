import { NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';
import { hashPassword } from '@/lib/auth/password';
import { registerUserSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

/**
 * POST /api/auth/register
 * Endpoint para registrar un nuevo usuario adoptante (RF-001, HU-001)
 * 
 * MEJORAS APLICADAS:
 * - Código de error específico para email duplicado
 * - Metadata adicional en respuestas de error
 * - Sugerencia de recuperación de contraseña
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
            // Si la cuenta está bloqueada, mostrar mensaje de bloqueo
            if (!existingUser.isActive) {
                return NextResponse.json(
                    {
                        error: `Cuenta bloqueada. Contacta con soporte para más información`,
                        code: 'ACCOUNT_BLOCKED',
                        suggestion: 'Contacta con soporte para resolver el bloqueo de tu cuenta.',
                    },
                    { status: 403 } // 403 = forbidden
                );
            }

            // Si la cuenta está activa, mostrar mensaje de correo en uso
            return NextResponse.json(
                {
                    error: 'El correo ya está registrado',
                    code: 'EMAIL_ALREADY_EXISTS',
                    suggestion: '¿Olvidaste tu contraseña? Puedes recuperarla aquí.',
                    recoveryUrl: '/forgot-password',
                },
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
                    code: 'VALIDATION_ERROR',
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
        // Esto es un fallback por si el check manual del paso 3 falla
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                {
                    error: 'El correo o número de identificación ya están registrados',
                    code: 'DUPLICATE_DATA',
                    suggestion: 'Verifica tus datos o intenta recuperar tu contraseña',
                    recoveryUrl: '/forgot-password',
                },
                { status: 409 }
            );
        }

        // Error genérico del servidor
        console.error('Error en el registro:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                code: 'INTERNAL_ERROR',
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            },
            { status: 500 } // 500 Internal Server Error
        );
    }
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. CÓDIGOS DE ERROR:
 *    - EMAIL_ALREADY_EXISTS: Email duplicado (caso principal HU-001)
 *    - VALIDATION_ERROR: Errores de validación Zod
 *    - DUPLICATE_DATA: Otros datos duplicados (fallback)
 *    - INTERNAL_ERROR: Errores inesperados del servidor
 * 
 * 2. ESTRUCTURA DE RESPUESTA DE ERROR:
 *    {
 *      error: string,        // Mensaje para mostrar al usuario
 *      code: string,         // Código único para identificar el error
 *      suggestion?: string,  // Sugerencia opcional para el usuario
 *      recoveryUrl?: string, // URL para recuperación (si aplica)
 *      details?: any         // Detalles adicionales (solo en desarrollo)
 *    }
 * 
 * 3. STATUS CODES HTTP:
 *    - 201: Creación exitosa
 *    - 400: Datos inválidos (validación Zod)
 *    - 409: Conflicto (email/datos duplicados)
 *    - 500: Error interno del servidor
 * 
 * 4. SEGURIDAD:
 *    - Password hasheado con bcrypt (12 salt rounds)
 *    - Solo se retornan campos seguros (sin password)
 *    - Detalles de error solo visibles en desarrollo
 */