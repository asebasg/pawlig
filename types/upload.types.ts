/**
 * Descripcion: Tipos compartidos para el flujo de upload granular de imágenes
 *   en formularios de creacion/edicion (mascotas, productos).
 * Implementa: Fix Issue #161 - Fase 2 (Estado granular por imagen).
 */

/**
 * Estados posibles durante el ciclo de vida de una imagen en el formulario.
 * - pending:   Archivo validado localmente, en cola para subir.
 * - uploading: Peticion a Cloudinary en curso.
 * - success:   Upload completado; cloudinaryUrl contiene la URL definitiva.
 * - error:     Upload fallido; error contiene el motivo.
 */
export type ImageUploadStatus = "pending" | "uploading" | "success" | "error";

/**
 * Representa el estado completo de una imagen a lo largo de su ciclo de
 * validacion y subida. Solo los items con status "success" se incluyen
 * en el payload final del formulario.
 */
export interface ImageUploadItem {
  /** Identificador unico local para React keys y actualizaciones de estado. */
  id: string;
  /** Archivo original seleccionado por el usuario (null si viene de initialData). */
  file: File | null;
  /** Estado actual del ciclo de vida de la imagen. */
  status: ImageUploadStatus;
  /** URL definitiva en Cloudinary; disponible solo cuando status === "success". */
  cloudinaryUrl: string | null;
  /** Mensaje de error descriptivo; disponible solo cuando status === "error". */
  error: string | null;
  /**
   * URL temporal de objeto (URL.createObjectURL) para mostrar preview
   * antes de que el upload complete. Debe revocarse al desmontar o al
   * reemplazar con cloudinaryUrl.
   */
  previewUrl: string | null;
}
