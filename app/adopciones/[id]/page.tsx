import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { notFound } from 'next/navigation';
import PetDetailClient from '@/components/PetDetailClient';
import { getPetById, getSimilarPets, checkIsFavorited } from '@/lib/services/pet.service';
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link';

/**
 * Página de Detalle de Mascota
 * 
 * Ruta: /adopciones/[id]
 * Acceso: Público (cualquier usuario)
 * 
 * Requerimientos:
 * - HU-005: Desarrollar galería pública de mascotas
 * - Mostrar detalle completo de mascota
 * - Opción de agregar a favoritos
 * - Opción de solicitar adopción
 * 
 * Funcionalidades:
 * ✅ Galería de imágenes expandida
 * ✅ Información completa de mascota
 * ✅ Descripción y requisitos
 * ✅ Información del albergue
 * ✅ Botón de favoritos
 * ✅ Botón de solicitud de adopción
 * ✅ Recomendaciones de mascotas similares
 */

interface PetDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: PetDetailPageProps
): Promise<Metadata> {
  try {
    const pet = await getPetById(params.id);

    if (!pet) {
      return {
        title: 'Mascota no encontrada - PawLig',
      };
    }

    return {
      title: `Adopta a ${pet.name}`,
      description: `${pet.species}${pet.breed ? ` ${pet.breed}` : ''} en adopción. ${pet.description?.substring(0, 150) || 'Encuentra tu compañero perfecto'}...`,
      openGraph: {
        title: `${pet.name} busca hogar en PawLig`,
        description: pet.description || '',
        images: pet.images && pet.images.length > 0 ? [pet.images[0]] : [],
      },
    };
  } catch (error) {
    console.error(`Error detectado: ${error}`)
    return {
      title: 'Detalle de mascota - PawLig',
    };
  }
}

export const revalidate = 60;

export default async function PetDetailPage({ params }: PetDetailPageProps) {
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

  const userSession = session?.user ? {
    id: session.user.id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    role: session.user.role || '',
  } : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
              <Link href="/adopciones" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-base font-semibold">
                <ArrowLeft className="w-4 h-4" />
                Volver a Adopciones
              </Link>
            </div>
      <PetDetailClient
        pet={pet}
        isFavorited={isFavorited}
        userSession={userSession}
        similarPets={similarPets}
      />
    </main>
  );
}
