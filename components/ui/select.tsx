"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Descripción: Componente de UI para menús desplegables que estandariza la
 *              apariencia, el comportamiento y la accesibilidad de los selects.
 * Requiere: Un 'id' y una 'label' para accesibilidad, y los elementos '<option>'
 *           como 'children'.
 * Implementa: Requisito de UI para todos los formularios de la aplicación que
 *             requieran selección de opciones de una lista predefinida.
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
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
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
 * Este componente encapsula un elemento '<select>' de HTML y su '<label>'
 * correspondiente para crear un campo de selección desplegable estandarizado,
 * accesible y reutilizable en toda la aplicación.
 *
 * Lógica Clave:
 * - 'Accesibilidad': La asociación explícita de 'label' con 'select' a través del
 *   prop 'htmlFor' (usando el 'id') es fundamental para la correcta interpretación
 *   por parte de los lectores de pantalla.
 * - 'React.forwardRef': Se utiliza para permitir que librerías de gestión de
 *   formularios (como React Hook Form) puedan registrar y controlar este
 *   componente de forma nativa.
 * - 'cva (class-variance-authority)': Gestiona las variantes visuales del
 *   componente, especialmente el estado de 'error', que proporciona
 *   retroalimentación visual inmediata al usuario.
 *
 * Dependencias Externas:
 * - 'react': Utilizado para la creación del componente y el 'forwardRef'.
 * - 'class-variance-authority': Herramienta para la gestión de variantes de CSS.
 *
 */
