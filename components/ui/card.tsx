import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accentColor?: "teal" | "orange" | "purple";
}

const accentStyles = {
  teal: "border-t-teal-500",
  orange: "border-t-orange-500",
  purple: "border-t-purple-600",
};

export function Card({ children, className, accentColor }: CardProps) {
  const accentClass = accentColor ? accentStyles[accentColor] : "border-t-gray-200";

  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden border-t-4 ${accentClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este archivo define un conjunto de componentes reutilizables para crear
 * "Cards" (tarjetas) consistentes a lo largo de la aplicación. Las tarjetas
 * son un patrón de UI fundamental para agrupar y mostrar información de
 * manera modular.
 *
 * **Lógica Clave:**
 * - Composición: El Card se construye a través de la composición de sub-
 *   componentes (`Card`, `CardHeader`, `CardTitle`, `CardContent`). Esto
 *   proporciona flexibilidad para construir diferentes tipos de tarjetas
 *   mientras se mantiene un estilo base consistente.
 * - Acento de Color: La prop `accentColor` en el componente `Card` permite
 *   añadir un borde superior de un color específico. Esto se utiliza para
 *   diferenciar visualmente las secciones temáticas (ej: Teal para info
 *   personal, Púrpura para gestión de roles), tal como lo requiere el
 *   diseño.
 *
 * **Dependencias Externas:**
 * - React: Para la creación de los componentes.
 * - Tailwind CSS: Utilizado para todo el estilizado a través de clases de
 *   utilidad.
 *
 */
