"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BlogPost } from "@prisma/client";
import { z } from "zod";
import { TipTapEditor } from "./tiptap-editor";
import { createBlogSchema } from "@/lib/validations/blog.schema";
import { motion } from "framer-motion";
import { springs } from "@/lib/motion/springs";

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
      status: initialData?.status || "DRAFT",
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Título *</label>
          <input 
            type="text" 
            {...form.register("title")}
            className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950" 
            placeholder="Título del artículo" 
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Extracto *</label>
          <textarea 
            {...form.register("excerpt")}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 min-h-[5rem]" 
            placeholder="Breve resumen del artículo" 
          />
          {form.formState.errors.excerpt && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.excerpt.message}</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Contenido *</label>
          <TipTapEditor 
            value={form.watch("content")} 
            onChange={(val) => form.setValue("content", val, { shouldValidate: true })}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Imagen Destacada (URL)</label>
          <input 
            type="url" 
            {...form.register("featured")}
            className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950" 
            placeholder="https://ejemplo.com/imagen.jpg" 
          />
          {form.formState.errors.featured && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.featured.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Estado</label>
          <select 
            {...form.register("status")}
            className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            <option value="DRAFT">Borrador</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="ARCHIVED">Archivado</option>
          </select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">Etiquetas (separadas por coma)</label>
          <input 
            type="text" 
            value={tagString}
            onChange={handleTagsChange}
            className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950" 
            placeholder="ej. Next.js, React, Tutorial" 
          />
          {form.formState.errors.tags && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.tags.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <motion.button 
          whileTap={{ scale: 0.97 }}
          transition={springs.snap}
          type="button" 
          onClick={() => router.push("/admin/blog")}
          className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          Cancelar
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.97 }}
          transition={springs.snap}
          type="submit" 
          disabled={isLoading}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
        >
          {isLoading ? "Guardando..." : "Guardar Artículo"}
        </motion.button>
      </div>
    </form>
  );
}
