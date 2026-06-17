/**
 * Descripción: Sidebar de navegación de la sección de documentación técnica.
 *              Lista todos los documentos agrupados por categoría y marca el
 *              documento activo según el slug actual.
 * Implementa:  Vista de documento en /admin/dev/docs/[slug].
 */

import Link from "next/link";
import { BookOpen, FileText, FlaskConical, ScrollText } from "lucide-react";
import { getAllDocsMetadata } from "@/lib/services/docs.service";
import { DocCategory } from "@/types/docs.types";

interface DocsSidebarProps {
  activeSlug: string;
}

const CATEGORY_LABEL: Record<DocCategory, string> = {
  analysis: "Análisis",
  design: "Diseño",
  testing: "Pruebas",
  final: "Entregables",
};

const CATEGORY_ICON: Record<DocCategory, React.ElementType> = {
  analysis: ScrollText,
  design: BookOpen,
  testing: FlaskConical,
  final: FileText,
};

const CATEGORY_ORDER: DocCategory[] = ["analysis", "design", "testing", "final"];

/**
 * Sidebar fijo con la lista de documentos agrupados por categoría.
 * Recibe el slug activo para resaltar el ítem correspondiente.
 */
function DocsSidebar({ activeSlug }: DocsSidebarProps) {
  const docs = getAllDocsMetadata();

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof docs>>(
    (acc, category) => {
      acc[category] = docs.filter((doc) => doc.category === category);
      return acc;
    },
    {},
  );

  return (
    <aside
      id="docs-sidebar"
      aria-label="Navegación de documentos"
      className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border
                 bg-background h-screen sticky top-0 overflow-y-auto"
    >
      {/* Encabezado del sidebar */}
      <div className="px-4 py-5 border-b border-border">
        <Link
          href="/admin/dev/docs"
          className="flex items-center gap-2 text-sm font-semibold text-foreground
                     hover:text-primary transition-colors"
        >
          <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
          Documentación
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          {docs.length} documentos disponibles
        </p>
      </div>

      {/* Grupos por categoría */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {CATEGORY_ORDER.map((category) => {
          const categoryDocs = grouped[category];
          if (!categoryDocs || categoryDocs.length === 0) return null;

          const Icon = CATEGORY_ICON[category];

          return (
            <div key={category}>
              {/* Etiqueta de categoría */}
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {CATEGORY_LABEL[category]}
                </span>
              </div>

              {/* Lista de documentos */}
              <ul role="list" className="space-y-0.5">
                {categoryDocs.map((doc) => {
                  const isActive = doc.slug === activeSlug;
                  return (
                    <li key={doc.slug}>
                      <Link
                        id={`sidebar-link-${doc.slug}`}
                        href={`/admin/dev/docs/${doc.slug}`}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                          transition-colors duration-150
                          ${
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground/70 hover:bg-muted hover:text-foreground"
                          }
                        `}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? "bg-primary" : "bg-border"
                          }`}
                          aria-hidden="true"
                        />
                        {doc.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default DocsSidebar;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Server Component que renderiza el sidebar de navegación de documentos.
 * Consume getAllDocsMetadata() directamente (sin prop drilling desde el page)
 * para mantener el componente autónomo y reutilizable.
 *
 * Lógica Clave:
 * - Agrupación: Mismo patrón que DocsIndexPage usando CATEGORY_ORDER como
 *   fuente de orden para garantizar la secuencia correcta de secciones.
 * - Estado activo: Determinado por comparación directa de slug (string),
 *   sin necesidad de usePathname ni cliente. Aplica aria-current="page"
 *   para accesibilidad de lectores de pantalla.
 * - sticky + h-screen: El sidebar permanece visible mientras el usuario
 *   scrollea el contenido del documento a su derecha.
 * - hidden lg:flex: El sidebar solo aparece en pantallas grandes. En móvil
 *   se puede añadir un drawer/hamburger como mejora futura.
 * - IDs únicos: sidebar-link-{slug} facilita el testing automatizado.
 *
 * Dependencias Externas:
 * - lucide-react: Íconos de categorías.
 * - getAllDocsMetadata: Fuente de datos (lib/services/docs.service.ts).
 *
 */
