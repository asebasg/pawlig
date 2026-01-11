'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertCircle, LucideIcon } from 'lucide-react';
import Loader from '@/components/ui/loader';
import Image from 'next/image';
import { toast } from 'sonner';

/**
 * GET /api/shelters/adoptions
 * PATCH /api/adoptions/[id]
 * Descripción: Componente de cliente para gestionar las solicitudes de adopción recibidas por un refugio.
 * Requiere: Usuario autenticado con rol de refugio (SHELTER).
 * Implementa: Gestión de postulaciones de adopción.
 */

interface Adopter {
  id: string;
  name: string;
  email: string;
  phone: string;
  municipality: string;
  address: string;
  createdAt: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  sex: string | null;
  images: string[];
  status: string;
}

interface Adoption {
  id: string;
  status: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  adopter: Adopter;
  pet: Pet;
}

export default function AdoptionApplicationsClient() {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal de rechazo
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedAdoptionId, setSelectedAdoptionId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de aprobación
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedAdoptionForApprove, setSelectedAdoptionForApprove] = useState<string | null>(null);

  // Cargar postulaciones
  const fetchAdoptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      const response = await fetch(`/api/shelters/adoptions?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar postulaciones');
      }

      if (data.success) {
        setAdoptions(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      }
    } catch (err: unknown) {
      console.error('Error cargando postulaciones:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar postulaciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => {
    fetchAdoptions();
  }, [fetchAdoptions]);

  // Manejar aprobación
  const handleApprove = async (adoptionId: string) => {
    const toastId = toast.loading('Aprobando solicitud...');
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/adoptions/${adoptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'APPROVED',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al aprobar postulación');
      }

      if (data.data) {
        toast.success('Solicitud aprobada exitosamente', { id: toastId });
        await fetchAdoptions();
        setShowApproveModal(false);
        setSelectedAdoptionForApprove(null);
      }
    } catch (err: unknown) {
      console.error('Error aprobando postulación:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al aprobar postulación';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar rechazo
  const handleReject = async () => {
    if (!selectedAdoptionId) return;

    if (!rejectionReason.trim()) {
      toast.error('Por favor, ingresa una razón para el rechazo');
      return;
    }

    const toastId = toast.loading('Rechazando solicitud...');

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/adoptions/${selectedAdoptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al rechazar postulación');
      }

      if (data.data) {
        toast.success('Solicitud rechazada exitosamente', { id: toastId });
        await fetchAdoptions();
        setShowRejectModal(false);
        setSelectedAdoptionId(null);
        setRejectionReason('');
      }
    } catch (err: unknown) {
      console.error('Error rechazando postulación:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al rechazar postulación';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: LucideIcon }> = {
      PENDING: {
        label: 'Pendiente',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: AlertCircle,
      },
      APPROVED: {
        label: 'Aprobada',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: Check,
      },
      REJECTED: {
        label: 'Rechazada',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: X,
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <div className={`${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit`}>
        <IconComponent size={16} />
        {config.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
        <span className="ml-2">Cargando postulaciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => fetchAdoptions()}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Estado</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-black px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Todas</option>
            <option value="PENDING">Pendientes</option>
            <option value="APPROVED">Aprobadas</option>
            <option value="REJECTED">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Info de resultados */}
      <div className="text-sm text-gray-600">
        Mostrando {adoptions.length} de {totalCount} postulaciones
      </div>

      {/* Tabla */}
      {adoptions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No hay postulaciones para mostrar</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Mascota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Adoptante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {adoptions.map((adoption) => (
                <tr key={adoption.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {adoption.pet.images && adoption.pet.images.length > 0 && (
                        <Image
                          src={adoption.pet.images[0]}
                          alt={adoption.pet.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{adoption.pet.name}</p>
                        <p className="text-sm text-gray-500">{adoption.pet.species}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="font-medium text-gray-900">{adoption.adopter.name}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      <p>{adoption.adopter.phone}</p>
                      <p className="text-xs text-gray-500">{adoption.adopter.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(adoption.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(adoption.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    {adoption.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedAdoptionForApprove(adoption.id);
                            setShowApproveModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
                        >
                          <Check size={16} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAdoptionId(adoption.id);
                            setShowRejectModal(true);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                        >
                          <X size={16} />
                          Rechazar
                        </button>
                      </>
                    )}
                    {adoption.status === 'APPROVED' && (
                      <span className="text-sm text-gray-500">Completada</span>
                    )}
                    {adoption.status === 'REJECTED' && (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg text-sm ${currentPage === page
                ? 'bg-purple-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de Aprobación */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Aprobación</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas aprobar esta postulación? La mascota pasará al estado &quot;En Proceso&quot; de adopción.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedAdoptionForApprove(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => selectedAdoptionForApprove && handleApprove(selectedAdoptionForApprove)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Aprobando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rechazar Postulación</h3>
            <p className="text-gray-600 mb-4">
              Por favor, proporciona una razón para rechazar esta postulación.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ingresa la razón del rechazo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 resize-none"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedAdoptionId(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Rechazando...' : 'Rechazar'}
              </button>
            </div>
          </div>
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
 * Este componente permite a los refugios visualizar, filtrar, aprobar o rechazar
 * las solicitudes de adopción para sus mascotas.
 *
 * Lógica Clave:
 * - fetchAdoptions: Recupera las postulaciones desde la API con soporte para filtros y paginación.
 * - handleApprove/handleReject: Realizan actualizaciones parciales (PATCH) del estado de la adopción.
 * - getStatusBadge: Genera elementos visuales descriptivos para los diferentes estados de la postulación.
 *
 * Dependencias Externas:
 * - sonner: Para notificaciones en tiempo real sobre el estado de las operaciones.
 * - lucide-react: Para iconografía consistente.
 * - next/image: Para optimización de imágenes de mascotas.
 *
 */
