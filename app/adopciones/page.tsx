import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import PetGalleryClient from '@/components/PetGalleryClient';

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Encuentra tu compañero perfecto
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Miles de mascotas en el Valle de Aburrá esperan por un hogar lleno de amor
        </p>
      </div>

      <PetGalleryClient 
        userSession={session?.user ? {
          id: session.user.id || '',
          name: session.user.name || '',
          email: session.user.email || '',
          role: session.user.role || '',
        } : null}
      />
    </main>
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
