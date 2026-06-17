/**
 * Descripción: Componente de visualización de contenido Markdown procesado a HTML.
 *              Aplica estilos tipográficos de prose para que tablas, encabezados,
 *              listas y código se rendericen correctamente sin estilar cada tag.
 * Requiere:    @tailwindcss/typography instalado y registrado en tailwind.config.ts.
 * Implementa:  Vista de documento en /admin/dev/docs/[slug].
 */

interface DocViewerProps {
  htmlContent: string;
}

/**
 * Renderiza HTML generado desde Markdown con estilos prose completos.
 * El contenido es seguro porque proviene exclusivamente de archivos .md
 * del repositorio, nunca de input de usuario.
 */
function DocViewer({ htmlContent }: DocViewerProps) {
  return (
    <article
      id="doc-viewer"
      className="
        prose prose-slate max-w-none
        prose-headings:font-poppins prose-headings:font-semibold prose-headings:text-foreground
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-3 prose-h1:border-b prose-h1:border-border
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:text-foreground/80 prose-p:leading-7
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5
        prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
        prose-table:text-sm
        prose-thead:bg-muted prose-th:text-foreground prose-th:font-semibold
        prose-td:border-border prose-tr:border-border
        prose-img:rounded-xl prose-img:shadow-md
        prose-ul:text-foreground/80 prose-ol:text-foreground/80
        prose-li:marker:text-primary
        dark:prose-invert
      "
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

export default DocViewer;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente presentacional puro que envuelve el HTML generado por remark
 * en un elemento article con clases prose de @tailwindcss/typography.
 * No tiene estado, efectos ni lógica propia.
 *
 * Lógica Clave:
 * - dangerouslySetInnerHTML: Es seguro aquí porque el HTML proviene de
 *   archivos .md propios del repositorio, procesados server-side por remark.
 *   Nunca se inyecta contenido proveniente de inputs de usuario.
 * - prose-slate: Paleta base de grises alineada con el diseño de PawLig.
 * - dark:prose-invert: Invierte automáticamente los colores en modo oscuro,
 *   sin necesidad de sobreescribir cada token individualmente.
 * - prose-code:before/after content-none: Elimina las comillas decorativas
 *   que prose agrega por defecto a los bloques de código inline.
 * - max-w-none: Cancela el max-width que prose aplica por defecto, dado que
 *   el layout padre (DocPage) ya controla el ancho máximo.
 *
 * Dependencias Externas:
 * - @tailwindcss/typography: Plugin requerido para las clases prose-*.
 *
 */
