"use client";

import React from "react";
import { ScrollProgress, type ScrollProgressSection } from "@/components/ui/scroll-progress";

/**
 * Componente: BlogArticleReader
 * Descripción: Contenedor interactivo para la lectura de artículos del blog. Renderiza el cuerpo
 *   enriquecido del artículo y gestiona la visualización del indicador de progreso de lectura
 *   y tabla de contenidos contextual (ScrollProgress).
 * Requiere: contentHtml procesado con anclas de sección, arreglo de sections.
 * Implementa: HU-Blog / Experiencia de lectura fluida con ToC interactivo.
 */

export interface BlogArticleReaderProps {
  contentHtml: string;
  sections?: ScrollProgressSection[];
  /** Selector CSS del elemento ante el cual frenar el indicador de progreso (por defecto 'footer') */
  stopBeforeSelector?: string;
  /** Margen en px antes de tocar el elemento de freno (por defecto 24) */
  stopMargin?: number;
}

export function BlogArticleReader({
  contentHtml,
  sections = [],
  stopBeforeSelector = "footer",
  stopMargin = 24,
}: BlogArticleReaderProps) {
  // Solo se monta el indicador flotante si el artículo tiene 2 o más secciones definidas
  const showProgress = sections.length >= 2;

  return (
    <div className="relative">
      <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-zinc">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      {showProgress && (
        <ScrollProgress
          sections={sections}
          stopBeforeSelector={stopBeforeSelector}
          stopMargin={stopMargin}
        />
      )}
    </div>
  );
}

export default BlogArticleReader;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente cliente encargado de renderizar el cuerpo del artículo y enlazar
 * el indicador ScrollProgress cuando existen suficientes secciones para navegar.
 *
 * Lógica Clave:
 * - Renderizado seguro de contenido HTML con tipografía optimizada (prose-zinc).
 * - Montaje condicional de ScrollProgress: solo si sections.length >= 2 para evitar
 *   elementos flotantes innecesarios en artículos breves o sin subtítulos.
 *
 * Dependencias Externas:
 * - ScrollProgress desde @/components/ui/scroll-progress.
 *
 */
