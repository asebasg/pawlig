import { PetStatus } from '@prisma/client';

/**
 * Ruta/Componente/Servicio: Componente Badge
 * Descripción: Un componente de UI para mostrar el estado de una mascota con un estilo visual distintivo.
 * Requiere: -
 * Implementa: -
 */

interface BadgeProps {
  status: PetStatus;
  className?: string;
}

const statusConfig = {
  AVAILABLE: {
    label: 'Disponible',
    bgColor: 'bg-teal-500',
    textColor: 'text-white',
  },
  IN_PROCESS: {
    label: 'En Proceso',
    bgColor: 'bg-amber-500',
    textColor: 'text-white',
  },
  ADOPTED: {
    label: 'Adoptada',
    bgColor: 'bg-gray-500',
    textColor: 'text-white',
  },
};

export default function Badge({ status, className = '' }: BadgeProps) {
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
 * Este es un componente de UI simple y reutilizable que traduce un estado de
 * 'PetStatus' a una representación visual consistente (una "insignia" o "badge")
 * con un texto y color específicos.
 *
 * Lógica Clave:
 * - 'statusConfig': Un objeto de mapeo que centraliza la configuración de estilo
 *   para cada estado posible. Esto permite modificar fácilmente la apariencia de
 *   todos los badges de estado en la aplicación desde un solo lugar.
 *
 * Dependencias Externas:
 * - '@prisma/client': Se utiliza para importar el tipo 'PetStatus', asegurando
 *   que los estados manejados por el componente sean consistentes con los
 *   definidos en la base de datos.
 *
 */
