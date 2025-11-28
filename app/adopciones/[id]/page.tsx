import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { notFound } from 'next/navigation';
import PetDetailClient from '@/components/PetDetailClient';
import { ToastProvider } from '@/components/ui/toast';
import { getPetById, getSimilarPets, checkIsFavorited } from '@/lib/services/pet.service';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const pet = await getPetById(params.id);

    if (!pet) {
      return {
        title: 'Mascota no encontrada - PawLig',
      };
    }

    return {
      title: `${pet.name} - Adopta en PawLig`,
      description: `${pet.species}${pet.breed ? ` ${pet.breed}` : ''} en adopción. ${pet.description?.substring(0, 150) || 'Encuentra tu compañero perfecto'}...`,
      openGraph: {
        title: `${pet.name} busca hogar en PawLig`,
        description: pet.description || '',
        images: pet.images && pet.images.length > 0 ? [pet.images[0]] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Detalle de mascota - PawLig',
    };
  }
}

export const revalidate = 60;

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await getPetById(params.id);

  if (!pet) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  let isFavorited = false;
  if (session?.user?.id) {
    isFavorited = await checkIsFavorited(session.user.id, params.id);
  }

  const similarPets = await getSimilarPets(params.id, pet.shelterId, pet.species);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
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
                  ← Volver a adopciones
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PetDetailClient
            pet={pet}
            isFavorited={isFavorited}
            userSession={session?.user || null}
            similarPets={similarPets}
          />
        </main>

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
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="text-sm text-gray-600 hover:text-purple-600">
                      Términos de servicio
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
