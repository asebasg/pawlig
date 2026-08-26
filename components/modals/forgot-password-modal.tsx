"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/user.schema";
import { springUI, springMomentum, reducedMotionTransition } from "@/lib/utils/motion";

/**
 * Descripción: Modal para solicitar el restablecimiento de contraseña por correo electrónico.
 * Requiere: Props isOpen y onClose para el control del ciclo de vida del modal.
 * Implementa: Estética Glassmorphism + físicas Apple Design (motion.ts).
 */

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Necesario para evitar errores de hidratación con createPortal en SSR
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const shouldReduceMotion = useReducedMotion();
  const transitionUI = shouldReduceMotion ? reducedMotionTransition : springUI;
  const transitionMomentum = shouldReduceMotion ? reducedMotionTransition : springMomentum;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    onClose();
  };

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("Has superado el límite de 3 intentos. Por favor, espera 5 minutos.");
          return;
        }
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || "Error al procesar la solicitud";
        toast.error(errorMessage);
        return;
      }

      toast.success("Enlace de recuperación enviado exitosamente.");
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Hubo un problema al enviar la solicitud. Inténtalo más tarde.";
      toast.error(message);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div data-portal-wrapper>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay oscuro — el modal se renderiza en el portal fuera del div raíz */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionUI}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-black/40"
              aria-hidden="true"
            />

            {/* Contenedor centrado */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              {/* Card Glassmorphic */}
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={transitionUI}
                className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] w-full max-w-md overflow-hidden relative pointer-events-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="forgot-password-title"
              >
                {/* Luz ambiental superior */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                {/* Header */}
                <div className="flex justify-between items-center px-7 pt-7 pb-0">
                  <h2
                    id="forgot-password-title"
                    className="text-lg font-semibold tracking-tight text-gray-900"
                  >
                    Restablecer contraseña
                  </h2>
                  <motion.button
                    onClick={handleClose}
                    whileTap={{ scale: 0.93 }}
                    transition={transitionMomentum}
                    className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1"
                    aria-label="Cerrar modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Body con transición entre estados */}
                <div className="px-7 pt-5 pb-7">
                  <AnimatePresence mode="wait" initial={false}>
                    {isSuccess ? (
                      // Estado de éxito
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={transitionUI}
                        className="text-center space-y-4"
                      >
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={transitionMomentum}
                          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </motion.div>
                        <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                          Solicitud enviada
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          Si la cuenta existe, recibirás un correo en los próximos minutos con las
                          instrucciones para restablecer tu contraseña.
                        </p>
                        <motion.button
                          onClick={handleClose}
                          whileTap={{ scale: 0.98 }}
                          transition={transitionMomentum}
                          className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity mt-2"
                        >
                          Entendido
                        </motion.button>
                      </motion.div>
                    ) : (
                      // Estado de formulario
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={transitionUI}
                      >
                        <p className="text-gray-500 mb-5 text-sm leading-relaxed">
                          Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace
                          para restablecer tu contraseña.
                        </p>
                        <form
                          onSubmit={(e) => {
                            e.stopPropagation();
                            handleSubmit(onSubmit)(e);
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label
                              htmlFor="reset-email"
                              className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                              Correo electrónico
                            </label>
                            <input
                              {...register("email")}
                              type="email"
                              id="reset-email"
                              className={`w-full px-3.5 py-2.5 bg-white/60 border rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary/50 outline-none text-gray-900 text-sm transition-all ${
                                errors.email ? "border-red-400 bg-red-50/40" : "border-gray-200"
                              }`}
                              placeholder="tu@email.com"
                            />
                            {errors.email && (
                              <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
                            )}
                          </div>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileTap={{ scale: 0.98 }}
                            transition={transitionMomentum}
                            className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex justify-center items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <svg
                                  className="animate-spin h-4 w-4 text-current"
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
                                Enviando...
                              </>
                            ) : (
                              "Enviar enlace"
                            )}
                          </motion.button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Modal glassmorphic para el flujo de recuperacion de contrasena. Sigue el
 * estandar visual del modulo /profile: superficies translucidas, fisica de
 * resortes via motion.ts y soporte nativo a prefers-reduced-motion.
 *
 * Logica Clave:
 * - createPortal: renderiza el modal directamente en document.body, fuera del
 *   div raiz de Next.js. Esto permite que la regla CSS body.modal-open > div
 *   aplique blur a toda la pagina (incluyendo la navbar) sin afectar al modal.
 * - isMounted: protege contra errores de hidratacion SSR al usar createPortal.
 * - AnimatePresence externo: controla la entrada y salida animada del overlay
 *   y el card. El card escala desde 0.95 con opacidad 0 (springUI sin rebote).
 * - AnimatePresence interior (mode="wait"): orquesta el cross-fade entre el
 *   formulario y el mensaje de exito sin parpadeos instantaneos.
 * - El icono de exito usa springMomentum para un pop elastico sutil.
 * - motion.button con whileTap={ scale: 0.98 } brinda retroalimentacion tactica
 *   al clic, alineado con el estandar del modulo /profile.
 *
 * Dependencias Externas:
 * - framer-motion: AnimatePresence, motion, useReducedMotion.
 * - lib/utils/motion: springUI, springMomentum, reducedMotionTransition.
 * - lucide-react: X, CheckCircle2.
 *
 */

