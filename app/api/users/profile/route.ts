import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

/**
 * GET, PUT /api/users/profile
 * Descripción: Obtiene y actualiza el perfil del usuario autenticado.
 * Requiere: Usuario autenticado.
 * Implementa: HU-003 (Actualización de perfil).
 */
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo define los endpoints para que un usuario autenticado pueda
 * gestionar su propio perfil. Permite tanto la obtención ('GET') de los
 * datos del perfil como su actualización ('PUT').
 *
 * Lógica Clave:
 * - 'Autenticación Central': Ambas funciones ('GET' y 'PUT') comienzan
 *   verificando la existencia de una sesión de usuario válida. Si no hay
 *   sesión, se deniega el acceso con un error '401 Unauthorized'.
 * - 'Endpoint GET':
 *   - Se encarga de obtener y devolver los datos del perfil del usuario
 *     autenticado.
 *   - Utiliza 'prisma.user.findUnique' para buscar al usuario por el ID
 *     almacenado en la sesión.
 *   - El objeto 'select' se utiliza para excluir explícitamente el campo
 *     de la contraseña y otros datos sensibles, asegurando que solo se
 *     devuelva información segura al cliente.
 * - 'Endpoint PUT':
 *   - Permite al usuario actualizar los campos de su perfil.
 *   - 'Reutilización de Esquema Zod': En lugar de definir un nuevo
 *     esquema, reutiliza 'registerUserSchema' y usa el método '.pick'
 *     para crear dinámicamente un esquema de validación que solo incluye
 *     los campos que el usuario puede modificar (nombre, teléfono, etc.).
 *     Esto evita que campos sensibles como el 'email' o la 'password'
 *     puedan ser alterados a través de este endpoint.
 *   - 'Actualización Segura': Utiliza 'prisma.user.update' con una
 *     cláusula 'where' que apunta al ID del usuario en sesión, garantizando
 *     que los usuarios solo puedan modificar su propio perfil.
 *
 * Dependencias Externas:
 * - 'next-auth': Es fundamental para obtener la sesión del usuario y
 *   proteger ambos endpoints.
 * - 'zod': Se utiliza en el endpoint 'PUT' para validar los datos de
 *   entrada y asegurar que cumplan con las reglas de negocio (ej: edad
 *   mínima de 18 años).
 * - '@prisma/client': Para interactuar con la base de datos y realizar
 *   las operaciones de lectura y escritura del perfil.
 *
 */
