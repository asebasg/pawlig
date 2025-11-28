'use client';

import { useState } from 'react';
import FavoritesSection from './FavoritesSection';
import AdoptionsSection from './AdoptionsSection';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AdopterDashboardClientProps {
  userSession: User;
}

/**
 * Componente Cliente: Dashboard del Adoptante
 * 
 * Funcionalidad:
 * - Integra FavoritesSection y AdoptionsSection
 * - Sistema de navegación por tabs
 * - Sincronización de datos entre secciones
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - Ver mascotas favoritas
 * - Ver estado de solicitudes de adopción
 * - Notificaciones destacadas de cambios
 */
export default function AdopterDashboardClient({
  userSession,
}: AdopterDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'adoptions' | 'favorites'>('adoptions');

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
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('adoptions')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'adoptions'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📋 Mis Solicitudes de Adopción
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-3 font-medium transition border-b-2 ${
            activeTab === 'favorites'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          ❤️ Mis Mascotas Favoritas
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'adoptions' && (
          <AdoptionsSection userId={userSession.id} />
        )}
        {activeTab === 'favorites' && (
          <FavoritesSection userId={userSession.id} />
        )}
      </div>
    </div>
  );
}

/**
 * NOTAS TÉCNICAS:
 * 
 * - Componente cliente que maneja el estado de navegación
 * - Delega rendering de secciones a componentes especializados
 * - Ambas secciones cargan datos de forma independiente
 * - Sistema de tabs sin dependencias externas
 * - Diseño consistente con el resto del proyecto
 * - Animación suave al cambiar de tab
 */
