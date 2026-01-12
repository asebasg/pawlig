import { PetStatus } from "@prisma/client";

/**
 * Descripción: Componente de UI para mostrar el estado de una mascota
 *              (Disponible, En Proceso, Adoptada) con un estilo visual distintivo.
 * Requiere: El 'status' de la mascota.
 * Implementa: Requisito de UI para la visualización de estados en las tarjetas
 *             y páginas de detalle de mascotas.
 */

interface BadgeProps {
  status: PetStatus;
  className?: string;
}

const statusConfig = {
  AVAILABLE: {
    label: "Disponible",
    bgColor: "bg-teal-500",
    textColor: "text-white",
  },
  IN_PROCESS: {
    label: "En Proceso",
    bgColor: "bg-amber-500",
    textColor: "text-white",
  },
  ADOPTED: {
    label: "Adoptada",
    bgColor: "bg-gray-500",
    textColor: "text-white",
  },
};

export default function Badge({ status, className = "" }: BadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente encapsula la lógica de renderizado para las insignias de estado
 * de las mascotas. Centraliza los estilos y las etiquetas, garantizando así una
 * consistencia visual en toda la aplicación cada vez que se necesita mostrar
- * el estado de una mascota.
 *
 * Lógica Clave:
 * - 'statusConfig': Se utiliza un objeto de configuración que mapea cada valor
 *   del enum 'PetStatus' a una etiqueta legible para el usuario y a las clases
 *   de Tailwind CSS correspondientes para el color de fondo y de texto.
 *   Este enfoque facilita la adición de nuevos estados en el futuro, ya que
 *   solo requiere modificar este objeto.
 *
 * Dependencias Externas:
 * - '@prisma/client': Se importa el tipo 'PetStatus' para garantizar que los
 *   estados aceptados por el componente coincidan exactamente con el esquema
 *   definido en la base de datos.
 *
 */
