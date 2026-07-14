"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPetSchema, PetSpecies, PetSex, type CreatePetInput } from "@/lib/validations/pet.schema";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { AiRefineButton } from "@/components/ui/ai-refine-button";
import { MAX_FILE_SIZE, MAX_IMAGES, ACCEPTED_IMAGE_TYPES_PETS, CLOUDINARY_FOLDERS } from "@/lib/constants";
import type { ImageUploadItem } from "@/types/upload.types";

/**
 * POST /api/pets
 * PUT /api/pets/[id]
 * Descripción: Formulario para la creación y edición de perfiles de mascotas con soporte para múltiples imágenes.
 * Requiere: Identificador del refugio (shelterId).
 * Implementa: HU-005 (Publicación y gestión de mascota).
 */

interface PetFormProps {
  mode?: "create" | "edit";
  initialData?: Partial<CreatePetInput> & { id?: string };
  shelterId: string;
}

/**
 * Construye un ImageUploadItem inicial para imágenes que vienen de initialData
 * (ya subidas a Cloudinary en edición). No tienen File asociado.
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

export default function PetForm({ mode = "create", initialData, shelterId }: PetFormProps) {
  const router = useRouter();

  // Estado granular: cada imagen tiene su propio ciclo de vida (Issue #161 - Fase 2)
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>(
    (initialData?.images || []).map(buildInitialItem)
  );

  // React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
  } = useForm<CreatePetInput>({
    resolver: zodResolver(createPetSchema),
    defaultValues: {
      name: initialData?.name || "",
      species: initialData?.species || PetSpecies.DOG,
      breed: initialData?.breed || "",
      age: initialData?.age || undefined,
      months: initialData?.months || undefined,
      sex: initialData?.sex || PetSex.MALE,
      description: initialData?.description || "",
      requirements: initialData?.requirements || "",
      images: initialData?.images || [],
      shelterId,
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
   * Actualiza un item concreto en el estado granular por su id y
   * re-sincroniza el campo de imágenes del formulario.
   */
  const updateItem = useCallback(
    (id: string, patch: Partial<ImageUploadItem>, currentItems: ImageUploadItem[]) => {
      const updated = currentItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      );
      setImageItems(updated);
      syncFormImages(updated);
      return updated;
    },
    [syncFormImages]
  );

  /**
   * FUNCIÓN: handleImageUpload
   * Fase 1 (Issue #161): Valida tamaño y MIME de forma síncrona ANTES
   * de cualquier llamada a la red. Separa en validFiles / rejectedFiles.
   * Fase 2 (Issue #161): Cada archivo válido genera su propio ImageUploadItem
   * con ciclo de vida granular (pending → uploading → success | error).
   * Usa Promise.allSettled para que un fallo individual no cancele los demás.
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // FASE 1: Validación síncrona previa
    const validFiles: File[] = [];
    const rejectedFiles: { file: File; reason: string }[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        rejectedFiles.push({ file, reason: "excede 5MB" });
      } else if (!(ACCEPTED_IMAGE_TYPES_PETS as readonly string[]).includes(file.type)) {
        rejectedFiles.push({ file, reason: "formato inválido" });
      } else {
        validFiles.push(file);
      }
    }

    // Validar límite usando solo los archivos válidos
    const availableSlots = MAX_IMAGES - imageItems.filter((i) => i.status !== "error").length;
    if (validFiles.length > availableSlots) {
      toast.error(
        `Solo puedes agregar ${availableSlots} foto${availableSlots !== 1 ? "s" : ""} más (máximo ${MAX_IMAGES})`
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

    // FASE 2: Crear items en estado "pending" inmediatamente para mostrar en la UI
    const newItems: ImageUploadItem[] = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "pending",
      cloudinaryUrl: null,
      error: null,
      previewUrl: URL.createObjectURL(file),
    }));

    const allItems = [...imageItems, ...newItems];
    setImageItems(allItems);

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
          body: JSON.stringify({ image: base64, folder: CLOUDINARY_FOLDERS.PETS }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al subir imagen");
        }

        const data = await response.json();
        const cloudinaryUrl = data.url as string;

        uploadSuccessCount++;
        // Marcar como "success"
        setImageItems((prev) => {
          const updated = prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "success" as const, cloudinaryUrl, error: null }
              : i
          );
          syncFormImages(updated);
          return updated;
        });
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
   * Extrae el publicId de una URL de Cloudinary
   */
  const extractPublicId = (cloudinaryUrl: string): string | null => {
    try {
      const url = new URL(cloudinaryUrl);
      const pathParts = url.pathname.split("/");
      const pawligIndex = pathParts.findIndex((p) => p === "pawlig");
      if (pawligIndex === -1) return null;

      const publicIdWithExt = pathParts.slice(pawligIndex).join("/");
      const lastDotIndex = publicIdWithExt.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        return publicIdWithExt.substring(0, lastDotIndex);
      }
      return publicIdWithExt;
    } catch {
      return null;
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
  const onSubmit = async (data: CreatePetInput) => {
    const toastId = toast.loading(mode === "create" ? "Publicando mascota..." : "Guardando cambios...");

    try {
      const url = mode === "create" ? "/api/pets" : `/api/pets/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...data,
        age: data.age == null ? 0 : data.age,
        months: data.months === undefined ? null : data.months,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar mascota");
      }

      toast.success(
        `¡Mascota ${mode === "create" ? "publicada" : "actualizada"} exitosamente!`,
        { id: toastId }
      );

      // Redireccionar después de 1.5 segundos
      setTimeout(() => {
        router.push("/shelter/pets");
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "Error inesperado", { id: toastId });
    }
  };

  // Items que se muestran en la galería (todos excepto los rechazados antes del upload)
  const visibleItems = imageItems;
  // Items en proceso de subida (para deshabilitar el botón de submit)
  const isUploadingAny = imageItems.some((i) => i.status === "uploading" || i.status === "pending");
  // Slots disponibles basados en items no fallidos
  const successCount = imageItems.filter((i) => i.status === "success").length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* SECCIÓN 1: DATOS BÁSICOS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Datos Básicos</h3>

        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la mascota <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            placeholder="Ej: Luna"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>

        {/* Especie */}
        <div>
          <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
            Especie <span className="text-red-500">*</span>
          </label>
          <select
            {...register("species")}
            id="species"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value={PetSpecies.DOG}>Perro</option>
            <option value={PetSpecies.CAT}>Gato</option>
            <option value={PetSpecies.OTHER}>Otro</option>
          </select>
          {errors.species && <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>}
        </div>

        {/* Raza */}
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-1">
            Raza
          </label>
          <input
            {...register("breed")}
            type="text"
            id="breed"
            placeholder="Ej: Labrador, Cruce, Desconocida"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {errors.breed && <p className="mt-1 text-sm text-red-600">{errors.breed.message}</p>}
        </div>

        {/* Grid: Edad y Sexo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Edad (Años y Meses) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Edad (años)
              </label>
              <input
                {...register("age", { setValueAs: (v) => v === "" ? 0 : Number(v) })}
                type="number"
                id="age"
                min="0"
                max="30"
                placeholder="Años"
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
            </div>
            <div>
              <label htmlFor="months" className="block text-sm font-medium text-gray-700 mb-1">
                Meses
              </label>
              <input
                {...register("months", { setValueAs: (v) => v === "" ? null : Number(v) })}
                type="number"
                id="months"
                min="0"
                max="11"
                placeholder="Meses"
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {errors.months && <p className="mt-1 text-sm text-red-600">{errors.months.message}</p>}
            </div>
          </div>

          {/* Sexo */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
              Sexo
            </label>
            <select
              {...register("sex")}
              id="sex"
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value={PetSex.MALE}>Macho</option>
              <option value={PetSex.FEMALE}>Hembra</option>
            </select>
            {errors.sex && <p className="mt-1 text-sm text-red-600">{errors.sex.message}</p>}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: DESCRIPCIÓN */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>

        {/* Descripción detallada */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción detallada <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              {...register("description")}
              id="description"
              rows={5}
              placeholder="Describe el carácter, personalidad y comportamiento de la mascota. Mínimo 20 caracteres."
              className="text-black w-full px-4 py-2 pb-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
            />
            <AiRefineButton
              currentText={getValues("description") ?? ""}
              onRefined={(text) => setValue("description", text, { shouldValidate: true })}
              type="pet"
              minLength={20}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Caracteres: {watch("description")?.length || 0} / 1000 (mínimo 20)
          </p>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Requisitos de adopción */}
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
            Requisitos de adopción
          </label>
          <textarea
            {...register("requirements")}
            id="requirements"
            rows={3}
            placeholder="Requisitos específicos para adopción (espacio, experiencia, otras mascotas, etc.)"
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
          />
          <p className="mt-1 text-xs text-gray-500">Opcional. Máximo 500 caracteres.</p>
          {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements.message}</p>}
        </div>
      </div>

      {/* SECCIÓN 3: FOTOS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Fotos <span className="text-red-500">*</span>
        </h3>
        <p className="text-sm text-gray-600">
          Sube entre 1 y {MAX_IMAGES} fotos de la mascota. Formatos: JPEG, PNG. Máximo 5MB por foto.
        </p>

        {/* Grid de imágenes con estado granular */}
        {visibleItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {visibleItems.map((item, index) => (
              <div key={item.id} className="relative group">
                {/* Preview de la imagen */}
                {item.previewUrl && (
                  <Image
                    src={item.previewUrl}
                    alt={`Foto ${index + 1}`}
                    width={150}
                    height={150}
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
                  aria-label="Eliminar foto"
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
                  <span className="text-sm font-medium text-purple-600">Subiendo fotos...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {successCount === 0 ? "Subir fotos (mínimo 1)" : "Agregar más fotos"}
                  </span>
                </>
              )}
            </label>
            <input
              id="image-upload"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES_PETS.join(",")}
              multiple
              onChange={handleImageUpload}
              disabled={isUploadingAny}
              className="hidden"
            />
          </div>
        )}

        {errors.images && <p className="text-sm text-red-600">{errors.images.message}</p>}
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
          disabled={isSubmitting || isUploadingAny}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <span>{mode === "create" ? "Publicando..." : "Guardando..."}</span>
          ) : (
            <span>{mode === "create" ? "Publicar Mascota" : "Guardar Cambios"}</span>
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
 * Este formulario integral permite la gestión de mascotas, incluyendo la carga
 * asíncrona de imágenes y validaciones robustas mediante esquemas de Zod.
 *
 * Lógica Clave:
 * - Estado Granular (Fix Issue #161 - Fase 2): Se reemplazó el estado plano
 *   string[] por ImageUploadItem[], donde cada imagen tiene su propio ciclo de
 *   vida (pending, uploading, success, error). Esto permite mostrar previews
 *   inmediatos, spinners por imagen, mensajes de error individuales y que las
 *   imágenes exitosas persistan aunque otras fallen.
 * - Validación Previa (Fix Issue #161 - Fase 1): Se valida tamaño y MIME de
 *   forma síncrona ANTES de abrir cualquier conexión a la red. Solo los
 *   archivos que pasan el filtro local entran al flujo de upload.
 * - syncFormImages: Función auxiliar que mantiene el campo "images" de
 *   React Hook Form siempre sincronizado con las URLs exitosas del estado
 *   granular, garantizando que el payload del submit solo contenga URLs válidas.
 * - updateItem: Utilidad para parchear un item por id y re-sincronizar.
 * - Promise.allSettled: Cada imagen sube de forma independiente; un fallo en
 *   Cloudinary no cancela los uploads en curso.
 * - Modo Dual: Soporta creación y edición mediante lógicas condicionadas por el 'mode'.
 * - buildInitialItem: Hidrata el estado granular con imágenes preexistentes
 *   (modo edición), marcándolas como "success" directamente.
 *
 * Dependencias Externas:
 * - cloudinary (via API): Para almacenamiento optimizado de imágenes.
 * - react-hook-form: Gestión eficiente del estado y validación del formulario.
 * - sonner: Retroalimentación inmediata al usuario sobre acciones críticas.
 *
 */
