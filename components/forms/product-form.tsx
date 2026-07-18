"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@/lib/validations/product.schema";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { PRODUCT_CATEGORIES, MAX_FILE_SIZE, MAX_IMAGES, ACCEPTED_IMAGE_TYPES_PRODUCTS, CLOUDINARY_FOLDERS } from "@/lib/constants";
import { AiRefineButton } from "@/components/ui/ai-refine-button";
import type { ImageUploadItem } from "@/types/upload.types";
import { extractPublicId } from "@/lib/utils/cloudinary-helpers";
import { useUnsavedImagesGuard } from "@/lib/hooks/use-unsaved-images-guard";
import { LeaveFormConfirmModal } from "@/components/modals/leave-form-confirm-modal";
import { FormTimeoutModal } from "@/components/modals/form-timeout-modal";

/**
 * Formulario para crear o editar productos con soporte para múltiples imágenes,
 * validación de datos y manejo de estado de carga por recurso.
 */

interface ProductFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<CreateProductInput> & { id?: string };
  vendorId: string;
}

/**
 * Construye un ImageUploadItem inicial para imágenes que vienen de initialData
 * (ya subidas a Cloudinary en modo edición). No tienen File asociado.
 */
function buildInitialItem(cloudinaryUrl: string): ImageUploadItem {
  return {
    id: crypto.randomUUID(),
    file: null,
    status: "success",
    cloudinaryUrl,
    error: null,
    previewUrl: cloudinaryUrl,
  };
}

