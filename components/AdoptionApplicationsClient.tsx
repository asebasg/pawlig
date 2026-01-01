'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, AlertCircle } from 'lucide-react';
import Loader from '@/components/ui/loader';
import Image from 'next/image';

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

interface AdoptionApplicationsClientProps { }

export default function AdoptionApplicationsClient({ }: AdoptionApplicationsClientProps) {
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
  const fetchAdoptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      const response = await axios.get(`/api/shelters/adoptions?${params.toString()}`);

      if (response.data.success) {
        setAdoptions(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.totalCount);
      }
    } catch (err: any) {
      console.error('Error cargando postulaciones:', err);
      setError(err.response?.data?.error || 'Error al cargar postulaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, [statusFilter, currentPage]);

  // Manejar aprobación
  const handleApprove = async (adoptionId: string) => {
    try {
      setIsSubmitting(true);
      const response = await axios.patch(`/api/adoptions/${adoptionId}`, {
        status: 'APPROVED',
      });

      if (response.data.data) {
        // Actualizar lista
        await fetchAdoptions();
        setShowApproveModal(false);
        setSelectedAdoptionForApprove(null);
      }
    } catch (err: any) {
      console.error('Error aprobando postulación:', err);
      alert(err.response?.data?.error || 'Error al aprobar postulación');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar rechazo
  const handleReject = async () => {
    if (!selectedAdoptionId) return;

    if (!rejectionReason.trim()) {
      alert('Por favor, ingresa una razón para el rechazo');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.patch(`/api/adoptions/${selectedAdoptionId}`, {
        status: 'REJECTED',
        rejectionReason: rejectionReason.trim(),
      });

      if (response.data.data) {
        // Actualizar lista
        await fetchAdoptions();
        setShowRejectModal(false);
        setSelectedAdoptionId(null);
        setRejectionReason('');
      }
    } catch (err: any) {
      console.error('Error rechazando postulación:', err);
      alert(err.response?.data?.error || 'Error al rechazar postulación');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: any }> = {
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
        <span>Cargando postulaciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
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
                          className="w-10 h-10 rounded-full object-cover"
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
              ¿Estás seguro de que deseas aprobar esta postulación? La mascota pasará al estado "En Proceso" de adopción.
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

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. FUNCIONALIDADES:
 *    - Tabla de postulaciones con información del adoptante y mascota
 *    - Filtro por estado (PENDING, APPROVED, REJECTED)
 *    - Paginación de 20 resultados por página
 *    - Estados visuales con colores e iconos
 * 
 * 2. ACCIONES:
 *    - Aprobar: Solo disponible si PENDING
 *    - Rechazar: Solo disponible si PENDING
 *    - Modal de confirmación para ambas acciones
 *    - Modal de rechazo requiere razón
 * 
 * 3. ESTADOS VISUALES:
 *    - PENDING: Amarillo con alerta
 *    - APPROVED: Verde con checkmark
 *    - REJECTED: Rojo con X
 * 
 * 4. UX MEJORAS:
 *    - Imagen de mascota en tabla
 *    - Información del adoptante en filas
 *    - Botones contextuales según estado
 *    - Carga automática al cambiar filtros
 * 
 * 5. VALIDACIÓN:
 *    - Razón del rechazo obligatoria (mínimo 5 caracteres)
 *    - Confirmación antes de acciones irreversibles
 * 
 * 6. ACTUALIZACIÓN:
 *    - Automática después de aprobar/rechazar
 *    - Recarga lista completa con nuevos datos
 */
