/**
 *  Componente: ShelterPetCard
 * 
 * PROPÓSITO:
 * - Tarjeta de mascota para vista del albergue
 * - Acciones: Ver, Editar, Cambiar Estado, Eliminar
 * - Muestra contador de postulaciones
 * 
 * TRAZABILIDAD:
 * - HU-005: Gestión de mascotas
 * - Criterio: "Cuando cambio estado, se retira de búsqueda"
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PetStatus } from "@prisma/client";
import { Edit, Trash2, Eye, Clock, CheckCircle, XCircle, BookOpenCheck } from "lucide-react";
import Link from "next/link";

interface Pet {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    age: number | null;
    sex: string | null;
    status: PetStatus;
    images: string[];
    description: string;
    createdAt: Date;
    _count: {
        adoptions: number;
    };
}

interface ShelterPetCardProps {
    pet: Pet;
}

export default function ShelterPetCard({ pet }: ShelterPetCardProps) {
    const router = useRouter();
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    /**
     *  FUNCIÓN: handleStatusChange
     *  Cambiar estado de la mascota
     * 
     * CRITERIO DE ACEPTACIÓN:
     * "Cuando cambio estado a ADOPTED o IN_PROCESS,
     * entonces se retira de búsqueda activa"
     */
    const handleStatusChange = async (newStatus: PetStatus) => {
        if (isChangingStatus) return;

        setIsChangingStatus(true);

        try {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al cambiar estado");
            }

            router.refresh();
        } catch (error) {
            console.error("Error changing status:", error);
            alert(error instanceof Error ? error.message : "Error al cambiar estado");
        } finally {
            setIsChangingStatus(false);
        }
    };

    /**
     *  FUNCIÓN: handleDelete
     *  Eliminar mascota permanentemente
     */
    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/pets/${pet.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al eliminar");
            }

            router.refresh();
        } catch (error) {
            console.error("Error deleting pet:", error);
            alert(error instanceof Error ? error.message : "Error al eliminar mascota");
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Badge de estado
    const statusConfig = {
        [PetStatus.AVAILABLE]: {
            label: "Disponible",
            color: "bg-green-100 text-green-800 p-0.5",
            icon: CheckCircle,
        },
        [PetStatus.IN_PROCESS]: {
            label: "En Proceso",
            color: "bg-yellow-100 text-yellow-800 p-0.5",
            icon: Clock,
        },
        [PetStatus.ADOPTED]: {
            label: "Adoptada",
            color: "bg-gray-100 text-gray-800 p-0.5",
            icon: XCircle,
        },
    };

    const currentStatus = statusConfig[pet.status];
    const StatusIcon = currentStatus.icon;

    return (
        <>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Imagen */}
                <div className="relative h-48 bg-gray-200">
                    {pet.images.length > 0 ? (
                        <img
                            src={pet.images[0]}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin foto
                        </div>
                    )}
                    {/* Badge de estado */}
                    <div className={`absolute top-2 right-2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {currentStatus.label}
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-4">
                    {/* Nombre y especie */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{pet.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {pet.species} {pet.breed && `• ${pet.breed}`} {pet.age && `• ${pet.age} años`}
                    </p>

                    {/* Contador de postulaciones */}
                    {pet._count.adoptions > 0 && (
                        <div className="flex items-center gap-1 text-sm text-purple-600 mb-3">
                            <BookOpenCheck className="w-4 h-4" />
                            <span>{pet._count.adoptions} {pet._count.adoptions === 1 ? "postulación" : "postulaciones"}</span>
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {/* Ver */}
                        <Link
                            href={`/adopciones/${pet.id}`}
                            target="_blank"
                            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            <Eye className="w-4 h-4" />
                            Ver
                        </Link>

                        {/* Editar */}
                        <Link
                            href={`/shelter/pets/${pet.id}/edit`}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Link>

                        {/* Eliminar */}
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </button>
                    </div>

                    {/* Cambiar Estado */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Cambiar estado:
                        </label>
                        <select
                            value={pet.status}
                            onChange={(e) => handleStatusChange(e.target.value as PetStatus)}
                            disabled={isChangingStatus}
                            className="text-black w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value={PetStatus.AVAILABLE}>Disponible</option>
                            <option value={PetStatus.IN_PROCESS}>En Proceso</option>
                            <option value={PetStatus.ADOPTED}>Adoptada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Modal de Confirmación de Eliminación */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            ¿Eliminar a {pet.name}?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Esta acción no se puede deshacer. Se eliminarán todas las postulaciones asociadas.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {isDeleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}