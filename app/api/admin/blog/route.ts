/**
 * @fileoverview Endpoints administrativos para listar y crear artículos de blog.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import { createBlogSchema, blogQuerySchema } from "@/lib/validations/blog.schema";
import { createBlogPost, getBlogPosts } from "@/lib/services/blog.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page") as string) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : undefined,
      tag: searchParams.get("tag") || undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
    };

    const validQuery = blogQuerySchema.parse(query);

    const result = await getBlogPosts(validQuery, true);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[API /admin/blog GET] Error:", error);
    return NextResponse.json(
      { error: "Error al obtener artículos", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autenticado", code: "UNAUTHORIZED" }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Acceso denegado. Se requiere rol ADMIN.", code: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createBlogSchema.parse(body);

    const post = await createBlogPost(
      validatedData, 
      session.user.id,
      session.user.email ?? "admin@pawlig.com",
      request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
      request.headers.get("user-agent") ?? undefined
    );

    return NextResponse.json({ success: true, data: post }, { status: 201 });
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

    console.error("[API /admin/blog POST] Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * Maneja GET para listado de artículos y POST para creación (solo ADMIN).
 */
