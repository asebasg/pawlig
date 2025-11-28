import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, FileText, LogOut } from 'lucide-react';
import AdopterDashboardClient from '@/components/dashboard/AdopterDashboardClient';

/**
 * Metadata para SEO
 */
export const metadata: Metadata = {
  title: 'Mi Dashboard - PawLig',
  description: 'Panel de control para adoptantes de mascotas',
};

/**
 * Página de dashboard para adoptantes
 * Implementa HU-004: Panel de usuario adoptante
 * 
 * Criterios de aceptación:
 * 1. Vista de favoritos con mascotas guardadas
 * 2. Vista de postulaciones activas (en progreso)
 * 3. Información clara del estado de cada solicitud
 * 
 * Rutas:
 * - /dashboard/adopter - Dashboard principal (protegido)
 * - /dashboard/adopter/favorites - Favoritos detallado (opcional)
 * - /dashboard/adopter/applications - Solicitudes detallado (opcional)
 */
export default async function AdopterDashboardPage() {
  // Obtener sesión del usuario
  const session = await getServerSession(authOptions);

  // Verificar autenticación
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/adopter');
  }

  // Verificar que sea adoptante
  if (session.user.role !== 'ADOPTER') {
    const roleRedirects: Record<string, string> = {
      ADMIN: '/admin',
      SHELTER: '/shelter',
      VENDOR: '/vendor',
    };

    const redirectPath = roleRedirects[session.user.role] || '/adopciones';
    redirect(redirectPath);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
              PawLig
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/adopciones"
                className="text-sm text-gray-700 hover:text-purple-600 font-medium transition"
              >
                Ver mascotas
              </Link>

              <Link
                href="/dashboard/adopter"
                className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition border-b-2 border-purple-600"
              >
                Mi Panel
              </Link>

              <Link
                href="/dashboard/profile"
                className="text-sm text-gray-700 hover:text-purple-600 font-medium transition"
              >
                Perfil
              </Link>

              <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{session.user.name}</span>
                </span>
                <a
                  href="/api/auth/signout"
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-8 border border-purple-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido, {session.user.name.split(' ')[0]}! 🐾
            </h1>
            <p className="text-gray-700">
              Aquí puedes gestionar tus favoritos, ver el estado de tus solicitudes de adopción y más.
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <AdopterDashboardClient userId={session.user.id} />

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/adopciones"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition border-l-4 border-purple-500"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explorar más mascotas</h3>
            <p className="text-sm text-gray-600">
              Descubre nuevas mascotas disponibles para adopción en la plataforma.
            </p>
            <span className="inline-block mt-4 text-purple-600 font-semibold text-sm">
              Ir a galería →
            </span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition border-l-4 border-blue-500"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Actualizar perfil</h3>
            <p className="text-sm text-gray-600">
              Mantén tu información personal actualizada en la plataforma.
            </p>
            <span className="inline-block mt-4 text-blue-600 font-semibold text-sm">
              Editar perfil →
            </span>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ℹ️ Información Importante</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              <strong>Favoritos:</strong> Guarda tus mascotas preferidas para acceder fácilmente después.
            </li>
            <li>
              <strong>Solicitudes:</strong> Haz seguimiento a tus postulaciones de adopción en tiempo real.
            </li>
            <li>
              <strong>Contacto:</strong> Comunícate directamente con los albergues a través de WhatsApp.
            </li>
            <li>
              <strong>Privacidad:</strong> Tu información personal se mantiene segura y confidencial.
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">PawLig</h3>
              <p className="text-sm text-gray-600">
                Promoviendo la adopción responsable en el Valle de Aburrá
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Enlaces</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/adopciones" className="text-sm text-gray-600 hover:text-purple-600">
                    Ver mascotas
                  </a>
                </li>
                <li>
                  <a href="/dashboard/adopter" className="text-sm text-gray-600 hover:text-purple-600">
                    Mi Panel
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terminos" className="text-sm text-gray-600 hover:text-purple-600">
                    Términos de servicio
                  </a>
                </li>
                <li>
                  <a href="/privacidad" className="text-sm text-gray-600 hover:text-purple-600">
                    Política de privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; 2025 PawLig - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. SEGURIDAD:
 *    - Requiere autenticación con NextAuth
 *    - Solo accesible para usuarios con rol 'ADOPTER'
 *    - Redirige según rol si usuario no es adoptante
 *    - Redirige a login si no está autenticado
 * 
 * 2. FLUJO DE USUARIO (HU-004):
 *    1. Usuario autenticado como ADOPTER accede a /dashboard/adopter
 *    2. Página servidor valida sesión y rol
 *    3. Si no ADOPTER → redirige a su dashboard correcto
 *    4. Renderiza server component y AdopterDashboardClient
 *    5. AdopterDashboardClient carga favoritos y solicitudes
 *    6. Usuario ve dos secciones principales:
 *       - Favoritos: Mascotas guardadas con PetCard
 *       - Postulaciones Activas: Solicitudes de adopción en progreso
 * 
 * 3. CRITERIOS DE ACEPTACIÓN HU-004:
 *    ✓ "Vista /dashboard/user (que ya hicimos)"
 *      - Nota: La ruta fue /dashboard/adopter en lugar de /dashboard/user
 *      - Más específica y clara para adoptantes
 *      - Consistente con /dashboard/profile (HU-003)
 *    
 *    ✓ "Sección de favoritos"
 *      - Componente FavoritesSection.tsx
 *      - Muestra mascotas favoritas con PetCard
 *      - Paginación y contador total
 *      - Botón para quitar de favoritos
 *      - Mensaje si no hay favoritos
 *    
 *    ✓ "Sección de postulaciones activas"
 *      - Componente ActiveApplicationsSection.tsx
 *      - Muestra solicitudes de adopción en progreso (status: PENDING, APPROVED, etc)
 *      - Información de mascota, albergue, fecha de solicitud
 *      - Badge con estado actual
 *      - Opción de contactar albergue
 *      - Mensaje si no hay solicitudes
 *    
 *    ✓ "Tarjetas de mascotas favoritas"
 *      - Reutiliza componente PetCard existente
 *      - Mismo comportamiento que en galería
 *      - Botón de quitar favorito
 *      - Enlace a detalle
 * 
 * 4. ESTRUCTURA DE COMPONENTES:
 *    - page.tsx (Server): Layout, header, footer, navegación
 *    - AdopterDashboardClient (Client): Lógica y estado
 *    - FavoritesSection (Client): Sección de favoritos
 *    - ActiveApplicationsSection (Client): Sección de solicitudes
 * 
 * 5. DATOS A MOSTRAR:
 *    
 *    Favoritos:
 *    - Mascotas: name, image, breed, age, sex, shelter name
 *    - Acciones: Ver detalle, Quitar de favoritos, Contactar albergue
 *    - Contador: "X mascotas guardadas"
 *    
 *    Postulaciones:
 *    - Solicitudes: petName, shelterName, status, createdAt, updatedAt
 *    - Estados: PENDING (En revisión), APPROVED (Aprobada), REJECTED (Rechazada)
 *    - Acciones: Ver mascota, Contactar albergue, Ver detalles
 *    - Información: Fecha de solicitud, estado actual, próximos pasos
 * 
 * 6. ESTADOS VISUALES:
 *    - Loading: Skeleton o spinner
 *    - Empty: Mensaje personalizado con link a galería
 *    - Error: Mensaje de error con retry
 *    - Success: Lista de favoritos/solicitudes
 * 
 * 7. RESPONSIVE DESIGN:
 *    - Mobile (1 col): Tarjetas apiladas
 *    - Tablet (2 cols): Dos tarjetas por fila
 *    - Desktop (3 cols): Tres tarjetas por fila
 * 
 * 8. INTEGRACIÓN CON APIs:
 *    - GET /api/adopter/favorites - Lista de favoritos
 *    - GET /api/adopter/adoptions - Lista de solicitudes
 *    - DELETE /api/pets/[id]/favorite - Quitar de favoritos
 *    - GET /api/pets/[id] - Detalle de mascota
 * 
 * 9. TRAZABILIDAD:
 *    - HU-004: Panel de usuario ✅
 *    - RF-006: Favoritos ✅
 *    - RF-007: Postulaciones ✅
 *    - RNF-002: Seguridad (autorización) ✅
 *    - RNF-004: Rendimiento (paginación) ✅
 */
