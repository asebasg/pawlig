/**
 * GET /admin/dev/docs
 * Descripción: Página índice de la sección de documentación técnica del proyecto.
 *              Muestra una grilla de tarjetas con todos los documentos disponibles,
 *              agrupados por categoría, con acceso directo a cada uno.
 * Requiere:    Rol ADMIN autenticado.
 * Implementa:  Panel de desarrollo interno — sección Docs.
 */

import Link from "next/link";
import { UserRole } from "@prisma/client";
import { BookOpen, FileText, FlaskConical, ScrollText } from "lucide-react";
import { requireRole } from "@/lib/auth/require-role";
import { getAllDocsMetadata } from "@/lib/services/docs.service";
import { DocCategory } from "@/types/docs.types";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "[DEV] Documentación del Proyecto",
  description:
    "Centro de documentación técnica interna de PawLig: análisis, diseño, pruebas y entregables finales.",
};

// ---------------------------------------------------------------------------
// Configuración visual de cada categoría
// ---------------------------------------------------------------------------

interface CategoryConfig {
  label: string;
  icon: React.ElementType;
  accent: string;
  badge: string;
}

const CATEGORY_CONFIG: Record<DocCategory, CategoryConfig> = {
  analysis: {
    label: "Análisis",
    icon: ScrollText,
    accent: "var(--color-blue-500, #3b82f6)",
    badge: "bg-blue-100 text-blue-700",
  },
  design: {
    label: "Diseño",
    icon: BookOpen,
    accent: "var(--color-purple-500, #a855f7)",
    badge: "bg-purple-100 text-purple-700",
  },
  testing: {
    label: "Pruebas",
    icon: FlaskConical,
    accent: "var(--color-emerald-500, #10b981)",
    badge: "bg-emerald-100 text-emerald-700",
  },
  final: {
    label: "Entregables",
    icon: FileText,
    accent: "var(--color-amber-500, #f59e0b)",
    badge: "bg-amber-100 text-amber-700",
  },
};

const CATEGORY_ORDER: DocCategory[] = [
  "analysis",
  "design",
  "testing",
  "final",
];

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------

export default async function DocsIndexPage() {
  await requireRole([UserRole.ADMIN]);

  const docs = await getAllDocsMetadata();

  // Agrupar documentos por categoría preservando el orden de CATEGORY_ORDER
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof docs>>(
    (acc, category) => {
      acc[category] = docs.filter((doc) => doc.category === category);
      return acc;
    },
    {},
  );

  return (
    <main className="container mx-auto py-8 px-4 space-y-6">
      <div className="mb-4">
        <Link
          href="/admin/dev"
          className="inline-flex items-center gap-2 text-primary hover:brightness-75 transition-all font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dev Hub
        </Link>
      </div>

      {/* Encabezado */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Documentación del Proyecto
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Accede a todos los documentos técnicos del ciclo de vida del proyecto: análisis, diseño, pruebas y entregables finales.
        </p>
      </div>

      {/* Contador global */}
      <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span>
          <strong className="text-foreground">{docs.length}</strong> documentos
          disponibles
        </span>
      </div>

      {/* Secciones por categoría */}
      <div className="space-y-12">
        {CATEGORY_ORDER.map((category) => {
          const categoryDocs = grouped[category];
          if (!categoryDocs || categoryDocs.length === 0) return null;

          const config = CATEGORY_CONFIG[category];
          const Icon = config.icon;

          return (
            <section key={category} aria-labelledby={`heading-${category}`}>
              {/* Encabezado de categoría */}
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
                <span
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: `${config.accent}1a` }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: config.accent }}
                    aria-hidden="true"
                  />
                </span>
                <h2
                  id={`heading-${category}`}
                  className="text-xl font-semibold text-foreground"
                >
                  {config.label}
                </h2>
                <span
                  className={`ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full ${config.badge}`}
                >
                  {categoryDocs.length}{" "}
                  {categoryDocs.length === 1 ? "documento" : "documentos"}
                </span>
              </div>

              {/* Grilla de tarjetas */}
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                role="list"
              >
                {categoryDocs.map((doc) => (
                  <li key={doc.slug}>
                    <Link
                      id={`doc-card-${doc.slug}`}
                      href={`/admin/dev/docs/${doc.slug}`}
                      className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-card
                                 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5
                                 transition-all duration-200 h-full"
                    >
                      {/* Ícono y badge */}
                      <div className="flex items-start justify-between">
                        <span
                          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                          style={{ backgroundColor: `${config.accent}1a` }}
                        >
                          <Icon
                            className="w-4 h-4"
                            style={{ color: config.accent }}
                            aria-hidden="true"
                          />
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}
                        >
                          {config.label}
                        </span>
                      </div>

                      {/* Título */}
                      <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {doc.title}
                      </p>

                      {/* Indicador de navegación */}
                      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                        <span>Ver documento</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
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
 * Página Server Component que actúa como índice de documentación. No realiza
 * ningún I/O de archivos; solo consume getAllDocsMetadata() para obtener la
 * lista estática y la renderiza agrupada por categoría.
 *
 * Lógica Clave:
 * - Autorización: requireRole([UserRole.ADMIN]) redirige al dashboard del rol
 *   correspondiente si el usuario no es ADMIN, sin exponer la página.
 * - Agrupación: Se usa CATEGORY_ORDER como fuente de orden para garantizar
 *   que las secciones siempre aparezcan en la secuencia correcta
 *   (Análisis → Diseño → Pruebas → Entregables), independientemente del
 *   orden en AVAILABLE_DOCS.
 * - CATEGORY_CONFIG: Centraliza el estilo visual (colores, íconos, badges)
 *   de cada categoría. Al usar variables CSS semánticas (--color-*), respeta
 *   el tema claro/oscuro definido en el sistema de diseño.
 * - IDs únicos: Cada tarjeta tiene id="doc-card-{slug}" para facilitar el
 *   testing con Playwright o Cypress.
 * - Accesibilidad: Cada sección usa aria-labelledby apuntando a su h2,
 *   y la lista de tarjetas usa role="list" con elementos li semánticos.
 *
 * Dependencias Externas:
 * - lucide-react: Íconos de las categorías.
 * - getAllDocsMetadata: Fuente de datos (lib/services/docs.service.ts).
 * - requireRole: Guardia de autorización (lib/auth/require-role.ts).
 *
 */