export default function ProductForm({ mode = "create", initialData, vendorId }: ProductFormProps) {
  const router = useRouter();

  // Estado granular: cada imagen mantiene su propio estado de carga y resultado.
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>(
    (initialData?.images || []).map(buildInitialItem)
  );

  // Protección para limpiar recursos pendientes si el usuario abandona el
  // formulario antes de completar el guardado.
  const {
    markAsSubmitted,
    requestNavigation,
    showLeaveModal,
    onCancelLeave,
    onConfirmLeave,
    registerActivity,
    isLocked,
    showTimeoutModal,
  } = useUnsavedImagesGuard({ imageItems, setImageItems });

  // React Hook Form con Zod
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
   * Sincroniza el campo "images" de React Hook Form con las URLs exitosas
   * del estado granular. Solo los items con status "success" y cloudinaryUrl
   * válida forman parte del payload del formulario.
   */
  const syncFormImages = useCallback(
    (items: ImageUploadItem[]) => {
      const successUrls = items
        .filter((item) => item.status === "success" && item.cloudinaryUrl !== null)
        .map((item) => item.cloudinaryUrl as string);
      setValue("images", successUrls, { shouldValidate: true });
    },
    [setValue]
  );

  /**
   * Maneja la selección de imágenes, valida los archivos localmente y crea un
   * registro independiente por cada uno para mostrar el estado de carga.
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validación local previa para descartar archivos demasiado grandes o con
    // formato no admitido antes de iniciar cualquier subida.
    const validFiles: File[] = [];
    const rejectedFiles: { file: File; reason: string }[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        rejectedFiles.push({ file, reason: "excede 5MB" });
      } else if (!(ACCEPTED_IMAGE_TYPES_PRODUCTS as readonly string[]).includes(file.type)) {
        rejectedFiles.push({ file, reason: "formato inválido" });
      } else {
        validFiles.push(file);
      }
    }

    // Validar límite usando solo los archivos válidos
    const availableSlots = MAX_IMAGES - imageItems.filter((i) => i.status !== "error").length;
    if (validFiles.length > availableSlots) {
      toast.error(
        `Solo puedes agregar ${availableSlots} imagen${availableSlots !== 1 ? "es" : ""} más (máximo ${MAX_IMAGES})`
      );
      const surplus = validFiles.splice(availableSlots);
      surplus.forEach(f => rejectedFiles.push({ file: f, reason: "excede el límite de fotos" }));
    }

    if (validFiles.length === 0) {
       if (rejectedFiles.length > 0) {
          const reasons = rejectedFiles.map(r => `"${r.file.name}" (${r.reason})`).join(", ");
          toast.error(`${rejectedFiles.length} imagen(es) rechazada(s): ${reasons}`);
       }
       return;
    }

    // Crear registros iniciales para mostrar la carga en la interfaz de forma
    // inmediata mientras se procesan los archivos.
    const newItems: ImageUploadItem[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "pending",
      cloudinaryUrl: null,
      error: null,
      previewUrl: URL.createObjectURL(file),
    }));

    setImageItems((prev) => [...prev, ...newItems]);

    // Trackear resultados
    let uploadSuccessCount = 0;
    const uploadErrors: string[] = [];

    // Subir cada archivo de forma independiente con estado granular
    const uploadPromises = newItems.map(async (item) => {
      // Marcar como "uploading"
      setImageItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i))
      );

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Error al leer el archivo"));
          reader.readAsDataURL(item.file as File);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, folder: CLOUDINARY_FOLDERS.PRODUCTS }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al subir imagen");
        }

        const data = await response.json();
        const cloudinaryUrl = data.url as string;

        uploadSuccessCount++;
        // Marcar como "success" y registrar actividad para reiniciar el timer de inactividad
        setImageItems((prev) => {
          const updated = prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "success" as const, cloudinaryUrl, error: null }
              : i
          );
          syncFormImages(updated);
          return updated;
        });
        // Una subida exitosa cuenta como actividad aunque el usuario no esté tecleando
        registerActivity();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido";
        uploadErrors.push(`"${item.file?.name}": ${errorMessage}`);

        // Marcar como "error"
        setImageItems((prev) => {
          const updated = prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error" as const, error: errorMessage }
              : i
          );
          syncFormImages(updated);
          return updated;
        });
      }
    });

    // Promise.allSettled: esperar todos sin que un fallo cancele los demás
    await Promise.allSettled(uploadPromises);

    e.target.value = "";

    // Feedback granular final
    if (uploadSuccessCount > 0 && rejectedFiles.length === 0 && uploadErrors.length === 0) {
      toast.success(`${uploadSuccessCount} imagen(es) subida(s) correctamente.`);
    } else {
      let msg = `${uploadSuccessCount} subida(s) con éxito. `;
      if (rejectedFiles.length > 0) {
        msg += `${rejectedFiles.length} rechazada(s) localmente. `;
      }
      if (uploadErrors.length > 0) {
        msg += `${uploadErrors.length} fallida(s) en servidor.`;
      }
      toast.warning(msg);
    }
  };


  /**
   * FUNCIÓN: removeImage
   * Elimina un item del estado granular por su id.
   * Si el item tiene status "success", también elimina la imagen de Cloudinary.
   * Si tiene status "error" o "pending", solo limpia el estado local y revoca la preview.
   */
  const removeImage = async (id: string) => {
    const item = imageItems.find((i) => i.id === id);
    if (!item) return;

    // Revocar el objectURL para liberar memoria del navegador
    if (item.previewUrl && item.file !== null) {
      URL.revokeObjectURL(item.previewUrl);
    }

    // Actualización optimista: quitar de la UI de inmediato
    const newItems = imageItems.filter((i) => i.id !== id);
    setImageItems(newItems);
    syncFormImages(newItems);

    // Solo intentar borrar de Cloudinary si el upload fue exitoso
    if (item.status !== "success" || !item.cloudinaryUrl) return;

    try {
      const publicId = extractPublicId(item.cloudinaryUrl);
      if (!publicId) {
        console.warn("No se pudo extraer el publicId de la URL", item.cloudinaryUrl);
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

      toast.success("Imagen eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando imagen de Cloudinary:", error);
      toast.error("La imagen se quitó del formulario, pero hubo un error al borrarla del servidor.");
    }
  };

  /**
   * FUNCIÓN: onSubmit
   * Envío del formulario a API
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

      // Marcar el envío como completado antes de redirigir para evitar que el
      // guardia intente limpiar recursos que ya quedaron persistidos.
      markAsSubmitted();

      // Redireccionar después de 1.5 segundos
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

  // Items en proceso de subida (para deshabilitar botón de submit e input)
  const isUploadingAny = imageItems.some((i) => i.status === "uploading" || i.status === "pending");
  // Slots disponibles basados solo en items exitosos
  const successCount = imageItems.filter((i) => i.status === "success").length;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      onInput={registerActivity}
      className="space-y-6"
    >

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
            disabled={isLocked}
            placeholder="Ej: Alimento Premium"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isLocked}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isLocked}
              min="0"
              placeholder="Ej: 50"
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={isLocked}
            min="0"
            step="1"
            placeholder="Ej: 25000"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              disabled={isLocked}
              rows={5}
              placeholder="Descripción detallada del producto. Mínimo 20 caracteres."
              className="text-black w-full px-4 py-2 pb-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          Sube entre 1 y {MAX_IMAGES} imágenes. Formatos: JPEG, PNG, WEBP. Máximo 5MB por imagen.
        </p>

        {/* Grid de imágenes con estado granular */}
        {imageItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imageItems.map((item, index) => (
              <div key={item.id} className="relative group">
                {/* Preview de la imagen */}
                {item.previewUrl && (
                  <Image
                    src={item.previewUrl}
                    alt={`Imagen producto ${index + 1}`}
                    width={300}
                    height={300}
                    className={`w-full h-32 object-cover rounded-lg border-2 transition-all ${
                      item.status === "error"
                        ? "border-red-400 opacity-60"
                        : item.status === "success"
                        ? "border-green-300"
                        : "border-gray-200"
                    }`}
                  />
                )}

                {/* Overlay de estado: subiendo */}
                {(item.status === "uploading" || item.status === "pending") && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}

                {/* Overlay de estado: error */}
                {item.status === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/60 rounded-lg p-1">
                    <AlertCircle className="w-5 h-5 text-red-300 mb-1" />
                    <span className="text-xs text-red-200 text-center leading-tight line-clamp-2">
                      {item.error}
                    </span>
                  </div>
                )}

                {/* Botón de eliminar */}
                <button
                  type="button"
                  onClick={() => removeImage(item.id)}
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
        {successCount < MAX_IMAGES && (
          <div>
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              {isUploadingAny ? (
                <>
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <span className="text-sm font-medium text-purple-600">Subiendo imágenes...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {successCount === 0 ? "Subir imágenes (mínimo 1)" : "Agregar más imágenes"}
                  </span>
                </>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES_PRODUCTS.join(",")}
              multiple
              onChange={handleImageUpload}
              disabled={isUploadingAny || isLocked}
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
          onClick={() => requestNavigation()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || isLocked}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploadingAny || isLocked}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span>{mode === "create" ? "Publicando..." : "Guardando..."}</span>
          ) : (
            <span>{mode === "create" ? "Publicar Producto" : "Guardar Cambios"}</span>
          )}
        </button>
      </div>

      {/* Modal de confirmación de abandono */}
      <LeaveFormConfirmModal
        isOpen={showLeaveModal}
        onCancel={onCancelLeave}
        onConfirm={onConfirmLeave}
      />

      {/* Modal de tiempo límite de inactividad */}
      <FormTimeoutModal isOpen={showTimeoutModal} />
    </form>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este formulario mezcla validación, subida de imágenes y protección frente a
 * abandono del proceso. Si se cambian los estados de carga o los mensajes de
 * error, conviene conservar una experiencia coherente para el usuario.
 */
