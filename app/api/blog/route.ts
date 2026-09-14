/**
 * @fileoverview Endpoint público para listar artículos publicados del blog.
 */
import { NextRequest, NextResponse } from "next/server";
import { blogQuerySchema } from "@/lib/validations/blog.schema";
import { getBlogPosts } from "@/lib/services/blog.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page") as string) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : undefined,
      tag: searchParams.get("tag") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
    };

    const validQuery = blogQuerySchema.parse(query);

    // false = no admin, it will enforce "PUBLISHED" status internally
    const result = await getBlogPosts(validQuery, false);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[API /blog GET] Error:", error);
    return NextResponse.json(
      { error: "Error al obtener los artículos", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * Retorna exclusivamente artículos publicados.
 */
