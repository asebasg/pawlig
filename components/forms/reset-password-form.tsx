"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/user.schema";
import { PasswordInput } from "@/components/ui/password-input";
import { PawPrint } from "lucide-react";
import { springUI, springMomentum, reducedMotionTransition } from "@/lib/utils/motion";

/**
 * Descripción: Formulario para establecer una nueva contrasena mediante un token valido.
 * Requiere: Prop token (string) extraido de los query params por el Server Component padre.
 * Implementa: Estetica Glassmorphic + fisicas Apple Design alineadas al modulo /profile.
 */

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const shouldReduceMotion = useReducedMotion();
  const transitionUI = shouldReduceMotion ? reducedMotionTransition : springUI;
  const transitionMomentum = shouldReduceMotion ? reducedMotionTransition : springMomentum;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...data }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Error al restablecer la contraseña");
      }

      toast.success("¡Contraseña actualizada! Todas las sesiones previas fueron cerradas. Serás redirigido al inicio.");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Error inesperado al restablecer la contraseña.";
      toast.error(message);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitionUI}
      className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] w-full max-w-md mx-auto relative overflow-hidden"
    >
      {/* Luz ambiental superior */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <div className="px-8 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={transitionMomentum}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto"
          >
            <PawPrint className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Restablecer contraseña
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm">Ingresa tu nueva contraseña</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campo: Nueva Contraseña */}
          <div>
            <PasswordInput
              {...register("password")}
              id="password"
              label="Nueva Contraseña"
              autoComplete="new-password"
              variant={errors.password ? "error" : "default"}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div>
            <PasswordInput
              {...register("passwordConfirm")}
              id="passwordConfirm"
              label="Confirmar Contraseña"
              autoComplete="new-password"
              variant={errors.passwordConfirm ? "error" : "default"}
              placeholder="Repite tu contraseña"
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs mt-1.5">{errors.passwordConfirm.message}</p>
            )}
          </div>

          {/* Botón de envío */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            transition={transitionMomentum}
            className="w-full bg-primary text-primary-foreground py-2.5 mt-2 rounded-xl font-semibold hover:opacity-90 focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Guardando...
              </>
            ) : (
              "Cambiar contraseña"
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripcion General:
 * Formulario client-side para el restablecimiento de contrasena. Se encapsula
 * dentro de un card glassmorphic identico al del modulo /profile para mantener
 * la coherencia visual a lo largo de toda la experiencia de autenticacion.
 *
 * Logica Clave:
 * - El card entero anima su entrada con fade + desplazamiento vertical (springUI)
 *   al cargarse la pagina, igual que los contenedores del modulo /profile.
 * - El icono PawPrint usa springMomentum para un pop elastico sutil al aparecer.
 * - motion.button con whileTap={ scale: 0.98 } brinda retroalimentacion tactica.
 * - useReducedMotion deshabilita todas las animaciones para usuarios sensibles.
 *
 * Dependencias Externas:
 * - framer-motion: motion, useReducedMotion.
 * - lib/utils/motion: springUI, springMomentum, reducedMotionTransition.
 * - lucide-react: PawPrint.
 *
 */
