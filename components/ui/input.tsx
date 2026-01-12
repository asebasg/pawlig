"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Descripción: Componente de UI para campos de texto que estandariza la
 *              apariencia, el comportamiento y la accesibilidad de los inputs.
 * Requiere: Un 'id' y una 'label' para accesibilidad, además de las props
 *           estándar de un elemento input HTML.
 * Implementa: Requisito de UI para todos los formularios de la aplicación que
 *             requieran entrada de datos del usuario.
 */

const inputVariants = cva(
  "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 sm:text-sm",
  {
    variants: {
      variant: {
        default: "border-gray-300",
        error: "border-pink-600 text-pink-600 focus:ring-pink-500",
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
  label: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, id, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="mt-1">
          <input
            id={id}
            className={inputVariants({ variant, className })}
            ref={ref}
            {...props}
          />
        </div>
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
 * Este componente encapsula un elemento '<input>' de HTML junto con su '<label>'
 * para crear un campo de formulario estandarizado, accesible y reutilizable.
 *
 * Lógica Clave:
 * - 'Accesibilidad': La asociación explícita de 'label' con 'input' a través del
 *   prop 'htmlFor' (usando el 'id') es crucial para que los lectores de pantalla
 *   interpreten correctamente la función del campo.
 * - 'React.forwardRef': Permite que librerías de gestión de formularios como
 *   React Hook Form puedan registrar y controlar este componente, manejando su
 *   estado, valor y validación de forma externa.
 * - 'cva (class-variance-authority)': Se utiliza para gestionar variantes visuales,
 *   principalmente el estado de 'error', que aplica un borde de color distintivo
 *   para dar retroalimentación visual al usuario cuando la validación falla.
 *
 * Dependencias Externas:
 * - 'react': Utilizado para la creación del componente y el 'forwardRef'.
 * - 'class-variance-authority': Herramienta para la gestión de variantes de CSS.
 *
 */
