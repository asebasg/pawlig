import React from "react";
import { BlogForm } from "@/components/admin/blog/blog-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogPostById } from "@/lib/services/blog.service";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const post = await getBlogPostById(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1 mb-4">
          <ArrowLeft size={16} /> Volver a artículos
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Editar Artículo</h1>
        <p className="text-muted-foreground text-gray-500 mt-1">
          Actualiza los detalles de este artículo.
        </p>
      </div>
      
      <BlogForm initialData={post} />
    </div>
  );
}
