"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X, MapPin, Mail, Phone, User, CheckCircle, Briefcase, Search } from "lucide-react";
import { RejectRequestModal } from "@/components/admin/reject-request-modal";
import { ApproveRequestModal } from "@/components/admin/approve-request-modal";
import Link from "next/link";

/**
 * /app/(dashboard)/admin/moderation/vendors/vendor-moderation-client.tsx
 * Descripción: Componente cliente para visualizar y moderar las solicitudes de negocios.
 * Requiere: API /api/admin/moderation/vendors.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */

interface VendorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Vendor {
  id: string;
  businessName: string;
  businessPhone: string | null;
  municipality: string;
  address: string;
  description: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  user: VendorUser;
}

export function VendorModerationClient() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalData, setRejectModalData] = useState<{ id: string; name: string } | null>(null);
  const [approveModalData, setApproveModalData] = useState<{ id: string; name: string } | null>(null);

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");

  const fetchVendors = async (tab: "pending" | "approved" | "rejected") => {
    setLoading(true);
    try {
      const url = tab === "pending" 
        ? "/api/admin/moderation/vendors" 
        : `/api/admin/moderation/vendors?status=${tab}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al cargar solicitudes");
      const data = await res.json();
      setVendors(data);
    } catch {
      toast.error("Hubo un problema al cargar los negocios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(activeTab);
  }, [activeTab]);

  const handleApproveConfirm = async (reason: string) => {
    if (!approveModalData) return;
    const { id } = approveModalData;

    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/moderation/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE", reason }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al aprobar");
      }

      toast.success("Negocio aprobado exitosamente.");
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) throw error;
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectModalData) return;
    const { id } = rejectModalData;
    
    const res = await fetch(`/api/admin/moderation/vendors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REJECT", reason }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al rechazar");
    }

    toast.success("Negocio rechazado exitosamente.");
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const filteredVendors = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.businessName.toLowerCase().includes(q) ||
      v.municipality.toLowerCase().includes(q) ||
      v.user.email.toLowerCase().includes(q) ||
      v.user.name.toLowerCase().includes(q)
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
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Moderación de Negocios</h2>
        <p className="text-sm text-gray-500 mt-1">
          Revisa y gestiona las solicitudes de registro de negocios proveedores en la plataforma.
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
                placeholder="Buscar por nombre, municipio, email..."
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
          {activeTab === "pending" ? "Negocios Pendientes" : activeTab === "approved" ? "Negocios Aprobados" : "Negocios Rechazados"}
        </h3>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
          {vendors.length} {activeTab === "pending" ? "solicitudes" : activeTab === "approved" ? "verificados" : "rechazados"}
        </span>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Todo al día</h3>
          <p className="text-gray-500 max-w-sm">
            {activeTab === "pending" 
              ? "No hay solicitudes de nuevos negocios pendientes por revisar en este momento." 
              : activeTab === "approved" 
                ? "No hay negocios aprobados registrados en el sistema."
                : "No hay negocios rechazados en el sistema."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{vendor.businessName}</h3>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400 shrink-0" />
                    <span>{vendor.address}, <span className="font-medium">{vendor.municipality}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
                    <span>{vendor.businessPhone || "N/A"} (Negocio)</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-800">{vendor.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{vendor.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{vendor.user.phone} (Rep.)</span>
                    </div>
                  </div>
                </div>

                {vendor.description && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 line-clamp-3 italic">
                      &ldquo;{vendor.description}&rdquo;
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                {activeTab === "pending" ? (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition" 
                      variant="outline"
                      onClick={() => setRejectModalData({ id: vendor.id, name: vendor.businessName })}
                      disabled={processingId === vendor.id}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white transition"
                      onClick={() => setApproveModalData({ id: vendor.id, name: vendor.businessName })}
                      disabled={processingId === vendor.id}
                    >
                      {processingId === vendor.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                      Aprobar
                    </Button>
                  </div>
                ) : activeTab === "approved" ? (
                  <div className="flex items-center justify-center text-green-700 font-medium py-2 bg-green-50 rounded-lg border border-green-100 text-sm">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600 shrink-0" />
                    <span>Negocio Verificado</span>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center text-red-700 font-medium text-sm p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center">
                      <X className="h-4 w-4 mr-2 text-red-600 shrink-0" />
                      <span>Solicitud Rechazada</span>
                    </div>
                    {vendor.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1 italic pl-6 font-normal">
                        Motivo: {vendor.rejectionReason}
                      </p>
                    )}
                  </div>
                )}

                <Link href={`/admin/moderation/users/${vendor.user.id}/view`} passHref className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    Ver Perfil de Usuario
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModalData && (
        <RejectRequestModal
          isOpen={!!rejectModalData}
          onClose={() => setRejectModalData(null)}
          onConfirm={handleRejectConfirm}
          title="Rechazar Solicitud de Negocio"
          targetName={rejectModalData.name}
        />
      )}

      {approveModalData && (
        <ApproveRequestModal
          isOpen={!!approveModalData}
          onClose={() => setApproveModalData(null)}
          onConfirm={handleApproveConfirm}
          title="Aprobar Solicitud de Negocio"
          targetName={approveModalData.name}
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
 * Componente interactivo estilizado para moderar solicitudes de negocios.
 *
 * Lógica Clave:
 * - Diseño alinado con el layout de la plataforma (border-radius, sombras, colores slate/purple).
 * - Incorpora el componente RejectRequestModal para capturar el motivo de rechazo 
 *   en lugar de la API prompt() nativa del navegador.
 * - Unificación estética de las tarjetas de moderación (pendiente, aprobado y rechazado) 
 *   compartiendo el mismo diseño de pie de página (footer) y fondo gris consistente.
 * - Botón de acceso directo para visualizar el perfil de usuario asociado en /admin/moderation/users/[id]/view.
 *
 * Dependencias Externas:
 * - next/link: Para navegación entre rutas del dashboard.
 * - lucide-react: Iconografía unificada (User, Check, X, etc.).
 *
 */
