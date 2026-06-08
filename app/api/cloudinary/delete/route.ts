import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import cloudinary, { isValidCloudinaryUrl } from "@/lib/cloudinary";
import { deleteResourceSchema } from "@/lib/validations/cloudinary.schema";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";

/**
 * DELETE /api/cloudinary/delete
 * Descripción: Endpoint centralizado y seguro para eliminar recursos multimedia alojados en Cloudinary.
 *              Verifica autenticacion, permisos por rol (RBAC) y propiedad del recurso en MongoDB
 *              antes de ejecutar la eliminacion en Cloudinary.
 * Requiere: Usuario autenticado con sesion activa. Body: { publicId, resourceType? }.
 * Implementa: Issue-135
 */

// Prefijo para validar que el publicId pertenece a este proyecto
const ENV_PREFIX = "pawlig";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Deriva la URL de Cloudinary a partir del publicId y resourceType.
 * Necesaria para buscar el recurso en los campos de la base de datos.
 */
function deriveCloudinaryUrl(publicId: string, resourceType: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${publicId}`;
}

/**
 * Verifica que el publicId pertenece al bucket de este proyecto
 * validando que comience con el prefijo de entorno correcto.
 */
function isOwnedByProject(publicId: string): boolean {
  return publicId.startsWith(ENV_PREFIX + "/");
}

export async function DELETE(req: NextRequest) {
  try {
    // 1. Verificación de sesión
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado. Se requiere una sesión activa." },
        { status: 401 }
      );
    }

    // 2. Verificación de estado de cuenta
    if (!session.user.isActive) {
      return NextResponse.json(
        { error: "Cuenta bloqueada. Contacte al administrador." },
        { status: 403 }
      );
    }

    // 3. Validación de input con Zod
    const body = await req.json();
    const validation = deleteResourceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos en la solicitud.",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { publicId, resourceType, url } = validation.data;

    // 4. Validar que el publicId pertenece a este proyecto
    if (!CLOUD_NAME) {
      console.error("[CLOUDINARY_DELETE] CLOUD_NAME no configurado.");
      return NextResponse.json(
        { error: "Servicio de imágenes no disponible." },
        { status: 500 }
      );
    }

    if (!isOwnedByProject(publicId)) {
      return NextResponse.json(
        { error: "El recurso no pertenece al proyecto." },
        { status: 400 }
      );
    }

    const targetUrl = url || deriveCloudinaryUrl(publicId, resourceType);

    if (!isValidCloudinaryUrl(targetUrl)) {
      return NextResponse.json(
        { error: "La URL proporcionada o derivada no es válida para este proyecto." },
        { status: 400 }
      );
    }

    // 5. RBAC + Verificación de propiedad
    const userId = session.user.id;
    const userRole = session.user.role as UserRole;

    // Verificar si el usuario es el autor de la subida (estampa en el publicId)
    // El publicId tiene el formato: pawlig/pets/{userId}_{uniqueId}
    const fileName = publicId.split('/').pop() || "";
    const isUploaderOriginal = fileName.startsWith(`${userId}_`);

    // Los administradores pueden eliminar cualquier recurso sin verificacion de propiedad
    // Si no es admin y no es el uploader original, verificamos en DB como fallback (imágenes antiguas)
    if (userRole !== UserRole.ADMIN && !isUploaderOriginal) {
      const ownershipVerified = await verifyResourceOwnership(
        userId,
        userRole,
        targetUrl
      );

      if (!ownershipVerified.found) {
        return NextResponse.json(
          {
            error:
              "Recurso no encontrado o no tienes permisos para eliminarlo.",
          },
          { status: ownershipVerified.forbidden ? 403 : 404 }
        );
      }
    }

    // 6. Eliminación en Cloudinary
    const destroyResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    // Cloudinary retorna { result: "ok" } en éxito o { result: "not found" } si no existe
    if (destroyResult.result !== "ok") {
      return NextResponse.json(
        {
          error: `Cloudinary no pudo eliminar el recurso. Resultado: ${destroyResult.result}`,
        },
        { status: 404 }
      );
    }

    // 7. Respuesta exitosa (la actualización en MongoDB es responsabilidad del caller)
    return NextResponse.json(
      {
        message: "Recurso eliminado exitosamente de Cloudinary.",
        publicId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CLOUDINARY_DELETE_ERROR]", error);
    return NextResponse.json(
      { error: "Error interno al procesar la eliminación del recurso." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// FUNCIONES DE VERIFICACIÓN DE PROPIEDAD (RBAC por rol)
// ---------------------------------------------------------------------------

interface OwnershipResult {
  found: boolean;
  forbidden?: boolean;
}

/**
 * Enruta la verificación de propiedad al handler correcto según el rol del usuario.
 * Busca la URL derivada del publicId en los campos correspondientes de MongoDB.
 */
async function verifyResourceOwnership(
  userId: string,
  userRole: UserRole,
  cloudinaryUrl: string
): Promise<OwnershipResult> {
  switch (userRole) {
    case UserRole.SHELTER:
      return verifyShelterOwnership(userId, cloudinaryUrl);
    case UserRole.VENDOR:
      return verifyVendorOwnership(userId, cloudinaryUrl);
    case UserRole.ADOPTER:
      return verifyAdopterOwnership(cloudinaryUrl);
    default:
      // Rol desconocido: denegar por defecto
      return { found: false, forbidden: true };
  }
}

/**
 * SHELTER: verifica que la URL pertenece a una mascota de su albergue.
 */
async function verifyShelterOwnership(
  userId: string,
  cloudinaryUrl: string
): Promise<OwnershipResult> {
  const shelter = await prisma.shelter.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!shelter) {
    return { found: false, forbidden: true };
  }

  const pet = await prisma.pet.findFirst({
    where: {
      shelterId: shelter.id,
      images: { has: cloudinaryUrl },
    },
    select: { id: true },
  });

  return { found: !!pet };
}

/**
 * VENDOR: verifica que la URL pertenece a un producto de su tienda o a su logo.
 */
async function verifyVendorOwnership(
  userId: string,
  cloudinaryUrl: string
): Promise<OwnershipResult> {
  const vendor = await prisma.vendor.findUnique({
    where: { userId },
    select: { id: true, logo: true },
  });

  if (!vendor) {
    return { found: false, forbidden: true };
  }

  // Verificar si es el logo del vendor
  if (vendor.logo === cloudinaryUrl) {
    return { found: true };
  }

  // Verificar si pertenece a alguno de sus productos
  const product = await prisma.product.findFirst({
    where: {
      vendorId: vendor.id,
      images: { has: cloudinaryUrl },
    },
    select: { id: true },
  });

  return { found: !!product };
}

/**
 * ADOPTER: solo puede eliminar recursos dentro de la carpeta de avatares.
 * Valida por convención de prefijo de carpeta ya que no hay campo avatar en el modelo User actual.
 */
async function verifyAdopterOwnership(
  cloudinaryUrl: string
): Promise<OwnershipResult> {
  const avatarPathSegment = `/${ENV_PREFIX}/avatars/`;
  const isAvatarUrl = cloudinaryUrl.includes(avatarPathSegment);
  return { found: isAvatarUrl, forbidden: !isAvatarUrl };
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este endpoint es el punto centralizado y seguro para la eliminacion de
 * recursos en Cloudinary. Fue creado para reemplazar el handler DELETE
 * no seguro que existia en /api/upload y para proveer una solución unica
 * reutilizable por todos los contextos: mascotas, productos, avatares y logos.
 * La responsabilidad de este endpoint es SOLO eliminar en Cloudinary.
 * La actualizacion de los campos 'images' o 'logo' en MongoDB queda a
 * cargo del servicio o endpoint que invoca este endpoint (el "caller").
 *
 * Lógica Clave:
 * - Flujo de 7 pasos: sesion, cuenta activa, Zod, validacion de proyecto,
 *   RBAC + propiedad en DB, destruccion en Cloudinary, respuesta exitosa.
 * - isOwnedByProject: Primer filtro rapido que verifica que el publicId
 *   comienza con el prefijo de entorno (pawlig-prod/ o pawlig-dev/).
 *   Previene intentos de eliminar recursos de otros proyectos Cloudinary.
 * - deriveCloudinaryUrl: Reconstruye la URL completa desde el publicId
 *   para poder buscarla en los arrays 'images[]' de Prisma usando 'has'.
 * - verifyResourceOwnership: Dispatcher de propiedad por rol. ADMIN omite
 *   esta verificacion por diseno, garantizando acceso administrativo total.
 * - verifyShelterOwnership / verifyVendorOwnership: Buscan en Prisma si la
 *   URL derivada existe dentro de los recursos que le pertenecen al usuario.
 * - verifyAdopterOwnership: Validacion por convencion de carpeta ya que el
 *   modelo User actual no tiene campo 'avatar'. Si se agrega en el futuro,
 *   esta funcion debe actualizarse para buscar en DB.
 * - destroyResult.result: La API de Cloudinary retorna el string "ok" en
 *   exito. Cualquier otro valor (ej: "not found") se trata como error.
 *
 * Dependencias Externas:
 * - 'cloudinary' (default export de lib/cloudinary.ts): SDK configurado
 *   condicionalmente para la operacion de destruccion del recurso.
 * - 'isValidCloudinaryUrl' (lib/cloudinary.ts): Valida que la URL derivada
 *   pertenece al bucket del proyecto.
 * - 'deleteResourceSchema' (lib/validations/cloudinary.schema.ts): Valida
 *   y parsea el body del request con publicId y resourceType.
 * - 'prisma' (lib/utils/db.ts): ORM para verificacion de propiedad en MongoDB.
 * - 'next-auth': Para obtener la sesion del usuario autenticado.
 *
 */
