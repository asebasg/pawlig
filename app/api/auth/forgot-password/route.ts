import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";
import { sendPasswordResetEmail } from "@/lib/services/email.service";
import { z } from "zod";
import { generateResetToken } from "@/lib/auth/password";
import { forgotPasswordSchema } from "@/lib/validations/user.schema";

/**
 * POST /api/auth/forgot-password
 * Descripción: Endpoint para solicitar recuperación de contraseña.
 * Requiere: Email del usuario en el body.
 * Implementa: RF-004, ISSUE-225
 */

/**
 * Ofusca un correo electrónico para su uso seguro en logs.
 * Ejemplo: "usuario@dominio.com" → "u***@dominio.com"
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***.***";
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

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

    // Rate Limiting: 3 solicitudes en los últimos 5 minutos
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentRequests = await prisma.passwordResetToken.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    if (recentRequests >= 3) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor, intenta más tarde." },
        { status: 429 },
      );
    }

    // Generar token único en texto plano para el correo y hasheado para BD
    const { token, hashedToken } = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de validez

    // Guardar token hasheado en BD
    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Enviar correo con el token en texto plano
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const maskedEmail = maskEmail(user.email ?? "");
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] Iniciando envío de email a: ${maskedEmail}`);
    }

    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetUrl,
    });

    if (!emailResult.success) {
      console.error(`[ERROR] Fallo al enviar correo de recuperación a: ${maskedEmail}`);
    } else if (process.env.NODE_ENV === "development") {
      console.log(`[DEBUG] Correo de recuperación enviado exitosamente a: ${maskedEmail}`);
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

    if (process.env.NODE_ENV === "development") {
      console.error("Error en forgot-password:", error);
    } else {
      console.error("Error interno en el proceso de recuperación de contraseña.");
    }
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
 * - Rate Limiting consultando en BD los tokens recientes (máximo 3 en 5 min).
 * - Los tokens se almacenan en la BD hasheados para evitar extracción de BD.
 * - Los tokens expiran en 1 hora.
 *
 * Dependencias Externas:
 * - Resend/React Email para el envío.
 * - crypto (vía lib/auth/password) para generación y hasheo de tokens.
 *
 */
