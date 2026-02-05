'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ClipboardClock
} from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/ui/loader';
import { PetCard, PetCardData } from '@/components/cards/pet-card';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * GET /api/adopter/adoptions
 * Descripción: Muestra el historial y estado de las solicitudes de adopción realizadas por el usuario.
 * Requiere: Sesión de usuario válida.
 * Implementa: HU-004 (Visualización del Panel de Usuario).
 */

interface Adoption {
  id: string;
  petId: string;
  petName: string;
  petSpecies: string;
  petBreed: string | null;
  petAge: number | null;
  petSex: string | null;
  petImages: string[];
  shelter: {
    id: string;
    name: string;
    municipality: string;
    contactWhatsApp?: string;
    contactInstagram?: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  message: string | null;
  createdAt: string;
  updatedAt: string;
  isRecent: boolean;
}

interface AdoptionStats {
  pending: number;
  approved: number;
  rejected: number;
}


// El componente obtiene los datos mediante la sesión del servidor, no requiere props externas
export default function AdoptionsSection() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [stats, setStats] = useState<AdoptionStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Cargar solicitudes
  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/adoptions');

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Sesión expirada');
          }
          throw new Error('Error al cargar solicitudes');
        }

        const data = await response.json();
        setAdoptions(data.data || []);
        setStats(data.stats || { pending: 0, approved: 0, rejected: 0 });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptions();
  }, []);

  // Filtrar adoptions
  const filteredAdoptions = adoptions.filter(
    (adoption) =>
      selectedStatus === 'ALL' ||
      adoption.status === selectedStatus
  );

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-2">
        <h2 className="flex flex-inline items-center text-2xl font-bold text-gray-900 mb-2">
          <ClipboardClock size={26} className="mr-2" />
          Mis Solicitudes de Adopción
        </h2>
        <p className="text-gray-600">
          {adoptions.length === 0
            ? 'No tienes solicitudes de adopción'
            : `Tienes ${adoptions.length} solicitud${adoptions.length !== 1 ? 'es' : ''}`}
        </p>
      </div>

      {/* Stats */}
      {adoptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
          <StatCard
            label="Pendientes"
            value={stats.pending}
            icon={Clock}
            color="yellow"
          />
          <StatCard
            label="Aprobadas"
            value={stats.approved}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            label="Rechazadas"
            value={stats.rejected}
            icon={XCircle}
            color="red"
          />
        </div>
      )}

      {/* Filtros */}
      {adoptions.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {[
            { value: 'ALL', label: 'Todas' },
            { value: 'PENDING', label: 'Pendientes' },
            { value: 'APPROVED', label: 'Aprobadas' },
            { value: 'REJECTED', label: 'Rechazadas' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${selectedStatus === filter.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      {/* Estados */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader />
          <p className="text-gray-500">Cargando solicitudes...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-purple-600 hover:underline"
          >
            Intentar nuevamente
          </button>
        </div>
      ) : adoptions.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No tienes solicitudes de adopción</p>
          <p className="text-sm text-gray-400 mb-4">
            Cuando hagas una solicitud de adopción, aparecerá aquí
          </p>
          <Link
            href="/adopciones"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            Explorar mascotas
          </Link>
        </div>
      ) : filteredAdoptions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No tienes solicitudes con estado: {selectedStatus}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdoptions.map((adoption) => {
            // Mapeo de datos para PetCard
            const petData: PetCardData = {
              id: adoption.petId,
              name: adoption.petName,
              images: adoption.petImages,
              species: adoption.petSpecies,
              breed: adoption.petBreed,
              age: adoption.petAge,
              sex: adoption.petSex,
              shelter: adoption.shelter,
            };

            // Configuración visual según estado
            const isApproved = adoption.status === 'APPROVED';
            const isRejected = adoption.status === 'REJECTED';
            const isPending = adoption.status === 'PENDING';

            const accentColor = isApproved ? 'green' : isRejected ? 'red' : 'orange';

            const StatusBadge = (
              <Badge
                variant={isApproved ? "default" : isRejected ? "destructive" : "secondary"}
                className={`shadow-sm ${isApproved ? 'bg-green-600 hover:bg-green-700' : isPending ? 'bg-amber-500 text-white hover:bg-amber-600' : ''}`}
              >
                {isApproved ? 'Aprobada' : isRejected ? 'Rechazada' : 'Pendiente'}
              </Badge>
            );

            return (
              <PetCard
                key={adoption.id}
                pet={petData}
                accentColor={accentColor}
                imageOverlay={<div className="absolute top-2 right-2">{StatusBadge}</div>}
                footer={
                  <div className="w-full flex flex-col gap-2">
                    {/* Mensaje de rechazo o info extra */}
                    {isRejected && adoption.message && (
                      <div className="bg-red-50 p-2 rounded text-xs text-red-800 border border-red-100 flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                        <span>{adoption.message}</span>
                      </div>
                    )}

                    {isApproved && (
                      <div className="bg-green-50 p-2 rounded text-xs text-green-800 border border-green-100 mb-1">
                        ¡Felicidades! Contacta al albergue para finalizar.
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1 h-8 text-xs" size="sm">
                        <Link href={`/adopciones/${adoption.petId}`}>Ver Mascota</Link>
                      </Button>

                      {isApproved && (
                        <>
                          {adoption.shelter.contactWhatsApp && (
                            <Button asChild variant="default" className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs" size="sm">
                              <a href={`https://wa.me/${adoption.shelter.contactWhatsApp}`} target="_blank" rel="noopener noreferrer">
                                WhatsApp
                              </a>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

/**
 * Componente: Tarjeta de Estadística (Mantenido local por simplicidad, pero estilizado)
 */
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: 'yellow' | 'green' | 'red';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    yellow: 'bg-amber-50 border-amber-200 text-amber-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className={`rounded-lg border p-4 flex items-center justify-between ${colorClasses[color]}`}>
      <div>
        <p className="text-sm font-medium opacity-80">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
      </div>
      <Icon className="w-8 h-8 opacity-80" />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Esta sección proporciona al adoptante una vista clara de sus procesos de adopción
 * en curso y finalizados, con estadísticas rápidas y filtros de estado.
 *
 * Lógica Clave:
 * - Fetching de Datos: Obtiene solicitudes específicas del usuario desde el endpoint del adoptante.
 * - Integración con PetCard: Transforma los datos de la solicitud para que coincidan 
 *   con la interfaz PetCardData, manteniendo la consistencia visual.
 * - Feedback por Estado: Cambia los colores de acento y badges según el estado de la adopción.
 * - Contacto Directo: Habilita botones de WhatsApp solo cuando la solicitud es aprobada.
 *
 * Dependencias Externas:
 * - next/link: Para navegación entre el dashboard y las vistas de detalle.
 * - lucide-react: Para iconografía de estados y estadísticas.
 * - @/components/ui: Button, Badge, Loader.
 *
 */
