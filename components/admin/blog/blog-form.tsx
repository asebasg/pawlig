"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { BlogPost } from "@prisma/client";
import { z } from "zod";
import Image from "next/image";
import { TipTapEditor } from "./tiptap-editor";
import { createBlogSchema } from "@/lib/validations/blog.schema";
import { motion, AnimatePresence } from "framer-motion";
import { springs } from "@/lib/motion/springs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteButton } from "@/components/ui/delete-button";
import { Loader2, AlertCircle, X } from "lucide-react";
import { MAX_FILE_SIZE, CLOUDINARY_FOLDERS } from "@/lib/constants";
import type { ImageUploadItem } from "@/types/upload.types";
import { extractPublicId } from "@/lib/utils/cloudinary-helpers";

/**
 * Descripción: Formulario de creación/edición de artículos del blog.
 * Implementa: Surface 2 Glassmorphic (DESIGN.md), subida de imágenes
 *   al editor vía Cloudinary (patrón idéntico a pet-form y product-form),
 *   y DeleteButton para eliminación segura de imágenes y del artículo.
 */

interface BlogFormProps {
  initialData?: BlogPost;
}

const ACCEPTED_IMAGE_TYPES_BLOG = ["image/jpeg", "image/png", "image/webp"] as const;

// ---------------------------------------------------------------------------
// TagsInput — sub-componente
// ---------------------------------------------------------------------------

