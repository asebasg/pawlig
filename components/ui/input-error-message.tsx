"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { springs } from "@/lib/motion/springs";
import { cn } from "@/lib/utils";

/**
 * Ruta/Componente/Servicio: Componente InputErrorMessage
 * Descripción: Muestra mensajes de error de validación de formulario con micro-interacción de resorte físico (DESIGN.md §4) y accesibilidad WCAG.
 * Requiere: Mensaje opcional a desplegar y un id para asociar con aria-describedby.
 * Implementa: DESIGN.md §2 (Semántica Danger), §4 (springs.snap) y §5 (Contrato de Formularios).
 */

export interface InputErrorMessageProps {
  id?: string;
  message?: string;
  className?: string;
}

export function InputErrorMessage({
  id,
  message,
  className,
}: InputErrorMessageProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          id={id}
          role="alert"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4, height: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, height: "auto" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, height: 0 }}
          transition={reduced ? { duration: 0 } : springs.snap}
          className={cn("overflow-hidden", className)}
        >
          <div className="flex items-center gap-1.5 pt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default InputErrorMessage;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente atómico de feedback de error para entradas de formularios.
 * Proporciona una transición fluida al desplegar y ocultar errores de validación,
 * evitando saltos abruptos de layout en la interfaz.
 *
 * Lógica Clave:
 * - 'Micro-interacción (Framer Motion)': Utiliza AnimatePresence y springs.snap
 *   para animar la opacidad, desplazamiento vertical (y) y altura del contenedor.
 * - 'Accesibilidad (A11y)': Implementa role="alert" y soporte para asociarse
 *   mediante el 'id' al atributo 'aria-describedby' del campo de entrada.
 * - 'Modo Reducción de Movimiento': Respeta la preferencia 'prefers-reduced-motion'
 *   del usuario mediante useReducedMotion.
 * - 'Consistencia Visual': Aplica el color Danger semántico de PawLig (DESIGN.md §2)
 *   junto con el ícono AlertCircle de Lucide.
 *
 * Dependencias Externas:
 * - framer-motion: Para animaciones basadas en resortes físicos.
 * - lucide-react: Ícono AlertCircle.
 * - @/lib/motion/springs: Resortes canónicos del proyecto.
 *
 */
