"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { ShelterAdoption } from "@/types/adoption";
import { AdoptionStatus } from "@prisma/client";
import { ApplicationsList } from "./applications-list";
import { AdoptionsTable } from "./adoptions-table";
import { ApprovalModal } from "./approval-modal";
import { toast } from "sonner";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * COMPONENTE: AdoptionsClient
 * Descripción: Orquestador principal de la gestión de adopciones para albergues.
 * Requiere: -
 * Implementa: HU-007, RF-011
 */

export default function AdoptionsClient() {
  const [adoptions, setAdoptions] = useState<ShelterAdoption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // Estado para el modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: AdoptionStatus;
    application?: ShelterAdoption;
  }>({
    isOpen: false,
    status: AdoptionStatus.APPROVED,
  });

  // Estado para las pestañas
  const [activeTab, setActiveTab] = useState<"pending" | "managed">("pending");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAdoptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/adoptions?role=shelter");
      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Error al cargar postulaciones");

      setAdoptions(result.data as ShelterAdoption[]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  const handleAction = async (status: AdoptionStatus, reason?: string) => {
    if (!modalState.application) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/api/adoptions/${modalState.application?.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, rejectionReason: reason }),
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.error || "Error al procesar la solicitud");

        toast.success(
          status === AdoptionStatus.APPROVED
            ? "¡Postulación aprobada con éxito!"
            : "Postulación rechazada."
        );
        
        // Recargar datos
        await fetchAdoptions();
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error desconocido";
        toast.error(message);
      }
    });
  };

  const openModal = (applicationId: string, status: AdoptionStatus) => {
    const application = adoptions.find((a) => a.id === applicationId);
    if (application) {
      setModalState({ isOpen: true, status, application });
    }
  };

  // Filtrado
  const pendingAdoptions = adoptions.filter(
    (a) => a.status === AdoptionStatus.PENDING && 
    (a.adopter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const managedAdoptions = adoptions.filter(
    (a) => a.status !== AdoptionStatus.PENDING &&
    (a.adopter.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     a.pet.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Barra de Herramientas */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por mascota o adoptante..."
            className="pl-11 h-12 bg-gray-50 border-none rounded-2xl focus-visible:ring-purple-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => fetchAdoptions()}
            className="p-3 bg-purple-50 text-purple-600 rounded-2xl hover:bg-purple-100 transition-colors disabled:opacity-50"
            disabled={isLoading}
            title="Refrescar datos"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <div className="flex-1 md:flex-none p-3 bg-gray-50 text-gray-500 rounded-2xl flex items-center gap-2 text-sm font-medium border border-gray-100">
            <Filter className="w-4 h-4" />
            <span>{adoptions.length} Solicitudes</span>
          </div>
        </div>
      </div>

      {/* Navegación por Pestañas */}
      <div className="flex bg-gray-100/50 p-1.5 rounded-2xl h-auto mb-8 w-fit">
        <button
          onClick={() => setActiveTab("pending")}
          className={`rounded-xl px-8 py-3 font-bold transition-all flex items-center ${
            activeTab === "pending"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pendientes
          {pendingAdoptions.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] rounded-full">
              {pendingAdoptions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("managed")}
          className={`rounded-xl px-8 py-3 font-bold transition-all ${
            activeTab === "managed"
              ? "bg-white text-purple-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Gestionadas
        </button>
      </div>

      <div className="outline-none">
        {activeTab === "pending" ? (
          <ApplicationsList
            applications={pendingAdoptions}
            isLoading={isLoading}
            onApprove={(id) => openModal(id, AdoptionStatus.APPROVED)}
            onReject={(id) => openModal(id, AdoptionStatus.REJECTED)}
          />
        ) : (
          <AdoptionsTable applications={managedAdoptions} isLoading={isLoading} />
        )}
      </div>

      {/* Modal de Confirmación */}
      <ApprovalModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        petName={modalState.application?.pet.name || ""}
        adopterName={modalState.application?.adopter.name || ""}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleAction}
      />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Punto de entrada para la gestión interactiva de adopciones.
 *
 * Lógica Clave:
 * - State Management: Centraliza el estado de las postulaciones y modales.
 * - Transitions: Utiliza 'useTransition' para manejar acciones de servidor,
 *   permitiendo que la UI permanezca interactiva durante las mutaciones.
 * - Filtering: Implementa búsqueda reactiva por nombre de mascota o adoptante.
 * - Modularidad: Delega la renderización a subcomponentes especializados
 *   (List, Table, Modal).
 *
 * Dependencias Externas:
 * - types/adoption: Garantiza seguridad de tipos sin 'any'.
 * - sonner: Feedback visual mediante toasts.
 *
 */
