/**
 * Descripción: Helper centralizado (SSOT) para resolver la URL base de la aplicación.
 * Requiere: Variables de entorno NEXT_PUBLIC_APP_URL, VERCEL_URL o NODE_ENV.
 * Implementa: Resolución robusta de URLs para correos transaccionales y redirecciones.
 */

/**
 * Resuelve la URL base del entorno actual de forma robusta.
 *
 * Prioridad de resolución:
 * 1. NEXT_PUBLIC_APP_URL  — variable explícita (producción / local configurado).
 * 2. VERCEL_URL           — inyectada automáticamente por Vercel en cada deployment
 *                           (preview de PRs, ramas de staging). Se antepone "https://"
 *                           porque Vercel la provee sin protocolo.
 * 3. http://localhost:3000 — fallback local cuando NODE_ENV es "development".
 * 4. https://pawlig.lat   — salvavidas de producción ante configuraciones incompletas.
 *
 * Siempre elimina la barra diagonal final para evitar URLs malformadas
 * al concatenar rutas (ej: "https://pawlig.lat//reset-password").
 */
export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (
    process.env.VERCEL_ENV === "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
  ) {
    return "https://pawlig.lat";
  }

  const vercelUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://pawlig.lat";
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Centraliza la lógica de resolución de la URL base en un único lugar (SSOT),
 * eliminando duplicación y previniendo enlaces rotos en correos transaccionales.
 *
 * Lógica Clave:
 * - Prioridad escalonada: explicit > Vercel auto-inject > local > producción.
 * - VERCEL_URL no incluye protocolo (ej: "pawlig-git-feat.vercel.app"), por eso
 *   se antepone "https://" manualmente.
 * - El replace de barra final es defensivo: evita "https://domain.com//ruta".
 *
 * Dependencias Externas:
 * - Ninguna. Solo variables de entorno de Node.js y Vercel.
 *
 */
