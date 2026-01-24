"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

/**
 * Ruta/Componente/Servicio: Componente Logo
 * Descripción: Muestra el logo de la aplicación con variantes de tamaño y estilo.
 * Requiere: -
 * Implementa: -
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
    lg: "h-12 text-3xl"
  };

  const iconSizes = {
    sm: 24,
    md: 28,
    lg: 32
  };

  return (
    <Link 
      href={href}
      className="flex items-center gap-2 transition-transform hover:scale-105"
    >
      <PawPrint 
        size={iconSizes[size]} 
        className="text-primary"
        strokeWidth={2.5}
      />
      {variant === "full" && (
        <span className={`font-poppins font-bold text-primary ${sizeClasses[size]}`}>
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
 * Este componente renderiza el logo de 'PawLig'. Está diseñado para ser
 * flexible, permitiendo su uso en diferentes partes de la aplicación con
 * tamaños y apariencias variables.
 *
 * Lógica Clave:
 * - 'variant': Esta propiedad permite mostrar el logo completo (icono + texto) o
 *   solo el icono, lo cual es útil para interfaces compactas como barras de
 *   navegación móviles.
 * - 'size': Controla el tamaño general del logo, ajustando tanto el icono
 *   como la fuente del texto a través de objetos de mapeo ('sizeClasses' y
 *   'iconSizes').
 * - Soporte de Temas: Utiliza la clase 'text-primary' para que el color del logo
 *   se adapte al tema actual de la aplicación.
 *
 * Dependencias Externas:
 * - 'next/link': Se utiliza para envolver el logo en un enlace de navegación
 *   del lado del cliente.
 * - 'lucide-react': Proporciona el icono 'PawPrint' utilizado en el logo.
 *
 */
