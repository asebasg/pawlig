import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { UserRole } from '@prisma/client';
import AdopterDashboardClient from '@/components/adopter/AdopterDashboardClient';

/**
 * Página del Panel de Usuario - Adoptante
 * 
 * Rutas protegidas:
 * - Solo usuarios autenticados con rol ADOPTER
 * - Redirige a login si no está autenticado
 * - Redirige a unauthorized si no es adoptante
 * 
 * Requerimientos cumplidos:
 * - HU-004: Visualización del Panel de Usuario
 * - Acceso al panel de usuario personal
 * - Ver mascotas favoritas
 * - Ver estado de solicitudes de adopción
 * - Notificaciones destacadas de cambios
 */
export default async function AdopterProfilePage() {
  // Validación de autenticación y autorización
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login?callbackUrl=/adopter/profile');
  }

  // Solo ADOPTER y ADMIN pueden acceder (ADMIN para verificar)
  if (session.user.role !== UserRole.ADOPTER && session.user.role !== UserRole.ADMIN) {
    redirect('/unauthorized?reason=adopter_only');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <a href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
                PawLig
              </a>
              <p className="text-sm text-gray-600 mt-1">
                Panel de Adoptante
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Hola, <span className="font-semibold">{session.user.name}</span>
              </span>
              <a
                href="/adopciones"
                className="text-sm text-gray-600 hover:text-purple-600 font-medium"
              >
                Explorar mascotas
              </a>
              <a
                href="/api/auth/signout"
                className="text-sm bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
              >
                Cerrar sesión
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mi Panel de Adopción
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tus mascotas favoritas y realiza seguimiento a tus solicitudes de adopción
          </p>
        </div>

        {/* Dashboard Client Component */}
        <AdopterDashboardClient userSession={session.user} />
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
              <h3 className="font-semibold text-gray-900 mb-4">Enlaces útiles</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/adopciones" className="text-sm text-gray-600 hover:text-purple-600">
                    Explorar mascotas
                  </a>
                </li>
                <li>
                  <a href="/adopter/profile" className="text-sm text-gray-600 hover:text-purple-600">
                    Mi panel
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Ayuda</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm text-gray-600 hover:text-purple-600">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="/" className="text-sm text-gray-600 hover:text-purple-600">
                    Preguntas frecuentes
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

export const metadata = {
  title: 'Mi Panel de Adopción - PawLig',
  description: 'Gestiona tus mascotas favoritas y solicitudes de adopción',
};

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. SERVER COMPONENT:
 *    - Obtiene sesión en servidor (sin latencia cliente)
 *    - Valida autenticación y roles antes de renderizar
 *    - Seguridad: Redirect en servidor no envía página a cliente no autenticado
 * 
 * 2. PROTECCIONES:
 *    - Validación de sesión con getServerSession
 *    - Verificación de rol ADOPTER (solo adoptantes)
 *    - Redirect automático si fallan validaciones
 * 
 * 3. ESTRUCTURA:
 *    - Layout consistente con app/adopciones/page.tsx
 *    - Header sticky para navegación
 *    - Footer con enlaces útiles
 *    - Contenedor max-w-7xl para responsive
 * 
 * 4. INTEGRACIÓN:
 *    - Delega lógica de datos a AdopterDashboardClient
 *    - Pasa userSession completa para contexto
 *    - Componente cliente maneja estado y fetching
 */
