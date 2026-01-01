import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

/**
 * POST /api/cloudinary/sign
 * Descripción: Genera una firma segura para subir archivos a Cloudinary.
 * Requiere: Usuario autenticado.
 * Implementa: Lógica de autorización basada en roles para la subida de archivos.
 */
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
/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint es un componente de seguridad crítico que centraliza la
 * generación de firmas para la subida de archivos a Cloudinary. En lugar
 * de exponer claves de API en el cliente, el frontend solicita una firma
 * a esta ruta, que valida la autenticación y autorización del usuario
 * antes de devolver una firma de un solo uso.
 *
 * Lógica Clave:
 * - 'Autenticación y Estado de Cuenta': Primero, se verifica que el
 *   usuario tenga una sesión activa y que su cuenta no esté bloqueada
 *   ('isActive' es true). Esta es la primera barrera de seguridad.
 * - 'Validación de Intención con Zod': Se valida el cuerpo de la solicitud
 *   para asegurar que el cliente especifique una carpeta de destino válida
 *   ('folder'). Esto previene intentos de subida a directorios no esperados.
 * - 'Matriz de Permisos (RBAC)': Se utiliza un objeto 'rolePermissions'
 *   para definir explícitamente qué roles de usuario pueden subir archivos
 *   a qué carpetas. Por ejemplo, un 'ADOPTER' solo puede subir a la carpeta
 *   'avatars', mientras que un 'SHELTER' puede subir a 'pets' y 'avatars'.
 *   Esta es la principal capa de autorización.
 * - 'Generación de Firma Segura': La función 'generateUploadSignature'
 *   (abstraída en 'lib/cloudinary') utiliza el SDK de Cloudinary en el
 *   backend para crear una firma digital usando la API Secret. La firma
 *   incluye la carpeta de destino y un timestamp, lo que la hace segura y
 *   de corta duración.
 *
 * Dependencias Externas:
 * - 'next-auth': Para obtener la sesión del servidor y verificar la
 *   autenticación y el rol del usuario.
 * - 'zod': Para validar y asegurar la integridad del payload de la
 *   solicitud.
 * - 'cloudinary' (indirectamente a través de 'lib/cloudinary'): El SDK
 *   de Cloudinary se utiliza en el backend para la generación de la firma.
 *
 */
