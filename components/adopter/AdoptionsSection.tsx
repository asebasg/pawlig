'use client';

import { useEffect, useState } from 'react';
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import NotificationBanner from './NotificationBanner';

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

interface AdoptionsSectionProps {
  userId: string;
}

/**
 * Componente: Sección de Solicitudes de Adopción
 * 
 * Características:
 * - Lista todas las solicitudes de adopción del usuario
 * - Filtrado por estado (PENDING, APPROVED, REJECTED)
 * - Notificación destacada para cambios recientes (< 24h)
 * - Información detallada del albergue y mascota
 * - Estados visuales y badges
 * - Contacto directo con albergues
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - Ver estado de solicitudes de adopción activas
 * - Recibir notificación destacada de cambios de estado
 */
export default function AdoptionsSection({ userId }: AdoptionsSectionProps) {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [stats, setStats] = useState<AdoptionStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [notificationAdoption, setNotificationAdoption] = useState<Adoption | null>(
    null
  );

  // Cargar solicitudes
  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/adopter/adoptions');

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Sesión expirada');
          }
          throw new Error('Error al cargar solicitudes');
        }

        const data = await response.json();
        setAdoptions(data.data || []);
        setStats(data.stats || { pending: 0, approved: 0, rejected: 0 });

        // Buscar y mostrar adoptiones recientes
        const recentAdoptions = (data.data || []).filter(
          (a: Adoption) => a.isRecent
        );
        if (recentAdoptions.length > 0) {
          setNotificationAdoption(recentAdoptions[0]);
        }
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
      {/* Notificación destacada */}
      {notificationAdoption && (
        <NotificationBanner adoption={notificationAdoption} />
      )}

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📋 Mis Solicitudes de Adopción
        </h2>
        <p className="text-gray-600">
          {adoptions.length === 0
            ? 'No tienes solicitudes de adopción'
            : `Tienes ${adoptions.length} solicitud${adoptions.length !== 1 ? 'es' : ''}`}
        </p>
      </div>

      {/* Stats */}
      {adoptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { value: 'ALL', label: 'Todas' },
            { value: 'PENDING', label: 'Pendientes' },
            { value: 'APPROVED', label: 'Aprobadas' },
            { value: 'REJECTED', label: 'Rechazadas' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedStatus === filter.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.label}
              {filter.value === 'ALL'
                ? ` (${adoptions.length})`
                : filter.value === 'PENDING'
                  ? ` (${stats.pending})`
                  : filter.value === 'APPROVED'
                    ? ` (${stats.approved})`
                    : ` (${stats.rejected})`}
            </button>
          ))}
        </div>
      )}

      {/* Estados */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
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
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
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
        <div className="space-y-4">
          {filteredAdoptions.map((adoption) => (
            <AdoptionCard
              key={adoption.id}
              adoption={adoption}
              isRecent={adoption.isRecent}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Componente: Tarjeta de Estadística
 */
interface StatCardProps {
  label: string;
  value: number;
  icon: any;
  color: 'yellow' | 'green' | 'red';
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
  };

  const iconColorClasses = {
    yellow: 'text-yellow-600',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <Icon className={`w-10 h-10 ${iconColorClasses[color]}`} />
      </div>
    </div>
  );
}

/**
 * Componente: Tarjeta de Solicitud de Adopción
 */
interface AdoptionCardProps {
  adoption: Adoption;
  isRecent: boolean;
}

function AdoptionCard({ adoption, isRecent }: AdoptionCardProps) {
  const statusConfig = {
    PENDING: {
      badge: 'bg-yellow-100 text-yellow-800',
      label: 'Pendiente',
      icon: Clock,
      description: 'Tu solicitud está siendo revisada por el albergue',
    },
    APPROVED: {
      badge: 'bg-green-100 text-green-800',
      label: '¡Aprobada!',
      icon: CheckCircle,
      description: 'Tu solicitud fue aprobada. Contacta al albergue para coordinar',
    },
    REJECTED: {
      badge: 'bg-red-100 text-red-800',
      label: 'Rechazada',
      icon: XCircle,
      description: 'Tu solicitud fue rechazada por el albergue',
    },
  };

  const config = statusConfig[adoption.status];
  const StatusIcon = config.icon;

  return (
    <div
      className={`rounded-lg border-2 p-4 transition ${
        isRecent ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex gap-4">
        {/* Imagen */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
            {adoption.petImages && adoption.petImages.length > 0 ? (
              <img
                src={adoption.petImages[0]}
                alt={adoption.petName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                Sin foto
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {adoption.petName}
              </h3>
              <p className="text-sm text-gray-600">
                {adoption.petSpecies}
                {adoption.petBreed && ` • ${adoption.petBreed}`}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}>
              {config.label}
            </span>
          </div>

          {/* Status description */}
          <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
            <StatusIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{config.description}</span>
          </div>

          {/* Albergue */}
          <div className="bg-gray-50 rounded p-2 mb-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900">{adoption.shelter.name}</p>
                <p className="text-gray-600">{adoption.shelter.municipality}</p>
                {/* Contacto */}
                <div className="flex gap-2 mt-1">
                  {adoption.shelter.contactWhatsApp && (
                    <a
                      href={`https://wa.me/${adoption.shelter.contactWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-xs font-medium"
                    >
                      WhatsApp
                    </a>
                  )}
                  {adoption.shelter.contactInstagram && (
                    <a
                      href={`https://instagram.com/${adoption.shelter.contactInstagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 text-xs font-medium"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message si existe */}
          {adoption.message && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3 text-sm">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-900">{adoption.message}</p>
              </div>
            </div>
          )}

          {/* Fechas */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Enviada: {new Date(adoption.createdAt).toLocaleDateString()}</p>
            <p>Última actualización: {new Date(adoption.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* CTA según estado */}
      {adoption.status === 'APPROVED' && (
        <Link
          href={`/adopciones/${adoption.petId}`}
          className="mt-4 block text-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          Ver detalles de la mascota
        </Link>
      )}
    </div>
  );
}

/**
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * 
 * ✅ Carga asincrónica de solicitudes
 * ✅ Filtrado por estado (PENDING, APPROVED, REJECTED)
 * ✅ Estadísticas en tiempo real
 * ✅ Notificación destacada para cambios recientes
 * ✅ Información detallada de mascota y albergue
 * ✅ Enlaces de contacto directo (WhatsApp, Instagram)
 * ✅ Badges visuales por estado
 * ✅ Mensajes del albergue (razón de rechazo, etc)
 * ✅ Estado de carga y errores
 * ✅ Responsive design
 * ✅ Integración con NotificationBanner
 * ✅ CTA contextual por estado
 */
