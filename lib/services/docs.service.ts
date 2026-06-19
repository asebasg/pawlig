"use server";

/**
 * Descripción: Servicio de acceso a los documentos del proyecto.
 *              Obtiene archivos Markdown del servidor a través de peticiones HTTP,
 *              los convierte a HTML y retorna los datos necesarios para renderizarlos.
 * Requiere:    Ejecución server-side (Next.js Server Actions / Server Components).
 * Implementa:  Sección de documentación interna de PawLig.
 *
 * SEGURIDAD:   filePath NUNCA debe provenir de la request del usuario. Solo se usan
 *              las rutas definidas en la whitelist AVAILABLE_DOCS (constants.ts)
 *              para evitar peticiones a recursos no autorizados.
 */

import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { AVAILABLE_DOCS } from "@/lib/constants";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Image } from "mdast";

// ---------------------------------------------------------------------------
// Tipos de retorno
// ---------------------------------------------------------------------------

export interface DocContent {
  slug: string;
  title: string;
  htmlContent: string;
}

// ---------------------------------------------------------------------------
// Funciones del servicio
// ---------------------------------------------------------------------------

/**
 * Plugin remark personalizado: reescribe rutas relativas de imágenes
 * (./images/x.png, ../images/x.png) a la ruta absoluta pública real
 * (/images/x.png), ya que las imágenes se sirven desde public/images
 * independientemente de dónde viva el .md de origen.
 */
const remarkRewriteImagePaths: Plugin = () => {
  return (tree) => {
    visit(tree, "image", (node: Image) => {
      const filename = node.url.split("/").pop();
      if (filename) {
        node.url = `/images/${filename}`;
      }
    });
  };
};

/**
 * Obtiene la URL base de la aplicación.
 *
 * @returns La URL base como cadena de texto.
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

/**
 * Busca un documento por su slug, obtiene su contenido Markdown vía HTTP y retorna el HTML procesado.
 *
 * @param slug - Identificador único del documento (ej: "arquitectura-software").
 * @returns Objeto con el slug, título y contenido HTML del documento, o null si no se encuentra.
 */
export async function getDocBySlug(slug: string): Promise<DocContent | null> {
  const doc = AVAILABLE_DOCS.find((d) => d.slug === slug);
  if (!doc) return null;

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/docs/${doc.filePath}`, {
    cache: "force-cache",
  });

  if (!response.ok) return null;

  const content = await response.text();

  const processedFile = await remark()
    .use(remarkGfm)
    .use(remarkRewriteImagePaths)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug: doc.slug,
    title: doc.title,
    htmlContent: processedFile.toString(),
  };
}

/**
 * Retorna los metadatos de todos los documentos disponibles sin leer su contenido.
 * Diseñado para construir el sidebar y las listas de navegación de la sección de docs.
 *
 * SEGURIDAD: Esta función retorna exclusivamente los elementos de AVAILABLE_DOCS.
 * Los filePath son una whitelist estática definida en constants.ts y nunca
 * provienen de parámetros de la request, eliminando el riesgo de path traversal.
 *
 * @returns Copia del array AVAILABLE_DOCS con slug, title, filePath y category.
 */
export async function getAllDocsMetadata() {
  return AVAILABLE_DOCS;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este servicio actúa como la capa de acceso a datos para la sección de
 * documentación. Obtiene archivos Markdown vía HTTP usando la URL base de la
 * aplicación y los transforma a HTML listo para renderizar.
 *
 * Lógica Clave:
 * - getDocBySlug: Valida el slug contra AVAILABLE_DOCS, obtiene el contenido
 *   del archivo Markdown desde el servidor web local o remoto usando fetch,
 *   y procesa el Markdown a HTML.
 * - getBaseUrl: Obtiene la URL base de la aplicación a partir de la variable
 *   de entorno NEXT_PUBLIC_APP_URL.
 * - getAllDocsMetadata: Retorna AVAILABLE_DOCS directamente. No realiza I/O.
 *   Ideal para Server Components que renderizan el sidebar o listados.
 * - Búsqueda por slug: Se usa Array.find sobre AVAILABLE_DOCS (fuente única
 *   de verdad). Si no existe o falla la petición fetch, retorna null.
 * - Procesado Markdown: remark + remarkGfm habilita tablas, listas de tareas
 *   y otros elementos GFM. remarkHtml con sanitize: false preserva el HTML
 *   embebido en los Markdown (diagramas, badges, etc.).
 * - La directiva "use server" garantiza que esta lógica solo se ejecute
 *   en el servidor.
 *
 * Seguridad:
 * - Los filePath son una whitelist estática definida en constants.ts.
 * - Las peticiones fetch se dirigen únicamente a rutas relativas a la URL base
 *   de la propia aplicación resuelta de manera segura.
 *
 * Dependencias Externas:
 * - remark (^15.0.1): Motor de procesado de Markdown.
 * - remark-gfm (^4.0.1): Soporte para GitHub Flavored Markdown.
 * - remark-html (^16.0.1): Serialización del AST a HTML.
 * - AVAILABLE_DOCS: Fuente única de verdad definida en lib/constants.ts.
 *
 */
