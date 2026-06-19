"use client";

/**
 * Descripción: Sidebar de navegación de la sección de documentación técnica.
 *              Lista todos los documentos agrupados por categoría y marca el
 *              documento activo según el slug actual. En pantallas móviles se
 *              renderiza como una lista desplegable (dropdown) interactiva.
 * Implementa:  Vista de documento en /admin/dev/docs/[slug].
 */

import { useState } from "react";
import Link from "next/link";
import { BookOpen, FileText, FlaskConical, ScrollText, ChevronDown, ChevronUp } from "lucide-react";
import { DocCategory, DocMetadata } from "@/types/docs.types";

interface DocsSidebarProps {
  docs: DocMetadata[];
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

const CATEGORY_ORDER: DocCategory[] = [
  "analysis",
  "design",
  "testing",
  "final",
];

/**
 * Sidebar adaptable con lista colapsable en móvil y fija en escritorio.
 */
function DocsSidebar({ docs, activeSlug }: DocsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeDoc = docs.find((doc) => doc.slug === activeSlug);

  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof docs>>(
    (acc, category) => {
      acc[category] = docs.filter((doc) => doc.category === category);
      return acc;
    },
    {},
  );

  return (
    <>
      {/* Selector móvil (Visible en móvil/tablet, oculto en lg) */}
      <div className="lg:hidden w-full border-b border-border bg-card px-4 py-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-medium text-foreground hover:bg-muted transition-colors"
          aria-expanded={isOpen}
          aria-controls="mobile-docs-nav"
        >
          <span className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <span className="truncate">
              {activeDoc ? activeDoc.title : "Seleccionar documento..."}
            </span>
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" aria-hidden="true" />
          )}
        </button>

        {isOpen && (
          <nav
            id="mobile-docs-nav"
            className="mt-2 p-2 max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-background shadow-lg space-y-4"
          >
            {CATEGORY_ORDER.map((category) => {
              const categoryDocs = grouped[category];
              if (!categoryDocs || categoryDocs.length === 0) return null;

              const Icon = CATEGORY_ICON[category];

              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center gap-1.5 px-3 py-1">
                    <Icon
                      className="w-3.5 h-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {CATEGORY_LABEL[category]}
                    </span>
                  </div>
                  <ul role="list" className="space-y-0.5 pl-3 border-l border-border/55 ml-4">
                    {categoryDocs.map((doc) => {
                      const isActive = doc.slug === activeSlug;
                      return (
                        <li key={doc.slug}>
                          <Link
                            id={`mobile-sidebar-link-${doc.slug}`}
                            href={`/admin/dev/docs/${doc.slug}`}
                            onClick={() => setIsOpen(false)}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                              transition-colors duration-150 w-full text-left
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
                            <span className="truncate">{doc.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
        )}
      </div>

      {/* Sidebar fijo de escritorio (Oculto en móvil/tablet, visible en lg) */}
      <aside
        id="docs-sidebar"
        aria-label="Navegación de documentos"
        className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border
                   bg-background h-screen sticky top-0 overflow-y-auto scrollbar-hide"
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
                  <Icon
                    className="w-3.5 h-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
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
    </>
  );
}

export default DocsSidebar;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente presentacional interactivo que renderiza el sidebar de navegación
 * de documentos. En pantallas móviles, se convierte en un dropdown selector
 * para optimizar el espacio y mejorar la responsividad.
 *
 * Lógica Clave:
 * - Directiva "use client": Necesaria para gestionar el estado de apertura/cierre
 *   del selector móvil con useState.
 * - Diseño Responsive: Usa clases de Tailwind para ocultar/mostrar elementos
 *   según el breakpoint (lg:hidden para el selector móvil, hidden lg:flex para
 *   el sidebar clásico).
 * - Agrupación y Orden: Organiza los documentos bajo categorías usando el array
 *   CATEGORY_ORDER como guía de secuencia.
 * - Navegación: Los elementos de la lista desplegable son enlaces estándar
 *   Link que permiten una navegación SPA óptima en Next.js. Al hacer click
 *   en un enlace móvil, se cierra el panel del dropdown automáticamente.
 * - IDs únicos: sidebar-link-{slug} y mobile-sidebar-link-{slug} facilitan el
 *   testing automatizado en ambas variantes.
 *
 * Dependencias Externas:
 * - react: Hook useState para controlar el menú desplegable.
 * - lucide-react: Iconos para categorías e indicadores de colapso.
 * - DocMetadata, DocCategory: Tipos definidos en types/docs.types.ts.
 *
 */
