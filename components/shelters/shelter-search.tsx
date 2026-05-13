"use client";

import { useState, useEffect } from "react";
import { Search, X, MapPin, Loader2 } from "lucide-react";
import { MapShelter } from "@/types/shelter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * Descripción: Buscador con autocompletado para albergues.
 * Requiere: Endpoint /api/shelters/search.
 * Implementa: ISSUE-91 (Buscador del mapa).
 */

interface ShelterSearchProps {
  onSelect: (shelter: MapShelter) => void;
}

export function ShelterSearch({ onSelect }: ShelterSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MapShelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const searchShelters = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/shelters/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error buscando albergues:", error);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(searchShelters, 300);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nombre..."
          className="pl-9 bg-white border-gray-200"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {open && (query.trim().length >= 2 || loading) && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-[50] max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <span>Buscando...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((shelter) => (
                <button
                  key={shelter.id}
                  className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center justify-between transition-colors"
                  onClick={() => {
                    onSelect(shelter);
                    setOpen(false);
                    setQuery(shelter.name);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-gray-900">
                      {shelter.name}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-400" />
                      {shelter.municipality}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px]">
                    {shelter.petCount}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">
                No hay resultados.
              </p>
            </div>
          )}
        </div>
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
 * Buscador "sticky" con efectos visuales modernos.
 *
 * Lógica Clave:
 * - Debounce nativo: Uso de setTimeout en useEffect para evitar peticiones 
 *   innecesarias a la API mientras el usuario escribe.
 * - Diseño: Se utiliza 'backdrop-blur' y transparencias para que el buscador
 *   se integre visualmente con el mapa de fondo.
 *
 */
