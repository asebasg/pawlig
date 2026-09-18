import React from "react";
import { BlogForm } from "@/components/admin/blog/blog-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div>
        {/* Fallback: framer-motion no disponible en Server Component */}
        <Link href="/admin/blog" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 active:scale-[0.97] text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 rounded-sm mb-4">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Volver a artículos
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Nuevo Artículo</h1>
        <p className="text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300 mt-1">
          Crea un nuevo artículo para el blog.
        </p>
      </div>
      
      <BlogForm />
    </div>
  );
}
