"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

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
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
 * **Descripción General:**
 * Este archivo define un componente `Input` reutilizable y accesible que
 * envuelve el elemento `<input>` nativo de HTML. Su propósito es estandarizar
 * la apariencia y el comportamiento de los campos de entrada de texto en
 * toda la aplicación.
 *
 * **Lógica Clave:**
 * - Reenvío de Ref (forwardRef): Al igual que el componente `Select`, este
 *   utiliza `React.forwardRef` para que las librerías de gestión de
 *   formularios (como React Hook Form) puedan registrarlo y gestionar su
 *   estado, validación y valor.
 * - Accesibilidad: La `label` se asocia explícitamente con el `input` a
 *   través del `id`, lo cual es una práctica fundamental de accesibilidad
 *   para garantizar que los lectores de pantalla puedan interpretar
 *   correctamente el propósito del campo.
 * - Variantes de Estilo (cva): Se utiliza `class-variance-authority` para
 *   gestionar las variantes, especialmente el estado de `error`. Esto
 *   permite que el formulario cambie visualmente el borde del input a rojo
 *   cuando una validación falla, proporcionando una retroalimentación
 *   visual clara al usuario.
 *
 * **Dependencias Externas:**
 * - React: Para la creación del componente.
 * - class-variance-authority: Para la gestión de variantes de estilo.
 *
 */
