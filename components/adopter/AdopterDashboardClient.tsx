"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FavoritesSection from "./FavoritesSection";
import AdoptionsSection from "./AdoptionsSection";
import CartSection from "./CartSection";
import { HeartPlus, ClipboardClock, ShoppingCart } from "lucide-react";

/**
 * Descripción: Dashboard principal para el usuario adoptante con sistema de pestañas para gestionar solicitudes, favoritos y carrito.
 * Requiere: Sesión de usuario válida y Suspense para useSearchParams.
 * Implementa: HU-004 (Visualización del Panel de Usuario) y HU-009 (Integración del carrito).
 */

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AdopterDashboardClientProps {
  userSession: User;
}

function AdopterDashboardContent({ userSession }: AdopterDashboardClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sincronizar pestaña activa con la URL
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"adoptions" | "favorites" | "cart">("adoptions");

  useEffect(() => {
    if (tabParam === "favorites" || tabParam === "cart" || tabParam === "adoptions") {
      setActiveTab(tabParam as "favorites" | "cart" | "adoptions");
    }
  }, [tabParam]);

  const handleTabChange = (tab: "adoptions" | "favorites" | "cart") => {
    setActiveTab(tab);
    // Actualizar URL sin recargar la página para mantener consistencia
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/user?${params.toString()}`, { scroll: false });
  };

  if (!userSession?.id) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error: No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => handleTabChange("adoptions")}
          className={`flex items-center px-4 py-3 font-medium transition border-b-2 ${activeTab === "adoptions"
            ? "border-purple-600 text-purple-600"
            : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
        >
          <ClipboardClock size={20} className="mr-2" />
          Mis Solicitudes
        </button>
        <button
          onClick={() => handleTabChange("favorites")}
          className={`flex items-center px-4 py-3 font-medium transition border-b-2 ${activeTab === "favorites"
            ? "border-purple-600 text-purple-600"
            : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
        >
          <HeartPlus size={20} className="mr-2" />
          Mis Favoritos
        </button>
        <button
          onClick={() => handleTabChange("cart")}
          className={`flex items-center px-4 py-3 font-medium transition border-b-2 ${activeTab === "cart"
            ? "border-purple-600 text-purple-600"
            : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
        >
          <ShoppingCart size={20} className="mr-2" />
          Mi Carrito
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === "adoptions" && (
          <AdoptionsSection />
        )}
        {activeTab === "favorites" && (
          <FavoritesSection />
        )}
        {activeTab === "cart" && (
          <CartSection />
        )}
      </div>
    </div>
  );
}

export default function AdopterDashboardClient(props: AdopterDashboardClientProps) {
  return (
    <Suspense fallback={<div className="h-40 bg-gray-100 animate-pulse rounded-xl" />}>
      <AdopterDashboardContent {...props} />
    </Suspense>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente orquestador gestiona la navegación interna del perfil del adoptante.
 * Se ha actualizado para soportar la activación de pestañas mediante parámetros de URL.
 *
 * Lógica Clave:
 * - Sincronización de URL: Utiliza useSearchParams para permitir que enlaces externos
 *   (como el botón del carrito) activen una pestaña específica al navegar.
 * - Suspense: Requerido por Next.js para componentes que utilizan useSearchParams
 *   durante la generación estática.
 *
 * Dependencias Externas:
 * - lucide-react: Iconografía.
 * - next/navigation: Hooks para gestión de rutas y parámetros.
 *
 */
