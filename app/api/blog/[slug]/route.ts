/**
 * @fileoverview Endpoint público para obtener detalle de un artículo por su slug.
 */
import { NextRequest, NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/lib/services/blog.service";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(`[API /blog/${params.slug} GET] Error:`, error);
    return NextResponse.json(
      { error: "Error al obtener el artículo", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * Incrementa atómicamente el contador de vistas y retorna solo el post si está publicado.
 */
