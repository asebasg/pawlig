"use client";

import { AuditAction } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, UserX, CheckCircle, UserPlus, Trash2 } from "lucide-react";

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
    <Card accentColor="orange">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Historial de Auditoría</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {auditRecords.length === 0 ? (
          <p className="text-gray-500">No hay registros de auditoría para este usuario.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {auditRecords.map((record, index) => {
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
 * - `lucide-react`: Para los iconos visuales.
 *
 */
