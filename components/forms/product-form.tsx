"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/product.schema";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from 'next/image';

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
        watch,
    } = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: initialData?.name || "",
            price: initialData?.price || 0,
            stock: initialData?.stock || 0,
            category: initialData?.category || "",
            description: initialData?.description || "",
            images: initialData?.images || [],
            vendorId,
        },
    });

    /**
     *  FUNCIÓN: handleImageUpload
     *  Upload de imágenes a Cloudinary
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        //  Validar límite de 5 imágenes
        if (images.length + files.length > 5) {
            toast.error("Máximo 5 fotos permitidas");
            return;
        }

        setUploadingImages(true);

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                //  Validar tamaño
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`${file.name} excede 5MB`);
                }

                //  Validar formato
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                    throw new Error(`${file.name} debe ser JPEG, PNG o WEBP`);
                }

                //  Convertir a base64
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error("Error al leer archivo"));
                    reader.readAsDataURL(file);
                });

                //  Upload a Cloudinary via API
                const response = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64, folder: "products" }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || "Error al subir imagen");
                }

                const data = await response.json();
                return data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            const newImages = [...images, ...uploadedUrls];
            setImages(newImages);
            setValue("images", newImages, { shouldValidate: true });
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error(error instanceof Error ? error.message : "Error al subir imágenes");
        } finally {
            setUploadingImages(false);
        }
    };

    /**
     *  FUNCIÓN: removeImage
     *  Eliminar imagen del array
     */
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setValue("images", newImages, { shouldValidate: true });
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
                `¡Producto ${mode === "create" ? "publicado" : "actualizada"} exitosamente!`,
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                            <option value="alimento">Alimento</option>
                            <option value="juguetes">Juguetes</option>
                            <option value="accesorios">Accesorios</option>
                            <option value="higiene">Higiene</option>
                            <option value="medicamentos">Medicamentos</option>
                            <option value="otros">Otros</option>
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
                        step="0.01"
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
                    <textarea
                        {...register("description")}
                        id="description"
                        rows={5}
                        placeholder="Descripción detallada del producto. Mínimo 20 caracteres."
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
                    />
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
                {images.length < 5 && (
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
 * - handleImageUpload: Orquesta la subida de assets a Cloudinary antes del registro final.
 * - Validación Zod: Garantiza que el precio, stock y categoría sean válidos.
 * - Comportamiento Dual: Funciona tanto para creación como para edición (POST/PUT).
 *
 * Dependencias Externas:
 * - react-hook-form: Motor de gestión de estados del formulario.
 * - sonner: Framework de notificaciones para retroalimentación visual.
 * - lucide-react: Set de iconos para la interfaz.
 *
 */
