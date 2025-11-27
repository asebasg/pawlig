import { v2 as cloudinary } from "cloudinary";

// 1. Validación temprana de entorno (Fail Fast)
if (
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("❌ Faltan variables de entorno críticas de Cloudinary en .env");
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Interfaz para el retorno de la firma (Vital para el Frontend)
export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string | undefined;
  cloudName: string | undefined;
  // Estos parámetros DEBEN ser enviados por el frontend en el FormData
  params: {
    timestamp: number;
    folder: string;
    resource_type: string;
    allowed_formats: string;
  };
}

/**
 * Genera una firma segura para subir archivos desde el cliente.
 * * @param folder Carpeta destino (ej: 'pawlig-prod/pets')
 * @returns Objeto con la firma y los parámetros que el frontend DEBE incluir.
 */
export function generateUploadSignature(folder: string): CloudinarySignature {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Parámetros estrictos: El frontend debe enviar estos EXACTAMENTE igual
  const paramsToSign = {
    timestamp,
    folder,
    resource_type: "image",
    allowed_formats: "jpg,jpeg,png,webp",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    params: paramsToSign,
  };
}

/**
 * Valida si una URL pertenece al bucket de Cloudinary de Pawlig.
 * Útil para prevenir inyección de imágenes externas en la BD.
 */
export function isValidCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return url.startsWith(`https://res.cloudinary.com/${cloudName}/`);
}

export default cloudinary;