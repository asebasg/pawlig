import { NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/db';
import { hashPassword } from '@/lib/auth/password';
import { shelterApplicationSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

export async function POST(request: Request) {
    try {
        //  1. Parsear el body de la petición
        const body = await request.json();

        //  2. Validar datos con Zod (type-safe validation)
        const validatedData = shelterApplicationSchema.parse(body);

        //  3️. Verificar si el email ya existe en la base de datos
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'El correo ya está registrado',
                    code: 'EMAIL_ALREADY_EXISTS',
                    suggestion: '¿Olvidaste tu contraseña? Puedes recuperarla aquí.',
                    recoveryUrl: '/forgot-password',
                },
                { status: 409 }
            );
        }

        //  4️. Verificar si el NIT ya existe (evita albergues duplicados)
        if (validatedData.shelterNit) {
            const existingShelter = await prisma.shelter.findFirst({
                where: { nit: validatedData.shelterNit },
            });

            if (existingShelter) {
                return NextResponse.json(
                    {
                        error: 'Ya existe un albergue registrado con este NIT',
                        code: 'NIT_ALREADY_EXISTS',
                        suggestion: 'Verifica el NIT o contacta al administrador si crees que es un error.',
                    },
                    { status: 409 }
                );
            }
        }

        //  5️. Hashear la contraseña antes de almacenarla (RNF-002)
        const hashedPassword = await hashPassword(validatedData.password);

        //  6️. TRANSACCIÓN: Crear usuario Y albergue en una sola operación atómica
        const result = await prisma.$transaction(async (tx) => {
            // Crear el usuario con rol SHELTER
            const newUser = await tx.user.create({
                data: {
                    email: validatedData.email,
                    password: hashedPassword,
                    name: validatedData.name,
                    phone: validatedData.phone,
                    municipality: validatedData.municipality,
                    address: validatedData.address,
                    idNumber: validatedData.idNumber,
                    birthDate: new Date(validatedData.birthDate),
                    role: 'SHELTER', // Rol específico de albergue
                },
            });

            // Crear el registro de Shelter con verified = false (ESTADO INICIAL)
            const newShelter = await tx.shelter.create({
                data: {
                    userId: newUser.id,
                    name: validatedData.shelterName,
                    nit: validatedData.shelterNit,
                    municipality: validatedData.shelterMunicipality,
                    address: validatedData.shelterAddress,
                    description: validatedData.shelterDescription,
                    contactWhatsApp: validatedData.contactWhatsApp,
                    contactInstagram: validatedData.contactInstagram,
                    verified: false, // ⚠️ ESTADO INICIAL: Pendiente de aprobación (RN-004)
                    rejectionReason: null,
                },
            });

            return { user: newUser, shelter: newShelter };
        });

        //  7️. TODO: Enviar notificación al administrador (implementar en Sprint futuro)
        // - Email al admin con link directo a /admin/shelter-requests
        // - Datos del albergue para revisión rápida
        // Por ahora, se simula con un log
        console.log('📧 [NOTIFICACIÓN ADMIN] Nueva solicitud de albergue:', {
            shelterName: validatedData.shelterName,
            representativeName: validatedData.name,
            email: validatedData.email,
            municipality: validatedData.shelterMunicipality,
            shelterId: result.shelter.id,
        });

        //  8️. Retornar respuesta exitosa al solicitante
        return NextResponse.json(
            {
                message: 'Solicitud de albergue enviada exitosamente',
                status: 'PENDING_APPROVAL', // Estado explícito para el frontend
                details: {
                    email: result.user.email,
                    shelterName: result.shelter.name,
                    estimatedReviewTime: '2-3 días laborables',
                },
                nextSteps: [
                    'Tu solicitud será revisada por un administrador',
                    'Recibirás un correo electrónico con la decisión',
                    'Si es aprobada, podrás iniciar sesión inmediatamente',
                ],
            },
            { status: 201 } // 201 = Created
        );
    } catch (error) {
        //  9️. Manejo de errores de validación de Zod
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

        //  10. Error de Prisma (violación de constraint único)
        if (error instanceof Error && error.message.includes('Unique constraint')) {
            return NextResponse.json(
                {
                    error: 'El correo o NIT ya están registrados',
                    code: 'DUPLICATE_DATA',
                    suggestion: 'Verifica tus datos o contacta al administrador',
                },
                { status: 409 }
            );
        }

        //  11. Error genérico del servidor
        console.error('❌ Error en solicitud de albergue:', error);
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

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. ESTADO INICIAL (verified = false):
 *    - Cumple con RN-004: Aprobación requerida por administrador
 *    - El albergue NO puede publicar mascotas hasta ser verificado
 *    - Estado explícito para tracking del proceso
 * 
 * 2. TRANSACCIÓN ATÓMICA:
 *    - prisma.$transaction garantiza que User y Shelter se crean juntos
 *    - Si falla cualquiera, se hace rollback completo
 *    - Evita usuarios huérfanos sin albergue asociado
 * 
 * 3. VALIDACIÓN DE NIT (NUEVO):
 *    - Evita múltiples albergues con el mismo NIT
 *    - Cumple con integridad de datos legales
 *    - Código de error específico: NIT_ALREADY_EXISTS
 * 
 * 4. FLUJO DE APROBACIÓN (HU-002):
 *    Paso 1: Solicitud enviada (verified = false) ← ESTE ARCHIVO
 *    Paso 2: Admin revisa solicitud → /api/admin/shelter-requests
 *    Paso 3: Admin aprueba/rechaza → /api/admin/shelters/[shelterId]
 *    Paso 4: Notificación al solicitante (email)
 *    Paso 5: Albergue accede a su panel (si aprobado)
 * 
 * 5. RESPUESTA ESTRUCTURADA:
 *    - message: Confirmación visual
 *    - status: 'PENDING_APPROVAL' para lógica del frontend
 *    - nextSteps: Guía clara para el usuario
 *    - estimatedReviewTime: Expectativa realista (Manual del Usuario)
 * 
 * 6. CÓDIGOS DE ERROR:
 *    - EMAIL_ALREADY_EXISTS: Email duplicado
 *    - NIT_ALREADY_EXISTS: NIT duplicado (nuevo)
 *    - VALIDATION_ERROR: Errores de validación Zod
 *    - DUPLICATE_DATA: Otros datos duplicados (fallback)
 *    - INTERNAL_ERROR: Errores inesperados del servidor
 * 
 * 7. SEGURIDAD:
 *    - Password hasheado con bcrypt (12 salt rounds)
 *    - Validación estricta con Zod antes de DB
 *    - No se retorna password en respuesta
 *    - Transacción atómica previene estados inconsistentes
 * 
 * 8. TRAZABILIDAD:
 *    - RF-007: Administración de albergues ✅
 *    - HU-002: Solicitud y aprobación de cuenta ✅
 *    - CU-002: Caso de uso completo ✅
 *    - RN-004: Aprobación requerida ✅
 */
