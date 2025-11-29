import { PetStatus } from '@prisma/client';

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
