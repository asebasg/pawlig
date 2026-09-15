import React from "react";
import Link from "next/link";
import { BlogTable } from "@/components/admin/blog/blog-table";
import { PlusCircle } from "lucide-react";

export default function AdminBlogDashboard() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">Gestión de Blog</h1>
          <p className="text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300">
            Crea, edita y administra los artículos del blog.
          </p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 active:scale-[0.97]"
        >
          <PlusCircle className="w-4 h-4" strokeWidth={1.5} />
          Nuevo Artículo
        </Link>
      </div>
      
      <section>
        <BlogTable />
      </section>
    </div>
  );
}
