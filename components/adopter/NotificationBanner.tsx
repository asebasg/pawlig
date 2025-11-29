'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Bell } from 'lucide-react';

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

interface NotificationBannerProps {
  adoption: Adoption;
}

/**
 * Componente: Banner de Notificación Destacada
 * 
 * Características:
 * - Muestra notificación destacada cuando cambia el estado de una solicitud
 * - Aparece solo para adoptiones con cambios recientes (< 24h)
 * - Diseño visual diferenciado por estado (aprobado/rechazado)
 * - Botón para descartar notificación
 * - Información detallada de la mascota y albergue
 * 
 * Requerimientos:
 * - HU-004: Visualización del Panel de Usuario
 * - Notificación destacada de actualización del estado
 * 
 * Criterios de aceptación:
 * - ✅ Cuando el estado cambia, el sistema muestra notificación destacada
 * - ✅ Se muestra en primer lugar en el panel
 * - ✅ Contiene información clara sobre la mascota y el cambio
 */
export default function NotificationBanner({ adoption }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [autoHide, setAutoHide] = useState(false);

  // Auto-ocultar después de 8 segundos para aprobadas, 5 para rechazadas
  useEffect(() => {
    if (!autoHide) return;

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, adoption.status === 'APPROVED' ? 8000 : 5000);

    return () => clearTimeout(timeout);
  }, [autoHide, adoption.status]);

  if (!isVisible) return null;

  const isApproved = adoption.status === 'APPROVED';
  const isRejected = adoption.status === 'REJECTED';

  const bannerClasses = isApproved
    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'
    : isRejected
      ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500'
      : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500';

  const iconClasses = isApproved
    ? 'text-green-600'
    : isRejected
      ? 'text-red-600'
      : 'text-blue-600';

  const titleClasses = isApproved
    ? 'text-green-900'
    : isRejected
      ? 'text-red-900'
      : 'text-blue-900';

  const textClasses = isApproved
    ? 'text-green-800'
    : isRejected
      ? 'text-red-800'
      : 'text-blue-800';

  const buttonClasses = isApproved
    ? 'bg-green-600 hover:bg-green-700'
    : isRejected
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div
      className={`rounded-lg p-4 mb-6 border ${bannerClasses} shadow-md animate-in slide-in-from-top-4`}
      role="alert"
    >
      <div className="flex gap-4">
        {/* Ícono */}
        <div className="flex-shrink-0 pt-1">
          {isApproved ? (
            <CheckCircle className={`w-6 h-6 ${iconClasses}`} />
          ) : isRejected ? (
            <AlertCircle className={`w-6 h-6 ${iconClasses}`} />
          ) : (
            <Bell className={`w-6 h-6 ${iconClasses}`} />
          )}
        </div>

        {/* Contenido */}
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              {/* Título */}
              <h3 className={`font-bold text-lg ${titleClasses} mb-1`}>
                {isApproved
                  ? '¡Buenas noticias! Tu solicitud fue aprobada'
                  : isRejected
                    ? 'Tu solicitud fue rechazada'
                    : 'Tu solicitud tiene actualización'}
              </h3>

              {/* Descripción */}
              <div className={`${textClasses} text-sm space-y-2`}>
                <p>
                  <span className="font-semibold">{adoption.petName}</span> (
                  {adoption.petSpecies}
                  {adoption.petBreed ? ` • ${adoption.petBreed}` : ''})
                </p>

                <p>
                  Albergue: <span className="font-semibold">{adoption.shelter.name}</span>
                </p>

                {isApproved && (
                  <p className="mt-2">
                    Contacta al albergue para coordinar los detalles finales de la adopción.
                  </p>
                )}

                {isRejected && adoption.message && (
                  <div className="mt-2 p-2 bg-white/50 rounded">
                    <p className="text-xs font-medium mb-1">Motivo del rechazo:</p>
                    <p className="italic">{adoption.message}</p>
                  </div>
                )}

                {isApproved && (
                  <div className="mt-2 pt-2 border-t border-green-200 flex gap-3">
                    {adoption.shelter.contactWhatsApp && (
                      <a
                        href={`https://wa.me/${adoption.shelter.contactWhatsApp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 transition"
                      >
                        💬 WhatsApp
                      </a>
                    )}
                    {adoption.shelter.contactInstagram && (
                      <a
                        href={`https://instagram.com/${adoption.shelter.contactInstagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-pink-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-pink-700 transition"
                      >
                        📷 Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Auto-hide info */}
              <div className="mt-3 pt-2 border-t border-opacity-20 border-current">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={autoHide}
                    onChange={(e) => setAutoHide(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span>Descartar automáticamente en unos segundos</span>
                </label>
              </div>
            </div>

            {/* Botón cerrar */}
            <button
              onClick={() => setIsVisible(false)}
              className={`flex-shrink-0 p-1 rounded-lg transition ${
                isApproved
                  ? 'hover:bg-green-200'
                  : isRejected
                    ? 'hover:bg-red-200'
                    : 'hover:bg-blue-200'
              }`}
              title="Descartar notificación"
            >
              <X className={`w-5 h-5 ${iconClasses}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * CARACTERÍSTICAS IMPLEMENTADAS:
 * 
 * ✅ Notificación destacada para cambios de estado
 * ✅ Diferenciación visual por tipo (aprobado, rechazado, pendiente)
 * ✅ Información clara y concisa
 * ✅ Botones de contacto directo (WhatsApp, Instagram)
 * ✅ Mostrar motivo del rechazo si aplica
 * ✅ Opción de descarte manual
 * ✅ Opción de auto-descarte
 * ✅ Animación de entrada suave
 * ✅ Íconos contextuales
 * ✅ Diseño gradient para mayor impacto visual
 * ✅ Responsive y accesible (role=\"alert\")
 * 
 * CRITERIOS DE ACEPTACIÓN CUMPLIDOS:
 * - ✅ Dado que el estado de una solicitud ha cambiado
 * - ✅ Cuando consulto el panel
 * - ✅ Entonces el sistema muestra notificación destacada
 */
