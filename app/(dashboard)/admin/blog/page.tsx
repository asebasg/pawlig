import React from "react";
import Link from "next/link";
import { BlogTable } from "@/components/admin/blog/blog-table";
import { PlusCircle } from "lucide-react";

export default function AdminBlogDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Gestión de Blog</h1>
          <p className="text-muted-foreground text-gray-500">
            Crea, edita y administra los artículos del blog.
          </p>
        </div>
        <Link 
          href="/admin/blog/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Nuevo Artículo
        </Link>
      </div>
      
      <section>
        <BlogTable />
      </section>
    </div>
  );
}
