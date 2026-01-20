import { v2 as cloudinary } from "cloudinary";

/**
 * Ruta/Componente/Servicio: Servicio de Cloudinary
 * Descripción: Configura el SDK de Cloudinary y proporciona funciones de utilidad para la firma de subidas seguras y la validación de URLs.
 * Requiere: Variables de entorno de Cloudinary (cloud_name, api_key, api_secret).
 * Implementa: RNF-004
 */

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else {
  // Durante el build de Next.js, algunas rutas pueden importar este archivo.
  // Evitamos lanzar un error fatal para permitir que la construcción progrese,
  // pero advertimos en la consola.
  console.warn(
    "⚠️ ADVERTENCIA: Cloudinary no está configurado. Las funciones de subida de imágenes fallarán."
  );
}

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
  if (!isConfigured) {
    throw new Error("Cloudinary no está configurado. No se puede generar la firma.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
    resource_type: "image",
    allowed_formats: "jpg,jpeg,png,webp",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    apiSecret!
  );

  return {
    timestamp,
    signature,
    apiKey: apiKey,
    cloudName: cloudName,
    params: paramsToSign,
  };
}

export function isValidCloudinaryUrl(url: string): boolean {
  if (!url || !cloudName) return false;
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
 * - Configuración Condicional: Se verifica la existencia de las variables de
 *   entorno antes de configurar el SDK. Esto evita errores fatales durante el
 *   build de Next.js cuando las variables no están presentes.
 * - Validación en Tiempo de Ejecución: Las funciones que requieren configuración
 *   (como generateUploadSignature) lanzan un error solo cuando son llamadas,
 *   lo que permite que el resto de la aplicación compile correctamente.
 * - generateUploadSignature: Genera una firma única en el servidor que autoriza
 *   una operación de subida desde el cliente, asegurando que los parámetros no
 *   sean manipulados.
 * - isValidCloudinaryUrl: Verifica que una URL pertenece al bucket de Cloudinary
 *   configurado para el proyecto.
 *
 * Dependencias Externas:
 * - 'cloudinary': El SDK oficial de Cloudinary para Node.js, utilizado para la
 *   configuración y la generación de la firma de la API.
 *
 */
