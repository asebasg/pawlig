/**
 *  Página: /shelter/pets/[id]/edit
 * 
 * PROPÓSITO:
 * - Edición de mascota existente
 * - Pre-carga de datos actuales
 * - Validación de propiedad (solo el albergue dueño puede editar)
 * 
 * TRAZABILIDAD:
 * - HU-005: Edición de publicación de mascota
 * - CU-004: Actualizar información de mascota
 */

import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import PetForm from "@/components/forms/pet-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
    const pet = await prisma.pet.findUnique({
        where: { id: params.id },
        select: { name: true },
    });

    return {
        title: pet ? `Editar ${pet.name} | PawLig` : "Editar Mascota | PawLig",
        description: "Actualiza la información de tu mascota en adopción",
    };
}

export default async function EditPetPage({ params }: PageProps) {
    //  1. Autenticación
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.SHELTER) {
        redirect("/unauthorized");
    }

    //  2. Obtener albergue
    const shelter = await prisma.shelter.findUnique({
        where: { userId: session.user.id },
        select: { id: true, verified: true },
    });

    if (!shelter || !shelter.verified) {
        redirect("/shelter");
    }

    //  3. Obtener mascota
    const pet = await prisma.pet.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            age: true,
            sex: true,
            description: true,
            requirements: true,
            images: true,
            status: true,
            shelterId: true,
        },
    });

    //  4. Validaciones
    if (!pet) {
        notFound();
    }

    //  Verificar propiedad
    if (pet.shelterId !== shelter.id) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center max-w-md w-full mx-4">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">
                        Acceso Denegado
                    </h2>
                    <p className="text-red-800 mb-4">
                        No tienes permiso para editar esta mascota.
                    </p>
                    <Link
                        href="/shelter/pets"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Mis Mascotas
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/shelter/pets"
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a Mis Mascotas
                    </Link>
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Editar {pet.name}
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Actualiza la información de tu mascota. Los campos marcados con{" "}
                            <span className="text-red-500">*</span> son obligatorios.
                        </p>
                    </div>
                </div>

                {/* Formulario Pre-cargado */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                    <PetForm
                        mode="edit"
                        initialData={{
                            id: pet.id,
                            name: pet.name,
                            species: pet.species,
                            breed: pet.breed ?? undefined,
                            age: pet.age ?? undefined,
                            sex: pet.sex ?? undefined,
                            description: pet.description,
                            requirements: pet.requirements ?? undefined,
                            images: pet.images,
                        }}
                        shelterId={shelter.id}
                    />
                </div>
            </div>
        </div>
    );
}
