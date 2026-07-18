/**
 * Proporciona utilidades puras para trabajar con URLs de Cloudinary sin depender
 * del SDK ni de credenciales del servidor. Esto permite reutilizar la lógica en
 * componentes cliente y rutas de API de manera segura.
 */

/**
 * Extrae el publicId de una URL de Cloudinary.
 * Funciona con los entornos de carpeta: pawlig, pawlig-dev y pawlig-prod.
 *
 * @param cloudinaryUrl - URL completa de Cloudinary (ej: https://res.cloudinary.com/demo/image/upload/v1/pawlig/pets/abc123.jpg)
 * @returns El publicId sin extensión (ej: "pawlig/pets/abc123"), o null si la URL no es válida.
 */
export function extractPublicId(cloudinaryUrl: string): string | null {
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split("/");
    const pawligIndex = pathParts.findIndex(
      (p) => p === "pawlig" || p === "pawlig-dev" || p === "pawlig-prod"
    );
    if (pawligIndex === -1) return null;

    const publicIdWithExt = pathParts.slice(pawligIndex).join("/");
    const lastDotIndex = publicIdWithExt.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return publicIdWithExt.substring(0, lastDotIndex);
    }
    return publicIdWithExt;
  } catch {
    return null;
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este módulo debe mantenerse independiente de código de negocio y de variables
 * sensibles. Si cambian las rutas o los nombres de carpeta usados por Cloudinary,
 * la lógica de extracción debe actualizarse aquí para evitar regresiones en los
 * flujos de carga y borrado.
 */
