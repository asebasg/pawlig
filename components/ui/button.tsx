"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Ruta/Componente/Servicio: Componente Button
 * Descripción: Un componente de botón reutilizable y personalizable con variantes de estilo y tamaño.
 * Requiere: -
 * Implementa: -
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
 * Este archivo define un componente 'Button' reutilizable y altamente
 * personalizable. Proporciona una base consistente para todos los botones de
 * la aplicación, asegurando un estilo uniforme y un comportamiento predecible.
 *
 * Lógica Clave:
 * - 'class-variance-authority (cva)': Es la biblioteca central utilizada para
 *   definir variantes de estilo ('variant') y tamaño ('size'). Esto permite
 *   crear múltiples tipos de botones (primario, destructivo, etc.) sin
 *   duplicar clases de CSS, haciendo el código más limpio y mantenible.
 * - 'Reenvío de Ref (forwardRef)': Se utiliza 'React.forwardRef' para permitir
 *   que los componentes padres obtengan una referencia al elemento DOM del
 *   botón subyacente, lo cual es útil para casos de uso avanzados como la
 *   gestión del foco.
 * - 'Accesibilidad': El estilo de foco visible ('focus:ring-2') es crucial
 *   para la accesibilidad, proporcionando una indicación clara a los usuarios
 *   que navegan con teclado. Los estados deshabilitados también se manejan
 *   visualmente.
 *
 * Dependencias Externas:
 * - 'react': Para la creación del componente.
 * - 'class-variance-authority': Para la gestión de las variantes de estilo.
 *
 */
