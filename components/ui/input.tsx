"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { InputErrorMessage } from "@/components/ui/input-error-message";

/**
 * Ruta/Componente/Servicio: Componente Input
 * Descripción: Un componente de campo de entrada de texto reutilizable y accesible con variantes de estilo y gestión automática de mensajes de error.
 * Requiere: InputErrorMessage para renderizado accesible de mensajes de error.
 * Implementa: DESIGN.md §2, §3 (Contrato de Formularios) y §5 (Accesibilidad).
 */

const inputVariants = cva(
  "h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 transition-[color,background-color,border-color,box-shadow] duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-400 focus-visible:ring-red-500 text-red-900 dark:text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      label,
      id,
      error,
      "aria-invalid": ariaInvalid,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const computedVariant = variant ?? (error ? "error" : "default");
    const errorId = id ? `${id}-error` : undefined;
    const computedDescribedBy =
      ariaDescribedBy ?? (error && errorId ? errorId : undefined);

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          className={inputVariants({ variant: computedVariant, className })}
          ref={ref}
          aria-invalid={ariaInvalid ?? !!error}
          aria-describedby={computedDescribedBy}
          {...props}
        />
        <InputErrorMessage id={errorId} message={error} />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo define un componente 'Input' reutilizable y accesible que
 * envuelve el elemento '<input>' nativo. Su propósito es estandarizar
 * la apariencia y el comportamiento de los campos de entrada de texto.
 *
 * Lógica Clave:
 * - 'Reenvío de Ref (forwardRef)': Se utiliza 'React.forwardRef' para que las
 *   librerías de gestión de formularios (como React Hook Form) puedan
 *   registrar el input y gestionar su estado y validación.
 * - 'Accesibilidad': La 'label' se asocia explícitamente con el 'input' a
 *   través de la correspondencia 'htmlFor' e 'id', una práctica esencial
 *   para que los lectores de pantalla funcionen correctamente.
 * - 'Variantes de Estilo (cva)': Se utiliza 'class-variance-authority' para
 *   gestionar la variante de 'error', que cambia visualmente el borde del
 *   input para proporcionar retroalimentación clara al usuario sobre
 *   errores de validación.
 *
 * Dependencias Externas:
 * - 'react': Para la creación del componente.
 * - 'class-variance-authority': Para la gestión de variantes de estilo.
 *
 */
