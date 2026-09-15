import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";
import { hashPassword } from "@/lib/auth/password";
import { registerUserSchema } from "@/lib/validations/user.schema";
import { ZodError } from "zod";

/**
 * POST /api/auth/register
 * Descripción: Registro de nuevos usuarios adoptantes con validación tipada y contraseñas hasheadas.
 * Requiere: Request body con estructura validada por registerUserSchema.
 * Implementa: RF-001, HU-001
 */
export async function POST(request: Request) {
  try {
    // 1. Parsear el body de la petición
    const body: unknown = await request.json();

    // 2. Validar datos con Zod (type-safe validation)
    const validatedData = registerUserSchema.parse(body);

    // 3. Verificar si el email ya existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      // Si la cuenta está bloqueada, mostrar mensaje de bloqueo
      if (!existingUser.isActive) {
        return NextResponse.json(
          {
            error: "Cuenta bloqueada. Contacta con soporte para más información",
            code: "ACCOUNT_BLOCKED",
            suggestion: "Contacta con soporte para resolver el bloqueo de tu cuenta.",
          },
          { status: 403 }
        );
      }

      // Si la cuenta está activa, mostrar mensaje de correo en uso
      return NextResponse.json(
        {
          error: "El correo ya está registrado",
          code: "EMAIL_ALREADY_EXISTS",
          suggestion: "¿Olvidaste tu contraseña? Puedes recuperarla aquí.",
          recoveryUrl: "/forgot-password",
        },
        { status: 409 }
      );
    }

    // 4. Hashear la contraseña antes de almacenarla (RNF-002)
    const hashedPassword = await hashPassword(validatedData.password);

    // 5. Crear el usuario en MongoDB
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
        role: "ADOPTER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // 6. Retornar respuesta exitosa
    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Error de validaciones de Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          code: "VALIDATION_ERROR",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Error de Prisma (ej. violación de constraint único)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          error: "El correo o número de identificación ya están registrados",
          code: "DUPLICATE_DATA",
          suggestion: "Verifica tus datos o intenta recuperar tu contraseña",
          recoveryUrl: "/forgot-password",
        },
        { status: 409 }
      );
    }

    // Error genérico del servidor
    console.error("Error en el registro:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        code: "INTERNAL_ERROR",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
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
 * Endpoint encargado de registrar usuarios adoptantes en PawLig asegurando la integridad
 * y el hashing de credenciales.
 *
 * Lógica Clave:
 * - Validación Zod: registerUserSchema valida de forma estricta los datos recibidos.
 * - Validación de duplicidad: Verifica si el correo ya se encuentra registrado o bloqueado.
 * - Encriptación de contraseñas: Emplea hashPassword con bcrypt (12 salt rounds) antes de persistir.
 * - Manejo exhaustivo de errores: Normaliza errores de Zod, duplicados y excepciones internas sin filtrar datos sensibles.
 *
 * Dependencias Externas:
 * - prisma: ORM para la persistencia en MongoDB.
 * - Zod: Validación de esquemas de datos.
 *
 */