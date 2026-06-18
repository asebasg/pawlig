import { requireAdmin } from "@/lib/auth/require-role";
import { getAllDocsMetadata } from "@/lib/services/docs.service";
import DocsSidebar from "@/components/admin/docs/docs-sidebar";

/**
 * Descripción: Layout del módulo de documentación técnica de PawLig.
 *              Valida que el usuario tenga rol ADMIN antes de renderizar
 *              cualquier contenido, obtiene la lista de documentos disponibles
 *              y compone el sidebar de navegación junto al contenido de la página hija.
 * Requiere:    Sesión activa con rol ADMIN. Redirige automáticamente si no se cumple.
 * Implementa:  Sección /admin/dev/docs y todas sus sub-rutas.
 */

interface DocsLayoutProps {
  children: React.ReactNode;
}

async function DocsLayout({ children }: DocsLayoutProps) {
  await requireAdmin();

  const docs = await getAllDocsMetadata();

  return (
    <div className="flex min-h-screen bg-background">
      <DocsSidebar docs={docs} activeSlug="" />
      <main
        id="docs-main-content"
        className="flex-1 overflow-y-auto"
      >
        {children}
      </main>
    </div>
  );
}

export default DocsLayout;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este layout actúa como guardián y envoltura de toda la sección de
 * documentación técnica. Aplica seguridad primero (requireAdmin) y luego
 * resuelve los datos necesarios para el sidebar antes de renderizar.
 *
 * Lógica Clave:
 * - requireAdmin: Se invoca como primera instrucción para garantizar que
 *   ningún fragmento del layout (sidebar, docs) sea procesado si el usuario
 *   no tiene el rol correcto. Si falla, next/navigation redirect detiene
 *   la ejecución antes de cualquier otra lógica.
 * - getAllDocsMetadata: Se llama una sola vez en el layout y el resultado
 *   se pasa como prop a DocsSidebar, evitando llamadas duplicadas en
 *   componentes hijos y siguiendo el principio de prop drilling controlado.
 * - DocsSidebar recibe activeSlug vacío desde el layout: el slug activo
 *   real se determina en la página hija ([slug]/page.tsx) y se pasa a
 *   DocsSidebar directamente desde allí. El layout solo provee la lista
 *   de documentos para evitar hacer await innecesarios en cada page.
 * - min-h-screen en el contenedor raiz garantiza que el sidebar ocupe
 *   toda la altura de la pantalla en contenido corto.
 *
 * Seguridad:
 * - requireAdmin redirige a /admin si el usuario tiene otro rol autenticado,
 *   o a /login si no hay sesión activa, siguiendo la estrategia definida
 *   en lib/auth/require-role.ts.
 *
 * Dependencias Externas:
 * - requireAdmin: Shortcut de autorización definido en lib/auth/require-role.ts.
 * - getAllDocsMetadata: Servicio de lectura de whitelist de documentos.
 * - DocsSidebar: Componente de navegación lateral del módulo de docs.
 *
 */
