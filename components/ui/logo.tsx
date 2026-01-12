"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

/**
 * Descripción: Componente de UI para renderizar el logotipo de la aplicación.
 *              Ofrece variantes para mostrar el logo completo o solo el icono.
 * Requiere: Opcionalmente se puede especificar la variante ('variant'), el
 *           tamaño ('size') y la URL de destino ('href').
 * Implementa: Requisito de branding para una identidad visual consistente en
 *             toda la aplicación, especialmente en barras de navegación y pies de página.
 */

interface LogoProps {
  variant?: "full" | "icon-only";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ variant = "full", size = "md", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 text-xl",
    md: "h-10 text-2xl",
    lg: "h-12 text-3xl",
  };

  const iconSizes = {
    sm: 24,
    md: 28,
    lg: 32,
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-2 transition-transform hover:scale-105"
    >
      <PawPrint
        size={iconSizes[size]}
        className="text-purple-600"
        strokeWidth={2.5}
      />
      {variant === "full" && (
        <span
          className={`font-poppins font-bold text-purple-600 ${sizeClasses[size]}`}
        >
          PawLig
        </span>
      )}
    </Link>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente encapsula la representación visual del logotipo de 'PawLig'.
 * Está diseñado para ser flexible, permitiendo su uso en diferentes contextos
 * de la interfaz, como en la barra de navegación principal o en versiones
 * minimizadas para vistas móviles.
 *
 * Lógica Clave:
 * - 'Props de Configuración': El componente acepta las props 'variant' y 'size'
 *   para controlar su apariencia. 'variant' alterna entre el logotipo completo
 *   con texto y una versión de solo icono, mientras que 'size' ajusta las
 *   dimensiones para diferentes contextos de UI.
 * - 'Mapeo de Clases y Tamaños': Se utilizan objetos ('sizeClasses', 'iconSizes')
 *   para mapear los valores de la prop 'size' a clases específicas de Tailwind CSS
 *   y tamaños de icono, lo que mantiene el código limpio y fácil de extender.
 *
 * Dependencias Externas:
 * - 'next/link': Se utiliza para envolver el logotipo, proporcionando una
 *   navegación optimizada y semántica del lado del cliente.
 * - 'lucide-react': La librería de iconos se utiliza para renderizar el
 *   icono de la huella ('PawPrint') que forma parte del logotipo.
 *
 */
