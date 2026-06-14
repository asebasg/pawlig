import { Metadata } from "next";
import React from "react";
import {
  ArrowLeft,
  Terminal,
  Bug,
  Zap,
  Wrench,
  Layers,
  GitBranch,
  ShieldCheck,
  Cpu,
  FileCode,
  Code2,
} from "lucide-react";
import Link from "next/link";
import DevNotesClient from "./dev-notes-client";

/**
 * Descripción: Página de notas de desarrollo técnica para PawLig.
 * Proporciona un registro detallado de cambios internos, refactorizaciones y correcciones técnicas.
 * Requiere: Público.
 * Implementa: Registro de evolución técnica del proyecto.
 */

export const metadata: Metadata = {
  title: "Notas de Desarrollo",
  description:
    "Registro técnico de actualizaciones, refactorizaciones y mejoras internas de la plataforma PawLig.",
};

export default function DevNotesPage() {
  const lastDevUpdate = "12 de junio de 2026";

  const devLogs = [
    {
      version: "v1.15.0-dev",
      date: "12 de Junio, 2026",
      title: "Seguridad de Multimedia y Ciclo de Solicitudes",
      description:
        "Implementación del endpoint seguro de eliminación de Cloudinary con RBAC, remoción de métodos inseguros y habilitación del reenvío de solicitudes tras rechazo.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Endpoint Seguro de Eliminación Cloudinary",
          description: "Desarrollo de DELETE /api/cloudinary/delete con validación estricta de propiedad (RBAC) por rol y verificación de prefijo de entorno.",
          icon: <ShieldCheck size={18} className="text-emerald-500" />,
        },
        {
          category: "fix",
          title: "Reenvío de Solicitudes Denegadas",
          description: "Corrección en APIs de solicitud para permitir reenvíos de albergue y vendedor cuando el estado es REJECTED o DENIED.",
          icon: <Wrench size={18} className="text-amber-500" />,
        },
        {
          category: "refactor",
          title: "Limpieza de /api/upload",
          description: "Eliminación del handler DELETE desprotegido en la API de subida de archivos original.",
          icon: <Code2 size={18} className="text-blue-500" />,
        },
        {
          category: "improvement",
          title: "Helpers y Lote de Borrado",
          description: "Integración de extractPublicId y deleteImagesFromCloudinary con Promise.allSettled en lib/cloudinary.ts.",
          icon: <Zap size={18} className="text-indigo-500" />,
        },
      ],
    },
    {
      version: "v1.14.0-dev",
      date: "27 de Mayo, 2026",
      title: "Moderation Hub Integrado y Auditoría del Sistema",
      description:
        "Implementación del módulo de moderación centralizado para administradores con control transaccional de solicitudes de albergues/vendedores y bitácora de auditoría polimórfica.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Bitácora de Auditoría del Sistema",
          description: "Definición del modelo SystemAuditLog y enums asociados en Prisma para registro polimórfico de eventos del sistema.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
        {
          category: "feat",
          title: "Servicio de Moderación Transaccional",
          description: "Desarrollo de moderation.service.ts usando transacciones de Prisma para asegurar consistencia atómica y envío asíncrono de emails.",
          icon: <Cpu size={18} className="text-emerald-500" />,
        },
        {
          category: "feat",
          title: "Endpoints RESTful de Moderación",
          description: "Creación de APIs protegidas para el listado, aprobación y declinación de solicitudes bajo /api/admin/moderation.",
          icon: <ShieldCheck size={18} className="text-indigo-500" />,
        },
        {
          category: "feat",
          title: "UI del Moderation Hub y Visor de Auditoría",
          description: "Desarrollo de vistas y componentes interactivos paginados envueltos en Suspense para cumplir con Next.js App Router.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
      ],
    },
    {
      version: "v1.13.0-dev",
      date: "23 de Mayo, 2026",
      title: "Dashboard del Administrador y Enlaces de Gestión",
      description:
        "Implementación del panel de control centralizado para administradores con validación de seguridad de servidor y accesos directos para la administración del sistema.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Dashboard de Administración",
          description: "Página de servidor con validación estricta de sesión y verificación del rol ADMIN en la base de datos.",
          icon: <ShieldCheck size={18} className="text-emerald-500" />,
        },
        {
          category: "feat",
          title: "UI del Dashboard (Cliente)",
          description: "Desarrollo del componente cliente interactivo con accesos rápidos a moderación, usuarios y métricas globales.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "improvement",
          title: "Enlaces de Gestión y Desarrollo",
          description: "Integración en el panel de accesos directos al repositorio de GitHub y a las Notas de Desarrollo.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
      ],
    },
    {
      version: "v1.12.0-dev",
      date: "21 de Mayo, 2026",
      title: "Auditoría Técnica y Documentación",
      description:
        "Evaluación exhaustiva de la base de código y actualización de la documentación técnica para reflejar la estructura reciente y medir el progreso del desarrollo.",
      type: "docs",
      logs: [
        {
          category: "docs",
          title: "Actualización de CONTEXT",
          description: "Actualización de CONTEXT.md con dependencias y estructura reciente del proyecto.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
        {
          category: "docs",
          title: "Registro de Actualizaciones",
          description: "Creación del registro de actualizaciones mensuales (enero-mayo 2026) y README.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
        {
          category: "improvement",
          title: "Auditoría Técnica y Métricas",
          description: "Realización de auditoría técnica y generación de métricas de control de gestión.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
      ],
    },
    {
      version: "v1.11.0-dev",
      date: "16 de Mayo, 2026",
      title: "Estandarización y Robustez en Productos",
      description:
        "Implementación del Estándar de Oro en documentación y refuerzo del tipado estricto en el buscador de productos.",
      type: "improvement",
      logs: [
        {
          category: "improvement",
          title: "Buscador: Tipado de Categorías",
          description: "Refactorización del filtro por categoría para usar validación dinámica contra el enum ProductCategory de Prisma.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
        {
          category: "docs",
          title: "Estándar de Oro PawLig",
          description: "Inclusión de bloques JSDoc y Notas de Implementación exhaustivas en la capa de vistas de productos.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
        {
          category: "fix",
          title: "Validación de Acceso Vendedor",
          description: "Optimización de la cascada de redirecciones para cuentas de vendedor no verificadas o roles incorrectos.",
          icon: <ShieldCheck size={18} className="text-emerald-500" />,
        },
      ],
    },
    {
      version: "v1.10.0-dev",
      date: "15 de Mayo, 2026",
      title: "Sistema de Métricas y Georreferenciación",
      description:
        "Implementación completa de servicios de métricas, utilidades de exportación y motor de geocodificación para refugios.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Service Layer: Vendor Metrics",
          description: "Desarrollo de servicios optimizados para agregación de datos y reportes de ventas.",
          icon: <Cpu size={18} className="text-emerald-500" />,
        },
        {
          category: "feat",
          title: "Geocodificación Automática",
          description: "Implementación de geocoding.service.ts y scripts de migración para normalización de direcciones.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "improvement",
          title: "Exportación Multi-formato",
          description: "Desarrollo de utilidades para generación de reportes PDF/Excel/CSV con buffers eficientes.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
      ],
    },
    {
      version: "v1.9.0-dev",
      date: "11 de Mayo, 2026",
      title: "Sistema Integrado de Gestión de Postulaciones",
      description:
        "Refactorización y extensión del flujo de adopciones para una gestión operativa más eficiente y segura.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Servicio de Adopción (AdoptionService)",
          description: "Centralización de lógica de negocio y transacciones atómicas para gestión de estados de mascota/solicitud.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "improvement",
          title: "Tipado Estricto (Cero Any)",
          description: "Implementación de tipos basados en Prisma GetPayload para una API fuertemente tipada.",
          icon: <Cpu size={18} className="text-emerald-500" />,
        },
        {
          category: "feat",
          title: "UI Modular (Shelter)",
          description: "Componentes modulares de aprobación, tarjetas de postulación y tablas de gestión con Zod validación.",
          icon: <FileCode size={18} className="text-blue-500" />,
        },
      ],
    },
    {
      version: "v1.9.0-dev",
      date: "08 de Mayo, 2026",
      title: "Rediseño 404: Experiencia Orbital 3D",
      description:
        "Transformación de la página 404 en una experiencia dinámica de alta fidelidad basada en un sistema solar 3D con física orbital real.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Motor Orbital Kepleriano",
          description: "Implementación de física orbital (Ley de Áreas) en Canvas 2D para movimiento fluido y realista.",
          icon: <Cpu size={18} className="text-emerald-500" />,
        },
        {
          category: "improvement",
          title: "Proyección 3D e Isometría",
          description: "Cálculo de proyección paralela y oclusión dinámica para profundidad visual.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "improvement",
          title: "Optimización de Renderizado",
          description: "Manejo eficiente de RAF y escalado reactivo (DPR) para nitidez en pantallas Retina.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
      ],
    },
    {
      version: "v1.8.3-dev",
      date: "07 de Mayo, 2026",
      title: "Gestión Precisa de Edad (Años y Meses)",
      description:
        "Implementación de campos duales para la edad de las mascotas, permitiendo mayor precisión en cachorros y una visualización amigable.",
      type: "feat",
      logs: [
        {
          category: "feat",
          title: "Esquema Prisma: Pet.months",
          description: "Nuevo campo opcional para almacenar meses de vida de la mascota.",
          icon: <Layers size={18} className="text-indigo-500" />,
        },
        {
          category: "improvement",
          title: "Utilidad de Formateo de Edad",
          description: "Implementación de age-formatter.ts para normalizar strings como '1 año y 2 meses'.",
          icon: <Wrench size={18} className="text-slate-500" />,
        },
        {
          category: "feat",
          title: "UI: Formulario de Mascota",
          description: "Inclusión de input numérico para meses con validación en el rango 0-11.",
          icon: <Zap size={18} className="text-amber-500" />,
        },
      ],
    },
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

        <DevNotesClient devLogs={devLogs} />

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
            <Link
              href="https://github.com/asebasg/pawlig"
              className="hover:text-slate-600 transition-colors"
            >
              <Code2 size={18} />
            </Link>
            <Link
              href="https://github.com/asebasg/pawlig/issues/new/choose"
              className="hover:text-red-600 transition-colors"
            >
              <Bug size={18} />
            </Link>
            <Link
              href="https://drive.google.com/drive/folders/16V41xWkq5CkAVAwj_ojDM3ri-jfaXh2m"
              className="hover:text-green-600 transition-colors"
            >
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
 * - Diseño Minimalista: Look profesional con paleta slate.
 * - Paginación: Implementada para gestionar el volumen de logs técnicos.
 * - Estructura de Timeline: Organización cronológica limpia.
 *
 * Dependencias Externas:
 * - lucide-react: Iconografía técnica.
 * - next/link: Navegación interna.
 *
 */
