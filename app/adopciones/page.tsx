import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import PetGalleryClient from '@/components/pet-gallery-client';
import { ToastProvider } from '@/components/ui/toast';

/**
 * Metadata para SEO
 */
export const metadata: Metadata = {
  title: 'Adopta una mascota - PawLig',
  description: 'Encuentra tu compañero perfecto en el Valle de Aburrá. Miles de mascotas esperan por un hogar lleno de amor.',
};

export default async function AdopcionesPage() {
  // Obtener sesión del usuario (puede ser null si es anónimo)
  const session = await getServerSession(authOptions);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
              PawLig
            </a>
            <nav className="flex items-center gap-4">
              <a
                href="/adopciones"
                className="text-sm text-gray-700 hover:text-purple-600 font-medium"
              >
                Adopciones
              </a>
              <a
                href="/productos"
                className="text-sm text-gray-700 hover:text-purple-600 font-medium"
              >
                Productos
              </a>
              <a
                href="/albergues"
                className="text-sm text-gray-700 hover:text-purple-600 font-medium"
              >
                Albergues
              </a>
              {session?.user ? (
                <>
                  <span className="text-sm text-gray-600">
                    Hola, <span className="font-semibold">{session.user.name}</span>
                  </span>
                  <a
                    href="/api/auth/signout"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cerrar sesión
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Iniciar sesión
                  </a>
                  <a
                    href="/register"
                    className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Registrarse
                  </a>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encuentra tu compañero perfecto
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Miles de mascotas en el Valle de Aburrá esperan por un hogar lleno de amor
          </p>
        </div>

        {/* Galería con filtros y mascotas */}
        <PetGalleryClient 
          userSession={session ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          } : null}
        />
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
                    Adopciones
                  </a>
                </li>
                <li>
                  <a href="/productos" className="text-sm text-gray-600 hover:text-purple-600">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="/albergues" className="text-sm text-gray-600 hover:text-purple-600">
                    Albergues
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
    </ToastProvider>
  );
}

/**
 * 📚 NOTAS TÉCNICAS:
 * 
 * 1. SERVER COMPONENT:
 *    - Obtiene sesión en el servidor (sin latencia cliente)
 *    - SSR mejora SEO y tiempo de carga inicial
 *    - Pasa datos mínimos al cliente (solo id, name, email, role)
 * 
 * 2. SEPARACIÓN DE RESPONSABILIDADES:
 *    - Página (server): Layout, header, footer, sesión
 *    - PetGalleryClient (client): Búsqueda, filtros, interacción
 * 
 * 3. ACCESIBILIDAD:
 *    - Header sticky para navegación constante
 *    - Enlaces con hover states visibles
 *    - Estructura semántica (header, main, footer)
 * 
 * 4. RESPONSIVE:
 *    - Grid adaptativo en footer (1 col móvil, 3 desktop)
 *    - Padding adaptativo (px-4 sm:px-6 lg:px-8)
 * 
 * 5. INTEGRACIÓN:
 *    - PetGalleryClient recibe userSession opcional
 *    - Si null: Usuario anónimo (puede buscar, no puede guardar favoritos)
 *    - Si presente: Usuario autenticado (puede interactuar completamente)
 */
