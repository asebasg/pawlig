"use client";

import { MapPin, Phone, Instagram, Info, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

/**
 * Descripción: Tarjeta de información que se muestra dentro del Popup del mapa.
 * Requiere: Información básica del albergue.
 * Implementa: ISSUE-91 (Popup de albergue).
 */

interface ShelterCardProps {
  shelter: {
    id: string;
    name: string;
    municipality: string;
    address: string;
    petCount: number;
    contactWhatsApp?: string | null;
    contactInstagram?: string | null;
  };
  onOpenLegal: (id: string) => void;
}

export function ShelterCard({ shelter, onOpenLegal }: ShelterCardProps) {
  return (
    <div className="w-[260px] p-1 space-y-3 font-sans">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-primary leading-tight line-clamp-2">
          {shelter.name}
        </h3>
        <div className="flex items-start text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{shelter.municipality}, {shelter.address}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-none flex items-center gap-1 text-[10px] py-0 px-2">
          <PawPrint className="w-3 h-3" />
          {shelter.petCount} mascotas
        </Badge>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {shelter.contactWhatsApp && (
          <a
            href={`https://wa.me/${shelter.contactWhatsApp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            title="WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        {shelter.contactInstagram && (
          <a
            href={`https://instagram.com/${shelter.contactInstagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={() => onOpenLegal(shelter.id)}
          className="flex-1 flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          title="Ver Información Legal"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-2 border-t">
        <Button asChild className="w-full h-8 text-xs font-semibold" variant="outline">
          <Link href={`/adopciones?shelter=${shelter.id}`}>
            Ver mascotas
          </Link>
        </Button>
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
 * Este componente renderiza el contenido de los Popups de Leaflet. Se diseñó
 * con un ancho fijo y estilos optimizados para que no rompa el contenedor del mapa.
 *
 * Lógica Clave:
 * - Uso de 'line-clamp' para manejar nombres o direcciones muy largas.
 * - Enlaces dinámicos a WhatsApp e Instagram con limpieza de caracteres.
 *
 */
