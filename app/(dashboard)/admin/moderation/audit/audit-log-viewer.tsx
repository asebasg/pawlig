"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ChevronDown,
  Eye,
  User,
  FileText,
  Database,
  ShieldAlert,
  Clock,
  ListFilter,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  UserCog,
  PlusCircle,
  RefreshCw,
  Trash2,
  X,
  Search,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * /app/(dashboard)/admin/moderation/audit/audit-log-viewer.tsx
 * Descripción: Componente cliente para visualizar los logs de auditoría con filtros y paginación.
 * Requiere: API /api/admin/moderation/audit.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */

interface AuditLog {
  id: string;
  category: string;
  action: string;
  actorEmail: string;
  resourceType: string;
  resourceId: string;
  reason: string;
  requestId: string | null;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  APPROVE: "Aprobación",
  REJECT: "Rechazo",
  BLOCK: "Bloqueo",
  UNBLOCK: "Desbloqueo",
  CHANGE_ROLE: "Cambio de Rol",
  CREATE: "Creación",
  UPDATE: "Actualización",
  DELETE: "Eliminación",
};

function getActionVariant(
  action: string,
): React.ComponentProps<typeof Badge>["variant"] {
  const map: Record<string, React.ComponentProps<typeof Badge>["variant"]> = {
    APPROVE: "green",
    REJECT: "red",
    BLOCK: "orange",
    UNBLOCK: "teal",
    CHANGE_ROLE: "blue",
    CREATE: "purple",
    UPDATE: "yellow",
    DELETE: "destructive",
  };
  return map[action] ?? "secondary";
}

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasMore, setHasMore] = useState(true);

  // Modal de detalles
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Ref para rastrear la cantidad de logs sin crear dependencia reactiva
  const logsLengthRef = useRef(0);

  const take = 50;

  // Obtiene el día actual del sistema en formato YYYY-MM-DD para limitar la fecha máxima
  const todayStr = new Date().toLocaleDateString("en-CA"); // Formato YYYY-MM-DD local

  const fetchLogs = useCallback(
    async (isLoadMore = false) => {
      const skip = isLoadMore ? logsLengthRef.current : 0;
      const params = new URLSearchParams({
        skip: skip.toString(),
        take: take.toString(),
      });

      if (startDate) {
        // Convierte el string "YYYY-MM-DD" al inicio del día local en la zona horaria del cliente y saca ISO
        const startISO = new Date(startDate + "T00:00:00").toISOString();
        params.append("startDate", startISO);
      }
      if (endDate) {
        // Convierte el string "YYYY-MM-DD" al fin del día local en la zona horaria del cliente y saca ISO
        const endISO = new Date(endDate + "T23:59:59.999").toISOString();
        params.append("endDate", endISO);
      }

      try {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const res = await fetch(
          `/api/admin/moderation/audit?${params.toString()}`,
        );
        if (!res.ok) throw new Error("Error al cargar auditoría");
        const data: AuditLog[] = await res.json();

        if (isLoadMore) {
          setLogs((prev) => {
            const updated = [...prev, ...data];
            logsLengthRef.current = updated.length;
            return updated;
          });
        } else {
          setLogs(data);
          logsLengthRef.current = data.length;
        }

        setHasMore(data.length === take);
      } catch {
        toast.error("Hubo un problema al cargar los logs de auditoría.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [startDate, endDate],
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.resourceType.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.requestId &&
        log.requestId.toLowerCase().includes(search.toLowerCase()));

    const matchAction = actionFilter === "ALL" || log.action === actionFilter;

    return matchSearch && matchAction;
  });

  function handleClearFilters() {
    setSearch("");
    setActionFilter("ALL");
    setStartDate("");
    setEndDate("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Registro de Auditoría
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Visualiza los cambios y acciones recientes en la plataforma.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-4 lg:flex-row justify-between items-start lg:items-center">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">

            {/* Búsqueda por texto */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="audit-search"
                type="text"
                placeholder="Buscar por email, recurso..."
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filtro por acción */}
            <div className="w-full md:w-56">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger
                  id="audit-action-filter"
                  className="w-full rounded-full bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-colors px-4"
                >
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-purple-500" />
                    <SelectValue placeholder="Todas las acciones" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border-gray-100">
                  <SelectItem value="ALL">
                    <div className="flex items-center gap-2">
                      <span>Todas las acciones</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="APPROVE">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Aprobación</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="REJECT">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>Rechazo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="BLOCK">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-orange-500" />
                      <span>Bloqueo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UNBLOCK">
                    <div className="flex items-center gap-2">
                      <Unlock className="h-4 w-4 text-teal-500" />
                      <span>Desbloqueo</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CHANGE_ROLE">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-blue-500" />
                      <span>Cambio de Rol</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CREATE" disabled>
                    <div className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4 text-emerald-500" />
                      <span>Creación</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="UPDATE" disabled>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-indigo-500" />
                      <span>Actualización</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DELETE" disabled>
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-red-600" />
                      <span>Eliminación</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Inputs de fecha nativos del navegador */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-40">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="audit-start-date"
                  type="date"
                  max={todayStr}
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <span className="text-gray-400 text-sm">-</span>
              <div className="relative flex-1 sm:w-40">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="audit-end-date"
                  type="date"
                  max={todayStr}
                  className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            id="audit-clear-filters"
            variant="outline"
            onClick={handleClearFilters}
            className="h-10 border-gray-200 text-gray-600 w-full md:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
            <span className="text-sm">Cargando registros de auditoría...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        Fecha
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        Actor
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-gray-400" />
                        Acción
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-400" />
                        Recurso
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Detalles
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No se encontraron registros de auditoría que coincidan
                        con la búsqueda.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {new Date(log.createdAt).toLocaleString("es-CO")}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {log.actorEmail}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                             variant={getActionVariant(log.action)}
                            className="font-medium"
                          >
                            {ACTION_LABELS[log.action] ?? log.action}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">
                            {log.resourceType}
                          </span>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            {log.resourceId.split("-")[0]}...
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver más
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {hasMore && filteredLogs.length >= take && (
              <div className="p-4 border-t border-gray-100 flex justify-center bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLogs(true)}
                  disabled={loadingMore}
                  className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                >
                  {loadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2" />
                  )}
                  Cargar más registros
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedLog && (
        <Dialog
          open={!!selectedLog}
          onOpenChange={(open) => !open && setSelectedLog(null)}
        >
          <DialogContent className="sm:max-w-lg bg-white border border-gray-100 shadow-xl">
            <DialogHeader className="border-b border-gray-100 pb-4 mb-4">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Detalles del Registro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-gray-500 font-medium">Actor:</span>
                <span className="col-span-2 text-gray-900 font-semibold">
                  {selectedLog.actorEmail}
                </span>

                <span className="text-gray-500 font-medium">Acción:</span>
                <span className="col-span-2">
                  <Badge variant={getActionVariant(selectedLog.action)}>
                    {ACTION_LABELS[selectedLog.action] ?? selectedLog.action}
                  </Badge>
                </span>

                <span className="text-gray-500 font-medium">Fecha:</span>
                <span className="col-span-2 text-gray-900">
                  {new Date(selectedLog.createdAt).toLocaleString("es-CO")}
                </span>

                <span className="text-gray-500 font-medium mt-2 pt-2 border-t border-gray-100">
                  Recurso:
                </span>
                <span className="col-span-2 text-gray-900 mt-2 pt-2 border-t border-gray-100 font-semibold">
                  {selectedLog.resourceType}
                </span>

                <span className="text-gray-500 font-medium">ID Recurso:</span>
                <span className="col-span-2 text-gray-600 font-mono text-xs">
                  {selectedLog.resourceId}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-gray-500 font-medium block mb-2">
                  Motivo / Descripción:
                </span>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 italic">
                  &ldquo;{selectedLog.reason}&rdquo;
                </div>
              </div>

              {selectedLog.requestId && (
                <div className="pt-2">
                  <span className="text-gray-500 font-medium block mb-1">
                    Request ID (Trace):
                  </span>
                  <div className="bg-slate-900 p-2 rounded-lg text-slate-300 font-mono text-xs overflow-x-auto">
                    {selectedLog.requestId}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Visualizador interactivo de logs de auditoría con filtros avanzados.
 *
 * Lógica Clave:
 * - El rango de fechas se gestiona con dos inputs date nativos del navegador.
 * - Al construir la query de la API, se normalizan las fechas al inicio (00:00) y
 *   al fin (23:59) del día en la zona horaria del cliente y se envían como strings ISO.
 *   Esto soluciona la discrepancia de zona horaria con el almacenamiento en base de datos.
 * - Filtros de texto y acción se aplican en el cliente sobre los datos ya cargados.
 * - Los detalles de cada registro se visualizan en un Dialog para mantener
 *   la tabla limpia y escalable.
 *
 */

