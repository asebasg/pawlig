import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import { petCreateSchema } from '@/lib/validations/pet.schema';
import { ZodError } from 'zod';

/**
 * Endpoint para crear mascotas
 * Implementa HU-005, TAREA-014
 * 
 * POST /api/pets
 * - Crear mascota (solo SHELTER)
 * - Integracion con Cloudinary para fotos
 * - Validación de datos con Zod
 */

export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        {
          error: 'No autenticado',
          code: 'UNAUTHORIZED',
          message: 'Debes iniciar sesión para crear una mascota',
        },
        { status: 401 }
      );
    }

    // 2. Verificar rol (solo SHELTER puede crear mascotas)
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        {
          error: 'Acceso denegado',
          code: 'FORBIDDEN',
          message: 'Solo usuarios con rol SHELTER pueden crear mascotas',
          userRole: session.user.role,
        },
        { status: 403 }
      );
    }

    // 3. Verificar que el usuario tiene un albergue
    const shelter = await prisma.shelter.findFirst({
      where: { userId: session.user.id },
      select: { id: true, verified: true },
    });

    if (!shelter) {
      return NextResponse.json(
        {
          error: 'Sin albergue',
          code: 'SHELTER_NOT_FOUND',
          message: 'Debes tener un albergue registrado para crear mascotas',
        },
        { status: 404 }
      );
    }

    // 4. Parsear y validar datos
    const body = await request.json();
    const validatedData = petCreateSchema.parse(body);

    // 5. Crear mascota
    const newPet = await prisma.pet.create({
      data: {
        name: validatedData.name,
        species: validatedData.species,
        breed: validatedData.breed || null,
        age: validatedData.age || null,
        sex: validatedData.sex || null,
        description: validatedData.description,
        requirements: validatedData.requirements || null,
        images: validatedData.images || [],
        status: 'AVAILABLE', // Estado por defecto
        shelterId: shelter.id,
      },
      include: {
        shelter: {
          select: {
            id: true,
            name: true,
            municipality: true,
            contactWhatsApp: true,
            contactInstagram: true,
          },
        },
      },
    });

    // 6. Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: 'Mascota creada exitosamente',
        code: 'PET_CREATED',
        data: newPet,
      },
      { status: 201 }
    );
  } catch (error) {
    // Manejo de errores de validación Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Error de Prisma
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('Error de Prisma al crear mascota:', error);
      return NextResponse.json(
        {
          error: 'Error al crear mascota',
          code: 'DATABASE_ERROR',
        },
        { status: 500 }
      );
    }

    // Error genérico del servidor
    console.error('Error al crear mascota:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. AUTENTICACIÓN Y AUTORIZACIÓN:
 *    - Solo SHELTER puede crear mascotas
 *    - Usuario debe estar registrado con rol SHELTER
 *    - Se verifica que existe albergue asociado
 * 
 * 2. VALIDACIÓN:
 *    - Zod en cliente y servidor
 *    - Campos requeridos: name, species, description
 *    - Campos opcionales: breed, age, sex, requirements, images
 * 
 * 3. IMÁGENES:
 *    - URLs de Cloudinary (subidas desde frontend)
 *    - Array de strings (URLs completas)
 *    - Mínimo 1, máximo 10 imágenes
 * 
 * 4. ESTADO INICIAL:
 *    - Las mascotas inician en estado AVAILABLE
 *    - Pueden cambiar a IN_PROCESS o ADOPTED luego
 * 
 * 5. RELACIONES:
 *    - Cada mascota pertenece a un shelter
 *    - Se incluyen datos del shelter en la respuesta
 * 
 * 6. RESPUESTA:
 *    - 201 Created: Mascota creada exitosamente
 *    - 400 Bad Request: Datos inválidos (Zod)
 *    - 401 Unauthorized: No autenticado
 *    - 403 Forbidden: No es SHELTER
 *    - 404 Not Found: Sin albergue registrado
 *    - 500 Internal Server Error: Error de BD
 */
