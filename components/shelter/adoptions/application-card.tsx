"use client";

import Image from "next/image";
import { ShelterAdoption } from "@/types/adoption";
import { AdoptionStatus } from "@prisma/client";
import { Calendar, MapPin, Phone, Mail, Check, X, MessageSquare } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * COMPONENTE: ApplicationCard
 * Descripción: Tarjeta individual que muestra los detalles de una postulación de adopción.
 * Requiere: Objeto de tipo ShelterAdoption.
 * Implementa: HU-007
 */

interface ApplicationCardProps {
  application: ShelterAdoption;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApplicationCard({
  application,
  onApprove,
  onReject,
}: ApplicationCardProps) {
  const { adopter, pet, status, createdAt, message } = application;

  const statusColors: Record<AdoptionStatus, string> = {
    [AdoptionStatus.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [AdoptionStatus.APPROVED]: "bg-teal-100 text-teal-700 border-teal-200",
    [AdoptionStatus.REJECTED]: "bg-pink-100 text-pink-700 border-pink-200",
  };

  const statusLabels: Record<AdoptionStatus, string> = {
    [AdoptionStatus.PENDING]: "Pendiente",
    [AdoptionStatus.APPROVED]: "Aprobada",
    [AdoptionStatus.REJECTED]: "Rechazada",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Header con Estado y Fecha */}
      <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <Badge className={`${statusColors[status as AdoptionStatus]} font-semibold text-xs border`}>
          {statusLabels[status as AdoptionStatus]}
        </Badge>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(createdAt).toLocaleDateString("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Info del Adoptante */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg border-2 border-white shadow-sm shrink-0">
            {adopter.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
              {adopter.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{adopter.municipality}</span>
            </div>
          </div>
        </div>

        {/* Detalles de Contacto */}
        <div className="grid grid-cols-1 gap-2 mb-6">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="p-1.5 bg-gray-50 rounded-lg shrink-0">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="truncate">{adopter.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="p-1.5 bg-gray-50 rounded-lg shrink-0">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span>{adopter.phone}</span>
          </div>
        </div>

        {/* Mascota Relacionada */}
        <div className="mt-auto pt-4 border-t border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Mascota Solicitada
          </p>
          <div className="flex items-center gap-3 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100/50">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white shadow-sm">
              <Image
                src={pet.images[0] || "/images/placeholder-pet.png"}
                alt={pet.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{pet.name}</p>
              <p className="text-xs text-purple-600 font-medium">
                {pet.breed || pet.species}
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje si existe */}
        {message && (
          <div className="mt-4 p-3 bg-blue-50/30 rounded-xl border border-blue-100/50">
            <div className="flex items-center gap-1.5 mb-1.5 text-blue-600">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Mensaje</span>
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed line-clamp-2">
              &quot;{message}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Acciones */}
      {status === AdoptionStatus.PENDING && (
        <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-50 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 gap-2 text-pink-600 border-pink-100 hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200"
            onClick={() => onReject(application.id)}
          >
            <X className="w-4 h-4" />
            Rechazar
          </Button>
          <Button
            className="flex-1 h-10 gap-2 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => onApprove(application.id)}
          >
            <Check className="w-4 h-4" />
            Aprobar
          </Button>
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
 * Representación visual de una postulación de adopción en formato tarjeta.
 *
 * Lógica Clave:
 * - Diseño Adaptativo: Muestra información del adoptante y la mascota de forma compacta.
 * - Acciones Condicionales: Los botones de aprobar/rechazar solo aparecen si el
 *   estado es 'PENDING'.
 * - Fallbacks: Maneja imágenes de mascotas no disponibles y visualización de mensajes.
 *
 * Dependencias Externas:
 * - next/image: Para carga optimizada de imágenes de mascotas.
 * - lucide-react: Iconografía semántica.
 *
 */
