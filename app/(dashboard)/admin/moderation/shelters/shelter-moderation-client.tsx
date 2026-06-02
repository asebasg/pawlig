"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X, MapPin, Mail, Phone, User, CheckCircle, Search } from "lucide-react";
import { RejectRequestModal } from "@/components/admin/reject-request-modal";

/**
 * /app/(dashboard)/admin/moderation/shelters/shelter-moderation-client.tsx
 * Descripción: Componente cliente para visualizar y moderar las solicitudes de albergues.
 * Requiere: API /api/admin/moderation/shelters.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */

interface ShelterUser {
  name: string;
  email: string;
  phone: string;
}

interface Shelter {
  id: string;
  name: string;
  nit: string;
  municipality: string;
  address: string;
  description: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  user: ShelterUser;
}

export function ShelterModerationClient() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalData, setRejectModalData] = useState<{ id: string; name: string } | null>(null);

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");

  const fetchShelters = async (tab: "pending" | "approved" | "rejected") => {
    setLoading(true);
    try {
      const url = tab === "pending" 
        ? "/api/admin/moderation/shelters" 
        : `/api/admin/moderation/shelters?status=${tab}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al cargar solicitudes");
      const data = await res.json();
      setShelters(data);
    } catch {
      toast.error("Hubo un problema al cargar los albergues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters(activeTab);
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/moderation/shelters/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al aprobar");
      }

      toast.success("Albergue aprobado exitosamente.");
      setShelters((prev) => prev.filter((s) => s.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectModalData) return;
    const { id } = rejectModalData;
    
    const res = await fetch(`/api/admin/moderation/shelters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REJECT", reason }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al rechazar");
    }

    toast.success("Albergue rechazado exitosamente.");
    setShelters((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredShelters = shelters.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.nit.toLowerCase().includes(q) ||
      s.municipality.toLowerCase().includes(q) ||
      s.user.email.toLowerCase().includes(q) ||
      s.user.name.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Moderación de Albergues</h2>
        <p className="text-sm text-gray-500 mt-1">
          Revisa y gestiona las solicitudes de registro de albergues en la plataforma.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-4 lg:flex-row justify-between items-start lg:items-center">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "pending"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "approved"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Aprobados
            </button>
            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === "rejected"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Rechazados
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nombre, NIT, email..."
                className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => { setActiveTab("pending"); setSearch(""); }}
              className="h-10 border-gray-200 text-gray-600 shrink-0"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {activeTab === "pending" ? "Albergues Pendientes" : activeTab === "approved" ? "Albergues Aprobados" : "Albergues Rechazados"}
        </h3>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
          {shelters.length} {activeTab === "pending" ? "solicitudes" : activeTab === "approved" ? "verificados" : "rechazados"}
        </span>
      </div>

      {filteredShelters.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Todo al día</h3>
          <p className="text-gray-500 max-w-sm">
            {activeTab === "pending" 
              ? "No hay solicitudes de nuevos albergues pendientes por revisar en este momento." 
              : activeTab === "approved" 
                ? "No hay albergues aprobados registrados en el sistema."
                : "No hay albergues rechazados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredShelters.map((shelter) => (
            <div key={shelter.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 border-b border-gray-50 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{shelter.name}</h3>
                    <p className="text-sm font-mono text-gray-500">NIT: {shelter.nit}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                    <span>{shelter.address}, <span className="font-medium">{shelter.municipality}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{shelter.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="truncate">{shelter.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{shelter.user.phone}</span>
                  </div>
                </div>

                {shelter.description && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 line-clamp-3 italic">
                      &ldquo;{shelter.description}&rdquo;
                    </p>
                  </div>
                )}
              </div>
              
              {activeTab === "pending" ? (
                <div className="p-4 bg-gray-50 flex gap-3">
                  <Button 
                    className="flex-1 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition" 
                    variant="outline"
                    onClick={() => setRejectModalData({ id: shelter.id, name: shelter.name })}
                    disabled={processingId === shelter.id}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rechazar
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white transition"
                    onClick={() => handleApprove(shelter.id)}
                    disabled={processingId === shelter.id}
                  >
                    {processingId === shelter.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                    Aprobar
                  </Button>
                </div>
              ) : activeTab === "approved" ? (
                <div className="p-4 bg-green-50 flex items-center justify-center text-green-700 font-medium border-t border-green-100">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Albergue Verificado
                </div>
              ) : (
                <div className="p-4 bg-red-50 flex flex-col justify-center text-red-700 font-medium border-t border-red-100 text-sm">
                  <div className="flex items-center mb-1">
                    <X className="h-5 w-5 mr-2" />
                    <span>Solicitud Rechazada</span>
                  </div>
                  {shelter.rejectionReason && (
                    <p className="text-xs text-red-600 mt-1 italic">
                      Motivo: {shelter.rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectModalData && (
        <RejectRequestModal
          isOpen={!!rejectModalData}
          onClose={() => setRejectModalData(null)}
          onConfirm={handleRejectConfirm}
          title="Rechazar Solicitud de Albergue"
          targetName={rejectModalData.name}
        />
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
 * Componente interactivo estilizado para moderar solicitudes de albergues.
 *
 * Lógica Clave:
 * - Diseño alineado con el layout de la plataforma (border-radius, sombras, colores slate/purple).
 * - Incorpora el componente RejectRequestModal para capturar el motivo de rechazo 
 *   en lugar de la API prompt() nativa del navegador.
 *
 */
