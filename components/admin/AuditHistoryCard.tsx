"use client";

import { useState } from "react";
import { AuditAction } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Shield, UserX, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Descripción: Muestra el historial de auditoría de acciones realizadas sobre un usuario.
 * Requiere: Lista de registros de auditoría (AuditRecord[]).
 * Implementa: Registro histórico de gestión administrativa con paginación.
 */

type AuditRecord = {
  action: AuditAction;
  reason: string;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: Date;
  performedBy: {
    name: string;
    email: string;
  };
  ipAddress?: string | null;
};

interface AuditHistoryCardProps {
  auditRecords: AuditRecord[];
}

const actionDetails = {
  [AuditAction.CHANGE_ROLE]: { icon: Shield, text: "Cambio de Rol", color: "text-purple-600" },
  [AuditAction.BLOCK]: { icon: UserX, text: "Bloqueo de Usuario", color: "text-red-600" },
  [AuditAction.UNBLOCK]: { icon: CheckCircle, text: "Desbloqueo de Usuario", color: "text-green-600" },
  [AuditAction.DELETE]: { icon: Trash2, text: "Eliminación de Usuario", color: "text-gray-600" },
};

export function AuditHistoryCard({ auditRecords }: AuditHistoryCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const totalPages = Math.ceil(auditRecords.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecords = auditRecords.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card accentColor="orange" className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Registro de Auditoría</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        {auditRecords.length === 0 ? (
          <p className="text-gray-500">No hay registros de auditoría para este usuario.</p>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {paginatedRecords.map((record, index) => {
                const details = actionDetails[record.action];
                const Icon = details.icon;
                return (
                  <li key={index} className="py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${details.color}`} />
                        <div>
                          <p className={`font-semibold ${details.color}`}>{details.text}</p>
                          {record.action === AuditAction.CHANGE_ROLE && (
                            <p className="text-sm font-mono text-gray-700">
                              {record.oldValue} → {record.newValue}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">Razón: {record.reason}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(record.createdAt)}</span>
                    </div>
                    <div className="mt-2 pl-8 text-xs text-gray-500">
                      <p>Realizado por: {record.performedBy.name} ({record.performedBy.email})</p>
                      {record.ipAddress && <p>IP: {record.ipAddress}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <span className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Este componente se especializa en renderizar la sección de historial de
 * auditoría para un usuario. Recibe una lista de registros de auditoría y
 * los muestra de una manera estructurada y fácil de leer.
 *
 * **Lógica Clave:**
 * - Paginación: Implementa paginación local usando `useState` para limitar la
 *   cantidad de registros mostrados y mantener la altura de la tarjeta en
 *   concordancia con el resto del layout.
 * - Mapeo de Acciones a Iconos y Colores: El objeto `actionDetails` mapea
 *   cada valor del enum `AuditAction` a un icono, texto y color
 *   específico. Esto hace que el historial sea mucho más visual e intuitivo,
 *   permitiendo al administrador identificar rápidamente el tipo de acción.
 * - Formato Condicional: El componente renderiza de forma condicional los
 *   valores `oldValue` y `newValue` solo para las acciones de `CHANGE_ROLE`,
 *   que es donde son relevantes.
 * - Estado Vacío: Maneja elegantemente el caso en que no hay registros de
 *   auditoría, mostrando un mensaje claro en lugar de una lista vacía.
 *
 * **Dependencias Externas:**
 * - `@prisma/client`: Para el enum `AuditAction`.
 * - `@/components/ui/card`: Para la estructura de la tarjeta.
 * - `@/components/ui/button`: Para los controles de paginación.
 * - `lucide-react`: Para los iconos visuales y las flechas de navegación.
 *
 */
