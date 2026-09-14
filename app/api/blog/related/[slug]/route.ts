/**
 * @fileoverview Endpoint público para obtener artículos relacionados a un artículo.
 */
import { NextRequest, NextResponse } from "next/server";
import { getRelatedBlogPosts } from "@/lib/services/blog.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 3;
    
    const related = await getRelatedBlogPosts(params.slug, limit);

    return NextResponse.json({ success: true, data: related });
  } catch (error) {
    console.error(`[API /blog/related/${params.slug} GET] Error:`, error);
    return NextResponse.json(
      { error: "Error al obtener artículos relacionados", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * Retorna los artículos relacionados basándose en coincidencias de tags.
 */
