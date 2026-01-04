import { v2 as cloudinary } from "cloudinary";

/**
 * Ruta/Componente/Servicio: Servicio de Cloudinary
 * Descripción: Configura el SDK de Cloudinary y proporciona funciones de utilidad para la firma de subidas seguras y la validación de URLs.
 * Requiere: Variables de entorno de Cloudinary (cloud_name, api_key, api_secret).
 * Implementa: RNF-004
 */

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

export interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string | undefined;
  cloudName: string | undefined;
  params: {
    timestamp: number;
    folder: string;
    resource_type: string;
    allowed_formats: string;
  };
}

export function generateUploadSignature(folder: string): CloudinarySignature {
  const timestamp = Math.round(new Date().getTime() / 1000);

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

export function isValidCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return url.startsWith(`https://res.cloudinary.com/${cloudName}/`);
}

export default cloudinary;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo es el punto central de la integración con Cloudinary. Se encarga de
 * la configuración inicial del SDK y exporta funciones de utilidad cruciales para
 * la gestión segura de archivos multimedia, especialmente para las subidas
 * directas desde el cliente (client-side uploads).
 *
 * Lógica Clave:
 * - 'Validación de Entorno (Fail-Fast)': El archivo comprueba la existencia de
 *   las variables de entorno necesarias al inicio. Si alguna falta, lanza un
 *   error inmediatamente, evitando que la aplicación se ejecute en un estado
 *   mal configurado.
 * - 'generateUploadSignature': Esta es una función de seguridad crítica. Genera
 *   una firma única en el servidor que autoriza una operación de subida desde el
 *   cliente. Al firmar los parámetros ('folder', 'resource_type', etc.) en el
 *   backend, se asegura que el cliente no pueda manipular el destino de la subida
 *   u otros parámetros importantes.
 * - 'isValidCloudinaryUrl': Una función de validación para verificar que una URL
 *   pertenece al bucket de Cloudinary del proyecto. Esto previene que se puedan
 *   guardar en la base de datos URLs de imágenes externas no controladas.
 *
 * Dependencias Externas:
 * - 'cloudinary': El SDK oficial de Cloudinary para Node.js, utilizado para la
 *   configuración y la generación de la firma de la API.
 *
 */
