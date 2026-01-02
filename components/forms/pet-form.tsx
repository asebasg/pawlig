"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPetSchema, PetSpecies, PetSex, type CreatePetInput } from "@/lib/validations/pet.schema";
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import Loader from "@/components/ui/loader";
import Image from "next/image";

/**
 * Componente: PetForm
 * Descripción: Formulario completo para crear y editar mascotas. Permite la validación de datos en tiempo real, subida de imágenes a Cloudinary y gestión de estados de carga/error.
 * Requiere: shelterId (prop), configuración de Cloudinary en servidor.
 * Implementa: HU-005 (Publicación y gestión de mascota), RF-009 (Registro de animales), RN-007 (Mínimo una foto).
 */

interface PetFormProps {
    mode?: "create" | "edit";
    initialData?: Partial<CreatePetInput> & { id?: string };
    shelterId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const MAX_IMAGES = 5;

export default function PetForm({ mode = "create", initialData, shelterId }: PetFormProps) {
    const router = useRouter();

    // Estados del componente
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // React Hook Form con Zod
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<CreatePetInput>({
        resolver: zodResolver(createPetSchema),
        defaultValues: {
            name: initialData?.name || "",
            species: initialData?.species || PetSpecies.DOG,
            breed: initialData?.breed || "",
            age: initialData?.age || undefined,
            sex: initialData?.sex || PetSex.MALE,
            description: initialData?.description || "",
            requirements: initialData?.requirements || "",
            images: initialData?.images || [],
            shelterId,
        },
    });

    /**
     * FUNCIÓN: handleImageUpload
     * Upload de imágenes a Cloudinary
     *
     * FLUJO:
     * 1. Leer archivo como base64
     * 2. Enviar a /api/upload (endpoint dedicado)
     * 3. Recibir URL de Cloudinary
     * 4. Agregar a array de imágenes
     *
     * VALIDACIONES:
     * - Máximo 5 imágenes (RN-007)
     * - Formatos: JPEG, PNG
     * - Tamaño máximo: 5MB
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Validar límite de imágenes
        if (images.length + files.length > MAX_IMAGES) {
            setSubmitError(`Máximo ${MAX_IMAGES} fotos permitidas`);
            return;
        }

        setUploadingImages(true);
        setSubmitError(null);

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                // Validar tamaño
                if (file.size > MAX_FILE_SIZE) {
                    throw new Error(`${file.name} excede 5MB`);
                }

                // Validar formato
                if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                    throw new Error(`${file.name} debe ser JPEG o PNG`);
                }

                // Convertir a base64
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = () => reject(new Error("Error al leer archivo"));
                    reader.readAsDataURL(file);
                });

                // Upload a Cloudinary via API
                const response = await fetch("/api/upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: base64, folder: "pets" }),
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
            setSubmitError(error instanceof Error ? error.message : "Error al subir imágenes");
        } finally {
            setUploadingImages(false);
        }
    };

    /**
     * FUNCIÓN: removeImage
     * Eliminar imagen del array
     */
    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        setValue("images", newImages, { shouldValidate: true });
    };

    /**
     * FUNCIÓN: onSubmit
     * Envío del formulario a API
     *
     * FLUJO:
     * - CREATE: POST /api/pets
     * - EDIT: PUT /api/pets/[id]
     */
    const onSubmit = async (data: CreatePetInput) => {
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const url = mode === "create" ? "/api/pets" : `/api/pets/${initialData?.id}`;
            const method = mode === "create" ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Error al guardar mascota");
            }

            setSubmitSuccess(true);

