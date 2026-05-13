"use client";

import { useState, useEffect } from "react";
import { Search, X, MapPin, PawPrint, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/**
 * Descripción: Buscador con autocompletado para albergues.
 * Requiere: Endpoint /api/shelters/search.
 * Implementa: ISSUE-91 (Buscador del mapa).
 */

interface ShelterSearchProps {
  onSelect: (shelter: any) => void;
}

export function ShelterSearch({ onSelect }: ShelterSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Busca un albergue por nombre..."
          className="pl-12 pr-12 h-14 bg-white/90 backdrop-blur-md border-2 border-transparent focus-visible:border-primary/50 shadow-xl rounded-2xl text-base transition-all duration-300"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && (query.trim().length >= 2 || loading) && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/40 overflow-hidden z-[50] max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
            <div className="p-6 flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Buscando albergues...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((shelter) => (
                <button
                  key={shelter.id}
                  className="w-full px-5 py-4 text-left hover:bg-primary/5 flex items-center justify-between transition-all group active:scale-[0.98]"
                  onClick={() => {
                    onSelect(shelter);
                    setOpen(false);
                    setQuery(shelter.name);
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {shelter.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-primary/60" />
                      {shelter.municipality}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-lg">
                    <PawPrint className="w-3 h-3" />
                    {shelter.petCount}
                  </Badge>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground italic">
                No encontramos albergues que coincidan con tu búsqueda.
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
