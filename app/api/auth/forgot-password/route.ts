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

// Global rate limit map for forgot password requests by email
// Stores { email: { count, firstRequest } }
const globalForRateLimit = globalThis as unknown as {
  forgotPasswordRateLimitMap?: Map<string, { count: number; firstRequest: number }>;
};
const rateLimitMap = globalForRateLimit.forgotPasswordRateLimitMap || new Map();
if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.forgotPasswordRateLimitMap = rateLimitMap;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // Rate Limiting en memoria: 3 solicitudes en los últimos 5 minutos por email
    const now = Date.now();
    const windowMs = 5 * 60 * 1000;
    
    const rateLimit = rateLimitMap.get(email) || { count: 0, firstRequest: now };
    
    if (now - rateLimit.firstRequest > windowMs) {
      rateLimit.count = 1;
      rateLimit.firstRequest = now;
    } else {
      rateLimit.count++;
    }
    
    rateLimitMap.set(email, rateLimit);
    
    if (rateLimit.count > 3) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Por favor, intenta más tarde." },
        { status: 429 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // Si el usuario está inactivo (bloqueado)
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Cuenta bloqueada. Contacta con soporte para más información" },
        { status: 403 },
      );
    }

    // Generar token único en texto plano para el correo y hasheado para BD
    const { token, hashedToken } = generateResetToken();
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora de validez

    // 1. Invalidar cualquier token activo previamente solicitado por el usuario
    // 2. Guardar el nuevo token hasheado en BD
    await prisma.$transaction([
      prisma.passwordResetToken.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      }),
      prisma.passwordResetToken.create({
        data: {
          token: hashedToken,
          userId: user.id,
          expiresAt,
        },
      }),
    ]);

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
