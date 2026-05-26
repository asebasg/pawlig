"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, MapPin, Mail, Phone, User, CheckCircle, Briefcase } from "lucide-react";
import { RejectRequestModal } from "@/components/admin/reject-request-modal";

/**
 * /app/(dashboard)/admin/moderation/vendors/vendor-moderation-client.tsx
 * Descripción: Componente cliente para visualizar y moderar las solicitudes de negocios.
 * Requiere: API /api/admin/moderation/vendors.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */

interface VendorUser {
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
  createdAt: string;
  user: VendorUser;
}

export function VendorModerationClient() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModalData, setRejectModalData] = useState<{ id: string; name: string } | null>(null);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/moderation/vendors");
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
    fetchVendors();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/moderation/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al aprobar");
      }

      toast.success("Negocio aprobado exitosamente.");
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Negocios Pendientes</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
          {vendors.length} solicitudes
        </span>
      </div>

      {vendors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Todo al día</h3>
          <p className="text-gray-500 max-w-sm">No hay solicitudes de nuevos negocios pendientes por revisar en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 border-b border-gray-50 flex-1">
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
              
              <div className="p-4 bg-gray-50 flex gap-3">
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
                  onClick={() => handleApprove(vendor.id)}
                  disabled={processingId === vendor.id}
                >
                  {processingId === vendor.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                  Aprobar
                </Button>
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
 * - Diseño alineado con el layout general (border-radius, sombras, tipografía).
 * - Incorpora el componente RejectRequestModal para capturar el motivo de rechazo 
 *   de forma modal y limpia.
 */
