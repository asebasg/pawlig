/**
 * @fileoverview Endpoints administrativos para gestionar un artículo de blog específico (CRUD).
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import { updateBlogSchema } from "@/lib/validations/blog.schema";
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/services/blog.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const post = await getBlogPostById(params.id);

    if (!post) {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(`[API /admin/blog/${params.id} GET] Error:`, error);
    return NextResponse.json(
      { error: "Error al obtener artículo", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado", code: "UNAUTHORIZED" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Acceso denegado. Se requiere rol ADMIN.", code: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = updateBlogSchema.parse(body);

    if (validatedData.content) {
      const sanitizeHtml = (await import("sanitize-html")).default;
      validatedData.content = sanitizeHtml(validatedData.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': [ 'src', 'alt' ],
          'a': [ 'href', 'name', 'target' ]
        }
      });
    }

    const updatedPost = await updateBlogPost(
      params.id, 
      validatedData,
      session.user.id,
      session.user.email ?? "admin@pawlig.com",
      request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
      request.headers.get("user-agent") ?? undefined
    );

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          code: "VALIDATION_ERROR",
          details: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
        },
        { status: 400 }
      );
    }

    console.error(`[API /admin/blog/${params.id} PUT] Error:`, error);
    return NextResponse.json(
      { error: "Error interno del servidor", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado", code: "UNAUTHORIZED" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Acceso denegado. Se requiere rol ADMIN.", code: "FORBIDDEN" }, { status: 403 });
    }

    await deleteBlogPost(
      params.id,
      session.user.id,
      session.user.email ?? "admin@pawlig.com",
      request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
      request.headers.get("user-agent") ?? undefined
    );

    return NextResponse.json({ success: true, message: "Artículo eliminado exitosamente" });
  } catch (error) {
    console.error(`[API /admin/blog/${params.id} DELETE] Error:`, error);
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar el artículo", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * GET, PUT y DELETE para el recurso de BlogPost. 
 * Todos requieren privilegios de ADMIN.
 */
