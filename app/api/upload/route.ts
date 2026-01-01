/**
 *  API Route: /api/upload
 * 
 * PROPÓSITO:
 * - Upload de imágenes a Cloudinary
 * - Validación de formato y tamaño
 * - Optimización automática
 * 
 * TRAZABILIDAD:
 * - HU-005: Upload de fotos de mascotas
 * - RN-007: Mínimo una foto por mascota
 * 
 * FLUJO:
 * 1. Recibir imagen en base64
 * 2. Validar formato (JPEG/PNG)
 * 3. Upload a Cloudinary con transformaciones
 * 4. Retornar URL optimizada
 * 
 * CONFIGURACIÓN:
 * - Variables de entorno requeridas:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 *  POST /api/upload
 *  Upload de imagen a Cloudinary
 * 
 * BODY:
 * {
 *   image: string (base64),
 *   folder: "pets" | "users" | "shelters"
 * }
 * 
 * RESPUESTA:
 * {
 *   url: string (URL de Cloudinary),
 *   publicId: string
 * }
 */

export async function POST(request: NextRequest) {
    try {
        //  1. Autenticación
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        //  2. Validar variables de entorno
        if (
            !process.env.CLOUDINARY_CLOUD_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_API_SECRET
        ) {
            console.error("Cloudinary no configurado correctamente");
            return NextResponse.json(
                { error: "Servicio de imágenes no disponible" },
                { status: 500 }
            );
        }

        //  3. Parsear body
        const body = await request.json();
        const { image, folder = "pets" } = body;

        if (!image || typeof image !== "string") {
            return NextResponse.json(
                { error: "Imagen requerida en formato base64" },
                { status: 400 }
            );
        }

        //  4. Validar formato a base64
        if (!image.startsWith("data:image/")) {
            return NextResponse.json(
                { error: "Formato de imagen inválido. Usa JPEG o PNG" },
                { status: 400 }
            );
        }

        //  5. Validar tipo de imagen
        const mimeType = image.split(";")[0].split(":")[1];
        const allowedTypes = ["image/jpeg", "image/png"];

        if (!allowedTypes.includes(mimeType)) {
            return NextResponse.json(
                { error: "Solo se permiten imágenes JPEG o PNG" },
                { status: 400 }
            );
        }

        //  6. Upload a Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: `pawlig/${folder}`, // Organización en Cloudinary
            transformation: [
                { width: 1200, height: 900, crop: "limit" }, // Máximo 1200x900
                { quality: "auto:good" }, // Calidad automática optimizada
                { fetch_format: "auto" }, // Formato automático (WebP si es compatible)
            ],
            allowed_formats: ["jpg", "png"],
        });

        //  7. Retornar URL
        return NextResponse.json({
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        });
    } catch (error) {
        console.error("[POST /api/upload] Error:", error);

        //  Manejo específico de errores de Cloudinary
        if (error instanceof Error) {
            if (error.message.includes("File size too large")) {
                return NextResponse.json(
                    { error: "Imagen muy grande. Máximo 5MB" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: "Error al subir imagen. Intenta nuevamente." },
            { status: 500 }
        );
    }
}

/**
 *  DELETE /api/upload
 *  Eliminar imagen de Cloudinary (opcional)
 * 
 * BODY:
 * {
 *   publicId: string
 * }
 */
export async function DELETE(request: NextRequest) {
    try {
        //  1. Autenticación
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        //  2. Parsear body
        const body = await request.json();
        const { publicId } = body;

        if (!publicId) {
            return NextResponse.json(
                { error: "publicId requerido" },
                { status: 400 }
            );
        }

        //  3. Eliminar de Cloudinary
        await cloudinary.uploader.destroy(publicId);

        return NextResponse.json({
            message: "Imagen eliminada exitosamente",
        });
    } catch (error) {
        console.error("[DELETE /api/upload] Error:", error);
        return NextResponse.json(
            { error: "Error al eliminar imagen" },
            { status: 500 }
        );
    }
}