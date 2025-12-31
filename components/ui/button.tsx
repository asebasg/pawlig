"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

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
 * **Descripción General:**
 * Este archivo define un componente `Button` reutilizable y altamente
 * personalizable para toda la aplicación. Proporciona una base consistente
 * para todos los botones, asegurando un estilo uniforme y un comportamiento
 * predecible.
 *
 * **Lógica Clave:**
 * - class-variance-authority (cva): Es la biblioteca central utilizada aquí
 *   para definir diferentes variantes de estilo (`variant`) y tamaño (`size`).
 *   Esto permite crear múltiples tipos de botones (primario, destructivo,
 *   contorno) con diferentes tamaños sin duplicar clases de CSS. El código
- *   es más limpio y fácil de mantener.
 * - Reenvío de Ref (forwardRef): `React.forwardRef` permite a los
 *   componentes padres acceder al elemento `<button>` subyacente. Esto
 *   es útil para casos de uso avanzados, como la gestión del foco.
 * - Accesibilidad: El estilo `focus` visible (`ring-2`) es una parte
 *   esencial de la accesibilidad, ya que proporciona una indicación clara
 *   para los usuarios que navegan con el teclado. Los estados `disabled`
 *   también se manejan visualmente para indicar que un botón no está
 *   activo.
 *
 * **Dependencias Externas:**
 * - React: Para la creación del componente.
 * - class-variance-authority: Para la gestión de variantes de estilo.
 *
 */
