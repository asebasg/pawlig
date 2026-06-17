/**
 * GET /admin/dev/docs/[slug]
 * Descripción: Página de visualización de un documento técnico individual.
 *              Obtiene el contenido Markdown procesado a HTML y lo renderiza
 *              junto al sidebar de navegación y el botón de exportación PDF.
 * Requiere:    Rol ADMIN autenticado. Parámetro slug válido en AVAILABLE_DOCS.
 * Implementa:  Panel de desarrollo interno — vista de documento.
 */

import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { requireRole } from "@/lib/auth/require-role";
import { getDocBySlug } from "@/lib/services/docs.service";
import DocsSidebar from "@/components/admin/docs/docs-sidebar";
import DocViewer from "@/components/admin/docs/doc-viewer";
import DocPdfButton from "@/components/admin/docs/doc-pdf-button";

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug } = await params;
  try {
    const doc = await getDocBySlug(slug);
    return {
      title: `${doc.title} | Docs — PawLig Admin`,
      description: `Documentación técnica: ${doc.title}`,
    };
  } catch {
    return { title: "Documento no encontrado | PawLig Admin" };
  }
}

export default async function DocPage({ params }: DocPageProps) {
  await requireRole([UserRole.ADMIN]);

  const { slug } = await params;

  let doc: Awaited<ReturnType<typeof getDocBySlug>>;
  try {
    doc = await getDocBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar de navegación */}
      <DocsSidebar activeSlug={slug} />

      {/* Área de contenido principal */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra superior */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4
                           px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
              Documentación técnica
            </p>
            <h1 className="text-lg font-semibold text-foreground truncate">
              {doc.title}
            </h1>
          </div>
          <DocPdfButton slug={doc.slug} title={doc.title} />
        </header>

        {/* Contenido del documento */}
        <main
          id="doc-content-main"
          className="flex-1 px-6 py-8 lg:px-12 lg:py-10 max-w-4xl w-full mx-auto"
        >
          <DocViewer htmlContent={doc.htmlContent} />
        </main>
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
 * Server Component que orquesta la vista de un documento técnico individual.
 * Delega la presentación a tres componentes especializados: DocsSidebar para
 * la navegación, DocViewer para el contenido HTML y DocPdfButton para la
 * exportación.
 *
 * Lógica Clave:
 * - params como Promise: A partir de Next.js 15, los params de rutas dinámicas
 *   son asíncronos. Se usa await params para compatibilidad futura.
 * - Manejo de errores: getDocBySlug lanza Error si el slug es inválido o el
 *   archivo no existe. El try/catch convierte ambos casos en un 404 limpio
 *   mediante notFound(), sin exponer detalles del sistema de archivos.
 * - generateMetadata: Comparte la misma lógica de resolución de slug para
 *   generar metadatos SEO sin una segunda llamada al servicio en el render.
 * - Layout: Usa flex de dos columnas (sidebar fijo + área scrolleable) para
 *   una experiencia de lectura tipo documentación (docs.rs, Notion, etc.).
 * - La barra superior es sticky con backdrop-blur para mantener el contexto
 *   del documento mientras el usuario hace scroll.
 *
 * Dependencias Externas:
 * - getDocBySlug: Servicio de lectura y procesado Markdown (docs.service.ts).
 * - requireRole: Guardia de autorización (lib/auth/require-role.ts).
 * - DocsSidebar, DocViewer, DocPdfButton: Componentes de presentación.
 *
 */
