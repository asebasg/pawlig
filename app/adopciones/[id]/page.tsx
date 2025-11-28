import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { notFound } from 'next/navigation';
import PetDetailClient from '@/components/PetDetailClient';
import { getPetById, getSimilarPets, checkIsFavorited } from '@/lib/services/pet.service';

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
      title: `${pet.name} - Adopta en PawLig`,
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PetDetailClient
        pet={pet}
        isFavorited={isFavorited}
        userSession={session?.user || null}
        similarPets={similarPets}
      />
    </main>
  );
}
