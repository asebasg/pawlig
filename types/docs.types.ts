/**
 * Descripción: Definiciones de tipos para el sistema de documentación interno de PawLig.
 * Implementa: Tipado de los metadatos necesarios para renderizar y organizar documentos
 *             en el sidebar y en las rutas de la sección de documentación.
 */

/**
 * Representa la categoría de agrupación de un documento en el sidebar.
 * - "analysis" : Análisis del proyecto (acta, stakeholders, requerimientos, HU, etc.).
 * - "design"   : Documentos de diseño (arquitectura, modelos, UML, manual de diseño).
 * - "testing"  : Planes y casos de prueba.
 * - "final"    : Entregables finales (manual del usuario, etc.).
 */
export type DocCategory = "analysis" | "design" | "testing" | "final";

/**
 * Metadatos que describen un documento dentro del sistema de documentación de PawLig.
 * Se utiliza para construir el sidebar, las rutas dinámicas y el listado de documentos.
 */
export interface DocMetadata {
  /** Identificador único del documento en la URL (ej: "context", "rules", "monthly-updates"). */
  slug: string;

  /** Título legible del documento para mostrarlo en el sidebar y en encabezados. */
  title: string;

  /** Ruta real del archivo en el repositorio (ej: "docs/context.md"). */
  filePath: string;

  /** Categoría opcional para agrupar y ordenar el documento en el sidebar. */
  category?: DocCategory;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo centraliza los tipos relacionados con la documentación interna
 * de PawLig. Permite que el sidebar, las rutas dinámicas y los loaders de
 * contenido compartan una misma forma de datos sin duplicar definiciones.
 *
 * Lógica Clave:
 * - DocCategory: Tipo unión que restringe las categorías válidas del sidebar.
 *   Se exporta por separado para facilitar su uso en guards o filtros.
 * - DocMetadata.category: Es opcional (?) para permitir documentos sin
 *   categoría asignada que puedan mostrarse en una sección genérica.
 * - DocMetadata.filePath: Debe apuntar a la ruta relativa dentro del repo
 *   para que los loaders de servidor puedan leer el archivo con fs o fetch.
 *
 * Dependencias Externas:
 * - Ninguna. Este archivo es puro TypeScript sin dependencias de librerías.
 *
 */
