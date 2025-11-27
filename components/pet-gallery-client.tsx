'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, Heart, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  status: string;
  description: string;
  images: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
  };
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PetGalleryClientProps {
  userSession: UserSession | null;
}

const MUNICIPALITIES = [
  { value: 'MEDELLIN', label: 'Medellín' },
  { value: 'BELLO', label: 'Bello' },
  { value: 'ITAGUI', label: 'Itagüí' },
  { value: 'ENVIGADO', label: 'Envigado' },
  { value: 'SABANETA', label: 'Sabaneta' },
  { value: 'LA_ESTRELLA', label: 'La Estrella' },
  { value: 'CALDAS', label: 'Caldas' },
  { value: 'COPACABANA', label: 'Copacabana' },
  { value: 'GIRARDOTA', label: 'Girardota' },
  { value: 'BARBOSA', label: 'Barbosa' }
];

export default function PetGalleryClient({ userSession }: PetGalleryClientProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [municipalityFilter, setMunicipalityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Cargar mascotas desde API
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      // Solo agregar filtros si tienen valor
      if (speciesFilter) params.append('species', speciesFilter);
      if (municipalityFilter) params.append('municipality', municipalityFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('status', 'AVAILABLE'); // Solo mascotas disponibles
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const response = await fetch(`/api/pets?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar mascotas');
      }

      const data = await response.json();
      
      setPets(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalCount(data.pagination?.totalCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar mascotas al cambiar filtros o página
  useEffect(() => {
    fetchPets();
  }, [speciesFilter, municipalityFilter, currentPage]);

  // Búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchPets();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Limpiar filtros
  const handleClearFilters = () => {
    setSpeciesFilter('');
    setMunicipalityFilter('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Filtrar mascotas
        </h2>
        
        {/* Búsqueda por texto */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o raza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros desplegables */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas las especies</option>
            <option value="Perro">Perros</option>
            <option value="Gato">Gatos</option>
            <option value="Otro">Otros</option>
          </select>

          <select 
            value={municipalityFilter}
            onChange={(e) => setMunicipalityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos los municipios</option>
            {MUNICIPALITIES.map((mun) => (
              <option key={mun.value} value={mun.value}>
                {mun.label}
              </option>
            ))}
          </select>

          <button 
            onClick={fetchPets}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>

          <button 
            onClick={handleClearFilters}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Contador de resultados */}
        {!loading && (
          <div className="mt-4 text-sm text-gray-600">
            {totalCount === 0 ? (
              'No se encontraron mascotas'
            ) : (
              `${totalCount} mascota${totalCount !== 1 ? 's' : ''} encontrada${totalCount !== 1 ? 's' : ''}`
            )}
          </div>
        )}
      </div>

      {/* Galería de mascotas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-500">Cargando mascotas...</p>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPets}
              className="text-purple-600 hover:underline"
            >
              Intentar nuevamente
            </button>
          </div>
        ) : pets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-2">
              No hay mascotas disponibles con estos filtros.
            </p>
            <p className="text-sm text-gray-400">
              Intenta cambiar los criterios de búsqueda.
            </p>
          </div>
        ) : (
          pets.map((pet) => (
            <PetCard 
              key={pet.id} 
              pet={pet} 
              userSession={userSession}
            />
          ))
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && !loading && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Anterior
          </button>
          
          <span className="text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

// Componente PetCard
interface PetCardProps {
  pet: Pet;
  userSession: UserSession | null;
}

function PetCard({ pet, userSession }: PetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  const handleFavoriteClick = async () => {
    if (!userSession) {
      // Redirigir a login si no está autenticado
      window.location.href = `/login?callbackUrl=/adopciones`;
      return;
    }

    try {
      setLoadingFavorite(true);
      
      const response = await fetch(`/api/pets/${pet.id}/favorite`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Error al actualizar favorito');
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group">
      {/* Imagen */}
      <div className="relative h-64 bg-gray-200">
        {pet.images && pet.images.length > 0 ? (
          <img 
            src={pet.images[0]} 
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin foto
          </div>
        )}
        
        {/* Botón de favorito */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>

        {/* Badge de estado */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            Disponible
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {pet.name}
        </h3>
        
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p>{pet.species} {pet.breed && `• ${pet.breed}`}</p>
          {pet.age && <p>{pet.age} año{pet.age !== 1 ? 's' : ''}</p>}
          {pet.sex && <p>{pet.sex}</p>}
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span>{pet.shelter.name}</span>
        </div>

        <Link
          href={`/adopciones/${pet.id}`}
          className="block w-full text-center bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

/**
 * MEJORAS IMPLEMENTADAS:
 * 
 * 1. ✅ Filtros funcionales con estado y onChange
 * 2. ✅ Integración completa con API /api/pets
 * 3. ✅ Búsqueda por texto con debounce (500ms)
 * 4. ✅ Manejo de errores con try-catch
 * 5. ✅ Paginación funcional (12 mascotas por página)
 * 6. ✅ Loading states apropiados
 * 7. ✅ Municipios desde constante (fácil de mantener)
 * 8. ✅ Componente PetCard separado y reutilizable
 * 9. ✅ Sistema de favoritos con autenticación
 * 10. ✅ Contador de resultados
 * 11. ✅ Botón de limpiar filtros
 * 12. ✅ Estados vacíos y de error con UX clara
 * 13. ✅ Iconos de Lucide React
 * 14. ✅ Responsive design mejorado
 * 15. ✅ Hover effects en cards
 * 
 * SEGURIDAD:
 * - ✅ Validación de userSession antes de acciones protegidas
 * - ✅ Redirección a login si no autenticado
 * - ✅ Manejo seguro de errores sin exponer detalles
 * - ✅ Sanitización de query params en servidor (API)
 * 
 * TRAZABILIDAD:
 * - HU-006: Filtro y búsqueda ✅
 * - RF-010: Búsqueda y filtrado ✅
 * - RF-005: Sistema de favoritos ✅
 */