"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRole, Municipality } from "@prisma/client";
import { Search, Shield, User, MessageCircleQuestion, Activity, Scroll, ShieldAlert, Eye } from "lucide-react";
import BlockUserButton from "@/components/admin/BlockUserButton";
import Loader from '@/components/ui/loader'

interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    municipality: Municipality;
    phone: string;
    isActive: boolean;
    blockedAt: string | null;
    blockReason: string | null;
    createdAt: string;
    _count: {
        adoptions: number;
        orders: number;
        favorites: number;
    };
    shelter?: {
        id: string;
        name: string;
        verified: boolean;
        _count: { pets: number };
    };
    vendor?: {
        id: string;
        businessName: string;
        verified: boolean;
        _count: { products: number };
    };
}

interface UsersManagementClientProps {
    adminUser: {
        id: string;
        email: string;
        name: string;
    }
}

export default function UsersManagementClient({ adminUser }: UsersManagementClientProps) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //  Filtros
    const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    //  Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    //  Cargar usuarios
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();

            if (roleFilter !== "ALL") params.append("role", roleFilter);
            if (statusFilter === "ACTIVE") params.append("isActive", "true");
            if (statusFilter === "BLOCKED") params.append("isActive", "false");
            if (searchQuery.trim()) params.append("search", searchQuery.trim());
            params.append("page", currentPage.toString());
            params.append("limit", "20");

            const response = await fetch(`/api/admin/users?${params.toString()}`);

            if (!response.ok) {
                throw new Error("Error al cargar usuarios");
            }

            const data = await response.json();

            setUsers(data.data);
            setTotalPages(data.pagination.totalPages);
            setTotalCount(data.pagination.totalCount);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false)
        }
    };

    //  Efecto para cargar usuarios al cambiar filtros o paginas
    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter, currentPage]);

    // Búsqueda con debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentPage === 1) {
                fetchUsers();
            } else {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // Badge de rol
    const getRoleBadge = (role: UserRole) => {
        const styles = {
            ADMIN: "bg-purple-100 text-purple-800 pointer-events-none",
            SHELTER: "bg-teal-100 text-teal-800 pointer-events-none",
            VENDOR: "bg-orange-100 text-orange-800 pointer-events-none",
            ADOPTER: "bg-blue-100 text-blue-800 pointer-events-none"
        };

        const labels = {
            ADMIN: "Administrador",
            SHELTER: "Albergue",
            VENDOR: "Vendedor",
            ADOPTER: "Adoptante"
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>
                {labels[role]}
            </span>
        );
    };

    // Badge de estado
    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 pointer-events-none">
                Activo
            </span>
        ) : (
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 pointer-events-none">
                Bloqueado
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar usuario
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Nombre o email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filtro por rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rol
                        </label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as UserRole | "ALL")}
                                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="ALL">Todos</option>
                                <option value="ADOPTER">Adoptantes</option>
                                <option value="SHELTER">Albergues</option>
                                <option value="VENDOR">Vendedores</option>
                                <option value="ADMIN">Administradores</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filtro por estado */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setStatusFilter("ALL")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "ALL"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Todos ({totalCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter("ACTIVE")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "ACTIVE"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Activos
                    </button>
                    <button
                        onClick={() => setStatusFilter("BLOCKED")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "BLOCKED"
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Bloqueados
                    </button>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                        <Loader />
                        <span>Cargando a todos los usuarios</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        {error}
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron usuarios
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4 text-gray-500" />
                                                Usuario
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <Shield className="w-4 h-4 text-gray-500" />
                                                Rol
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <MessageCircleQuestion className="w-4 h-4 text-gray-500" />
                                                Estado
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-4 h-4 text-gray-500" />
                                                Actividad
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <Scroll className="w-4 h-4 text-gray-500" />
                                                Registro
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center justify-center gap-1">
                                                <ShieldAlert className="w-4 h-4 text-gray-500" />
                                                Acciones
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    {user.shelter && (
                                                        <div className="text-xs text-teal-600 mt-1">
                                                            🏠 {user.shelter.name}
                                                        </div>
                                                    )}
                                                    {user.vendor && (
                                                        <div className="text-xs text-orange-600 mt-1">
                                                            🛒 {user.vendor.businessName}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {getStatusBadge(user.isActive)}
                                                {/* Mostrar razon del bloqueo */}
                                                {/* {!user.isActive && user.blockReason && (
                                                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                                        {user.blockReason}
                                                    </div>
                                                )} */}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.shelter && (
                                                    <div>🐾 {user.shelter._count?.pets || 0} mascotas</div>
                                                )}
                                                {user.vendor && (
                                                    <div>📦 {user.vendor._count?.products || 0} productos</div>
                                                )}
                                                {user.role === "ADOPTER" && (
                                                    <div>
                                                        <div>❤️ {user._count?.favorites || 0} favoritos</div>
                                                        <div>📋 {user._count?.adoptions || 0} postulaciones</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/users/${user.id}/view`)}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition text-purple-600 hover:bg-purple-50"
                                                        aria-label={`Ver detalles de ${user.name}`}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Ver más
                                                    </button>

                                                    <BlockUserButton
                                                        user={user}
                                                        onSuccess={fetchUsers}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Mostrando página {currentPage} de {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
