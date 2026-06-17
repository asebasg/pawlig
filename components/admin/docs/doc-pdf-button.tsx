"use client";

/**
 * Descripción: Botón para exportar el documento técnico actual como PDF.
 *              Realiza un fetch al endpoint /api/admin/docs/[slug]/pdf y descarga
 *              el blob resultante como archivo .pdf directamente en el navegador.
 * Implementa:  Vista de documento en /admin/dev/docs/[slug].
 */

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocPdfButtonProps {
  slug: string;
  title: string;
}

/**
 * Botón cliente que solicita la generación server-side del PDF y lo descarga.
 * Muestra estado de carga durante el proceso y notifica errores con sonner.
 */
function DocPdfButton({ slug, title }: DocPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/docs/${slug}/pdf`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { error?: string }).error ?? "Error al generar el PDF.",
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slug}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      toast.success("PDF descargado correctamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al exportar.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      id="doc-pdf-button"
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      aria-label={`Exportar "${title}" como PDF`}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                 border border-border bg-background text-foreground
                 hover:bg-muted hover:border-primary/40 hover:text-primary
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-150 shrink-0 print:hidden"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="w-4 h-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {isLoading ? "Generando…" : "Exportar PDF"}
      </span>
    </button>
  );
}

export default DocPdfButton;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente cliente mínimo que solicita la generación server-side del PDF
 * y lo descarga como archivo local sin recargar la página.
 *
 * Lógica Clave:
 * - fetch + blob: El endpoint retorna un stream PDF. Se convierte a Blob,
 *   se crea una URL de objeto temporal, se simula un clic en un anchor <a>
 *   con el atributo download y finalmente se libera la URL con revokeObjectURL
 *   para evitar fugas de memoria.
 * - Anchor programático: Se usa document.createElement("a") en lugar de
 *   un <a> en el JSX para que el trigger de descarga sea imperativo y no
 *   requiera estado adicional de visibilidad del enlace.
 * - Estado de carga: isLoading deshabilita el botón y muestra un spinner
 *   para evitar solicitudes duplicadas mientras se genera el PDF.
 * - Manejo de errores: Si el servidor retorna un JSON de error, se extrae
 *   el mensaje. En cualquier otro caso se muestra un fallback genérico.
 *   El feedback al usuario se entrega via sonner (toast).
 *
 * Dependencias Externas:
 * - sonner: Notificaciones de éxito/error.
 * - lucide-react: Íconos Download y Loader2.
 *
 */
