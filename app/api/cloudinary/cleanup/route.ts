import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { deleteImagesFromCloudinary } from "@/lib/cloudinary";
import { cleanupCloudinarySchema } from "@/lib/validations/cloudinary.schema";
import { extractPublicId } from "@/lib/utils/cloudinary-helpers";

/**
 * POST /api/cloudinary/cleanup
 * Elimina en lote recursos de Cloudinary que ya no están asociados a un registro persistido.
 * Se usa principalmente cuando un formulario queda incompleto y es necesario liberar
 * las imágenes cargadas para evitar archivos huérfanos.
 * Requiere una sesión activa y un cuerpo JSON con una lista de URLs válidas.
 */

export async function POST(req: NextRequest) {
  try {
    // 1. Verificación de sesión
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere una sesión activa." },
        { status: 401 }
      );
    }

    // 2. Verificación de cuenta activa
    if (!session.user.isActive) {
      return NextResponse.json(
        { error: "Cuenta bloqueada. Contacte al administrador." },
        { status: 403 }
      );
    }

    // 3. Parseo del body
    // sendBeacon puede enviar el body como texto plano; req.json() lo maneja correctamente
    // siempre que el Blob se construya con { type: "application/json" } en el cliente.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "El body de la solicitud no es JSON válido." },
        { status: 400 }
      );
    }

    // 4. Validación Zod
    const validation = cleanupCloudinarySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos en la solicitud.",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { images } = validation.data;

    // 5. Filtrar URLs que tengan un publicId derivable válido.
    // Se descarta cualquier URL que no pertenezca al bucket del proyecto
    // (extractPublicId retorna null si el path no contiene pawlig/pawlig-dev/pawlig-prod).
    const validUrls: string[] = [];
    const skippedUrls: string[] = [];

    for (const item of images) {
      const publicId = extractPublicId(item.url);
      if (publicId) {
        validUrls.push(item.url);
      } else {
        skippedUrls.push(item.url);
        console.warn(
          "[CLOUDINARY_CLEANUP] URL descartada (publicId no derivable):",
          item.url
        );
      }
    }

    if (validUrls.length === 0) {
      return NextResponse.json(
        {
          error: "Ninguna de las URLs proporcionadas pertenece al bucket del proyecto.",
          skipped: skippedUrls.length,
        },
        { status: 400 }
      );
    }

    // 6. Borrado en lote delegado a deleteImagesFromCloudinary.
    // Internamente usa Promise.allSettled, por lo que un fallo individual
    // no interrumpe el lote completo.
    // La función no retorna un resumen detallado, así que auditamos contando
    // los resultados a través de una capa adicional aquí.
    const results = await Promise.allSettled(
      validUrls.map(async (url) => {
        const publicId = extractPublicId(url)!;
        // deleteImagesFromCloudinary ya hace el destroy; llamamos con array de 1
        // para reutilizar su lógica de manejo de errores por ítem.
        await deleteImagesFromCloudinary([url]);
        return publicId;
      })
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    // 7. Respuesta con resumen.
    // sendBeacon no procesa esta respuesta, pero fetch normal sí puede usarla
    // cuando el flujo continúa en una pestaña abierta.
    return NextResponse.json(
      {
        message: `Limpieza completada. ${succeeded} imagen(es) eliminada(s), ${failed} con error.`,
        succeeded,
        failed,
        skipped: skippedUrls.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CLOUDINARY_CLEANUP_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno al procesar la limpieza de imágenes." },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este endpoint actúa como una capa de limpieza segura para recursos de Cloudinary.
 * Recibe una lista de URLs, valida que pertenezcan al bucket del proyecto y elimina
 * los recursos que puedan quedar sin referencia en la base de datos.
 *
 * Puntos clave para mantenerlo:
 * - El cuerpo debe seguir el esquema esperado por cleanupCloudinarySchema.
 * - La derivación del publicId se realiza con extractPublicId para evitar borrar
 *   recursos que no pertenezcan al proyecto.
 * - La respuesta devuelve un resumen simple de éxito, errores y URLs omitidas,
 *   útil para depuración y trazabilidad.
 */