const TagsInput = ({
  form,
}: {
  form: UseFormReturn<z.input<typeof createBlogSchema>>;
  initialTags?: string[];
}) => {
  const [inputValue, setInputValue] = useState("");
  // La fuente de verdad son los valores almacenados en el formulario
  const tags = form.watch("tags") || [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      form.setValue("tags", [...tags, trimmed], { shouldValidate: true });
    }
    setInputValue("");
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    form.setValue("tags", newTags, { shouldValidate: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Si el usuario pega texto con comas
    if (val.includes(",")) {
      const parts = val.split(",");
      const newTags = [...tags];
      parts.forEach((part, i) => {
        const t = part.trim();
        if (i === parts.length - 1) {
          setInputValue(t); // Lo último queda en el input
        } else if (t && !newTags.includes(t)) {
          newTags.push(t);
        }
      });
      form.setValue("tags", newTags, { shouldValidate: true });
    } else {
      setInputValue(val);
    }
  };

  return (
    <>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
        Etiquetas (presiona coma o Enter para añadir)
      </label>
      <div 
        className="flex flex-wrap items-center gap-2 min-h-[40px] w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 dark:focus-within:ring-offset-zinc-950 transition-all cursor-text"
        onClick={(e) => {
          const input = e.currentTarget.querySelector('input');
          if (input) input.focus();
        }}
      >
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springs.snap}
              className="inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-lg text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:bg-purple-200/50 dark:hover:bg-purple-800/50 rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600"
                aria-label={`Eliminar etiqueta ${tag}`}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent min-w-[120px] focus:outline-none text-zinc-900 dark:text-zinc-50"
          placeholder={tags.length === 0 ? "ej. Next.js, React, Tutorial" : ""}
        />
      </div>
      {form.formState.errors.tags && (
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.tags.message}
        </p>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// BlogForm — componente principal
// ---------------------------------------------------------------------------

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estado granular de la imagen actualmente en proceso de subida al editor
  // (idéntico al patrón de pet-form y product-form)
  const [editorImageItem, setEditorImageItem] =
    useState<ImageUploadItem | null>(null);

  // Galería de imágenes insertadas en el artículo (para gestionar su eliminación)
  const [galleryItems, setGalleryItems] = useState<ImageUploadItem[]>([]);

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

  // ---------------------------------------------------------------------------
  // handleEditorImageUpload — subida de imagen para insertar en el editor
  // ---------------------------------------------------------------------------

  const handleEditorImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validación local
      if (file.size > MAX_FILE_SIZE) {
        toast.error("La imagen excede el límite de 5MB.");
        return;
      }
      if (!(ACCEPTED_IMAGE_TYPES_BLOG as readonly string[]).includes(file.type)) {
        toast.error("Formato no válido. Usa JPEG, PNG o WEBP.");
        return;
      }

      const newItem: ImageUploadItem = {
        id: crypto.randomUUID(),
        file,
        status: "pending",
        cloudinaryUrl: null,
        error: null,
        previewUrl: URL.createObjectURL(file),
      };

      setEditorImageItem({ ...newItem, status: "uploading" });

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Error al leer el archivo"));
          reader.readAsDataURL(file);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, folder: CLOUDINARY_FOLDERS.BLOG }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al subir imagen");
        }

        const data = await response.json();
        const cloudinaryUrl = data.url as string;

        const successItem: ImageUploadItem = {
          ...newItem,
          status: "success",
          cloudinaryUrl,
        };

        // El tiptap-editor detecta el cambio de imageItem a status "success"
        // vía useEffect e inserta la imagen automáticamente en el contenido.
        setEditorImageItem(successItem);

        // Registrar en la galería de gestión
        setGalleryItems((prev) => [...prev, successItem]);

        toast.success("Imagen subida e insertada correctamente.");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        setEditorImageItem((prev) =>
          prev ? { ...prev, status: "error", error: errorMessage } : prev
        );
        toast.error(`No se pudo subir la imagen: ${errorMessage}`);
      } finally {
        // Limpiar el item activo tras el proceso (exitoso o fallido)
        setEditorImageItem(null);
        e.target.value = "";
      }
    },
    []
  );

  // ---------------------------------------------------------------------------
  // removeGalleryImage — elimina imagen de Cloudinary y la quita de la galería
  // ---------------------------------------------------------------------------

  const removeGalleryImage = useCallback(async (id: string) => {
    const item = galleryItems.find((i) => i.id === id);
    if (!item) return;

    // Revocar objectURL si existe
    if (item.previewUrl && item.file !== null) {
      URL.revokeObjectURL(item.previewUrl);
    }

    // Optimistic: quitar de la galería de inmediato
    setGalleryItems((prev) => prev.filter((i) => i.id !== id));

    if (item.status !== "success" || !item.cloudinaryUrl) return;

    try {
      const publicId = extractPublicId(item.cloudinaryUrl);
      if (!publicId) {
        console.warn("No se pudo extraer publicId", item.cloudinaryUrl);
        return;
      }
      const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, url: item.cloudinaryUrl }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar la imagen");
      }
      toast.success("Imagen eliminada del servidor.");
    } catch (error) {
      console.error("Error eliminando imagen de Cloudinary:", error);
      toast.error("La imagen se quitó de la galería, pero hubo un error al borrarla del servidor.");
    }
  }, [galleryItems]);

  // ---------------------------------------------------------------------------
  // onSubmit
  // ---------------------------------------------------------------------------

  const onSubmit = async (data: z.input<typeof createBlogSchema>) => {
    try {
      setIsLoading(true);
      const url = initialData
        ? `/api/admin/blog/${initialData.id}`
        : "/api/admin/blog";
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

      toast.success(
        initialData
          ? "Artículo actualizado correctamente"
          : "Artículo creado exitosamente"
      );
      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
      setIsLoading(false);
    }
  };

  const isUploading =
    editorImageItem?.status === "uploading" ||
    editorImageItem?.status === "pending";

  return (
    <motion.form
      onSubmit={form.handleSubmit(onSubmit)}
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 8 }}
      transition={springs.modal}
      className="space-y-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-8 relative overflow-hidden"
    >
      {/* Luz ambiental — obligatoria en toda Surface 2 */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Título */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Título *
          </label>
          <input
            type="text"
            {...form.register("title")}
            className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            placeholder="Título del artículo"
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Extracto */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Extracto *
          </label>
          <textarea
            {...form.register("excerpt")}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 min-h-[5rem]"
            placeholder="Breve resumen del artículo"
          />
          {form.formState.errors.excerpt && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.excerpt.message}
            </p>
          )}
        </div>

        {/* Contenido — Editor TipTap */}
        <div className="col-span-1 md:col-span-2 space-y-3">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Contenido *
          </label>
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => (
              <TipTapEditor
                value={field.value}
                onChange={field.onChange}
                imageItem={editorImageItem}
                onImageFileSelect={handleEditorImageUpload}
              />
            )}
          />
          {form.formState.errors.content && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.content.message}
            </p>
          )}

          {/* Galería de archivos subidos al artículo */}
          <AnimatePresence>
            {galleryItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={springs.default}
                className="space-y-2"
              >
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Archivos subidos al artículo
                </p>
                <div className="flex flex-wrap gap-3">
                  {galleryItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={springs.snap}
                      className="relative group flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-2"
                    >
                      {/* Preview miniatura */}
                      {item.previewUrl && item.status === "success" && (
                        <Image
                          src={item.previewUrl}
                          alt="Imagen subida"
                          width={36}
                          height={36}
                          className="w-9 h-9 object-cover rounded-lg flex-shrink-0"
                        />
                      )}

                      {/* Overlay de carga */}
                      {(item.status === "uploading" || item.status === "pending") && (
                        <div className="w-9 h-9 flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded-lg">
                          <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                        </div>
                      )}

                      {/* Overlay de error */}
                      {item.status === "error" && (
                        <div className="w-9 h-9 flex items-center justify-center bg-red-50 dark:bg-red-950/30 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </div>
                      )}

                      <span className="text-xs text-zinc-600 dark:text-zinc-300 max-w-[120px] truncate">
                        {item.file?.name ?? "imagen"}
                      </span>

                      {/* DeleteButton — elimina de Cloudinary y de la galería */}
                      {item.status === "success" && (
                        <DeleteButton
                          size="sm"
                          variant="default"
                          aria-label="Eliminar imagen del artículo"
                          onConfirm={() => removeGalleryImage(item.id)}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Indicador de subida activa */}
                {isUploading && (
                  <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Subiendo imagen...
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Imagen Destacada */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Imagen Destacada (URL)
          </label>
          <input
            type="url"
            {...form.register("featured")}
            className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
          {form.formState.errors.featured && (
            <p className="text-red-500 text-xs mt-1">
              {form.formState.errors.featured.message}
            </p>
          )}
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Estado
          </label>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Etiquetas */}
        <div className="col-span-1 md:col-span-2">
          <TagsInput form={form} initialTags={initialData?.tags} />
        </div>
      </div>

      {/* Footer — acciones del formulario */}
      <div className="flex justify-between items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <div>
          {initialData && (
            <DeleteButton
              disabled={isLoading}
              aria-label="Eliminar artículo"
              onConfirm={async () => {
                try {
                  setIsLoading(true);
                  const res = await fetch(`/api/admin/blog/${initialData.id}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) throw new Error("Error al eliminar el artículo");
                  toast.success("Artículo eliminado");
                  router.push("/admin/blog");
                  router.refresh();
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "Error desconocido"
                  );
                  setIsLoading(false);
                }
              }}
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={springs.snap}
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="px-4 h-12 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={springs.snap}
            type="submit"
            disabled={isLoading || isUploading}
            className="bg-purple-600 text-white px-4 h-12 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Artículo"
            )}
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * La lógica de subida de imágenes al editor sigue exactamente el mismo patrón
 * que pet-form y product-form: FileReader → base64 → /api/upload → Cloudinary,
 * con eliminación vía /api/cloudinary/delete usando extractPublicId.
 *
 * La galería de imágenes subidas usa DeleteButton (DESIGN.md §7.1) para la
 * eliminación segura con confirmación in-place y animaciones físicas.
 *
 * El botón "Guardar Artículo" se deshabilita mientras haya una imagen subiendo,
 * evitando envíos incompletos.
 */
