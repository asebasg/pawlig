"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const selectVariants = cva(
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

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, label, id, children, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <select
            id={id}
            className={selectVariants({ variant, className })}
            ref={ref}
            {...props}
          >
            {children}
          </select>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este archivo define un componente `Select` reutilizable y accesible para
 * toda la aplicación. Abstrae un elemento `<select>` de HTML nativo y lo
 * estiliza con Tailwind CSS, además de integrar la accesibilidad.
 *
 * **Lógica Clave:**
 * - Reenvío de Ref (forwardRef): `React.forwardRef` se utiliza para permitir
 *   que los componentes padres obtengan una referencia (`ref`) al elemento
 *   `<select>` subyacente. Esto es esencial para integrarse con librerías
 *   de formularios como React Hook Form.
 * - Accesibilidad: El componente asocia una `<label>` con el `<select>` a
 *   través del atributo `htmlFor`, lo cual es crucial para los lectores de
 *   pantalla y mejora la experiencia de usuario.
 * - Variantes de Estilo: Se utiliza `class-variance-authority` (cva) para
 *   manejar variantes de estilo (ej: `default`, `error`). Esto permite
 *   cambiar la apariencia del select fácilmente (ej: mostrar un borde rojo
 *   en caso de error de validación) sin tener que escribir lógica de clases
 *   condicionales en el componente.
 *
 * **Dependencias Externas:**
 * - React: Para la creación del componente.
 * - class-variance-authority: Para la gestión de variantes de estilo de
 *   manera programática y limpia.
 *
 */
