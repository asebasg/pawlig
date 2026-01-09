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
