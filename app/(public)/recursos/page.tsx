import React from 'react';
import Link from 'next/link';
import { BookOpen, Heart, Shield, HelpCircle, FileText, FileLock2, History } from 'lucide-react';

export const metadata = {
  title: 'Recursos Adicionales | PawLig',
  description: 'Guías, manuales y recursos adicionales para la comunidad de PawLig.',
};

const RESOURCES = [
  {
    title: 'Guía de Adopción',
    description: 'Todo lo que necesitas saber antes, durante y después de adoptar a tu nuevo mejor amigo.',
    icon: <Heart className="text-primary" size={24} />,
    href: '/guia-adopcion',
  },
  {
    title: 'Cuidado de Mascotas',
    description: 'Consejos sobre nutrición, salud, entrenamiento y bienestar general para mascotas.',
    icon: <Shield className="text-primary" size={24} />,
    href: '/cuidado',
  },
  {
    title: 'Manual del Usuario',
    description: 'Aprende a navegar y utilizar todas las funciones de la plataforma PawLig.',
    icon: <BookOpen className="text-primary" size={24} />,
    href: '/guide',
  },
  {
    title: 'Preguntas Frecuentes',
    description: 'Encuentra respuestas rápidas a las dudas más comunes de nuestra comunidad.',
    icon: <HelpCircle className="text-primary" size={24} />,
    href: '/faq',
  },
  {
    title: 'Términos y Condiciones',
    description: 'Información legal sobre el uso de nuestros servicios y plataforma.',
    icon: <FileText className="text-slate-600" size={24} />,
    href: '/terms',
  },
  {
    title: 'Política de Privacidad',
    description: 'Conoce cómo protegemos y manejamos tus datos personales en PawLig.',
    icon: <FileLock2 className="text-slate-600" size={24} />,
    href: '/privacy',
  },
  {
    title: 'Notas de Lanzamiento',
    description: 'Historial de versiones y nuevas características del ecosistema PawLig.',
    icon: <History className="text-slate-600" size={24} />,
    href: '/changelog',
  }
];

export default function RecursosPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Recursos <span className="text-primary">Adicionales</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explora nuestra biblioteca de guías, manuales y documentos diseñados para ayudarte a brindar
            el mejor cuidado a las mascotas y aprovechar al máximo nuestra plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all group flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-transform">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                {resource.title}
              </h3>
              <p className="text-slate-600 text-sm mb-6 flex-grow">
                {resource.description}
              </p>
              <div className="flex items-center text-primary font-semibold text-sm mt-auto">
                Explorar recurso
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
