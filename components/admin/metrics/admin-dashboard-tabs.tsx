"use client";

import { useState } from "react";
import { AdminMetricsClient } from "@/components/admin/metrics/admin-metrics-client";
import { VendorMetricsClient } from "@/components/vendor/metrics/vendor-metrics-client";
import { Button } from "@/components/ui/button";

export function AdminDashboardTabs() {
  const [activeTab, setActiveTab] = useState<"adoptions" | "sales">("adoptions");

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-px">
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 font-medium ${
            activeTab === "adoptions"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("adoptions")}
        >
          Métricas de Adopciones
        </Button>
        <Button
          variant="ghost"
          className={`rounded-none border-b-2 font-medium ${
            activeTab === "sales"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("sales")}
        >
          Métricas de Ventas
        </Button>
      </div>

      <div className="pt-4">
        {activeTab === "adoptions" && <AdminMetricsClient />}
        {activeTab === "sales" && <VendorMetricsClient isAdmin={true} />}
      </div>
    </div>
  );
}

/**
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * 
 * Descripción General:
 * Componente cliente para manejar la navegación entre métricas en el panel de administrador.
 */
