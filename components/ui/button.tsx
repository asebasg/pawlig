"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Descripción: Componente de UI que proporciona un botón reutilizable con
 *              múltiples variantes de estilo y tamaño.
 * Requiere: Props estándar de un botón HTML y las variantes opcionales 'variant' y 'size'.
 * Implementa: Requisito fundamental del sistema de diseño para interacciones
 *             de usuario consistentes en toda la aplicación.
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-purple-600 text-white hover:bg-purple-700",
        destructive: "bg-pink-600 text-white hover:bg-pink-700",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo define un componente 'Button' altamente reutilizable y personalizable,
 * sirviendo como la base para todas las interacciones de botones en la aplicación
 * para garantizar consistencia visual y de comportamiento.
 *
 * Lógica Clave:
 * - 'cva (class-variance-authority)': Se utiliza esta biblioteca para definir de
 *   manera programática las variantes de estilo ('variant') y tamaño ('size').
 *   Permite una API declarativa para combinar clases de Tailwind CSS, lo que
 *   simplifica la creación y el mantenimiento de múltiples estilos de botones.
 * - 'React.forwardRef': El componente utiliza 'forwardRef' para permitir que los
 *   componentes padres obtengan una referencia al elemento 'button' subyacente del DOM.
 *   Esto es esencial para casos de uso avanzados como la gestión del foco o la
 *   integración con otras bibliotecas.
 * - 'Accesibilidad': Los estilos se enfocan en la accesibilidad, con indicadores
 *   claros de foco ('focus:ring-2') y estados deshabilitados visualmente
 *   distintivos ('disabled:opacity-50').
 *
 * Dependencias Externas:
 * - 'react': Utilizado para la creación de componentes y el 'forwardRef'.
 * - 'class-variance-authority': Herramienta clave para la gestión de variantes
 *   de clases CSS.
 *
 */
