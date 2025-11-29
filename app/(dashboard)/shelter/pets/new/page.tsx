/**
 *  Página: /shelter/pets/new
 * 
 * PROPÓSITO:
 * - Formulario de creación de nueva mascota
 * - Solo accesible para albergues verificados
 * - Obtiene shelterId del usuario autenticado
 * 
 * TRAZABILIDAD:
 * - HU-005: Publicación de mascota
 * - CU-004: Publicar mascota en adopción
 * 
 * PROTECCIÓN:
 * - Middleware valida rol SHELTER
 * - Verificación adicional de albergue verificado
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole } from "@prisma/client";
import PetForm from "@/components/forms/pet-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Publicar Mascota",
    description: "Registra una nueva mascota para adopción en el Valle de Aburrá",
};

export default async function NewPetPage() {
    //  1. Verificar autenticación
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.SHELTER) {
        redirect("/unauthorized");
    }

    //  2. Obtener datos del albergue
    const shelter = await prisma.shelter.findUnique({
        where: { userId: session.user.id },
        select: {
            id: true,
            name: true,
            verified: true,
        },
    });

    //  3. Validaciones
    if (!shelter) {
        redirect("/shelter");
    }

    if (!shelter.verified) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center max-w-md w-full mx-4">
                    <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                        Albergue Pendiente de Verificación
                    </h2>
                    <p className="text-yellow-800 mb-4">
                        Tu albergue debe estar verificado por un administrador antes de poder publicar mascotas.
                    </p>
                    <Link
                        href="/shelter"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        );
    }
    //  4. Renderizar formulario
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Publicar Nueva Mascota</h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                            Completa el formulario para registrar una mascota en adopción. Los campos marcados con{" "}
                            <span className="text-red-500">*</span> son obligatorios.
                        </p>
                        {/* Tips de buenas prácticas */}
                    </div>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">💡 Tips para una buena publicación</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Usa fotos de alta calidad con buena iluminación</li>
                                <li>• Sé honesto en la descripción del carácter y comportamiento</li>
                                <li>• Incluye información sobre vacunas y esterilización</li>
                                <li>• Especifica claramente los requisitos de adopción</li>
                                <li>• Actualiza el estado cuando la mascota sea adoptada</li>
                            </ul>
                        </div>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                    <PetForm mode="create" shelterId={shelter.id} />
                </div>
            </div>
        </div>
    );
}
