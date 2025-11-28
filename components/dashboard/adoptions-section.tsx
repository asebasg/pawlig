'use client';

import { useEffect, useState } from 'react';
import { FileText, ArrowRight, Loader2, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface Adoption {
  id: string;
  petId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  pet?: {
    id: string;
    name: string;
    images: string[];
    breed: string;
  };
  shelter?: {
    id: string;
    name: string;
    contactWhatsApp?: string;
  };
}

interface AdoptionsSectionProps {
  userId: string;
  onCountChange?: (count: number) => void;
}

export default function AdoptionsSection({ userId, onCountChange }: AdoptionsSectionProps) {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    loadAdoptions();
  }, [userId]);

  const loadAdoptions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/adopter/adoptions?limit=3');
      const data = await response.json();
      setAdoptions(data.adoptions || []);
      onCountChange?.(data.total || 0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; icon: any; className: string }> = {
      PENDING: { label: 'Pendiente', icon: Clock, className: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: 'Aprobada', icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      REJECTED: { label: 'Rechazada', icon: XCircle, className: 'bg-red-100 text-red-800' },
    };
    const { label, icon: Icon, className } = config[status] || config.PENDING;
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${className}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const filteredAdoptions = filter === 'ALL' 
    ? adoptions 
    : adoptions.filter(a => a.status === filter);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (adoptions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes postulaciones activas</h3>
        <p className="text-gray-600 mb-6">Explora mascotas y comienza tu proceso de adopción</p>
        <Link
          href="/adopciones"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Ver mascotas disponibles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Mis Postulaciones</h2>
        </div>
        <Link
          href="/user/adoptions"
          className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
        >
          Ver todas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'ALL' ? 'Todas' : f === 'PENDING' ? 'Pendientes' : f === 'APPROVED' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAdoptions.map((adoption) => (
          <div key={adoption.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition">
            <div className="flex gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                {adoption.pet?.images?.[0] ? (
                  <img
                    src={adoption.pet.images[0]}
                    alt={adoption.pet.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                    Sin foto
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {adoption.pet?.name || 'Mascota'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {adoption.shelter?.name}
                      {adoption.pet?.breed && ` • ${adoption.pet.breed}`}
                    </p>
                  </div>
                  {getStatusBadge(adoption.status)}
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Fecha de postulación: {formatDate(adoption.createdAt)}
                </p>

                <div className="flex gap-2">
                  {adoption.pet?.id && (
                    <Link
                      href={`/adopciones/${adoption.pet.id}`}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                    >
                      Ver detalles
                    </Link>
                  )}
                  {adoption.shelter?.contactWhatsApp && (
                    <a
                      href={`https://wa.me/${adoption.shelter.contactWhatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 underline"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Contactar
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
