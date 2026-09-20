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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion/springs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteButton } from "@/components/ui/delete-button";
import { Input } from "@/components/ui/input";
import { InputErrorMessage } from "@/components/ui/input-error-message";
import { Loader2, AlertCircle, X, Upload } from "lucide-react";
import { MAX_FILE_SIZE, CLOUDINARY_FOLDERS } from "@/lib/constants";
import type { ImageUploadItem } from "@/types/upload.types";
import { extractPublicId } from "@/lib/utils/cloudinary-helpers";
import { useUnsavedImagesGuard } from "@/lib/hooks/use-unsaved-images-guard";
import { LeaveFormConfirmModal } from "@/components/modals/leave-form-confirm-modal";
import { FormTimeoutModal } from "@/components/modals/form-timeout-modal";
import { cn } from "@/lib/utils";

/**
 * Ruta/Componente/Servicio: Componente BlogForm
 * Descripción: Formulario de creación y edición de artículos del blog con Surface 2 Glassmorphic y DeleteButton.
 * Requiere: Objeto initialData opcional para modo edición.
 * Implementa: DESIGN.md §1 (Surface 2), §3 (Contrato de Formularios), §5 y §7.1 (DeleteButton).
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
  const tags = form.watch("tags") || [];

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, i) => i !== indexToRemove);
    form.setValue("tags", newTags, { shouldValidate: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = inputValue.trim();
      if (val && !tags.includes(val)) {
        if (tags.length >= 5) {
          toast.error("Máximo 5 etiquetas.");
          return;
        }
        form.setValue("tags", [...tags, val], { shouldValidate: true });
        setInputValue("");
      }
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(",")) {
      const parts = val.split(",").map((p) => p.trim());
      const newTags = [...tags];
      parts.forEach((t, i) => {
        if (newTags.length >= 5) return;
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

  const hasTagsError = !!form.formState.errors.tags;

  return (
    <>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
        Etiquetas (presiona coma o Enter para añadir)
      </label>
      <div 
        className={cn(
          "flex flex-wrap items-center gap-2 min-h-[40px] w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-zinc-950 transition-[color,background-color,border-color,box-shadow] duration-150 cursor-text",
          hasTagsError
            ? "border-red-400 focus-within:ring-red-500"
            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 focus-within:ring-purple-600"
        )}
        onClick={(e) => {
          const input = e.currentTarget.querySelector('input');
          if (input) input.focus();
        }}
      >
        <AnimatePresence>
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springs.snap}
              className="inline-flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snap}
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors focus:outline-none"
                aria-label={`Eliminar etiqueta ${tag}`}
              >
                <X className="w-3 h-3" />
              </motion.button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Ej: nutrición, salud, perros..." : ""}
          className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          disabled={tags.length >= 5}
        />
      </div>
      <InputErrorMessage
        id="tags-error"
        message={form.formState.errors.tags?.message}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// BlogForm — componente principal
// ---------------------------------------------------------------------------

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const prefersReduced = useReducedMotion() ?? false;
  const [isLoading, setIsLoading] = useState(false);

  // Estado granular de la imagen actualmente en proceso de subida al editor
  // (idéntico al patrón de pet-form y product-form)
  const [editorImageItem, setEditorImageItem] =
    useState<ImageUploadItem | null>(null);

  // Galería de imágenes insertadas en el artículo (para gestionar su eliminación)
  const [galleryItems, setGalleryItems] = useState<ImageUploadItem[]>([]);

  // Estado de la imagen destacada
  const [featuredItems, setFeaturedItems] = useState<ImageUploadItem[]>(
    initialData?.featured
      ? [
          {
            id: crypto.randomUUID(),
            file: null,
            status: "success",
            cloudinaryUrl: initialData.featured,
            error: null,
            previewUrl: initialData.featured,
          },
        ]
      : []
  );

  // Protección para limpiar imágenes no guardadas al salir o recargar
  const {
    markAsSubmitted,
    requestNavigation,
    showLeaveModal,
    onCancelLeave,
    onConfirmLeave,
    registerActivity,
    isLocked,
    showTimeoutModal,
  } = useUnsavedImagesGuard({ 
    imageItems: [...galleryItems, ...featuredItems], 
    setImageItems: (items) => {
      setGalleryItems(items.filter(i => galleryItems.some(g => g.id === i.id)));
      setFeaturedItems(items.filter(i => featuredItems.some(f => f.id === i.id)));
    } 
  });

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
      toast.success("Imagen eliminada correctamente.");
    } catch (error) {
      console.error("Error eliminando imagen de Cloudinary:", error);
      toast.error("La imagen se quitó de la galería, pero hubo un error al borrarla del servidor.");
    }
  }, [galleryItems]);

  // ---------------------------------------------------------------------------
  // Imagen Destacada
  // ---------------------------------------------------------------------------

  const handleFeaturedImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setFeaturedItems([{ ...newItem, status: "uploading" }]);

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

      setFeaturedItems([
        {
          ...newItem,
          status: "success",
          cloudinaryUrl,
        },
      ]);
      
      form.setValue("featured", cloudinaryUrl, { shouldValidate: true });
      toast.success("Imagen destacada subida.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setFeaturedItems([{ ...newItem, status: "error", error: errorMessage }]);
      toast.error(`No se pudo subir la imagen: ${errorMessage}`);
    } finally {
      e.target.value = "";
    }
  }, [form]);

  const removeFeaturedImage = useCallback(async (id: string) => {
    const item = featuredItems.find((i) => i.id === id);
    if (!item) return;

    if (item.previewUrl && item.file !== null) {
      URL.revokeObjectURL(item.previewUrl);
    }

    setFeaturedItems([]);
    form.setValue("featured", "", { shouldValidate: true });

    if (item.status !== "success" || !item.cloudinaryUrl) return;

    try {
      const publicId = extractPublicId(item.cloudinaryUrl);
      if (!publicId) return;

      const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId, url: item.cloudinaryUrl }),
      });
      if (!response.ok) throw new Error("Error al eliminar la imagen");
      toast.success("Imagen destacada eliminada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido");
    }
  }, [featuredItems, form]);

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
      markAsSubmitted();
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
    <>
      <motion.form
        onInput={registerActivity}
        onSubmit={form.handleSubmit(onSubmit)}
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 16 }}
        animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
        transition={prefersReduced ? { duration: 0 } : springs.modal}
        className="space-y-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-8 relative overflow-hidden"
      >
      {/* Luz ambiental — obligatoria en toda Surface 2 */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Título */}
        <div className="col-span-1 md:col-span-2">
          <Input
            id="title"
            label="Título *"
            type="text"
            placeholder="Título del artículo"
            error={form.formState.errors.title?.message}
            {...form.register("title")}
          />
        </div>

        {/* Descripción */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Descripción del post *
          </label>
          <textarea
            {...form.register("excerpt")}
            aria-invalid={!!form.formState.errors.excerpt}
            aria-describedby={form.formState.errors.excerpt ? "excerpt-error" : undefined}
            className={cn(
              "w-full rounded-xl border bg-transparent p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 transition-[color,background-color,border-color,box-shadow] duration-150 min-h-[5rem]",
              form.formState.errors.excerpt
                ? "border-red-400 focus-visible:ring-red-500 text-red-900 dark:text-red-200"
                : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 focus-visible:ring-purple-600"
            )}
            placeholder="Breve resumen del artículo"
          />
          <InputErrorMessage
            id="excerpt-error"
            message={form.formState.errors.excerpt?.message}
          />
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
          <InputErrorMessage
            id="content-error"
            message={form.formState.errors.content?.message}
          />

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
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Imagen Destacada
          </label>
          <p className="text-xs text-zinc-500 mb-3">
            Opcional. Sube 1 foto para encabezar el artículo. Formatos: JPEG, PNG, WEBP.
          </p>

          {/* Grid de imagen destacada (max 1) */}
          <div className="space-y-4">
            {featuredItems.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredItems.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Preview de la imagen */}
                    {item.previewUrl && (
                      <Image
                        src={item.previewUrl}
                        alt="Imagen Destacada"
                        width={150}
                        height={150}
                        className={cn(
                          "w-full h-32 object-cover rounded-xl border-2 transition-colors duration-150",
                          item.status === "error"
                            ? "border-red-400 opacity-60"
                            : item.status === "success"
                            ? "border-green-300 dark:border-green-800"
                            : "border-zinc-200 dark:border-zinc-700"
                        )}
                      />
                    )}

                    {/* Overlay de estado: subiendo */}
                    {(item.status === "uploading" || item.status === "pending") && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}

                    {/* Overlay de estado: error */}
                    {item.status === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 rounded-xl p-1">
                        <AlertCircle className="w-5 h-5 text-red-300 mb-1" />
                        <span className="text-xs text-red-200 text-center leading-tight line-clamp-2">
                          {item.error}
                        </span>
                      </div>
                    )}

                    {/* DeleteButton — eliminación segura in-place */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <DeleteButton
                        size="sm"
                        variant="destructive"
                        aria-label="Eliminar foto destacada"
                        onConfirm={() => removeFeaturedImage(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botón de upload */}
            {featuredItems.length === 0 && (
              <div>
                <label
                  htmlFor="featured-upload"
                  className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors"
                >
                  <Upload className="w-6 h-6 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Seleccionar imagen
                  </span>
                </label>
                <input
                  id="featured-upload"
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES_BLOG.join(",")}
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                />
              </div>
            )}
            
            <input type="hidden" {...form.register("featured")} />
            <InputErrorMessage
              id="featured-error"
              message={form.formState.errors.featured?.message}
            />
          </div>
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
                <SelectTrigger className="h-10 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 transition-[color,background-color,border-color,box-shadow] duration-150">
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
              variant="destructive"
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
            whileHover={{ scale: isLocked ? 1 : 1.01 }}
            whileTap={{ scale: isLocked ? 1 : 0.97 }}
            transition={springs.snap}
            type="button"
            disabled={isLocked}
            onClick={() => requestNavigation("/admin/blog")}
            className="px-4 h-12 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </motion.button>
          <motion.button
            whileHover={{
              scale: isLoading || isUploading || isLocked ? 1 : 1.01,
            }}
            whileTap={{
              scale: isLoading || isUploading || isLocked ? 1 : 0.97,
            }}
            transition={springs.snap}
            type="submit"
            disabled={isLoading || isUploading || isLocked}
            className="bg-purple-600 text-white px-4 h-12 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 flex items-center gap-2"
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

    <LeaveFormConfirmModal
      isOpen={showLeaveModal}
      onCancel={onCancelLeave}
      onConfirm={onConfirmLeave}
    />

    <FormTimeoutModal isOpen={showTimeoutModal} />
  </>
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
