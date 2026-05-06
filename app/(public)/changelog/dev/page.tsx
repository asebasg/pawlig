import { Metadata } from "next";
import React from "react";
import {
  ArrowLeft,
  Terminal,
  Code2,
  Bug,
  Zap,
  Wrench,
  Layers,
  GitBranch,
  BadgeAlert,
  ShieldCheck,
  Cpu,
  FileCode,
} from "lucide-react";
import Link from "next/link";

/**
 * Descripción: Página de notas de desarrollo técnica para PawLig.
 * Proporciona un registro detallado de cambios internos, refactorizaciones y correcciones técnicas.
 * Requiere: Público.
 * Implementa: Registro de evolución técnica del proyecto.
 */

export const metadata: Metadata = {
  title: "Notas de Desarrollo | PawLig",
  description:
    "Registro técnico de actualizaciones, refactorizaciones y mejoras internas de la plataforma PawLig.",
};

export default function DevNotesPage() {
  const lastDevUpdate = "06 de mayo de 2026";

  const devLogs = [
    {
      version: "v1.8.2-dev",
      date: "06 de Mayo, 2026",
      title: "Persistencia de Carrito y Sync de Dashboard",
      description:
        "Implementación de lógica de base de datos para el carrito de compras y sincronización de estados en el panel de adoptante.",
      type: "improvement",
      logs: [
        {
          category: "feat",
          title: "Capa de Servicio: CartService",
          description: "Desarrollo de métodos CRUD persistentes en Prisma para la gestión del carrito.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "refactor",
          title: "Sync de URL en Dashboard",
          description: "Implementación de useSearchParams para mantener el estado de pestañas tras recargas.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
      ],
    },
    {
      version: "v1.8.0-dev",
      date: "28 de Abril, 2026",
      title: "Seguridad de Formularios y UX",
      description: "Optimización de la experiencia de usuario en campos de contraseña y limpieza de estilos Chromium.",
      type: "fix",
      logs: [
        {
          category: "fix",
          title: "CSS: Botón Nativo de Password",
          description: "Ocultación de botones de revelación nativos (::-ms-reveal) para evitar duplicidad con PasswordInput.",
          icon: <Bug size={18} className="text-red-500" />,
        },
        {
          category: "improvement",
          title: "Hydration Warning Suppression",
          description: "Ajuste en layout.tsx para asegurar compatibilidad con next-themes y evitar errores de hidratación.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
      ],
    },
    {
      version: "v1.7.1-dev",
      date: "24 de Abril, 2026",
      title: "Optimización Administrativa",
      description: "Mejoras en la reactividad del panel administrativo y consistencia de datos on-demand.",
      type: "improvement",
      logs: [
        {
          category: "improvement",
          title: "Revalidación On-Demand",
          description: "Uso de revalidatePath en bloqueo de usuarios para sincronización inmediata de la UI sin recarga manual.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
        {
          category: "improvement",
          title: "Cloudinary: Build-Time Config",
          description: "Configuración condicional del servicio de imágenes para evitar fallos durante el proceso de next build.",
          icon: <Cpu size={18} className="text-emerald-500" />,
        },
      ],
    },
    {
      version: "v1.7.0-dev",
      date: "24 de Abril, 2026",
      title: "Sistema de Notificaciones y Email",
      description: "Implementación robusta del sistema de correos y seguridad de tokens de recuperación.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Email: Envíos No Bloqueantes",
          description: "Implementación de flujos asíncronos para evitar que fallos en el servicio de email afecten la respuesta de la API.",
          icon: <Cpu size={18} className="text-emerald-500" />,
        },
        {
          category: "feat",
          title: "Esquema Prisma: PasswordResetToken",
          description: "Nuevo modelo para gestión segura de recuperación de cuenta con expiración de 1 hora.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
      ],
    },
    {
      version: "v1.5.0-dev",
      date: "20 de Febrero, 2026",
      title: "Estabilidad del Entorno de Pruebas",
      description: "Resolución de conflictos entre librerías de UI y el entorno de ejecución de tests unitarios.",
      type: "fix",
      logs: [
        {
          category: "fix",
          title: "Vitest + Radix UI",
          description: "Polyfills para PointerEvent y ResizeObserver para soportar componentes Radix en JSDOM.",
          icon: <Wrench size={18} className="text-slate-500" />,
        },
        {
          category: "refactor",
          title: "Test de Usuario Administrativo",
          description: "Refactorización de user-view.spec.tsx para soportar la lógica de componentes Radix Select.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
      ],
    },
    {
      version: "v1.1.0-dev",
      date: "30 de Diciembre, 2025",
      title: "Calidad de Datos y Testing Base",
      description: "Estandarización de filtros de búsqueda y configuración inicial de Vitest.",
      type: "chore",
      logs: [
        {
          category: "fix",
          title: "Consistencia de Filtro de Sexo",
          description: "Sincronización de valores 'M/F' a 'Macho/Hembra' para coincidir con el Enum de la base de datos.",
          icon: <Bug size={18} className="text-red-500" />,
        },
        {
          category: "chore",
          title: "Setup de Vitest",
          description: "Instalación de testing-library y configuración de vitest.config.ts para el proyecto.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
      ],
    },
    {
      version: "v1.0.1-dev",
      date: "28 de Noviembre, 2025",
      title: "Arquitectura y Mantenimiento",
      description: "Reorganización de la arquitectura de API y limpieza de documentación obsoleta.",
      type: "refactor",
      logs: [
        {
          category: "refactor",
          title: "Rutas de API Adopter",
          description: "Migración de endpoints de /api/adopter a /api/user para mayor consistencia semántica.",
          icon: <GitBranch size={18} className="text-slate-500" />,
        },
        {
          category: "feat",
          title: "Validación de Rol Adopter",
          description: "Restricción de solicitudes de adopción únicamente a usuarios con el rol ADOPTER en el servidor.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "chore",
          title: "Cleanup de Repositorio",
          description: "Eliminación de documentación de PRs y configuración de exclusión para agentes IA en .gitignore.",
          icon: <Wrench size={18} className="text-slate-500" />,
        },
      ],
    },
  ];

  const categoryStyles: Record<string, string> = {
    feat: "bg-indigo-100 text-indigo-700 border-indigo-200 pointer-events-none",
    fix: "bg-red-100 text-red-700 border-red-200 pointer-events-none",
    refactor: "bg-amber-100 text-amber-700 border-amber-200 pointer-events-none",
    chore: "bg-slate-100 text-slate-700 border-slate-200 pointer-events-none",
    improvement: "bg-emerald-100 text-emerald-700 border-emerald-200 pointer-events-none",
    docs: "bg-blue-100 text-blue-700 border-blue-200 pointer-events-none",
  };

  return (
    <main className="min-h-screen bg-white pb-20 text-slate-900 font-sans">
      {/* Top Navigation */}
      <div className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/changelog"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Volver al Changelog Público</span>
          </Link>
          <div className="pointer-events-none flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LAST_SYNC: {lastDevUpdate}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <header className="mb-16">
          <div className="pointer-events-none inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
            <Terminal size={12} />
            <span>Internal Dev Logs</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Notas de Desarrollo
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
            Un registro técnico y detallado de la arquitectura, optimizaciones y el detrás de escena del desarrollo de PawLig.
          </p>
        </header>

        {/* Timeline */}
        <div className="space-y-12">
          {devLogs.map((entry) => (
            <section key={entry.version} className="relative pl-8 border-l border-slate-100">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-slate-300 ring-4 ring-white" />

              <div className="flex flex-col gap-6">
                <header>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-tighter">
                      {entry.version}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      /
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {entry.date}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {entry.title}
                  </h2>
                  <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-3xl">
                    {entry.description}
                  </p>
                </header>

                <div className="grid grid-cols-1 gap-3">
                  {entry.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="mt-1 shrink-0">
                        {log.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryStyles[log.category] || "bg-slate-100"}`}>
                            {log.category.toUpperCase()}
                          </span>
                          <h4 className="text-sm font-bold text-slate-700">
                            {log.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">
                          {log.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Dev Footer */}
        <footer className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitBranch size={16} />
              <span className="text-xs font-mono">branch: main</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              <span className="text-xs font-mono">status: stable</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            
            <Link href="https://github.com/asebasg/pawlig" className="hover:text-slate-600 transition-colors">
              <Code2 size={18} />
            </Link>
            <Link href="https://github.com/asebasg/pawlig/issues/new/choose" className="hover:text-red-600 transition-colors">
              <BadgeAlert size={18} />
            </Link>
            <Link href="https://drive.google.com/drive/folders/16V41xWkq5CkAVAwj_ojDM3ri-jfaXh2m" className="hover:text-green-600 transition-colors">
              <FileCode size={18} />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Vista técnica para desarrolladores que detalla cambios internos.
 *
 * Lógica Clave:
 * - Diseño Minimalista: Utiliza una paleta de colores slate y blanco para un look profesional.
 * - Iconografía Técnica: Lucide-react con iconos orientados a desarrollo (Terminal, Cpu, Layers).
 * - Estructura de Timeline: Una línea de tiempo vertical limpia para organizar las versiones.
 *
 * Dependencias Externas:
 * - lucide-react: Para la iconografía técnica.
 * - next/link: Para navegación interna.
 *
 */
