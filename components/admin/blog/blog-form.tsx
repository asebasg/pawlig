"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BlogPost } from "@prisma/client";
import { z } from "zod";
import { TipTapEditor } from "./tiptap-editor";
import { createBlogSchema, CreateBlogInput } from "@/lib/validations/blog.schema";

interface BlogFormProps {
  initialData?: BlogPost;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.input<typeof createBlogSchema>>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      featured: initialData?.featured || "",
      status: (initialData?.status as any) || "DRAFT",
      tags: initialData?.tags || [],
    },
  });

  const onSubmit = async (data: z.input<typeof createBlogSchema>) => {
    try {
      setIsLoading(true);
      const url = initialData ? `/api/admin/blog/${initialData.id}` : "/api/admin/blog";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar el artículo");
      }

      toast.success(initialData ? "Artículo actualizado correctamente" : "Artículo creado exitosamente");
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const tagString = form.watch("tags").join(", ");
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const tagsArray = value.split(",").map(tag => tag.trim()).filter(Boolean);
    form.setValue("tags", tagsArray, { shouldValidate: true });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-md shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Título *</label>
          <input 
            type="text" 
            {...form.register("title")}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Título del artículo" 
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Extracto *</label>
          <textarea 
            {...form.register("excerpt")}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-20" 
            placeholder="Breve resumen del artículo" 
          />
          {form.formState.errors.excerpt && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.excerpt.message}</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Contenido *</label>
          <TipTapEditor 
            value={form.watch("content")} 
            onChange={(val) => form.setValue("content", val, { shouldValidate: true })}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen Destacada (URL)</label>
          <input 
            type="url" 
            {...form.register("featured")}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="https://ejemplo.com/imagen.jpg" 
          />
          {form.formState.errors.featured && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.featured.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select 
            {...form.register("status")}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium mb-1">Etiquetas (separadas por coma)</label>
          <input 
            type="text" 
            value={tagString}
            onChange={handleTagsChange}
            className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="ej. Next.js, React, Tutorial" 
          />
          {form.formState.errors.tags && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.tags.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button 
          type="button" 
          onClick={() => router.push("/admin/blog")}
          className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Guardar Artículo"}
        </button>
      </div>
    </form>
  );
}
