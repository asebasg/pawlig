"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { PetFilter, FilterState } from "@/components/forms/pet-filter";
import axios from "axios";
import { Pet } from "@prisma/client";

/**
 * Página de Galería de Adopciones con Filtros
 * 
 * Permite a usuarios (anónimos o autenticados) buscar mascotas
 * con filtros por especie, tamaño y municipio
 * 
 * Ruta: /adopciones
 */

interface PetWithShelter extends Pet {
  size?: string;
  shelter: {
    id: string;
    name: string;
    municipality: string;
    contactWhatsApp?: string;
    contactInstagram?: string;
  };
}

interface SearchResult {
  count: number;
  pets: PetWithShelter[];
  hasMore: boolean;
}

export default function AdopcionesPage() {
  const { data: session } = useSession();
  const [pets, setPets] = useState<PetWithShelter[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({});

  // Fetch all species on mount
  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get<SearchResult>("/api/pets/search");
        // Extract unique species from initial results
        const uniqueSpecies = Array.from(
          new Set(response.data.pets.map((pet) => pet.species))
        );
        setSpecies(uniqueSpecies);
      } catch (err) {
        console.error("Error fetching species:", err);
      }
    };

    fetchSpecies();
  }, []);

  // Fetch pets when filters change
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (filters.species) queryParams.append("species", filters.species);
        if (filters.size) queryParams.append("size", filters.size);
        if (filters.municipality) queryParams.append("municipality", filters.municipality);

        const response = await axios.get<SearchResult>(
          `/api/pets/search?${queryParams.toString()}`
        );
        setPets(response.data.pets);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Error al cargar las mascotas");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">PawLig</h1>
            <div className="flex items-center gap-4">
              {session?.user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Hola, <span className="font-semibold">{session.user.name}</span>
                  </span>
                  <a
                    href="/api/auth/signout"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cerrar sesión
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Iniciar sesión
                  </a>
                  <a
                    href="/register"
                    className="text-sm text-white bg-purple-600 px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Registrarse
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Encuentra tu Compañero Perfecto</h2>
          <p className="text-gray-600 mt-2">
            Explora nuestras mascotas disponibles para adopción
          </p>
        </div>

        {/* Filter Component */}
        <PetFilter onFilterChange={handleFilterChange} species={species} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <>
            {pets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-4">
                  Intenta ampliar tus criterios de búsqueda seleccionando menos filtros.
                </p>
                <button
                  onClick={() => setFilters({})}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ver todas las mascotas
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Se encontraron <span className="font-semibold">{pets.length}</span> mascota(s)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Pet Image */}
                      {pet.images && pet.images.length > 0 ? (
                        <img
                          src={pet.images[0]}
                          alt={pet.name}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">Sin imagen</span>
                        </div>
                      )}

                      {/* Pet Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                        
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p>
                            <span className="font-semibold">Especie:</span> {pet.species}
                          </p>
                          {pet.breed && (
                            <p>
                              <span className="font-semibold">Raza:</span> {pet.breed}
                            </p>
                          )}
                          {pet.age && (
                            <p>
                              <span className="font-semibold">Edad:</span> {pet.age} años
                            </p>
                          )}
                          {pet.sex && (
                            <p>
                              <span className="font-semibold">Sexo:</span> {pet.sex}
                            </p>
                          )}
                          {pet.size && (
                            <p>
                              <span className="font-semibold">Tamaño:</span> {pet.size}
                            </p>
                          )}
                        </div>

                        {pet.description && (
                          <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                            {pet.description}
                          </p>
                        )}

                        {/* Shelter Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">
                            {pet.shelter.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            📍 {pet.shelter.municipality?.replace(/_/g, " ")}
                          </p>
                          {(pet.shelter.contactWhatsApp || pet.shelter.contactInstagram) && (
                            <div className="mt-2 flex gap-2">
                              {pet.shelter.contactWhatsApp && (
                                <a
                                  href={`https://wa.me/${pet.shelter.contactWhatsApp.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-green-600 hover:text-green-700 font-semibold"
                                >
                                  WhatsApp
                                </a>
                              )}
                              {pet.shelter.contactInstagram && (
                                <a
                                  href={`https://instagram.com/${pet.shelter.contactInstagram}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-pink-600 hover:text-pink-700 font-semibold"
                                >
                                  Instagram
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}