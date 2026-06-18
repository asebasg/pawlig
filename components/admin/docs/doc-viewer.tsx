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
    <article className="prose max-w-none">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
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