            // Redireccionar después de 1.5 segundos
            setTimeout(() => {
                router.push("/shelter/pets");
                router.refresh();
            }, 1500);
        } catch (error) {
            console.error("Submit error:", error);
            setSubmitError(error instanceof Error ? error.message : "Error inesperado");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* MENSAJE DE ERROR GLOBAL */}
            {submitError && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{submitError}</p>
                </div>
            )}

            {/* MENSAJE DE ÉXITO */}
            {submitSuccess && (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">
                        ¡Mascota {mode === "create" ? "publicada" : "actualizada"} exitosamente! Redirigiendo...
                    </p>
                </div>
            )}

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
                    {/* Edad */}
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                            Edad aproximada (años)
                        </label>
                        <input
                            {...register("age", { valueAsNumber: true })}
                            type="number"
                            id="age"
                            min="0"
                            max="30"
                            placeholder="Ej: 2"
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
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
                    <textarea
                        {...register("description")}
                        id="description"
                        rows={5}
                        placeholder="Describe el carácter, personalidad y comportamiento de la mascota. Mínimo 20 caracteres."
                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
                    />
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

                {/* Grid de imágenes subidas */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {images.map((url, index) => (
                            <div key={index} className="relative group">
                                <Image
                                    src={url}
                                    alt={`Foto ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
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
                {images.length < MAX_IMAGES && (
                    <div>
                        <label
                            htmlFor="image-upload"
                            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
                        >
                            {uploadingImages ? (
                                <>
                                    <Loader />
                                    <span className="text-sm font-medium text-purple-600">Subiendo fotos...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {images.length === 0 ? "Subir fotos (mínimo 1)" : "Agregar más fotos"}
                                    </span>
                                </>
                            )}
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploadingImages}
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
                    disabled={isSubmitting || uploadingImages}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <>
                            <Loader />
                            <span>{mode === "create" ? "Publicando..." : "Guardando..."}</span>
                        </>
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
 * PetForm es un componente de cliente ('use client') diseñado para la
 * creación y edición de perfiles de mascotas. Es un formulario complejo que
 * integra validación, subida de archivos y comunicación con la API,
 * proporcionando una experiencia de usuario interactiva y robusta.
 *
 * Lógica Clave:
 * - Manejo de Estado del Formulario:
 *   - Se utiliza 'react-hook-form' para gestionar el estado de los campos del
 *     formulario, incluyendo sus valores, errores y estado de envío.
 *   - La integración con 'zodResolver' permite una validación de datos en
 *     tiempo real basada en el esquema 'createPetSchema', mejorando la UX al
 *     proporcionar feedback inmediato.
 *
 * - Subida de Imágenes a Cloudinary:
 *   - La función 'handleImageUpload' es asíncrona y maneja la subida de
 *     imágenes a un endpoint propio ('/api/upload'), que a su vez se
 *     comunica con Cloudinary.
 *   - Realiza validaciones en el cliente (tamaño, tipo de archivo, cantidad)
 *     para evitar cargas innecesarias y mejorar el rendimiento.
 *   - El estado 'uploadingImages' se utiliza para deshabilitar el botón de
 *     envío y mostrar un indicador de carga, previniendo envíos incompletos.
 *
 * - Manejo de Estado Local:
 *   - 'useState' se usa para gestionar el estado que no pertenece a 'react-hook-form',
 *     como el array de URLs de imágenes ('images'), los estados de carga
 *     ('uploadingImages'), y los mensajes de error/éxito del envío ('submitError',
 *     'submitSuccess').
 *
 * - Modo Dinámico (Crear/Editar):
 *   - El componente acepta una prop 'mode' que puede ser 'create' o 'edit'.
 *   - Esta prop determina la URL del endpoint y el método HTTP a utilizar
 *     ('POST' para crear, 'PUT' para editar), haciendo el formulario reutilizable.
 *   - 'initialData' se utiliza para pre-llenar el formulario en modo de edición.
 *
 * Dependencias Externas:
 * - 'react-hook-form' y '@hookform/resolvers/zod': Son cruciales para la
 *   gestión del formulario y la validación basada en esquemas de Zod.
 * - 'lucide-react': Proporciona los íconos utilizados en la interfaz para
 *   mejorar la claridad visual.
 *
 */
