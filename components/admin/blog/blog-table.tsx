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
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Título</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">Vistas</th>
            <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map(post => (
            <tr key={post.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium max-w-xs truncate" title={post.title}>{post.title}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  post.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
                  post.status === "DRAFT" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {post.status}
                </span>
              </td>
              <td className="px-6 py-4">{post.views}</td>
              <td className="px-6 py-4 text-right space-x-3">
                <Link 
                  href={`/admin/blog/${post.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  <Edit size={16} /> <span className="hidden sm:inline">Editar</span>
                </Link>
                <button 
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                >
                  <Trash2 size={16} /> <span className="hidden sm:inline">Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                No se encontraron artículos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
