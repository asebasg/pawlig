/**
 * Descripción: Página informativa sobre la misión, visión y valores de PawLig.
 * Requiere: Metadata de Next.js.
 * Implementa: Boilerplate para la sección "Nosotros".
 */

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Target, 
  Award, 
  Smile,
  ArrowRight,
  PawPrint,
  Globe,
  Zap
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Conoce más sobre PawLig, nuestra misión para conectar mascotas con hogares amorosos y cómo estamos transformando el mundo animal.",
};

export default function NosotrosPage() {
  const stats = [
    { label: "Mascotas Adoptadas", value: "2,500+", icon: <PawPrint className="text-pink-500" /> },
    { label: "Albergues Asociados", value: "150+", icon: <Globe className="text-blue-500" /> },
    { label: "Vidas Transformadas", value: "10,000+", icon: <Zap className="text-yellow-500" /> },
    { label: "Comunidad Activa", value: "50,000+", icon: <Users className="text-purple-500" /> },
  ];

  const values = [
    {
      title: "Compromiso Ético",
      description: "Priorizamos el bienestar animal por encima de todo, asegurando que cada adopción sea responsable.",
      icon: <ShieldCheck size={32} className="text-purple-600" />,
    },
    {
      title: "Amor Incondicional",
      description: "Creemos en el vínculo único entre humanos y animales como motor de cambio social.",
      icon: <Heart size={32} className="text-pink-600" />,
    },
    {
      title: "Transparencia Total",
      description: "Mantenemos procesos claros y honestos en todas nuestras operaciones y alianzas.",
      icon: <Award size={32} className="text-amber-600" />,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/nosotros_hero_image_1778473832814.png"
            alt="Comunidad PawLig"
            fill
            className="object-cover opacity-60 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900/80 to-transparent" />
        </div>

        {/* Floating Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-20 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000" style={{ animationDelay: "2s" }} />
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000" style={{ animationDelay: "4s" }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white mb-6 drop-shadow-lg">
            Cambiando Vidas, <br />
            <span className="text-pink-400">Huella a Huella</span>
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            En PawLig, no solo conectamos mascotas con hogares; construimos una comunidad dedicada a la protección y el bienestar animal en todo el país.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/adopciones"
              className="px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-xl hover:bg-pink-50 transition-all transform hover:scale-105"
            >
              Ver Mascotas
            </Link>
            <Link
              href="/help"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Cómo Ayudar
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-bold mb-6">
              <Target size={16} />
              <span>Nuestra Misión</span>
            </div>
            <h2 className="text-4xl font-poppins font-bold text-slate-900 mb-6">
              Empoderar a los albergues y unir familias.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              PawLig nació de la necesidad de digitalizar y profesionalizar el proceso de adopción. Nuestra plataforma proporciona herramientas avanzadas a los albergues para gestionar sus mascotas, mientras ofrece a los adoptantes una experiencia segura, transparente y emocionante.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Smile size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Impacto Directo</h4>
                  <p className="text-slate-500 text-sm">Cada interacción en nuestra plataforma contribuye a salvar una vida.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Seguridad Garantizada</h4>
                  <p className="text-slate-500 text-sm">Validamos a cada albergue y vendedor para asegurar un entorno confiable.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop"
              alt="Mascotas felices"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-poppins font-bold mb-16">Nuestros Valores Fundamentales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div key={index} className="p-8 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                <div className="mb-6 inline-block p-4 bg-white rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-poppins font-bold text-slate-900 mb-8">Nuestra Historia</h2>
          <p className="text-xl text-slate-600 leading-relaxed mb-12">
            PawLig comenzó como un pequeño proyecto universitario en 2024, impulsado por la pasión de un grupo de amantes de los animales frustrados por las dificultades del sistema de adopción tradicional en el Valle de Aburrá. Hoy, somos el estándar de oro en tecnología para el bienestar animal.
          </p>
          <div className="relative p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-[2.5rem]">
            <div className="bg-white rounded-[2.4rem] p-12 text-left">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="shrink-0">
                  <div className="w-24 h-24 bg-purple-700 text-white rounded-full flex items-center justify-center text-3xl font-black">
                    2026
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">PawLig v2.0: La Revolución</h3>
                  <p className="text-slate-600">
                    Estamos lanzando nuestra versión más ambiciosa hasta la fecha, integrando inteligencia artificial para mejorar la compatibilidad entre mascotas y dueños, y expandiendo nuestro marketplace para apoyar la economía local.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-8 relative z-10">
            ¿Listo para encontrar a tu mejor amigo?
          </h2>
          <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto relative z-10">
            Miles de mascotas están esperando un hogar. Únete a nuestra comunidad y sé parte del cambio.
          </p>
          <Link
            href="/adopciones"
            className="inline-flex items-center gap-3 px-10 py-5 bg-pink-500 hover:bg-pink-400 text-white font-bold rounded-full text-xl shadow-lg hover:scale-105 transition-all relative z-10"
          >
            Explorar Galería <ArrowRight size={24} />
          </Link>
        </div>
      </section>
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Página informativa "Nosotros" que presenta la identidad de la marca PawLig.
 *
 * Lógica Clave:
 * - Diseño Premium: Uso de gradientes, glassmorphism (en la sección de valores) y sombras profundas.
 * - Hero Dinámico: Imagen generada por IA con overlay degradado para legibilidad.
 * - Responsividad: Grid adaptable para móviles y tablets.
 * - SEO: Metadata optimizada para búsqueda orgánica.
 *
 * Dependencias Externas:
 * - Lucide React: Iconografía estándar del proyecto.
 * - Next Image: Optimización de imágenes.
 * - Tailwind CSS: Estilizado basado en tokens del sistema.
 *
 */
