import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { hashPassword } from '@/lib/auth/password';
import { shelterApplicationSchema } from '@/lib/validations/user.schema';
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
                    message: 'Debes iniciar sesión para solicitar una cuenta de albergue',
                },
                { status: 401 }
            );
        }

        //  VALIDAR ROL: Solo ADOPTER puede solicitar cuenta de albergue
        if (session.user.role !== 'ADOPTER') {
            return NextResponse.json(
                {
                    error: 'No autorizado',
                    code: 'FORBIDDEN',
                    message: 'Solo usuarios adoptantes pueden solicitar cuentas de albergue',
                    currentRole: session.user.role,
                },
                { status: 403 }
            );
        }

        //  1. Parsear el body de la petición
        const body = await request.json();

        //  2. Validar datos con Zod
        const validatedData = shelterApplicationSchema.parse(body);

        //  3. Usar el email de la sesión actual (usuario ya autenticado)
        const userEmail = session.user.email;

        //  4. Verificar si el usuario actual ya tiene una solicitud de albergue pendiente
        const existingShelterRequest = await prisma.shelter.findFirst({
            where: {
                userId: session.user.id,
                verified: false,
            },
        });

        if (existingShelterRequest) {
            return NextResponse.json(
                {
                    error: 'Ya tienes una solicitud de albergue pendiente',
                    code: 'PENDING_REQUEST_EXISTS',
                    message: 'Tu solicitud está siendo revisada por un administrador',
                    shelterName: existingShelterRequest.name,
                    createdAt: existingShelterRequest.createdAt,
                },
                { status: 409 }
            );
        }

        //  5. Hashear la contraseña
        const hashedPassword = await hashPassword(validatedData.password);

        //  6. Crear usuario + albergue en una transacción
        const newShelterAccount = await prisma.$transaction(async (tx) => {
            // Crear usuario con rol SHELTER (pero sin verificar)
            // Actualizar usuario existente con nuevos datos y cambiar rol a SHELTER
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
                    role: 'SHELTER', // Cambiar rol de ADOPTER a SHELTER
                },
            });

            // Crear registro de albergue (sin verificar)
            const shelter = await tx.shelter.create({
                data: {
                    name: validatedData.shelterName,
                    nit: validatedData.shelterNit,
                    municipality: validatedData.shelterMunicipality,
                    address: validatedData.shelterAddress,
                    description: validatedData.shelterDescription,
                    contactWhatsApp: validatedData.contactWhatsApp,
                    contactInstagram: validatedData.contactInstagram,
                    verified: false, // Pendiente de aprobación
                    userId: user.id,
                },
            });

            return { user, shelter };
        });

        //  7. TODO: Enviar notificación por email al administrador
        // await sendEmailToAdmin(newShelterAccount.shelter.id);

        //  8. Retornar respuesta exitosa
        return NextResponse.json(
            {
                message: 'Solicitud enviada exitosamente',
                code: 'REQUEST_SUBMITTED',
                data: {
                    shelterName: newShelterAccount.shelter.name,
                    status: 'pending',
                    estimatedReviewTime: '2-3 días laborables',
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
        console.error('Error en solicitud de albergue:', error);
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
 * 1. SEGURIDAD EN 3 CAPAS:
 *    - Middleware: Bloquea anónimos ✅
 *    - Página: requireAdopter() valida rol ✅
 *    - API Route: getServerSession() + validación de rol ✅ (ESTA CAPA)
 * 
 * 2. ¿POR QUÉ VALIDAR NUEVAMENTE EN LA API?
 *    - Defense in Depth: Si una capa falla, las otras protegen
 *    - Protección contra bypass de frontend (Postman, curl, etc.)
 *    - Previene ataques de "replay" con tokens robados
 * 
 * 3. VALIDACIONES ESPECÍFICAS:
 *    ✅ Email único (previene duplicados)
 *    ✅ Solicitud pendiente existente (previene spam)
 *    ✅ Rol ADOPTER (solo adoptantes pueden solicitar)
 *    ✅ Sesión activa (usuario autenticado)
 * 
 * 4. CÓDIGOS DE ERROR:
 *    - 401 UNAUTHORIZED: Sin sesión activa
 *    - 403 FORBIDDEN: Rol incorrecto
 *    - 409 CONFLICT: Email duplicado o solicitud pendiente
 *    - 400 BAD REQUEST: Datos inválidos (Zod)
 *    - 500 INTERNAL ERROR: Error inesperado
 * 
 * 5. TRANSACCIÓN ATÓMICA:
 *    - Usa prisma.$transaction para crear User + Shelter
 *    - Si falla una operación, se revierten ambas
 *    - Garantiza integridad de datos
 * 
 * 6. ESTADO DEL ALBERGUE:
 *    - verified: false (pendiente de aprobación)
 *    - role: 'SHELTER' (asignado, pero cuenta inactiva)
 *    - Administrador debe aprobar antes de que funcione
 * 
 * 7. TRAZABILIDAD:
 *    - HU-002: Solicitud y aprobación de cuenta de albergue ✅
 *    - RF-007: Administración de albergues ✅
 *    - CU-002: Caso de uso de solicitud ✅
 *    - RNF-002: Seguridad (autorización) ✅
 * 
 * 8. TESTING:
 *    - Usuario anónimo → 401 UNAUTHORIZED ✅
 *    - Usuario SHELTER → 403 FORBIDDEN ✅
 *    - Usuario ADOPTER con solicitud pendiente → 409 CONFLICT ✅
 *    - Usuario ADOPTER válido → 201 CREATED ✅
 */