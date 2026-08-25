import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/utils/db";
import { hashResetToken } from "@/lib/auth/password";
import ResetPasswordForm from "@/components/forms/reset-password-form";

/**
 * GET /reset-password
 * Descripción: Página para que el usuario restablezca su contraseña tras hacer
 * clic en el enlace del correo. Valida el token en la base de datos antes de
 * renderizar el formulario.
 * Requiere: Token válido en query params (?token=...).
 * Implementa: Estetica Glassmorphic alineada al estandar del modulo /profile.
 */

async function ResetPasswordContent({ token }: { token: string }) {
  // Hasheamos el token recibido para buscarlo en la DB
  const hashedToken = hashResetToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  // Validaciones: token inexistente, ya utilizado o expirado
  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return (
      <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] w-full max-w-md mx-auto relative overflow-hidden">
        {/* Luz ambiental superior */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

        <div className="px-8 py-10 text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Enlace inválido o expirado
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            El enlace para restablecer la contraseña no es válido, ya fue utilizado o ha expirado.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity mt-2"
          >
            Volver a intentar
          </Link>
        </div>
      </div>
    );
  }

  // Si es válido, renderizamos el formulario con el token en texto plano (para ser enviado en el POST)
  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token;

  if (!token || typeof token !== "string") {
    redirect("/login");
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-center text-gray-500 text-sm">Cargando...</div>
        }
      >
        <ResetPasswordContent token={token} />
      </Suspense>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripcion General:
 * Server Component que valida el token de restablecimiento en la DB y decide
 * que renderizar: el formulario (token valido) o la tarjeta de error glassmorphic
 * (token invalido/expirado), ambos alineados al estandar visual del modulo /profile.
 *
 * Logica Clave:
 * - El estado de error adopta el mismo card glassmorphic (bg-white/80,
 *   backdrop-blur-2xl, rounded-[2rem]) que el formulario para coherencia.
 * - La luz ambiental (h-px gradiente) se replica en ambos estados.
 * - El boton "Volver a intentar" usa variables CSS semanticas (bg-primary) en
 *   lugar de colores hardcodeados.
 *
 * Dependencias Externas:
 * - prisma: consulta del token en PasswordResetToken.
 * - lib/auth/password: hashResetToken para comparacion segura.
 *
 */
