"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/**
 * Componente: UnauthorizedContent
 * Descripción: Contenido de la página de no autorizado que consume parámetros de búsqueda.
 */
function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "unknown";

  const messages: Record<string, { title: string; description: string; suggestion: string }> = {
    account_blocked: {
      title: "Cuenta bloqueada",
      description: "Tu cuenta ha sido bloqueada por un administrador. No puedes acceder a la plataforma en este momento.",
      suggestion: "Revisa tu correo electrónico para más detalles sobre el motivo del bloqueo. Si crees que es un error, contacta con soporte."
    },
    adopter_only: {
      title: "Acceso solo para adoptantes",
      description: "Solo usuarios con rol de adoptante pueden solicitar cuentas de albergue o vendedor.",
      suggestion: "Si ya eres albergue o vendedor, no necesitas solicitar una cuenta nueva. Si eres adoptante, asegúrate de haber iniciado sesión."
    },
    admin_only: {
      title: "Acceso solo para administradores",
      description: "Esta sección está restringida exclusivamente para administradores del sistema.",
      suggestion: "Si crees que deberías tener acceso, contacta con el equipo de administración."
    },
    shelter_only: {
      title: "Acceso solo para albergues",
      description: "Esta sección está restringida para albergues verificados.",
      suggestion: "Si representas un albergue, puedes solicitar una cuenta desde tu perfil de usuario. Si ya estás en proceso, un administrador estará evaluando tu solicitud, generalmente tarda de 2 a 3 días hábiles."
    },
    shelter_not_verified: {
      title: "Acceso solo para albergues verificados",
      description: "Esta sección está restringida aún, ya que tu cuenta no está verificada.",
      suggestion: "Está atento a tu bandeja de entrada. Cuando tu cuenta sea verificada, recibirás una notificación via email. Generalmente las solicitudes tardan de 2 a 3 días hábiles."
    },
    wrong_pet: {
      title: "Mascota no autorizada",
      description: "No tienes permisos para acceder o gestionar esta mascota.",
      suggestion: "Asegúrate de que la mascota pertenece a tu albergue y que has iniciado sesión con la cuenta correcta."
    },
    vendor_only: {
      title: "Acceso solo para vendedores",
      description: "Esta sección está restringida para vendedores verificados.",
      suggestion: "Si eres un vendedor de productos, puedes solicitar que tu cuenta sea verificada. Si ya estás en proceso, un administrador estará evaluando tu solicitud, generalmente tarda de 2 a 3 días hábiles."
    },
    vendor_not_verified: {
      title: "Acceso solo para vendedores verificados",
      description: "Esta sección está restringida aún, ya que tu cuenta no está verificada.",
      suggestion: "Está atento a tu bandeja de entrada. Cuando tu cuenta sea verificada, recibirás una notificación via email. Generalmente las solicitudes tardan de 2 a 3 días hábiles."
    },
    wrong_product: {
      title: "Producto no autorizado",
      description: "No tienes permisos para acceder o gestionar este producto.",
      suggestion: "Asegúrate de que el producto pertenece a tu catálogo y que has iniciado sesión con la cuenta correcta."
    },
    unknown: {
      title: "Acceso denegado",
      description: "No tienes los permisos necesarios para acceder a este recurso.",
      suggestion: "Verifica que hayas iniciado sesión con la cuenta correcta."
    }
  };

  const message = messages[reason] || messages.unknown;

  return (
    <div className="bg-card rounded-lg shadow-lg p-8 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-red-100 rounded-full p-4">
          <ShieldAlert className="w-12 h-12 text-red-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-3">
        {message.title}
      </h1>

      <p className="text-muted-foreground mb-4">
        {message.description}
      </p>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Sugerencia:</strong> {message.suggestion}
        </p>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
        >
          <Home className="w-5 h-5" />
          Volver al inicio
        </Link>

        <button
          onClick={() => window.history.back()}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-muted-foreground rounded-lg font-medium hover:bg-muted transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver atrás
        </button>
      </div>
    </div>
  );
}

/**
 * GET /unauthorized
 * Descripción: Página de error genérica para mostrar mensajes de acceso denegado.
 * Requiere: Acceso público.
 * Implementa: Manejo de errores de autorización
 */
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Suspense fallback={
          <div className="bg-card rounded-lg shadow-lg p-8 text-center animate-pulse">
            <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-6"></div>
            <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-4 bg-muted rounded w-full mb-4"></div>
            <div className="h-16 bg-muted rounded w-full mb-6"></div>
            <div className="space-y-3">
              <div className="h-12 bg-muted rounded w-full"></div>
              <div className="h-12 bg-muted rounded w-full"></div>
            </div>
          </div>
        }>
          <UnauthorizedContent />
        </Suspense>
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
 * Muestra mensajes de error amigables cuando un usuario intenta acceder a
 * un recurso no autorizado o restringido. El mensaje específico se determina
 * dinámicamente basándose en el parámetro de consulta 'reason'.
 *
 * Lógica Clave:
 * - Selección de Mensaje: Utiliza un objeto 'messages' como diccionario para
 *   mapear el código de error (reason) a un título, descripción y sugerencia
 *   personalizados.
 * - UX/UI: Proporciona retroalimentación visual clara con iconos y colores
 *   de advertencia, y ofrece acciones de recuperación como volver al inicio
 *   o contactar soporte.
 * - Suspense: Se envuelve el contenido en un 'Suspense' para cumplir con los
 *   requisitos de Next.js al usar 'useSearchParams' en componentes de cliente
 *   que se pre-renderizan.
 *
 * Dependencias Externas:
 * - lucide-react: Iconos SVG para mejorar la interfaz visual.
 * - next/navigation: Hook useSearchParams para leer los parámetros de la URL.
 *
 */
