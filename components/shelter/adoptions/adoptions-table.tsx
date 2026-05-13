"use client";

import { ShelterAdoption } from "@/types/adoption";
import { AdoptionStatus } from "@prisma/client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge";
import { Calendar, User, Dog } from "lucide-react";

/**
 * COMPONENTE: AdoptionsTable
 * Descripción: Vista de tabla para visualizar rápidamente postulaciones gestionadas.
 * Requiere: Array de ShelterAdoption.
 * Implementa: HU-007
 */

interface AdoptionsTableProps {
  applications: ShelterAdoption[];
  isLoading: boolean;
}

export function AdoptionsTable({ applications, isLoading }: AdoptionsTableProps) {
  const statusColors: Record<AdoptionStatus, string> = {
    [AdoptionStatus.PENDING]: "bg-yellow-100 text-yellow-700",
    [AdoptionStatus.APPROVED]: "bg-teal-100 text-teal-700",
    [AdoptionStatus.REJECTED]: "bg-pink-100 text-pink-700",
  };

  const statusLabels: Record<AdoptionStatus, string> = {
    [AdoptionStatus.PENDING]: "Pendiente",
    [AdoptionStatus.APPROVED]: "Aprobada",
    [AdoptionStatus.REJECTED]: "Rechazada",
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
    );
  }

  if (applications.length === 0) {
    return (
      <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium">No hay registros gestionados aún.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold text-gray-900">Mascota</TableHead>
            <TableHead className="font-bold text-gray-900">Adoptante</TableHead>
            <TableHead className="font-bold text-gray-900">Estado</TableHead>
            <TableHead className="font-bold text-gray-900">Fecha</TableHead>
            <TableHead className="text-right font-bold text-gray-900">Ubicación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app: ShelterAdoption) => (
            <TableRow key={app.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-50 rounded-lg shrink-0">
                    <Dog className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-bold text-gray-900">{app.pet.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{app.adopter.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${statusColors[app.status as AdoptionStatus]} border-none shadow-none text-[10px] font-bold uppercase tracking-wider`}>
                  {statusLabels[app.status as AdoptionStatus]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(app.createdAt).toLocaleDateString("es-CO")}
                </div>
              </TableCell>
              <TableCell className="text-right text-gray-500 text-sm">
                {app.adopter.municipality}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Vista tabular optimizada para el escaneo rápido de múltiples registros.
 *
 * Lógica Clave:
 * - Diseño Limpio: Elimina bordes innecesarios y utiliza tipografía clara.
 * - Iconografía Contextual: Ayuda a identificar visualmente las columnas
 *   principales (Mascota, Adoptante, Fecha).
 * - Accesibilidad: Implementa roles de tabla estándar mediante el componente 'Table'.
 *
 * Dependencias Externas:
 * - components/ui/table: Basado en primitivas de shadcn/ui.
 * - lucide-react: Iconografía semántica.
 *
 */
