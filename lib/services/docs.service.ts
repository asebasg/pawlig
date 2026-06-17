"use server";

/**
 * Descripción: Servicio de acceso a los documentos del proyecto.
 *              Lee archivos Markdown desde el sistema de archivos del servidor,
 *              los convierte a HTML y retorna los datos necesarios para renderizarlos.
 * Requiere:    Ejecución server-side (Node.js). Los archivos deben existir en process.cwd().
 * Implementa:  Sección de documentación interna de PawLig.
 *
 * SEGURIDAD:   filePath NUNCA debe provenir de la request del usuario. Solo se usan
 *              las rutas definidas en la whitelist AVAILABLE_DOCS (constants.ts)
 *              para prevenir ataques de path traversal.
 */

import fs from "fs/promises";
import path from "path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { AVAILABLE_DOCS } from "@/lib/constants";

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
 * Busca un documento por su slug, lee su archivo Markdown y retorna el HTML procesado.
 *
 * @param slug - Identificador único del documento (ej: "arquitectura-software").
 * @returns Objeto con el slug, título y contenido HTML del documento.
 * @throws Error si el slug no existe en AVAILABLE_DOCS o si el archivo no se puede leer.
 */
export async function getDocBySlug(slug: string): Promise<DocContent> {
  const docMeta = AVAILABLE_DOCS.find((doc) => doc.slug === slug);

  if (!docMeta) {
    throw new Error(`Documento no encontrado para el slug: "${slug}".`);
  }

  const absolutePath = path.join(process.cwd(), docMeta.filePath);

  let rawContent: string;
  try {
    rawContent = await fs.readFile(absolutePath, "utf-8");
  } catch {
    throw new Error(
      `No se pudo leer el archivo "${docMeta.filePath}". Verifique que existe en el repositorio.`,
    );
  }

  const processedFile = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(rawContent);

  return {
    slug: docMeta.slug,
    title: docMeta.title,
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
 * documentación. Lee archivos Markdown desde el sistema de archivos del
 * servidor (nunca del cliente) y los transforma a HTML listo para renderizar.
 *
 * Lógica Clave:
 * - getDocBySlug: Valida el slug contra AVAILABLE_DOCS antes de construir
 *   cualquier ruta de archivo. El filePath resultante proviene siempre de la
 *   whitelist, nunca de la entrada del usuario, previniendo path traversal.
 * - getAllDocsMetadata: Retorna AVAILABLE_DOCS directamente. No realiza I/O.
 *   Ideal para Server Components que renderizan el sidebar o listados.
 * - Búsqueda por slug: Se usa Array.find sobre AVAILABLE_DOCS (fuente única
 *   de verdad). Si no existe, lanza un Error descriptivo para que el page
 *   handler pueda llamar notFound().
 * - Lectura de archivo: path.join(process.cwd(), filePath) construye la ruta
 *   absoluta desde la raíz del proyecto. El try/catch independiente permite
 *   distinguir entre "slug inválido" y "archivo faltante en disco".
 * - Procesado Markdown: remark + remarkGfm habilita tablas, listas de tareas
 *   y otros elementos GFM. remarkHtml con sanitize: false preserva el HTML
 *   embebido en los Markdown (diagramas, badges, etc.).
 * - La directiva "use server" garantiza que fs y path nunca se incluyan
 *   en el bundle del cliente.
 *
 * Seguridad:
 * - Los filePath son una whitelist estática definida en constants.ts.
 * - Nunca construir rutas de archivo a partir de req.params, req.query
 *   ni ningún otro dato proveniente de la request del usuario.
 *
 * Dependencias Externas:
 * - remark (^15.0.1): Motor de procesado de Markdown.
 * - remark-gfm (^4.0.1): Soporte para GitHub Flavored Markdown.
 * - remark-html (^16.0.1): Serialización del AST a HTML.
 * - AVAILABLE_DOCS: Fuente única de verdad definida en lib/constants.ts.
 *
 */
