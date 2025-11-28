'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import FavoritesSection from './FavoritesSection';
import ActiveApplicationsSection from './ActiveApplicationsSection';

interface AdopterDashboardClientProps {
  userId: string;
}

/**
 * Componente cliente para el dashboard de adoptante
 * Gestiona:
 * - Carga de favoritos
 * - Carga de solicitudes de adopción
 * - Estados de loading y error
 * - Organización de secciones
 */
export default function AdopterDashboardClient({ userId }: AdopterDashboardClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de secciones
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);

  // Estados para refrescar datos
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Obtener conteos iniciales
    const fetchCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener favoritos
        const favResponse = await fetch('/api/adopter/favorites');
        if (!favResponse.ok) throw new Error('Error al cargar favoritos');
        const favData = await favResponse.json();
        setFavoriteCount(favData.total || 0);

        // Obtener solicitudes
        const appResponse = await fetch('/api/adopter/adoptions');
        if (!appResponse.ok) throw new Error('Error al cargar solicitudes');
        const appData = await appResponse.json();
        setApplicationCount(appData.total || 0);
      } catch (err) {
        console.error('Error al cargar conteos:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [refreshTrigger]);

  // Función para refrescar datos
  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Función para cuando se quita un favorito
  const handleFavoriteRemoved = () => {
    setFavoriteCount((prev) => Math.max(0, prev - 1));
  };

  // Función para cuando se crea una nueva solicitud
  const handleApplicationCreated = () => {
    handleRefresh();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-900">Error al cargar panel</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 text-sm font-semibold text-red-600 hover:text-red-700 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorites Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mascotas Favoritas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{favoriteCount}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-full">
              <span className="text-2xl">❤️</span>
            </div>
          </div>
        </div>

        {/* Applications Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solicitudes Activas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{applicationCount}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Favorites Section */}
        <FavoritesSection
          key={`favorites-${refreshTrigger}`}
          onFavoriteRemoved={handleFavoriteRemoved}
        />

        {/* Active Applications Section */}
        <ActiveApplicationsSection
          key={`applications-${refreshTrigger}`}
          onApplicationCreated={handleApplicationCreated}
        />
      </div>
    </div>
  );
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. MANEJO DE ESTADO:
 *    - isLoading: Mientras se cargan conteos iniciales
 *    - error: Mensaje de error si falla carga
 *    - favoriteCount: Número total de favoritos
 *    - applicationCount: Número total de solicitudes
 *    - refreshTrigger: Fuerza re-render de componentes hijos
 * 
 * 2. FLUJO DE DATOS:
 *    1. Al montar: Obtiene conteos de APIs
 *    2. Renderiza secciones (pasan trigger como key)
 *    3. Cuando se quita favorito: Disminuye contador
 *    4. Cuando se crea solicitud: Recarga todo
 *    5. Usuario puede hacer clic en "Refrescar" en cualquier momento
 * 
 * 3. INTEGRACIÓN CON APIs:
 *    - GET /api/adopter/favorites → { total: number, favorites: Pet[] }
 *    - GET /api/adopter/adoptions → { total: number, adoptions: Adoption[] }
 * 
 * 4. COMPONENTES HIJOS:
 *    - FavoritesSection: Muestra grid de favoritos
 *    - ActiveApplicationsSection: Muestra lista de solicitudes
 *    
 *    Ambos reciben callbacks:
 *    - onFavoriteRemoved: Actualiza contador cuando se quita
 *    - onApplicationCreated: Refrescamultiples datos si es necesario
 * 
 * 5. RESPONSABILIDADES:
 *    - Este componente: Orquestación, conteos, refresh
 *    - FavoritesSection: Renderizado y interacción de favoritos
 *    - ActiveApplicationsSection: Renderizado y seguimiento de solicitudes
 *    - Página servidor: Layout, header, footer, seguridad
 */
