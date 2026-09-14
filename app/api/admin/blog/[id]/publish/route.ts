/**
 * @fileoverview Endpoint administrativo para publicar/despublicar artículos rápidamente.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import { updateBlogPost, getBlogPostById } from "@/lib/services/blog.service";

export async function POST(
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

    const post = await getBlogPostById(params.id);
    if (!post) {
      return NextResponse.json({ error: "Artículo no encontrado", code: "NOT_FOUND" }, { status: 404 });
    }

    // Toggle status (DRAFT/ARCHIVED to PUBLISHED, or PUBLISHED to DRAFT)
    const newStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    
    const updatedPost = await updateBlogPost(
      params.id, 
      { status: newStatus },
      session.user.id,
      session.user.email ?? "admin@pawlig.com",
      request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined,
      request.headers.get("user-agent") ?? undefined
    );

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error(`[API /admin/blog/${params.id}/publish POST] Error:`, error);
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
 * Permite cambiar el estado de un artículo de forma atómica.
 */
