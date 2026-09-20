import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  Shield,
  HelpCircle,
  FileText,
  FileLock2,
  History,
} from "lucide-react";

/**
 * Descripción: Sección de recursos migrados de la antigua ruta /recursos.
 * Requiere: Ninguno
 * Implementa: ISSUE-157
 */

const RESOURCES = [
  {
    title: "Guía de Adopción",
    description:
      "Todo lo que necesitas saber antes, durante y después de adoptar a tu nuevo mejor amigo.",
    icon: <Heart className="text-primary" size={24} />,
    href: "/guia-adopcion",
  },
  {
    title: "Cuidado de Mascotas",
    description:
      "Consejos sobre nutrición, salud, entrenamiento y bienestar general para mascotas.",
    icon: <Shield className="text-primary" size={24} />,
    href: "/cuidado",
  },
  {
    title: "Manual del Usuario",
    description:
      "Aprende a navegar y utilizar todas las funciones de la plataforma PawLig.",
    icon: <BookOpen className="text-primary" size={24} />,
    href: "/guide",
  },
  {
    title: "Preguntas Frecuentes",
    description:
      "Encuentra respuestas rápidas a las dudas más comunes de nuestra comunidad.",
    icon: <HelpCircle className="text-primary" size={24} />,
    href: "/faq",
  },
  {
    title: "Términos y Condiciones",
    description:
      "Información legal sobre el uso de nuestros servicios y plataforma.",
    icon: <FileText className="text-zinc-600 dark:text-zinc-400" size={24} />,
    href: "/terms",
  },
  {
    title: "Política de Privacidad",
    description:
      "Conoce cómo protegemos y manejamos tus datos personales en PawLig.",
    icon: <FileLock2 className="text-zinc-600 dark:text-zinc-400" size={24} />,
    href: "/privacy",
  },
  {
    title: "Notas de Lanzamiento",
    description:
      "Historial de versiones y nuevas características del ecosistema PawLig.",
    icon: <History className="text-zinc-600 dark:text-zinc-400" size={24} />,
    href: "/changelog",
  },
];

export function BlogResources() {
  return (
    <div className="w-full">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
          Recursos <span className="text-primary">Institucionales y Ayuda</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-400 md:text-lg">
          Explora nuestra biblioteca de guías, manuales y documentos diseñados
          para ayudarte a brindar el mejor cuidado a las mascotas y aprovechar
          al máximo nuestra plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((resource) => (
          <Link
            key={resource.href}
            href={resource.href}
            className="hover:border-primary/20 group flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm active:scale-[0.98] transition-[transform,box-shadow,border-color] duration-200 ease-out hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50"
          >
            <div className="bg-primary/5 group-hover:bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-105">
              {resource.icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-900 transition-colors group-hover:text-primary dark:text-zinc-50">
              {resource.title}
            </h3>
            <p className="mb-6 flex-grow text-sm text-zinc-600 dark:text-zinc-400">
              {resource.description}
            </p>
            <div className="mt-auto flex items-center text-sm font-semibold text-primary">
              Explorar recurso
              <span className="ml-2 inline-block transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Migrado de /recursos. Componente estático con enlaces útiles para usuarios.
 *
 * Lógica Clave:
 * - Renderiza cards con efectos hover en CSS puro para evitar re-renders.
 * - Soporte nativo a dark mode usando la paleta zinc configurada.
 */
