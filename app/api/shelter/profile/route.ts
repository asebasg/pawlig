import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { shelterProfileUpdateSchema } from '@/lib/validations/user.schema';
import { ZodError } from 'zod';

/**
 * PUT /api/shelter/profile
 * Actualizar perfil de albergue
 * Requiere: Usuario autenticado con rol SHELTER
 * Implementa: Módulo de perfiles unificado
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        if (session.user.role !== 'SHELTER') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        if (session.user.isActive === false) {
            return NextResponse.json(
                { error: 'Cuenta bloqueada. No puedes actualizar tu perfil.' },
                { status: 403 }
            );
        }

        const shelterId = session.user.shelterId as string;
        if (!shelterId) {
            return NextResponse.json({ error: 'Albergue no encontrado' }, { status: 404 });
        }

        const body = await request.json();
        const validatedData = shelterProfileUpdateSchema.parse(body);

        const updatedShelter = await prisma.shelter.update({
            where: { id: shelterId },
            data: {
                name: validatedData.name,
                description: validatedData.description,
                municipality: validatedData.municipality,
                address: validatedData.address,
                contactWhatsApp: validatedData.contactWhatsApp,
                contactInstagram: validatedData.contactInstagram,
            },
            select: {
                id: true,
                name: true,
                description: true,
                municipality: true,
                address: true,
                contactWhatsApp: true,
                contactInstagram: true,
                verified: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Perfil de albergue actualizado exitosamente',
                shelter: updatedShelter,
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.issues.forEach((issue) => {
                const field = issue.path[0];
                if (typeof field === 'string') {
                    fieldErrors[field] = issue.message;
                }
            });

            return NextResponse.json(
                { error: 'Errores de validación', details: fieldErrors },
                { status: 400 }
            );
        }

        if (error instanceof Error && error.message.includes('Record to update not found')) {
            return NextResponse.json({ error: 'Albergue no encontrado' }, { status: 404 });
        }

        console.error('Error updating shelter profile:', error);
        return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 });
    }
}

/**
 * GET /api/shelter/profile
 * Obtener información del perfil del albergue autenticado
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        if (session.user.role !== 'SHELTER') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const shelterId = session.user.shelterId as string;
        if (!shelterId) {
            return NextResponse.json({ error: 'Albergue no encontrado' }, { status: 404 });
        }

        const shelter = await prisma.shelter.findUnique({
            where: { id: shelterId },
            select: {
                id: true,
                name: true,
                description: true,
                municipality: true,
                address: true,
                contactWhatsApp: true,
                contactInstagram: true,
                verified: true,
                updatedAt: true,
            },
        });

        if (!shelter) {
            return NextResponse.json({ error: 'Albergue no encontrado' }, { status: 404 });
        }

        return NextResponse.json(shelter);
    } catch (error) {
        console.error('Error fetching shelter profile:', error);
        return NextResponse.json({ error: 'Error al obtener el perfil' }, { status: 500 });
    }
}
