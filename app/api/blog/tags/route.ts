/**
 * @fileoverview Endpoint público para obtener las etiquetas de blog y sus conteos.
 */
import { NextResponse } from "next/server";
import { getBlogTags } from "@/lib/services/blog.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tags = await getBlogTags();
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    console.error("[API /blog/tags GET] Error:", error);
    return NextResponse.json(
      { error: "Error al obtener etiquetas", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 * Retorna las etiquetas extraídas de los artículos publicados.
 */
