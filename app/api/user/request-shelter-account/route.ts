import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { UserRole } from '@prisma/client';
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

        //  Solo ADOPTER y VENDOR pueden solicitar cuenta de albergue
        const allowedRoles: UserRole[] = [UserRole.ADOPTER, UserRole.VENDOR];
        if (!allowedRoles.includes(session.user.role as UserRole)) {
            return NextResponse.json(
                {
                    error: 'No autorizado',
                    code: 'FORBIDDEN',
                    message: 'Solo usuarios adoptantes o vendedores pueden solicitar cuentas de albergue',
                    currentRole: session.user.role,
                },
                { status: 403 }
            );
        }

        //  1. Parsear el body de la petición
        const body = await request.json();

        //  2. Validar datos con Zod
        const validatedData = shelterApplicationSchema.parse(body);

        //  3. (Paso eliminado) - userEmail verificado via session


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

        //  6. NO cambiar rol a SHELTER hasta aprobación
        const newShelterAccount = await prisma.$transaction(async (tx) => {
            // Actualizar usuario existente con nuevos datos (SIN cambiar rol)
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
                    // Mantener rol actual (ADOPTER o VENDOR)
                    // NO cambiar a SHELTER hasta aprobación
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
 * 📚 CAMBIOS IMPLEMENTADOS:
 * 
 * 1. NO asignar rol SHELTER automáticamente
 *    - Eliminada línea: role: 'SHELTER'
 *    - Usuario mantiene rol actual (ADOPTER o VENDOR)
 *    - Solo cambiará a SHELTER cuando admin apruebe
 * 
 * 2. Solo ADOPTER y VENDOR pueden solicitar
 *    - Validación: allowedRoles = ['ADOPTER', 'VENDOR']
 *    - SHELTER rechazado: Ya es albergue
 *    - ADMIN rechazado: No necesita ser albergue
 * 
 * 3. Seguridad reforzada:
 *    - Triple validación: Middleware + Página + API
 *    - Mensaje de error específico por rol
 *    - Status 403 FORBIDDEN para roles no permitidos
 * 
 * 4. Flujo corregido:
 *    Estado Inicial (ADOPTER/VENDOR):
 *      - Solicita cuenta de albergue
 *      - Registro Shelter creado (verified: false)
 *      - Usuario mantiene rol actual
 *    
 *    Admin Aprueba:
 *      - Shelter.verified → true
 *      - User.role → SHELTER (en PATCH /admin/shelters/[id])
 *      - Usuario puede acceder a /shelter
 * 
 * 5. Trazabilidad:
 *    - NO asignar rol automáticamente ✅
 *    - Solo ADOPTER y VENDOR ✅
 *    - HU-002: Solicitud de cuenta de albergue ✅
 *    - RNF-002: Seguridad (autorización) ✅
 */