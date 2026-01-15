import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/utils/db';
import AdoptionApplicationsClient from '@/components/AdoptionApplicationsClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UserRole } from '@prisma/client';

/**
 * Página del panel de postulaciones para albergues
 * Implementa TAREA-024
 * 
 * Ruta: /shelter/adoptions
 * - Solo SHELTER puede acceder
 * - Muestra lista de postulaciones pendientes
 * - Permite aprobar/rechazar
 */

export const metadata = {
  title: 'Postulaciones',
  description: 'Gestiona las postulaciones de adopción de tu albergue',
};

export default async function ShelterAdoptionsPage() {
  const session = await getServerSession(authOptions);
  // Verificar autenticación, rol y verificación de rol
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/shelter/adoptions");
  }

  if (session.user.role !== UserRole.SHELTER) {
    redirect("/unauthorized?reason=shelter_only");
  }
  // Obtener id de SHELTER
  const shelterId = session.user.shelterId as string;
  const shelter = await prisma.shelter.findUnique({
    where: { id: shelterId as string },
    select: { id: true, name: true, verified: true },
  });

  if (!shelter?.verified) {
    redirect("/unauthorized?reason=shelter_not_verified");
  }

  // 5. Obtener conteo de mascotas
  const petCount = await prisma.pet.count({
    where: { shelterId: shelter.id },
  });

  // 6. Obtener estadísticas de postulaciones
  const adoptionStats = await prisma.adoption.groupBy({
    by: ['status'],
    where: {
      pet: {
        shelterId: shelter.id,
      },
    },
    _count: true,
  });

  const stats = {
    pending: adoptionStats.find((s) => s.status === 'PENDING')?._count || 0,
    approved: adoptionStats.find((s) => s.status === 'APPROVED')?._count || 0,
    rejected: adoptionStats.find((s) => s.status === 'REJECTED')?._count || 0,
    total: adoptionStats.reduce((sum, s) => sum + s._count, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/shelter"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Postulaciones de Adopción</h1>
              <p className="text-sm text-gray-600">Gestiona las solicitudes de adopción de tu albergue</p>
            </div>
          </div>
        </div>
      </header>

      {/* Información del Albergue */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Albergue</p>
              <p className="text-lg font-bold text-gray-900">{shelter.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Mascotas</p>
              <p className="text-lg font-bold text-gray-900">{petCount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Postulaciones Pendientes</p>
              <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Estado del Albergue</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${shelter.verified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                />
                <span className="text-sm font-medium text-gray-900">
                  {shelter.verified ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-600 mb-1">Total de Postulaciones</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-lg shadow-sm border border-yellow-200 p-4 bg-yellow-50">
            <p className="text-sm font-medium text-yellow-700 mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="rounded-lg shadow-sm border border-green-200 p-4 bg-green-50">
            <p className="text-sm font-medium text-green-700 mb-1">Aprobadas</p>
            <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
          </div>
          <div className="rounded-lg shadow-sm border border-red-200 p-4 bg-red-50">
            <p className="text-sm font-medium text-red-700 mb-1">Rechazadas</p>
            <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {/* Panel de Postulaciones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Lista de Postulaciones</h2>
          <AdoptionApplicationsClient />
        </div>
      </div>

      {/* Información de Ayuda */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">ℹ️ Cómo funciona el sistema de postulaciones</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              <strong>Pendiente:</strong> Nueva postulación que espera tu revisión. Puedes aprobar o rechazar.
            </li>
            <li>
              <strong>Aprobada:</strong> Postulación aceptada. La mascota pasará automáticamente al estado &quot;En Proceso de adopción&quot;.
            </li>
            <li>
              <strong>Rechazada:</strong> Postulación rechazada. Se requiere proporcionar una razón.
            </li>
            <li>
              <strong>Adopción completada:</strong> Cuando una postulación es aprobada, la mascota pasa a estado &quot;Adoptada&quot;.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. AUTENTICACIÓN Y AUTORIZACIÓN:
 *    - Solo usuarios con rol SHELTER pueden acceder
 *    - Usuario debe tener un albergue registrado
 *    - Redirecciona a /login si no está autenticado
 *    - Redirecciona a /unauthorized si no es SHELTER
 * 
 * 2. INFORMACIÓN MOSTRADA:
 *    - Nombre del albergue
 *    - Cantidad de mascotas registradas
 *    - Postulaciones pendientes
 *    - Estado de verificación del albergue
 *    - Estadísticas: Total, Pendientes, Aprobadas, Rechazadas
 * 
 * 3. COMPONENTE CLIENTE:
 *    - AdoptionApplicationsClient: Tabla interactiva
 *    - Filtros por estado
 *    - Paginación
 *    - Modales de aprobación/rechazo
 * 
 * 4. ESTADÍSTICAS:
 *    - Conteo por estado de postulación
 *    - Cálculo en servidor (SSR) para mejor performance
 *    - Mostradas en tarjetas con colores diferenciados
 * 
 * 5. NAVEGACIÓN:
 *    - Botón volver a dashboard del albergue
 *    - Breadcrumbs implícitas en el flujo
 * 
 * 6. UX MEJORAS:
 *    - Información de ayuda en la página
 *    - Estado del albergue visible
 *    - Indicadores visuales con colores
 *    - Layout responsive
 */
