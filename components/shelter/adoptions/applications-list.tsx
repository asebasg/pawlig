"use client";

import { ShelterAdoption } from "@/types/adoption";
import { ApplicationCard } from "./application-card";
import { Inbox } from "lucide-react";

/**
 * COMPONENTE: ApplicationsList
 * Descripción: Lista cuadriculada de postulaciones de adopción.
 * Requiere: Array de ShelterAdoption.
 * Implementa: HU-007
 */

interface ApplicationsListProps {
  applications: ShelterAdoption[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}

export function ApplicationsList({
  applications,
  onApprove,
  onReject,
  isLoading,
}: ApplicationsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-[400px] bg-gray-100 rounded-2xl animate-pulse border border-gray-200"
          />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
          <Inbox className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No hay postulaciones</h3>
        <p className="text-gray-500 text-sm mt-1">
          Las solicitudes nuevas aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app) => (
        <ApplicationCard
          key={app.id}
          application={app}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Contenedor para renderizar múltiples tarjetas de postulación.
 *
 * Lógica Clave:
 * - Skeleton Loading: Muestra estados de carga visuales para mejorar el LCP.
 * - Empty State: Maneja la ausencia de datos con una ilustración amigable.
 * - Grid Responsivo: Se adapta de 1 a 3 columnas según el tamaño de pantalla.
 *
 * Dependencias Externas:
 * - ApplicationCard: Componente hijo para renderizar cada item.
 * - lucide-react: Iconografía para estados vacíos.
 *
 */
