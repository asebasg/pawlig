import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { generateUploadSignature } from "@/lib/cloudinary";
import { uploadIntentSchema } from "@/lib/validations/cloudinary.schema";
import { UserRole } from "@prisma/client";

/**
 * 📚 CLOUDINARY SIGN ROUTE
 * Endpoint API que genera firmas de subida seguras.
 * * FLUJO:
 * 1. Autenticación (Session + Block Check)
 * 2. Validación de Payload (Zod)
 * 3. Autorización por Rol (RBAC)
 * 4. Generación de Firma
 */
export async function POST(req: Request) {
    try {
        //  1. Verificación de Sesión
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        //  2. Validación de Estado de Cuenta
        // NOTA: Usamos 'isActive' según el schema de Prisma
        if (!session.user.isActive) {
            return NextResponse.json(
                { error: "Cuenta bloqueada. Contacte al administrador." },
                { status: 403 }
            );
        }

        // 3. Validación de Input (Zod)
        const body = await req.json();
        const validation = uploadIntentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { folder } = validation.data;
        const userRole = session.user.role as UserRole;

        //  4. Matriz de Permisos (RBAC)
        const rolePermissions: Record<UserRole, string[]> = {
            [UserRole.ADMIN]: ["pets", "products", "avatars"],
            [UserRole.SHELTER]: ["pets", "avatars"],
            [UserRole.VENDOR]: ["products", "avatars"],
            [UserRole.ADOPTER]: ["avatars"], // Adoptante solo puede subir su foto
        };

        const allowedFolders = rolePermissions[userRole] || [];

        if (!allowedFolders.includes(folder)) {
            return NextResponse.json(
                { error: `El rol ${userRole} no tiene permiso para subir a '${folder}'` },
                { status: 403 }
            );
        }

        //  5. Configuración de Entorno
        const envPrefix = process.env.NODE_ENV === "production" ? "pawlig-prod" : "pawlig-dev";
        const fullFolderPath = `${envPrefix}/${folder}`;

        //  6. Generación de Firma
        const signatureData = generateUploadSignature(fullFolderPath);

        if (!signatureData.cloudName) {
            throw new Error("Cloud Name no configurado en el servidor");
        }

        // Retorno exitoso con headers de seguridad
        return NextResponse.json(
            {
                ...signatureData,
                folder: fullFolderPath,
                // Construcción segura de la URL
                uploadUrl: `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
                maxFileSize: 10 * 1024 * 1024, // 10MB
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store, max-age=0', // Evitar cacheo de firmas temporales
                }
            }
        );

    } catch (error) {
        console.error("[CLOUDINARY_SIGN_ERROR]", error);
        return NextResponse.json(
            { error: "Error interno al generar firma de subida" },
            { status: 500 }
        );
    }
}