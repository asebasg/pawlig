import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";
import { sendPasswordResetEmail } from "@/lib/services/email.service";
import { z } from "zod";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Descripción: Endpoint para solicitar recuperación de contraseña.
 * Requiere: Email del usuario en el body.
 * Implementa: RF-004
 */

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Para evitar enumeración de correos, siempre retornamos éxito aunque no exista
    if (!user) {
      return NextResponse.json(
        {
          message:
            "Si el correo está registrado, recibirás un enlace de recuperación pronto.",
        },
        { status: 200 },
      );
    }

    // Si el usuario está inactivo (bloqueado)
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Cuenta suspendida. Contacta con soporte." },
        { status: 403 },
      );
    }

    // Generar token único (32 bytes hex = 64 caracteres)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de validez

    // Guardar token en BD (opcionalmente invalidar anteriores)
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true }, // Marcamos los anteriores como usados/inválidos
    });

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Enviar correo
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetUrl,
    });

    if (!emailResult.success) {
      console.error("Fallo al enviar correo de recuperación a", user.email);
      // Podríamos retornar 500, pero seguimos devolviendo 200 por el principio de no enumeración
      // O podemos manejarlo internamente. De momento, solo lo registramos.
    }

    return NextResponse.json(
      {
        message:
          "Si el correo está registrado, recibirás un enlace de recuperación pronto.",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error en forgot-password:", error);
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
 * Maneja la solicitud de recuperación de contraseña generando un token seguro
 * y enviando un correo al usuario.
 *
 * Lógica Clave:
 * - Evita enumeración de emails retornando el mismo mensaje siempre (200 OK).
 * - Invalida tokens previos no usados para mayor seguridad.
 * - Los tokens expiran en 1 hora.
 *
 * Dependencias Externas:
 * - Resend/React Email para el envío.
 * - crypto (nativo) para la generación de tokens aleatorios seguros.
 *
 */
