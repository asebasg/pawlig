import { ScrollProgressSection } from "@/components/ui/scroll-progress";

/**
 * Función de utilidad: parseBlogContent
 * Descripción: Analiza el contenido HTML de un artículo de blog, extrae encabezados (h2 y h3)
 *   para construir la tabla de contenido, y asegura que cada encabezado tenga un atributo ID
 *   único y clases de margen de scroll adecuadas.
 * Requiere: Cadena HTML válida generada por el editor TipTap o similar.
 * Implementa: HU-Blog / Navegación y progreso de lectura en blog posts.
 */

/**
 * Convierte un texto en un slug URL-friendly y normalizado.
 *
 * @param {string} text Texto a convertir.
 * @returns {string} Slug resultante.
 */
export function slugifyHeading(text: string): string {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return normalized || "seccion";
}

/**
 * Extrae texto plano eliminando etiquetas HTML internas.
 *
 * @param {string} html Cadena con posibles tags HTML.
 * @returns {string} Texto plano limpio.
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export interface ParsedBlogContent {
  contentWithIds: string;
  sections: ScrollProgressSection[];
}

/**
 * Analiza el HTML del artículo, asigna IDs y clases de scroll-margin a los encabezados
 * y genera el arreglo de secciones ordenadas para el componente de progreso.
 *
 * @param {string} html Contenido HTML original del artículo.
 * @returns {ParsedBlogContent} Objeto con el HTML enriquecido y la lista de secciones.
 */
export function parseBlogContent(html: string): ParsedBlogContent {
  if (!html || typeof html !== "string") {
    return { contentWithIds: "", sections: [] };
  }

  const sections: ScrollProgressSection[] = [];
  const usedIds = new Set<string>();

  // Expresión regular para encontrar etiquetas <h2> y <h3> completas
  const headingRegex = /<(h[23])(\s+[^>]*)?>(.*?)<\/\1>/gi;

  const contentWithIds = html.replace(headingRegex, (match, tag: string, rawAttrs: string = "", innerContent: string) => {
    const plainText = stripHtmlTags(innerContent);
    if (!plainText) {
      return match;
    }

    // Verificar si ya tiene id existente
    const idMatch = rawAttrs.match(/id=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : slugifyHeading(plainText);

    // Garantizar unicidad del id
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter += 1;
    }
    usedIds.add(uniqueId);

    sections.push({
      id: uniqueId,
      label: plainText,
    });

    // Limpiar atributos existentes de id y scroll-mt para evitar duplicados
    let updatedAttrs = rawAttrs
      .replace(/\s*id=["'][^"']*["']/gi, "")
      .trim();

    // Comprobar y fusionar clases para añadir scroll-mt-20 (evita que el navbar sticky lo tape)
    const classMatch = updatedAttrs.match(/class=["']([^"']*)["']/i);
    if (classMatch) {
      const existingClasses = classMatch[1];
      if (!existingClasses.includes("scroll-mt-")) {
        const newClasses = `${existingClasses} scroll-mt-20`.trim();
        updatedAttrs = updatedAttrs.replace(/class=["'][^"']*["']/i, `class="${newClasses}"`);
      }
    } else {
      updatedAttrs = `${updatedAttrs} class="scroll-mt-20"`.trim();
    }

    const attrsString = updatedAttrs ? ` ${updatedAttrs}` : "";
    return `<${tag} id="${uniqueId}"${attrsString}>${innerContent}</${tag}>`;
  });

  return {
    contentWithIds,
    sections,
  };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Parser de contenido HTML para artículos de blog. Analiza encabezados h2 y h3
 * para construir dinámicamente la tabla de contenidos interactiva y facilitar
 * el salto de navegación suave mediante ScrollProgress.
 *
 * Lógica Clave:
 * - Detección y preservación de etiquetas h2 y h3 producidas por TipTap.
 * - Normalización de caracteres acentuados y generación de slugs únicos seguros.
 * - Inyección automática de clase scroll-mt-20 para coordinar con el navbar sticky de 56px.
 * - Retorno de lista de secciones compatible con la interfaz ScrollProgressSection.
 *
 * Dependencias Externas:
 * - ScrollProgressSection desde @/components/ui/scroll-progress.
 *
 */
