import { Metadata } from "next";
import React from "react";
import {
  ArrowLeft,
  Rocket,
  History,
  Sparkles,
  Zap,
  GitPullRequest,
  Star,
  Shield,
  Heart,
  Bug,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ChangelogClient from "./changelog-client";

/**
 * Descripción: Página del registro de cambios (Changelog) público de la plataforma PawLig.
 * Requiere: Acceso público.
 * Implementa: Historial visual y amigable de las actualizaciones de la aplicación para el usuario final.
 */

export const metadata: Metadata = {
  title: "Notas de Lanzamiento",
  description:
    "Historial de actualizaciones, mejoras y nuevas funcionalidades integradas en la plataforma PawLig.",
};

export default function ChangelogPage() {
  const lastUpdate = "10 de julio de 2026";

  const versions = [
    {
      version: "v1.15.0",
      date: "10 de Julio, 2026",
      title: "Asistencia Inteligente y Carrito Más Eficiente",
      description:
        "Mejoramos la creación y moderación de contenidos con asistencia de IA, simplificamos los requisitos de adopción y optimizamos el carrito para evitar consultas innecesarias.",
      color: "from-violet-600 to-indigo-700",
      updates: [
        {
          type: "added",
          title: "Asistente IA en Formularios y Moderación",
          description:
            "Ahora es posible refinar descripciones de mascotas, productos y decisiones de moderación con asistencia de IA directamente desde los flujos de trabajo.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-violet-600",
        },
        {
          type: "improved",
          title: "Respuestas de IA Más Seguras",
          description:
            "Se reforzó la validación de solicitudes y el tratamiento de las respuestas generadas para ofrecer resultados más consistentes y confiables.",
          icon: <Shield size={20} className="text-white" />,
          bg: "bg-emerald-600",
        },
        {
          type: "improved",
          title: "Requisitos de Adopción Flexibles",
          description:
            "Los albergues pueden dejar los requisitos de adopción vacíos; en ese caso, la ficha de la mascota informa claramente que no existen requisitos adicionales.",
          icon: <Heart size={20} className="text-white" />,
          bg: "bg-pink-500",
        },
        {
          type: "improved",
          title: "Carrito con Menos Consultas",
          description:
            "El carrito y su botón de acceso rápido solo solicitan datos cuando hay una sesión activa y el usuario navega por el catálogo, reduciendo tráfico y mejorando el rendimiento.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-amber-500",
        },
      ],
    },
    {
      version: "v1.14.0",
      date: "12 de Junio, 2026",
      title: "Seguridad Multimedia y Desbloqueo de Solicitudes",
      description:
        "Mejora crítica en la seguridad de borrado de archivos multimedia en Cloudinary y corrección en el reenvío de solicitudes de cuenta denegadas.",
      color: "from-emerald-600 to-teal-700",
      updates: [
        {
          type: "added",
          title: "Eliminación Segura de Recursos",
          description:
            "Implementación del endpoint DELETE /api/cloudinary/delete que verifica sesión, estado de cuenta y propiedad real de los archivos antes de eliminarlos.",
          icon: <Shield size={20} className="text-white" />,
          bg: "bg-emerald-600",
        },
        {
          type: "fixed",
          title: "Reenvío de Solicitudes Denegadas",
          description:
            "Se corrigió la validación lógica en solicitudes de albergues y vendedores para permitir el reenvío de formularios tras un rechazo previo.",
          icon: <Bug size={20} className="text-white" />,
          bg: "bg-rose-500",
        },
        {
          type: "improved",
          title: "Optimización de Limpieza Asíncrona",
          description:
            "Introducción de helpers robustos que ejecutan la eliminación de múltiples imágenes de forma concurrente con tolerancia a fallos.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-amber-500",
        },
      ],
    },
    {
      version: "v1.13.0",
      date: "27 de Mayo, 2026",
      title: "Moderation Hub: Centro de Control Administrativo",
      description:
        "Nuevo módulo centralizado para que los administradores gestionen solicitudes de albergues y vendedores con auditoría completa del sistema.",
      color: "from-purple-600 to-indigo-700",
      updates: [
        {
          type: "added",
          title: "Moderation Hub",
          description:
            "Panel unificado bajo /admin/moderation para revisar, aprobar o rechazar solicitudes de albergues y vendedores.",
          icon: <Shield size={20} className="text-white" />,
          bg: "bg-purple-600",
        },
        {
          type: "added",
          title: "Registro de Auditoría del Sistema",
          description:
            "Bitácora paginada e interactiva que registra cada acción administrativa: aprobaciones, rechazos y bloqueos con fecha, IP y motivo.",
          icon: <History size={20} className="text-white" />,
          bg: "bg-indigo-600",
        },
        {
          type: "added",
          title: "Aprobaciones Transaccionales",
          description:
            "Las aprobaciones actualizan el rol del usuario y el estado de la solicitud de forma atómica, garantizando consistencia total.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-violet-500",
        },
        {
          type: "improved",
          title: "Notificaciones Asíncronas",
          description:
            "Los emails de aprobación o rechazo se envían sin bloquear la respuesta de la API, con tolerancia a fallos del proveedor.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
      ],
    },
    {
      version: "v1.12.0",
      date: "21 de Mayo, 2026",
      title: "Planificación y Estabilidad de la Plataforma",
      description:
        "Revisión general de la plataforma para optimizar la velocidad de carga y asegurar la estabilidad de las secciones principales.",
      color: "from-blue-500 to-indigo-600",
      updates: [
        {
          type: "improved",
          title: "Estabilidad de Navegación",
          description:
            "Revisión integral del rendimiento de la plataforma para una navegación fluida en todos los servicios.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-indigo-500",
        },
        {
          type: "improved",
          title: "Portal de Ayuda",
          description:
            "Actualización del centro de soporte con guías claras para resolver dudas de forma más ágil.",
          icon: <History size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
      ],
    },
    {
      version: "v1.11.0",
      date: "16 de Mayo, 2026",
      title: "Mejoras de Búsqueda y Seguridad en Tienda",
      description:
        "Optimización de las funciones de búsqueda en el catálogo y mayor seguridad en el panel para comercios aliados.",
      color: "from-emerald-500 to-teal-600",
      updates: [
        {
          type: "improved",
          title: "Búsqueda más Rápida",
          description:
            "Ajustes en el buscador para asegurar que las categorías de productos den resultados exactos.",
          icon: <Shield size={20} className="text-white" />,
          bg: "bg-emerald-500",
        },
        {
          type: "improved",
          title: "Seguridad para Tiendas",
          description:
            "Refuerzo en los controles de acceso en el panel de vendedor para mayor tranquilidad.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "improved",
          title: "Fichas de Productos",
          description:
            "Refinamientos de diseño para que sea más sencillo leer la información de las mascotas.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-teal-500",
        },
      ],
    },
    {
      version: "v1.10.0",
      date: "15 de Mayo, 2026",
      title: "Métricas y Mapa Interactivo",
      description:
        "Implementación de dashboards analíticos avanzados y visualización geoespacial de refugios.",
      color: "from-indigo-500 to-purple-600",
      updates: [
        {
          type: "added",
          title: "Dashboards de Métricas",
          description:
            "Paneles estadísticos detallados para vendedores y refugios con datos en tiempo real.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-indigo-500",
        },
        {
          type: "added",
          title: "Exportación de Reportes",
          description:
            "Funcionalidad para generar y exportar reportes estadísticos en CSV, Excel y PDF.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "added",
          title: "Mapa Interactivo",
          description:
            "Búsqueda, filtrado y visualización de refugios mediante un mapa georreferenciado.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
      ],
    },
    {
      version: "v1.9.0",
      date: "11 de Mayo, 2026",
      title: "Gestión Inteligente de Postulaciones",
      description:
        "Sistema integral de gestión de postulaciones para albergues con notificaciones automáticas y automatización de estados.",
      color: "from-purple-500 to-indigo-600",
      updates: [
        {
          type: "added",
          title: "Panel de Gestión de Albergues",
          description:
            "Nueva interfaz para que los albergues visualicen, aprueben o rechacen solicitudes de adopción.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
        {
          type: "added",
          title: "Automatización de Estados",
          description:
            "Al aprobar una adopción, la mascota se marca como 'En proceso' y se gestionan las solicitudes restantes automáticamente.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "improved",
          title: "Notificaciones Automáticas",
          description:
            "Emails instantáneos para albergues y adoptantes sobre el estado de sus postulaciones.",
          icon: <Heart size={20} className="text-white" />,
          bg: "bg-pink-500",
        },
      ],
    },
    {
      version: "v1.8.0",
      date: "28 de Abril, 2026",
      title: "Seguridad y UX en Formularios",
      description:
        "Toggle de visibilidad de contraseña en todos los formularios y corrección de compatibilidad con navegadores.",
      color: "from-emerald-500 to-teal-600",
      updates: [
        {
          type: "added",
          title: "Botón Ver Contraseña",
          description:
            "Nuevo componente PasswordInput con alternancia de visibilidad en login, registro y solicitudes.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-emerald-500",
        },
        {
          type: "fixed",
          title: "Iconos Duplicados en Edge",
          description:
            "Corrección CSS para ocultar botones nativos de revelación de contraseña en navegadores Microsoft.",
          icon: <Bug size={20} className="text-white" />,
          bg: "bg-red-500",
        },
      ],
    },
    {
      version: "v1.7.1",
      date: "24 de Abril, 2026",
      title: "Bloqueo de Usuarios y Sincronización",
      description:
        "Mejoras en el panel administrativo para la gestión de usuarios y sincronización de auditoría.",
      color: "from-blue-600 to-indigo-700",
      updates: [
        {
          type: "added",
          title: "Bloqueo de Usuarios",
          description:
            "Sincronización automática del historial de auditoría tras bloquear o desbloquear un usuario.",
          icon: <Shield size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
        {
          type: "added",
          title: "Botón Editar Usuario",
          description:
            "Nuevo componente EditUserButton con modal integrado para estandarizar la gestión de usuarios.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-slate-500",
        },
      ],
    },
    {
      version: "v1.7.0",
      date: "24 de Abril, 2026",
      title: "Notificaciones por Email",
      description:
        "Sistema completo de comunicación por email: desde recuperación de contraseñas hasta aprobaciones, adopciones y pedidos.",
      color: "from-sky-500 to-blue-600",
      updates: [
        {
          type: "added",
          title: "Recuperación de Contraseña",
          description:
            "Flujo seguro de reset con tokens de un solo uso y vencimiento automático en 1 hora.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "added",
          title: "Notificaciones de Adopción",
          description:
            "Correos automáticos al albergue al recibir postulaciones y al adoptante cuando cambia su estado.",
          icon: <Heart size={20} className="text-white" />,
          bg: "bg-pink-500",
        },
        {
          type: "added",
          title: "Aprobación de Cuentas",
          description:
            "Emails de bienvenida o rechazo (con motivo) para nuevos albergues y vendedores al ser evaluados.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
        {
          type: "added",
          title: "Gestión de Cuenta",
          description:
            "Avisos automáticos al usuario cuando su cuenta es suspendida o reactivada por el administrador.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
      ],
    },
    {
      version: "v1.6.0",
      date: "20 de Abril, 2026",
      title: "Auditoría Administrativa",
      description:
        "Implementación de historial de acciones para administradores y actualización de enlaces globales.",
      color: "from-slate-600 to-slate-800",
      updates: [
        {
          type: "added",
          title: "Historial de Auditoría",
          description:
            "Nuevo componente AuditHistoryCard para visualizar el rastro de acciones administrativas.",
          icon: <History size={20} className="text-white" />,
          bg: "bg-slate-700",
        },
        {
          type: "improved",
          title: "Enlaces Sociales",
          description:
            "Actualización de las constantes de redes sociales globales en toda la plataforma.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
      ],
    },
    {
      version: "v1.5.0",
      date: "20 de Febrero, 2026",
      title: "Centro de Ayuda y Estabilidad",
      description:
        "Lanzamiento del Centro de Ayuda integral y mejoras profundas en la estabilidad técnica del proyecto.",
      color: "from-violet-500 to-fuchsia-500",
      updates: [
        {
          type: "added",
          title: "Centro de Ayuda",
          description:
            "Nueva página oficial con el manual de usuario y guías de soporte optimizadas.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "improved",
          title: "Estabilidad de Pruebas",
          description:
            "Corrección de incompatibilidades en la suite de pruebas para asegurar un despliegue sin errores.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
        {
          type: "improved",
          title: "Ciclo de Vida 100%",
          description:
            "Optimización del proceso de build y ejecución en producción para máxima fiabilidad.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
      ],
    },
    {
      version: "v1.4.0",
      date: "20 de Enero, 2026",
      title: "Inteligencia Artificial Generativa",
      description:
        "Integración de IA para potenciar las descripciones de mascotas y productos.",
      color: "from-pink-500 to-rose-500",
      updates: [
        {
          type: "added",
          title: "Asistente de Redacción IA",
          description:
            "Refinamiento automático de descripciones para mascotas y productos usando Google Gemini.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "improved",
          title: "Optimización de Perfiles",
          description:
            "Mejora del impacto emocional en perfiles de adopción para aumentar las tasas de éxito.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
        {
          type: "added",
          title: "Copywriting para Marketplace",
          description:
            "Generación de descripciones persuasivas para productos del marketplace.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
      ],
    },
    {
      version: "v1.3.0",
      date: "16 de Enero, 2026",
      title: "Transparencia y Legalidad",
      description:
        "Implementación de páginas informativas esenciales para mejorar la comunicación y cumplimiento legal.",
      color: "from-purple-500 to-indigo-500",
      updates: [
        {
          type: "added",
          title: "Páginas Legales",
          description:
            "Nuevas secciones de Términos y Condiciones y Política de Privacidad.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "added",
          title: "Centro de Ayuda (FAQ)",
          description:
            "Preguntas frecuentes para resolver dudas rápidas de los usuarios.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
        {
          type: "added",
          title: "Registro de Cambios Público",
          description:
            "Esta misma página ahora permite a los usuarios seguir la evolución del proyecto.",
          icon: <GitPullRequest size={20} className="text-white" />,
          bg: "bg-pink-500",
        },
      ],
    },
    {
      version: "v1.2.0",
      date: "15 de Enero, 2026",
      title: "Marketplace PawLig",
      description:
        "Lanzamiento del módulo de productos y servicios veterinarios para vendedores.",
      color: "from-blue-500 to-cyan-500",
      updates: [
        {
          type: "added",
          title: "Gestión de Productos",
          description:
            "Los vendedores ahora pueden publicar y gestionar su inventario desde un panel dedicado.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
        {
          type: "improved",
          title: "Galería de Productos",
          description:
            "Filtros avanzados por categoría y precio para encontrar lo que tu mascota necesita.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-slate-500",
        },
        {
          type: "added",
          title: "Métricas para Vendedores",
          description:
            "Visualización de estadísticas de ventas y stock en tiempo real.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
      ],
    },
    {
      version: "v1.1.1",
      date: "13 de Enero, 2026",
      title: "Optimización de Desarrollo",
      description:
        "Mejoras en el flujo de trabajo técnico y estandarización de reportes en GitHub.",
      color: "from-slate-400 to-slate-500",
      updates: [
        {
          type: "improved",
          title: "Plantillas de GitHub",
          description:
            "Nuevas plantillas de Issues para estandarizar reportes de error y solicitudes.",
          icon: <GitPullRequest size={20} className="text-white" />,
          bg: "bg-slate-600",
        },
      ],
    },
    {
      version: "v1.1.0",
      date: "10 de Enero, 2026",
      title: "Optimización de Interfaz",
      description:
        "Mejoras visuales y de rendimiento en los componentes principales del sistema.",
      color: "from-teal-400 to-emerald-500",
      updates: [
        {
          type: "improved",
          title: "Estandarización de UI",
          description:
            "Refactorización de botones y tarjetas para una experiencia más fluida.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-slate-500",
        },
        {
          type: "improved",
          title: "Navegación Móvil",
          description:
            "Ajustes en el menú móvil para mejorar la accesibilidad en dispositivos pequeños.",
          icon: <Zap size={20} className="text-white" />,
          bg: "bg-blue-500",
        },
        {
          type: "fixed",
          title: "Plantillas de Reportes",
          description:
            "Se optimizaron los flujos de reporte de errores para el equipo técnico.",
          icon: <Bug size={20} className="text-white" />,
          bg: "bg-red-500",
        },
      ],
    },
    {
      version: "v1.0.0",
      date: "05 de Enero, 2026",
      title: "Lanzamiento y Gran Refactorización",
      description:
        "Migración completa a Tailwind CSS y nueva arquitectura de componentes.",
      color: "from-orange-400 to-red-500",
      updates: [
        {
          type: "added",
          title: "Nueva Arquitectura",
          description:
            "Reestructuración total del proyecto para mayor escalabilidad.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
        {
          type: "improved",
          title: "Diseño con Tailwind",
          description:
            "Migración completa del sistema de estilos para una carga más rápida.",
          icon: <Sparkles size={20} className="text-white" />,
          bg: "bg-amber-400",
        },
        {
          type: "added",
          title: "Sistema de Adopción Base",
          description:
            "Funcionalidad núcleo para la publicación y solicitud de mascotas.",
          icon: <Rocket size={20} className="text-white" />,
          bg: "bg-purple-500",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/pet-community.png"
            alt="PawLig Community"
            fill
            className="object-cover opacity-20 scale-105 animate-[pulse_8s_ease-in-out_infinite]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-indigo-900/80 to-slate-50" />
        </div>

        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
          <div
            className="absolute top-20 right-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 animate-[bounce_3s_infinite]">
            <Star className="text-yellow-400" size={16} fill="currentColor" />
            <span>¡Descubre nuestras últimas novedades!</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-6 drop-shadow-sm tracking-tight">
            Notas de Lanzamiento
          </h1>

          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            Explora la evolución de{" "}
            <span className="font-bold text-white">PawLig</span>. Cada
            actualización es un paso más hacia un mundo mejor para nuestras
            mascotas.
          </p>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft size={20} />
              Volver a la plataforma
            </Link>
          </div>
        </div>
      </div>

      <ChangelogClient versions={versions} lastUpdate={lastUpdate} />
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Vista de registro de cambios (Changelog) público de la plataforma PawLig.
 * Presenta las novedades y actualizaciones del sistema de cara al usuario final.
 *
 * Lógica Clave:
 * - Historial Cronológico: Renderiza la lista de actualizaciones de la app.
 * - Paginación Inteligente: Implementada en el cliente para mejor UX y transiciones fluidas.
 * - Estética Premium: Incorpora efectos visuales, degradados y animaciones modernas.
 *
 * Dependencias Externas:
 * - lucide-react: Iconos ilustrativos.
 * - next/link: Navegación nativa.
 * - next/image: Despliegue optimizado de imágenes.
 *
 */
