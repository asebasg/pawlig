"use client";

import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { BlogPost } from "@prisma/client";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PUBLISHED: {
    label: "Publicado",
    className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  },
  DRAFT: {
    label: "Borrador",
    className: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  },
  ARCHIVED: {
    label: "Archivado",
    className: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700",
  },
};

export function BlogTable() {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: BlogPost[]; meta: Meta }>("/api/admin/blog", fetcher);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este artículo?")) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar");
      }
      toast.success("Artículo eliminado");
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  if (error) return <div className="p-4 text-red-500">Error al cargar los artículos.</div>;
  if (isLoading) return <div className="p-4 text-gray-500">Cargando artículos...</div>;

  const posts = data?.data || [];

  return (
    <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Vistas</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-150">
              <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50 max-w-xs truncate" title={post.title}>{post.title}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  STATUS_CONFIG[post.status]?.className || "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}>
                  {STATUS_CONFIG[post.status]?.label || post.status}
                </span>
              </td>
              <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{post.views}</td>
              <td className="px-6 py-4 text-right space-x-3">
                <Link 
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-4 h-4" strokeWidth={1.5} /> <span className="hidden sm:inline">Editar</span>
                </Link>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} /> <span className="hidden sm:inline">Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                No se encontraron artículos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
