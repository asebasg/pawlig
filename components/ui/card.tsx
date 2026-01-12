import React from "react";

/**
 * Descripción: Define un sistema de componentes 'Card' para presentar información
 *              de forma modular y consistente en toda la aplicación.
 * Requiere: El contenido principal a través de 'children' y opcionalmente un
 *           color de acento para el borde superior.
 * Implementa: Patrón de UI fundamental para la agrupación de contenido, utilizado
 *             en dashboards, perfiles y listados.
 */

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
  const accentClass = accentColor
    ? accentStyles[accentColor]
    : "border-t-gray-200";

  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden border-t-4 ${accentClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo proporciona un conjunto de componentes ('Card', 'CardHeader',
 * 'CardTitle', 'CardContent') que funcionan juntos para crear tarjetas de UI
 * consistentes. Este enfoque de composición permite una gran flexibilidad en la
 * estructura del contenido de la tarjeta.
 *
 * Lógica Clave:
 * - 'Composición de Componentes': En lugar de un único componente monolítico, se
 *   exportan varios componentes que se pueden anidar ('CardHeader' dentro de 'Card').
 *   Esto mejora la semántica del marcado y la flexibilidad del diseño.
 * - 'accentColor': La prop 'accentColor' en el componente principal 'Card' permite
 *   añadir un borde de color temático en la parte superior. Esto se utiliza para
 *   categorizar visualmente diferentes tipos de información en el dashboard.
 * - 'Estilos reusables': Los sub-componentes como 'CardTitle' o 'CardContent'
 *   encapsulan clases de Tailwind CSS, asegurando que el padding, los bordes y
 *   la tipografía sean consistentes en todas las tarjetas.
 *
 * Dependencias Externas:
 * - 'react': Esencial para la creación y composición de los componentes.
 *
 */
