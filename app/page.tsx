import Image from "next/image";
import Link from "next/link";
import { Heart, HouseHeart, Shield, ClipboardCheck, Package, CheckCircle, Search, Flame, PawPrint, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { PetCard, PetCardData } from "@/components/cards/pet-card";
import { ConfettiButton } from "@/components/ui/confetti-button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Button } from "@/components/ui/button";
import { Metadata } from 'next';

/**
 * Metadata para SEO
 */
export const metadata: Metadata = {
  title: 'Inicio - PawLig',
  description: 'Plataforma integral para la adopción y cuidado de mascotas',
};

export default async function Home() {
  // Obtener sesión del usuario
  const session = await getServerSession(authOptions);

  // Obtener las primeras 3 mascotas disponibles
  const featuredPets = await prisma.pet.findMany({
    where: {
      status: "AVAILABLE",
    },
    include: {
      shelter: {
        select: {
          id: true,
          name: true,
          municipality: true,
        },
      },
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Si hay usuario autenticado, verificar favoritos
  let favoritePetIds: string[] = [];
  if (session?.user?.id && featuredPets.length > 0) {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
        petId: {
          in: featuredPets.map((p: typeof featuredPets[0]) => p.id),
        },
      },
      select: {
        petId: true,
      },
    });
    favoritePetIds = favorites.map((f: typeof favorites[0]) => f.petId);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sección Hero */}
      <section className="py-12 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-800 mb-8 leading-tight">
            Aquí, donde tus sueños comienzan y la felicidad de ellos también
          </h1>

          {/* Estadísticas */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-teal-600 text-xl">🐾</span>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-purple-800">+2,500</p>
                <p className="text-sm text-purple-600 font-medium">Animales rescatados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-purple-600 text-xl">🏠</span>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-purple-800">+50</p>
                <p className="text-sm text-purple-600 font-medium">Albergues aliados</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-yellow-600 text-xl">✨</span>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-purple-800">100%</p>
                <p className="text-sm text-purple-600 font-medium">Historias de esperanza</p>
              </div>
            </div>
          </div>

          {/* Botones de Llamada a la Acción */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/adopciones"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Buscar un amigo
            </Link>
            <Link
              href="/productos"
              className="bg-white text-purple-700 border-2 border-purple-200 px-8 py-3 rounded-lg font-bold hover:border-purple-600 hover:text-purple-600 transition-colors"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Sección Por Qué Adoptar */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-purple-800 mb-4">
              ¿Por qué adoptar?
            </h2>
            <p className="text-purple-600 max-w-2xl mx-auto">
              Salvar una vida es embellecer otra historia. La adopción es nuestra garantía de un mundo sostenible, consciente y lleno de responsabilidad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-purple-100">
              <div className="relative h-56 bg-purple-200">
                {/* Imágenes de tarjeta */}
                <Image
                  src="/images/pet-adopted.png"
                  alt="Mascota adoptada"
                  fill
                  className="object-cover pointer-events-none"
                />
              </div>
              <div className="p-8 text-center relative">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto absolute -top-7 left-1/2 transform -translate-x-1/2 shadow-md">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 mt-4">
                  Compañía para toda la vida
                </h3>
                <p className="text-purple-600 text-sm leading-relaxed">
                  Brinda un compañero y recibe amor incondicional en cada paseo.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-purple-100">
              <div className="relative h-56 bg-purple-200">
                {/* Imágenes de tarjeta */}
                <Image
                  src="/images/pet-home.png"
                  alt="Mascota en casa"
                  fill
                  className="object-cover pointer-events-none"
                />
              </div>
              <div className="p-8 text-center relative">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto absolute -top-7 left-1/2 transform -translate-x-1/2 shadow-md">
                  <HouseHeart className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 mt-4">
                  Dar un nuevo hogar
                </h3>
                <p className="text-purple-600 text-sm leading-relaxed">
                  Llena tu espacio de refugio, tranquilidad y salud con una mascota leal.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all border border-purple-100">
              <div className="relative h-56 bg-purple-200">
                {/* Imágenes de tarjeta */}
                <Image
                  src="/images/pet-community.png"
                  alt="Valle de Aburrá"
                  fill
                  className="object-cover pointer-events-none"
                />
              </div>
              <div className="p-8 text-center relative">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto absolute -top-7 left-1/2 transform -translate-x-1/2 shadow-md">
                  <Flame className="w-6 h-6 text-orange-600 fill-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 mt-4">
                  Apoyo comunitario
                </h3>
                <p className="text-purple-600 text-sm leading-relaxed">
                  Cada adopción impulsa programas de protección para rescatar a más animales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Mascotas Destacadas */}
      <section className="pb-10 pt-5 bg-purple-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-purple-800">
              Conoce a quienes buscan un hogar
            </h2>
            <Link
              href="/adopciones"
              className="text-purple-700 hover:text-purple-800 font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform"
            >
              Ver todas las mascotas
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPets.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-purple-500 mb-4 text-lg">
                  No hay mascotas destacadas en este momento.
                </p>
                <Link
                  href="/adopciones"
                  className="text-purple-600 hover:text-purple-700 font-semibold underline"
                >
                  Explorar todo el catálogo
                </Link>
              </div>
            ) : (
              featuredPets.map((pet: typeof featuredPets[0]) => {
                const petData: PetCardData = {
                  id: pet.id,
                  name: pet.name,
                  images: pet.images,
                  species: pet.species,
                  breed: pet.breed,
                  age: pet.age,
                  sex: pet.sex,
                  shelter: pet.shelter,
                };

                return (
                  <div key={pet.id} className="h-full">
                    <PetCard
                      pet={petData}
                      accentColor="purple"
                      imageOverlay={
                        <FavoriteButton
                          petId={pet.id}
                          initialIsFavorited={favoritePetIds.includes(pet.id)}
                          userSession={
                            session?.user
                              ? {
                                id: session.user.id,
                                name: session.user.name || "",
                                email: session.user.email || "",
                                role: session.user.role,
                              }
                              : null
                          }
                        />
                      }
                      footer={
                        <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                          <Link href={`/adopciones/${pet.id}`}>Ver detalles</Link>
                        </Button>
                      }
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Sección ¿Sabías Que? */}
      <section className="pb-10 pt-5 bg-gradient-to-b from-purple-50 via-purple-300 to-purple-500 text-white relative overflow-hidden">
        <section className="py-4 mb-4"> {/* bg-purple-50 */}
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center text-purple-800 mb-12">
              ¿Sabías que...?
            </h2>

            <div className="relative bg-purple-900 rounded-3xl overflow-hidden p-6 md:p-12 text-white shadow-2xl min-h-[450px] md:min-h-[500px] flex items-center">
              {/* Capa de Imagen de Fondo */}
              <Image
                src="/images/medellin-map.png"
                alt="Valle de Aburrá"
                fill
                className="object-cover pointer-events-none"
              />

              {/* Capa de Superposición Spotlight */}
              <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-20 pointer-events-none">
                <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-4 border-purple-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.70)] scale-150 md:scale-100" />
              </div>

              {/* Contenido Flotante */}
              <div className="relative z-10 text-center md:text-left max-w-lg mx-auto md:ml-10 md:mr-0">
                <p className="text-lg md:text-2xl mb-4 font-medium text-purple-300 uppercase tracking-wide drop-shadow-lg">
                  En el Valle de Aburrá
                </p>
                <h3 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-xl text-white">
                  +3500 animales
                </h3>
                <p className="text-lg md:text-3xl mb-10 text-purple-100 leading-relaxed font-light drop-shadow-lg">
                  están en situación de abandono.
                </p>
                <div className="inline-block bg-purple-600/95 hover:bg-purple-600 transition-colors rounded-full px-6 py-3 md:px-8 md:py-4 shadow-lg shadow-purple-900/50">
                  <p className="text-lg md:text-2xl font-bold text-white text-center">
                    ¡Tú puedes hacer la diferencia!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Solución PawLig */}
        <section className="py-6 mb-10">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-4xl font-bold text-center text-purple-800 mb-12">
              Y PawLig es la <span className="text-yellow-400">solución</span> a ello
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">
                  ¡Puedes escoger desde aquí a tu peludito favorito!
                </h3>
                <p className="text-purple-600 text-sm text-center">
                  En PawLig, no tienes que esperar: te damos un espacio real para descubrir cientos de mascotas en busca de hogar y puedes enviar tu solicitud de adopción al instante.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <ClipboardCheck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">
                  Procesos centralizados
                </h3>
                <p className="text-purple-600 text-sm text-center">
                  En PawLig, los procesos de adopción y la comunicación entre albergues son eficientes y ágiles, sin trámites largos ni desgaste emocional.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Package className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">
                  Productos confiables y segmentados
                </h3>
                <p className="text-purple-600 text-sm text-center">
                  Aquí encontrarás una amplia variedad de productos para el cuidado de tus mascotas (alimentos y accesorios de calidad, a precios accesibles).
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-purple-800 mb-3 text-center">
                  Veracidad de perfiles
                </h3>
                <p className="text-purple-600 text-sm text-center">
                  ¿Tienes dudas sobre la autenticidad de un producto o una mascota? ¡No te preocupes! En PawLig, los perfiles se encuentran siempre verificados antes de publicar cualquier contenido.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección CTA Emocional */}
        {/* Background Pattern - Paws */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Scatter Paws */}
          <PawPrint className="absolute top-3/4 left-10 text-purple-900/25 w-24 h-24 -rotate-45" />
          <PawPrint className="absolute bottom-10 left-1/4 text-purple-900/25 w-16 h-16 rotate-12" />
          <PawPrint className="absolute bottom-40 right-10 text-purple-900/25 w-32 h-32 rotate-45" />
          <PawPrint className="absolute bottom-10 right-1/3 text-purple-900/25 w-20 h-20 -rotate-12" />
          <PawPrint className="absolute top-2/3 right-20 text-purple-900/25 w-28 h-28 -rotate-12" />
          <PawPrint className="absolute bottom-1/2 left-20 text-purple-900/25 w-20 h-20 rotate-45" />
          <PawPrint className="absolute bottom-20 left-[10%] text-purple-900/25 w-12 h-12 -rotate-12" />
          <PawPrint className="absolute top-[60%] right-[10%] text-purple-900/25 w-14 h-14 rotate-12" />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            La vida de un animalito está en tus manos
          </h2>

          <p className="text-lg md:text-xl mb-6">
            Hay un pequeño compañero esperando por ti, listo para salir de su refugio y llenar tus días de ternura y alegría.
          </p>

          <p className="text-lg md:text-xl mb-8">
            Abrirle las puertas de tu hogar no solo transformará su vida, sino también la tuya. Cada adopción es una historia de esperanza y un nuevo comienzo.
          </p>

          <p className="text-2xl font-bold mb-8">
            ¡Dale una oportunidad al amor, anímate a adoptar!
          </p>

          <ConfettiButton
            href="/register"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-purple-100 transition-colors"
          >
            ¡Adopta y transforma la<br />vida de un animalito!
          </ConfettiButton>

          <p className="mt-6 text-sm">
            ¿Ya tienes una cuenta? <Link href="/login" className="underline font-semibold">Inicia sesión</Link>
          </p>
        </div>
      </section>

    </div>
  );
}