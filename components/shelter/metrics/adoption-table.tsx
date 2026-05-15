"use client";

import { AdoptionReportData } from "@/types/report.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AdoptionTableProps {
  adoptions: AdoptionReportData[];
  isAdmin?: boolean;
}

export function AdoptionTable({ adoptions, isAdmin = false }: AdoptionTableProps) {
  if (adoptions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-lg">No hay datos para mostrar con los filtros actuales.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Mascota</TableHead>
            {isAdmin && <TableHead>Albergue</TableHead>}
            <TableHead>Adoptante</TableHead>
            <TableHead>Municipio</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adoptions.map((adoption) => (
            <TableRow key={adoption.id} className="hover:bg-gray-50 transition-colors">
              <TableCell>{new Date(adoption.adoptionDate).toLocaleDateString()}</TableCell>
              <TableCell className="font-medium text-primary">{adoption.petName}</TableCell>
              {isAdmin && <TableCell>{adoption.shelterName || "N/A"}</TableCell>}
              <TableCell>{adoption.adopterName}</TableCell>
              <TableCell>{adoption.municipality}</TableCell>
              <TableCell>
                <Badge variant={adoption.status === "APPROVED" ? "default" : "secondary"}>
                  {adoption.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Tabla de resultados para visualizar las adopciones. 
 * Aplica estilos estándar de Tailwind y ShadcnUI.
 */
