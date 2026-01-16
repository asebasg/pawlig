"use client";

import React from "react";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants";

import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
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
