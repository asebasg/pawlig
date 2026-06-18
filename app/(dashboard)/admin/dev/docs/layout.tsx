import { requireAdmin } from "@/lib/auth/require-role";
import { getAllDocsMetadata } from "@/lib/services/docs.service";

/**
 * Descripción: Layout del módulo de documentación técnica de PawLig.
 *              Valida que el usuario tenga rol ADMIN antes de renderizar
 *              cualquier contenido. No incluye estructura visual propia
 *              (sidebar, columnas) porque cada sub-ruta define su propio layout.
 * Requiere:    Sesión activa con rol ADMIN. Redirige automáticamente si no se cumple.
 * Implementa:  Sección /admin/dev/docs y todas sus sub-rutas.
 */

interface DocsLayoutProps {
  children: React.ReactNode;
}

async function DocsLayout({ children }: DocsLayoutProps) {
  await requireAdmin();

  return <>{children}</>;
}

export default DocsLayout;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Layout minimalista que actúa exclusivamente como guardián de autorización
 * para todas las rutas bajo /admin/dev/docs. No renderiza estructura visual
 * propia (sidebar, columnas) para evitar duplicar el layout que cada página
 * hija define de forma autónoma según sus necesidades.
 *
 * Lógica Clave:
 * - requireAdmin: Se invoca como primera instrucción para garantizar que
 *   ningún hijo sea procesado si el usuario no tiene el rol correcto.
 *   Si falla, next/navigation redirect detiene la ejecución antes de
 *   renderizar cualquier contenido.
 * - Sin estructura visual: La página índice (/admin/dev/docs) muestra una
 *   grilla de tarjetas sin sidebar. La página de documento ([slug]) muestra
 *   sidebar + contenido. Cada una gestiona su propio layout de columnas.
 *
 * Seguridad:
 * - requireAdmin redirige a /admin si el usuario tiene otro rol autenticado,
 *   o a /login si no hay sesión activa, siguiendo la estrategia definida
 *   en lib/auth/require-role.ts.
 *
 * Dependencias Externas:
 * - requireAdmin: Shortcut de autorización definido en lib/auth/require-role.ts.
 *
 */
