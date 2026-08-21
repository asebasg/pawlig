"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserRole, Municipality } from "@prisma/client";
import { Search, Shield, User, MessageCircleQuestion, Activity, Scroll, ShieldAlert, Eye, Heart, Home, ShoppingBag, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlockUserButton from "@/components/admin/BlockUserButton";
import Loader from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Descripción: Componente cliente para la gestión administrativa de usuarios.
 * Permite listar, buscar, filtrar y realizar acciones sobre los usuarios del sistema.
 * Requiere: useState, useEffect, useCallback, useRouter, UserRole, Municipality;
 * Implementa: Búsqueda con debounce, paginación, filtrado por rol y estado;
 */
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

export default function UsersManagementClient() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Debounce de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, statusFilter, debouncedSearchQuery, limit]);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (roleFilter !== "ALL") params.append("role", roleFilter);
      if (statusFilter === "ACTIVE") params.append("isActive", "true");
      if (statusFilter === "BLOCKED") params.append("isActive", "false");
      if (debouncedSearchQuery.trim()) params.append("search", debouncedSearchQuery.trim());
      params.append("page", currentPage.toString());
      params.append("limit", limit.toString());

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
      setLoading(false);
    }
  }, [roleFilter, statusFilter, debouncedSearchQuery, currentPage, limit]);

  // Efecto para cargar usuarios al cambiar filtros o páginas
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h2>
        <p className="text-sm text-gray-500 mt-1">
          Administra, filtra y modera los usuarios registrados en la plataforma.
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col gap-4 lg:flex-row justify-between items-start lg:items-center">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Búsqueda */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Filtro por rol */}
            <div className="w-full md:w-56">
              <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val as UserRole | "ALL")}>
                <SelectTrigger className="w-full rounded-full bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-colors px-4">
                  <div className="flex items-center gap-2">
                    <SelectValue placeholder="Todos los roles" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg border-gray-100 bg-white">
                  <SelectItem value="ALL">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span>Todos los roles</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADOPTER">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-blue-500" />
                      <span>Adoptantes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SHELTER">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-teal-500" />
                      <span>Albergues</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="VENDOR">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-orange-500" />
                      <span>Vendedores</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-purple-500" />
                      <span>Administradores</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por estado */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "ALL" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Todos ({totalCount})
              </button>
              <button
                onClick={() => setStatusFilter("ACTIVE")}
                className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "ACTIVE" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Activos
              </button>
              <button
                onClick={() => setStatusFilter("BLOCKED")}
                className={`px-4 py-2 rounded-lg font-medium transition ${statusFilter === "BLOCKED" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Bloqueados
              </button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("ALL");
              setStatusFilter("ALL");
            }}
            className="h-10 border-gray-200 text-gray-600 w-full lg:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </Button>

          <Link href="/admin/moderation/users/create">
            <Button
              id="btn-crear-usuario"
              className="h-10 text-primary hover:brightness-75 transition-all text-white w-full lg:w-auto"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </Link>
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
                            <div className="mt-1">
                              <div className="text-xs text-teal-600">
                                🏠 {user.shelter.name}
                              </div>
                              <div className={`text-xs font-bold ${user.shelter.verified ? "text-green-600" : "text-red-600"}`}>
                                {user.shelter.verified ? "Verificado" : "No Verificado"}
                              </div>
                            </div>
                          )}
                          {user.vendor && (
                            <div className="mt-1">
                              <div className="text-xs text-orange-600">
                                🛒 {user.vendor.businessName}
                              </div>
                              <div className={`text-xs font-bold ${user.vendor.verified ? "text-green-600" : "text-red-600"}`}>
                                {user.vendor.verified ? "Verificado" : "No Verificado"}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(user.isActive)}
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
                            onClick={() => router.push(`/admin/moderation/users/${user.id}/view`)}
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
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Mostrando página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500">Usuarios por página:</label>
                    <Select value={limit.toString()} onValueChange={(val) => setLimit(Number(val))}>
                      <SelectTrigger className="w-20 rounded-lg bg-gray-50 border-gray-200 hover:bg-white focus:bg-white transition-colors px-2 py-1 text-sm h-8 text-black">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl shadow-lg border-gray-100 bg-white">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente proporciona la interfaz de administración para gestionar la base de usuarios.
 * Utiliza un estado local para manejar filtros y paginación, sincronizándose con la API administrativa.
 *
 * Lógica Clave:
 * - Debounce de búsqueda para evitar llamadas excesivas a la API.
 * - Manejo de paginación que se resetea al cambiar los filtros.
 * - Integración con modales de acción para bloqueo y edición de usuarios.
 * - Redirección a la nueva ruta de detalles `/admin/moderation/users/[id]/view`.
 *
 * Dependencias Externas:
 * - Lucide React para iconos.
 * - Prisma Client para tipos de roles y municipios.
 * - Next.js (useRouter, usePathname) para navegación.
 *
 */

