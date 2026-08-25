import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";
import { z } from "zod";
import { hashResetToken, hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/validations/user.schema";

/**
 * POST /api/auth/reset-password
 * Descripción: Endpoint para actualizar la contraseña utilizando un token válido.
 * Requiere: token, password y passwordConfirm en el body.
 * Implementa: ISSUE-225
 */

const resetPayloadSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
}).and(resetPasswordSchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = resetPayloadSchema.parse(body);

    // Buscar token (hasheado) en la BD
    const hashedToken = hashResetToken(token);
    
    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    // Validar token existe, no usado, no expirado
    if (
      !resetTokenRecord ||
      resetTokenRecord.used ||
      resetTokenRecord.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 },
      );
    }

    // Hashear nueva contraseña
    const newHashedPassword = await hashPassword(password);

    // Transacción atómica
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetTokenRecord.userId },
        data: { password: newHashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error en reset-password:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Valida un token de recuperación y actualiza la contraseña del usuario.
 *
 * Lógica Clave:
 * - Hashea el token recibido en texto plano para buscarlo en la DB.
 * - Utiliza prisma.$transaction para garantizar consistencia atómica:
 *   actualiza la clave del usuario y marca el token como usado a la vez.
 *
 * Dependencias Externas:
 * - bcrypt (vía lib/auth/password) para el hasheo de la contraseña.
 *
 */
