"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "block w-full px-4 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent sm:text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "border-gray-300 text-black",
        error: "border-red-500 text-black focus:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
  VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
}

/**
 * Descripción: Componente de entrada de contraseña con opción para alternar la visibilidad.
 * Requiere: lucide-react para los iconos.
 * Implementa: HU-001, HU-002 (Mejora de UX en formularios de acceso).
 */

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, variant, label, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            type={showPassword ? "text" : "password"}
            className={cn(inputVariants({ variant }), "pr-12", className)}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente proporciona un campo de entrada especializado para contraseñas
 * que permite al usuario ver el texto ingresado, mejorando la usabilidad y
 * reduciendo errores durante el registro o inicio de sesión.
 *
 * Lógica Clave:
 * - Estado Local: Utiliza el hook 'useState' para controlar la visibilidad
 *   del texto (intercambiando el tipo de input entre 'password' y 'text').
 * - Posicionamiento Absoluto: El botón de alternancia se posiciona de forma
 *   absoluta dentro de un contenedor relativo para superponerse al input.
 * - Accesibilidad: Incluye 'aria-label' descriptivo para lectores de pantalla
 *   y asegura que el botón sea accesible mediante teclado.
 *
 * Dependencias Externas:
 * - lucide-react: Para los iconos de 'Eye' y 'EyeOff'.
 * - class-variance-authority: Para mantener la consistencia de estilos con
 *   el componente Input base.
 *
 */
