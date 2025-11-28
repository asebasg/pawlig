/**
 *  Página: /shelter/pets
 * 
 * PROPÓSITO:
 * - Listado de mascotas del albergue autenticado
 * - Filtros por estado (AVAILABLE, IN_PROCESS, ADOPTED)
 * - Acciones: Editar, Cambiar estado, Eliminar
 * 
 * TRAZABILIDAD:
 * - HU-005: Gestión de mascotas publicadas
 * - RF-009: Visualización de animales registrados
 * 
 * FLUJO:
 * - Server Component obtiene datos de DB
 * - Client Components para acciones interactivas
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/db";
import { UserRole, PetStatus } from "@prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";
import PetCard from "@/components/cards/shelter-pet-card";

interface PageProps {
    searchParams: {
        status?: string;
        page?: string;
    };
}

export const metadata = {
    title: "Mis Mascotas | PawLig Shelter Management",
    description: "Gestiona las mascotas de tu albergue",
};

export default async function ShelterPetsPage({ searchParams }: PageProps) {
    //  1. Autenticación
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.SHELTER) {
        redirect("/unauthorized");
    }

    //  2. Obtener la ID del albergue (SHELTER ID)
    const shelter = await prisma.shelter.findUnique({
        where: { userId: session.user.id },
        select: { id: true, name: true, verified: true },
    });

    if (!shelter) {
        redirect("/shelter");
    }

    //  3. Parsear filtros
    const statusFilter = searchParams.status as PetStatus | undefined;
    const page = parseInt(searchParams.page || "1");
    const limit = 12;

    //  4. Construir query
    const where = {
        shelterId: shelter.id,
        ...(statusFilter && { status: statusFilter }),
    };

    //  5. Obtener mascotas y conteo
    const [pets, total] = await Promise.all([
        prisma.pet.findMany({
            where,
            select: {
                id: true,
                name: true,
                species: true,
                breed: true,
                age: true,
                sex: true,
                status: true,
                images: true,
                description: true,
                createdAt: true,
                _count: {
                    select: {
                        adoptions: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.pet.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    //  6. Contar por estado
    const statusCounts = await prisma.pet.groupBy({
        by: ["status"],
        where: { shelterId: shelter.id },
        _count: true,
    });

    const counts = {
        all: pets.length,
        available: statusCounts.find((s) => s.status === PetStatus.AVAILABLE)?._count || 0,
        inProcess: statusCounts.find((s) => s.status === PetStatus.IN_PROCESS)?._count || 0,
        adopted: statusCounts.find((s) => s.status === PetStatus.ADOPTED)?._count || 0,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Mascotas</h1>
                        <p className="text-gray-600 mt-1">
                            {total} {total === 1 ? "mascota" : "mascotas"} registradas
                        </p>
                    </div>
                    <Link
                        href="/shelter/pets/new"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Publicar Mascota
                    </Link>
                </div>

                {/* Filtros por Estado */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <FilterButton
                        href="/shelter/pets"
                        active={!statusFilter}
                        label="Todas"
                        count={counts.all}
                    />
                    <FilterButton
                        href="/shelter/pets?status=AVAILABLE"
                        active={statusFilter === PetStatus.AVAILABLE}
                        label="Disponibles"
                        count={counts.available}
                        color="green"
                    />
                    <FilterButton
                        href="/shelter/pets?status=IN_PROCESS"
                        active={statusFilter === PetStatus.IN_PROCESS}
                        label="En Proceso"
                        count={counts.inProcess}
                        color="yellow"
                    />
                    <FilterButton
                        href="/shelter/pets?status=ADOPTED"
                        active={statusFilter === PetStatus.ADOPTED}
                        label="Adoptadas"
                        count={counts.adopted}
                        color="gray"
                    />
                </div>
            </div>

            {/* Grid de Mascotas */}
            <div className="max-w-7xl mx-auto px-4 pb-8">
                {pets.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg">
                        <p className="text-gray-600 text-lg mb-4">
                            {statusFilter
                                ? `No hay mascotas con estado "${statusFilter}"`
                                : "Aún no has publicado mascotas"}
                        </p>
                        <Link
                            href="/shelter/pets/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Publicar Primera Mascota
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <Link
                                        key={p}
                                        href={`/shelter/pets?${statusFilter ? `status=${statusFilter}&` : ""}page=${p}`}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${p === page
                                                ? "bg-purple-600 text-white"
                                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        {p}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/**
 *  Componente auxiliar: FilterButton
 */
function FilterButton(
    {
        href,
        active,
        label,
        count,
        color = "purple",
    }: {
        href: string;
        active: boolean;
        label: string;
        count: number;
        color?: "purple" | "green" | "yellow" | "gray";
    }
) {
    const colors = {
        purple: active ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700 hover:bg-purple-200",
        green: active ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200",
        yellow: active ? "bg-yellow-600 text-white" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        gray: active ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };

    return (
        <Link
            href={href}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${colors[color]}`}
        >
            {label} ({count})
        </Link>
    );
}
