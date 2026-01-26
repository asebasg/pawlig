'use client';

import { useState } from 'react';
import FavoritesSection from './FavoritesSection';
import AdoptionsSection from './AdoptionsSection';
import CartSection from './CartSection';
import { HeartPlus, ClipboardClock, ShoppingCart } from 'lucide-react';

/**
 * Descripción: Dashboard principal para el usuario adoptante con sistema de pestañas para gestionar solicitudes, favoritos y carrito.
 * Requiere: Sesión de usuario válida.
 * Implementa: HU-004 (Visualización del Panel de Usuario).
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

export default function AdopterDashboardClient({
  userSession,
}: AdopterDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'adoptions' | 'favorites' | 'cart'>('adoptions');

  if (!userSession?.id) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Error: No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('adoptions')}
          className={`flex flex-inline px-4 py-3 font-medium transition border-b-2 ${activeTab === 'adoptions'
            ? 'border-purple-600 text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <ClipboardClock size={24} className="mr-2" />
          Mis Solicitudes de Adopción
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-inline px-4 py-3 font-medium transition border-b-2 ${activeTab === 'favorites'
            ? 'border-purple-600 text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <HeartPlus size={24} className='mr-2' />
          Mis Mascotas Favoritas
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-inline px-4 py-3 font-medium transition border-b-2 ${activeTab === 'cart'
            ? 'border-purple-600 text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <ShoppingCart size={24} className="mr-2" />
          Mi Carrito
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'adoptions' && (
          <AdoptionsSection />
        )}
        {activeTab === 'favorites' && (
          <FavoritesSection />
        )}
        {activeTab === 'cart' && (
          <CartSection />
        )}
      </div>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente orquestador gestiona la navegación interna del perfil del adoptante,
 * alternando entre diferentes secciones funcionales.
 *
 * Lógica Clave:
 * - Sistema de Tabs: Uso de estado local 'activeTab' para renderizado condicional de componentes.
 * - Sincronización: Las secciones actúan como componentes independientes que gestionan sus propios datos.
 *
 * Dependencias Externas:
 * - lucide-react: Iconografía para las pestañas de navegación.
 * - Secciones: FavoritesSection, AdoptionsSection, CartSection.
 *
 */
