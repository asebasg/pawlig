"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Ruta/Componente/Servicio: Componente Input
 * Descripción: Un componente de campo de entrada de texto reutilizable y accesible con variantes de estilo.
 * Requiere: -
 * Implementa: -
 */

const inputVariants = cva(
  "block w-full px-3 py-2 bg-background border border-input text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring sm:text-sm placeholder:text-muted-foreground",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive text-destructive focus:ring-destructive",
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
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          className={inputVariants({ variant, className })}
          ref={ref}
          {...props}
        />
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
 * - Soporte de Temas: Utiliza variables semánticas (bg-background, border-input, text-foreground)
 *   para integrarse con los temas Claro, Oscuro y Solarized.
 *
 * Dependencias Externas:
 * - 'react': Para la creación del componente.
 * - 'class-variance-authority': Para la gestión de variantes de estilo.
 *
 */
