"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Ruta/Componente/Servicio: Componente Select
 * Descripción: Un componente de menú desplegable (select) reutilizable y accesible con variantes de estilo.
 * Requiere: -
 * Implementa: -
 */

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
 * Descripción General:
 * Este archivo define un componente 'Select' reutilizable y accesible que
 * envuelve el elemento '<select>' nativo. Su propósito es estandarizar la
 * apariencia y el comportamiento de los menús desplegables.
 *
 * Lógica Clave:
 * - 'Reenvío de Ref (forwardRef)': Se utiliza 'React.forwardRef' para que las
 *   librerías de gestión de formularios (como React Hook Form) puedan
 *   registrar el select y gestionar su estado y validación.
 * - 'Accesibilidad': La 'label' se asocia explícitamente con el 'select' a
 *   través de la correspondencia 'htmlFor' e 'id', una práctica esencial
 *   para la accesibilidad.
 * - 'Variantes de Estilo (cva)': Se utiliza 'class-variance-authority' para
 *   gestionar la variante de 'error', que cambia el estilo del borde para
 *   indicar errores de validación en un formulario.
 *
 * Dependencias Externas:
 * - 'react': Para la creación del componente.
 * - 'class-variance-authority': Para la gestión de variantes de estilo.
 *
 */
