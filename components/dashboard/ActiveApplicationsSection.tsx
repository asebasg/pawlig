'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, FileText, MessageCircle, ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Adoption {
  _id: string;
  petID: string;
  shelterID: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  pet?: {
    _id: string;
    name: string;
    image: string;
    breed: string;
    status: string;
  };
  shelter?: {
    _id: string;
    name: string;
    phone?: string;
  };
  rejectionReason?: string;
}

interface ActiveApplicationsSectionProps {
  onApplicationCreated?: () => void;
}

/**
 * Sección de solicitudes de adopción activas en el dashboard
 * Muestra:
 * - Lista de solicitudes con estado
 * - Información de mascota y albergue
 * - Botones de acción (contactar, ver detalle)
 * - Mensaje si no hay solicitudes
 */
export default function ActiveApplicationsSection({
  onApplicationCreated,
}: ActiveApplicationsSectionProps) {
  const [applications, setApplications] = useState<Adoption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    fetchApplications();
  }, [currentPage, pageSize]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/adopter/adoptions?page=${currentPage}&limit=${pageSize}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar solicitudes');
      }

      const data = await response.json();
      setApplications(data.adoptions || []);
      setTotalApplications(data.total || 0);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      PENDING: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'En revisión',
      },
      APPROVED: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Aprobada',
      },
      REJECTED: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Rechazada',
      },
      COMPLETED: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completada',
      },
      CANCELLED: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Cancelada',
      },
    };

    const style = styles[status] || styles.PENDING;
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${style.bg}`}>
        {style.icon}
        <span className={`text-xs font-semibold ${style.text}`}>{style.label}</span>
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

  // Estado: Cargando
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Cargando solicitudes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Error
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error al cargar solicitudes</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchApplications}
              className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700 underline"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Estado: Sin solicitudes
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="mb-4">
          <FileText className="w-16 h-16 text-gray-300 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin solicitudes activas</h2>
        <p className="text-gray-600 mb-6">
          Aún no has hecho solicitudes de adopción. Explora mascotas y comienza tu proceso de adopción.
        </p>
        <Link
          href="/adopciones"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
        >
          Ver mascotas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil(totalApplications / pageSize);

  // Estado: Mostrar solicitudes
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Mis Solicitudes de Adopción
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {totalApplications} solicitud{totalApplications !== 1 ? 'es' : ''} en total
          </p>
        </div>
      </div>

      {/* Lista de solicitudes */}
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application._id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition border-l-4 border-blue-500"
          >
            <div className="flex gap-6">
              {/* Imagen de mascota */}
              <div className="flex-shrink-0">
                {application.pet?.image ? (
                  <img
                    src={application.pet.image}
                    alt={application.pet.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Sin foto</span>
                  </div>
                )}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.pet?.name || 'Mascota desconocida'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{application.shelter?.name || 'Albergue'}</span>
                      {application.pet?.breed && ` • ${application.pet.breed}`}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                {/* Detalles de solicitud */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Fecha de solicitud</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {formatDate(application.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Última actualización</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {formatDate(application.updatedAt)}
                    </p>
                  </div>
                  {application.rejectionReason && (
                    <div>
                      <p className="text-xs font-medium text-red-600 uppercase">Motivo del rechazo</p>
                      <p className="text-sm text-red-700 font-medium mt-1">{application.rejectionReason}</p>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  {application.pet?._id && (
                    <Link
                      href={`/adopciones/${application.pet._id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700 underline"
                    >
                      Ver mascota
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {application.shelter?.phone && (
                    <a
                      href={`https://wa.me/${application.shelter.phone}?text=Hola%2C%20me%20gustaría%20conocer%20el%20estado%20de%20mi%20solicitud%20de%20adopción.`}
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-3">📌 Estados de solicitud</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>
            <strong>En revisión:</strong> Tu solicitud fue recibida y está siendo revisada por el albergue.
          </li>
          <li>
            <strong>Aprobada:</strong> ¡Felicidades! Tu solicitud fue aprobada. Contacta al albergue para próximos pasos.
          </li>
          <li>
            <strong>Rechazada:</strong> Desafortunadamente, tu solicitud no fue aprobada. Verifica el motivo arriba.
          </li>
          <li>
            <strong>Completada:</strong> Has adoptado exitosamente. ¡Bienvenido a tu nueva familia!
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. STATES:
 *    - applications: Array de solicitudes
 *    - isLoading: Mientras carga datos
 *    - error: Mensaje de error
 *    - currentPage: Página actual de paginación
 *    - pageSize: Solicitudes por página (10)
 *    - totalApplications: Total para calcular paginación
 * 
 * 2. API CALL:
 *    - GET /api/adopter/adoptions?page=X&limit=10
 *    - Response: { adoptions: Adoption[], total: number }
 * 
 * 3. ESTADOS DE SOLICITUD:
 *    - PENDING (amarillo): En revisión por albergue
 *    - APPROVED (verde): Aprobada, esperar confirmación
 *    - REJECTED (rojo): Rechazada, muestra motivo
 *    - COMPLETED (azul): Adopción completada
 *    - CANCELLED (gris): Cancelada por adoptante/albergue
 * 
 * 4. INFORMACIÓN MOSTRADA:
 *    - Foto de mascota
 *    - Nombre y raza
 *    - Albergue responsable
 *    - Estado actual (badge)
 *    - Fecha de solicitud
 *    - Última actualización
 *    - Motivo rechazo (si aplica)
 *    - Botones de acción
 * 
 * 5. ACCIONES DISPONIBLES:
 *    - Ver mascota: Link a /adopciones/[id]
 *    - Contactar: Link a WhatsApp del albergue
 * 
 * 6. RESPONSIVIDAD:
 *    - Mobile: Disposición vertical
 *    - Desktop: Disposición horizontal con imagen a la izquierda
 * 
 * 7. PAGINACIÓN:
 *    - 10 solicitudes por página
 *    - Botones Anterior/Siguiente
 *    - Números de página activos
 * 
 * 8. MENSAJES:
 *    - Loading: "Cargando solicitudes..."
 *    - Error: Muestra error con retry
 *    - Empty: "Sin solicitudes activas" con link a galería
 *    - Success: Lista de solicitudes con detalles
 */
