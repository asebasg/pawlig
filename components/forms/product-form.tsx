"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/product.schema";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from 'next/image';
import { PRODUCT_CATEGORIES, MAX_FILE_SIZE, MAX_IMAGES, ACCEPTED_IMAGE_TYPES_PRODUCTS, CLOUDINARY_FOLDERS } from "@/lib/constants";
import { AiRefineButton } from "@/components/ui/ai-refine-button";

/**
 * POST /api/products
 * PUT /api/products/[id]
 * Descripción: Formulario para la gestión de productos comerciales, con soporte para múltiples imágenes y categorías.
 * Requiere: Sesión de usuario con rol VENDOR.
 * Implementa: HU-010 (Gestión de productos comerciales).
 */

interface ProductFormProps {
    mode?: "create" | "edit";
    initialData?: Partial<CreateProductInput> & { id?: string };
    vendorId: string;
}

export default function ProductForm({ mode = "create", initialData, vendorId }: ProductFormProps) {
    const router = useRouter();


    //  Estados del componente
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [uploadingImages, setUploadingImages] = useState(false);

    //  React Hook Form con Zod
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        watch,
    } = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: initialData?.name || "",
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            category: initialData?.category,
            description: initialData?.description || "",
            images: initialData?.images || [],
            vendorId,
        },
    });

    /**
     * FUNCIÓN: handleImageUpload
     * Valida archivos localmente ANTES de subir a Cloudinary (Fix Issue #161 - Fase 1).
     * Separa en validFiles y rejectedFiles para que los errores parciales no bloqueen
     * las imágenes correctas. Usa Promise.allSettled para mantener uploads exitosos
     * aunque alguno falle en Cloudinary.
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // FASE 1: Validación síncrona previa — ningún archivo sube sin pasar este filtro
      const validFiles: File[] = [];
      const rejectedFiles: { file: File; reason: string }[] = [];

      for (const file of Array.from(files)) {
        if (file.size > MAX_FILE_SIZE) {
          rejectedFiles.push({ file, reason: "excede el tamaño máximo de 5MB" });
        } else if (!(ACCEPTED_IMAGE_TYPES_PRODUCTS as readonly string[]).includes(file.type)) {
          rejectedFiles.push({ file, reason: "formato no permitido (solo JPEG, PNG o WEBP)" });
        } else {
          validFiles.push(file);
        }
      }

      // Notificar rechazos inmediatamente, antes de cualquier llamada a la red
      for (const { file, reason } of rejectedFiles) {
        toast.error(`"${file.name}" ${reason}`);
      }

      // Validar límite usando solo los archivos válidos
      const availableSlots = MAX_IMAGES - images.length;
      if (validFiles.length > availableSlots) {
        toast.error(`Solo puedes agregar ${availableSlots} imagen${availableSlots !== 1 ? "es" : ""} más (máximo ${MAX_IMAGES})`);
        validFiles.splice(availableSlots);
      }

      if (validFiles.length === 0) return;

      setUploadingImages(true);

      try {
        const uploadPromises = validFiles.map(async (file) => {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Error al leer archivo"));
            reader.readAsDataURL(file);
          });

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64, folder: CLOUDINARY_FOLDERS.PRODUCTS }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al subir imagen");
          }

          const data = await response.json();
          return data.url as string;
        });

        // Promise.allSettled: un fallo en Cloudinary no cancela las demás subidas
        const results = await Promise.allSettled(uploadPromises);

        const uploadedUrls: string[] = [];
        for (const result of results) {
          if (result.status === "fulfilled") {
            uploadedUrls.push(result.value);
          } else {
            const reason = result.reason instanceof Error ? result.reason.message : "Error desconocido";
            toast.error(`Error al subir una imagen en el servidor: ${reason}`);
          }
        }

        if (uploadedUrls.length > 0) {
          const newImages = [...images, ...uploadedUrls];
          setImages(newImages);
          setValue("images", newImages, { shouldValidate: true });
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error(error instanceof Error ? error.message : "Error al subir imágenes");
      } finally {
        setUploadingImages(false);
        e.target.value = "";
      }
    };

    /**
     * Extrae el publicId de una URL de Cloudinary
     */
    const extractPublicId = (cloudinaryUrl: string): string | null => {
        try {
            const url = new URL(cloudinaryUrl);
            const pathParts = url.pathname.split('/');
            const pawligIndex = pathParts.findIndex(p => p === 'pawlig');
            if (pawligIndex === -1) return null;
            
            const publicIdWithExt = pathParts.slice(pawligIndex).join('/');
            const lastDotIndex = publicIdWithExt.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                return publicIdWithExt.substring(0, lastDotIndex);
            }
            return publicIdWithExt;
        } catch {
            return null;
        }
    };

    /**
     *  FUNCIÓN: removeImage
     *  Eliminar imagen del array y de Cloudinary
     */
    const removeImage = async (index: number) => {
        const urlToRemove = images[index];
        if (!urlToRemove) return;

        // Actualización optimista de UI
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setValue("images", newImages, { shouldValidate: true });

        try {
            const publicId = extractPublicId(urlToRemove);
            if (!publicId) {
                console.warn("No se pudo extraer el publicId de la URL", urlToRemove);
                return;
            }

            const response = await fetch("/api/cloudinary/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicId, url: urlToRemove }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al eliminar la imagen");
            }
            
            toast.success("Imagen eliminada correctamente");
        } catch (error) {
            console.error("Error eliminando imagen de Cloudinary:", error);
            toast.error("La imagen se quitó del formulario, pero hubo un error al borrarla del servidor.");
        }
    };

    /**
     *  FUNCIÓN: onSubmit
     *  Envío del formulario a API
     */
    const onSubmit = async (data: CreateProductInput) => {
        const toastId = toast.loading(mode === "create" ? "Publicando producto..." : "Guardando cambios...");

        try {
            const url = mode === "create"
                ? "/api/products"
                : `/api/products/${initialData?.id}`;

            const method = mode === "create" ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Error al publicar el producto");
            }

            toast.success(
                `¡Producto ${mode === "create" ? "publicado" : "actualizado"} exitosamente!`,
                { id: toastId }
            );

            //  Redireccionar después de 1.5 segundos
            setTimeout(() => {
                router.push("/vendor/products");
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error instanceof Error ? error.message : "Error inesperado", { id: toastId });
        }
    };

    const onInvalid = (errors: FieldErrors<CreateProductInput>) => {
        console.error("Validation Errors:", errors);
        toast.error("Por favor, revisa los campos marcados en rojo.");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">

            {/* SECCIÓN 1: DATOS BÁSICOS */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Datos Básicos</h3>

                {/* Nombre */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del producto <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("name")}
                        type="text"
                        id="name"
                        placeholder="Ej: Alimento Premium"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("category")}
                            id="category"
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Seleccionar categoría</option>
                            {Object.entries(PRODUCT_CATEGORIES).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Stock */}
                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock disponible <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("stock", { valueAsNumber: true })}
                            type="number"
                            id="stock"
                            min="0"
                            placeholder="Ej: 50"
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.stock && (
                            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                        )}
                    </div>
                </div>

                {/* Precio */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Precio ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("price", { valueAsNumber: true })}
                        type="number"
                        id="price"
                        min="0"
                        step="1"
                        placeholder="Ej: 25000"
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                </div>
            </div>

            {/* SECCIÓN 2: DESCRIPCIÓN */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Detalles</h3>

                {/* Descripción */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <textarea
                            {...register("description")}
                            id="description"
                            rows={5}
                            placeholder="Descripción detallada del producto. Mínimo 20 caracteres."
                            className="text-black w-full px-4 py-2 pb-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
                        />
                        <AiRefineButton
                            currentText={getValues("description") ?? ""}
                            onRefined={(text) => setValue("description", text, { shouldValidate: true })}
                            type="product"
                            minLength={20}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Caracteres: {watch("description")?.length || 0} / 1000
                    </p>
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                </div>
            </div>

            {/* SECCIÓN 3: IMÁGENES */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Imágenes del Producto <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-gray-600">
                    Sube entre 1 y 5 imágenes. Formatos: JPEG, PNG, WEBP. Máximo 5MB por imagen.
                </p>

                {/* Grid de imágenes subidas */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {images.map((url, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={url}
                                    alt={`Imagen producto ${index + 1}`}
                                    width={300}
                                    height={300}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Eliminar imagen"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botón de upload */}
                {images.length < MAX_IMAGES && (
                    <div>
                        <label
                            htmlFor="image-upload"
                            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                        >
                            {uploadingImages ? (
                                <>
                                    <span className="text-sm font-medium text-purple-600">Subiendo imágenes...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {images.length === 0 ? "Subir imágenes (mínimo 1)" : "Agregar más imágenes"}
                                    </span>
                                </>
                            )}
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
                            className="hidden"
                        />
                    </div>
                )}

                {errors.images && (
                    <p className="text-sm text-red-600">{errors.images.message}</p>
                )}
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-4 pt-6 border-t">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || uploadingImages}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <span>{mode === "create" ? "Publicando..." : "Guardando..."}</span>
                        </>
                    ) : (
                        <span>{mode === "create" ? "Publicar Producto" : "Guardar Cambios"}</span>
                    )}
                </button>
            </div>
        </form>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Formulario reutilizable para la gestión de productos, con soporte para
 * subida de imágenes y validación en tiempo real.
 *
 * Lógica Clave:
 * - handleImageUpload (Fix Issue #161 - Fase 1): Valida tamaño (MAX_FILE_SIZE) y tipo
 *   MIME de forma sincrona ANTES de cualquier llamada a la red. Separa los archivos en
 *   validFiles y rejectedFiles. Solo los validos suben a Cloudinary. Usa
 *   Promise.allSettled para que un fallo individual no descarte los uploads exitosos.
 * - Validacion Zod: Garantiza que el precio, stock y categoria sean validos.
 * - Comportamiento Dual: Funciona tanto para creacion como para edicion (POST/PUT).
 *
 * Dependencias Externas:
 * - react-hook-form: Motor de gestión de estados del formulario.
 * - sonner: Framework de notificaciones para retroalimentación visual.
 * - lucide-react: Set de iconos para la interfaz.
 *
 */
