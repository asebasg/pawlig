import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/utils/db";
import { ProductsClient } from "@/components/vendor/ProductsClient";
import { VendorStats } from "@/components/vendor/VendorStats";
import { buttonVariants } from "@/components/ui/button-variants";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { UserRole, ProductCategory } from "@prisma/client";

/**
 * Descripción: Página principal del dashboard de gestión de productos para vendedores.
 * Requiere: Autenticación, rol VENDOR y estado de verificación del vendedor.
 * Implementa: HU-010
 */

export const metadata: Metadata = {
  title: "Gestiona tus productos",
  description: "Panel de administración de productos para vendedores",
};

// Definimos props de la página
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function VendorProductsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  // Verificar autenticación, rol y verificación de rol
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/vendor/products");
  }

  if (session.user.role !== UserRole.VENDOR) {
    redirect("/unauthorized?reason=vendor_only");
  }

  // Obtener id de VENDOR
  const vendorId = session.user.vendorId as string;
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId as string },
    select: { id: true, verified: true },
  });

  if (!vendor?.verified) {
    redirect("/unauthorized?reason=vendor_not_verified");
  }

  // 2. Parsear filtros y paginación
  const categoryFilter = searchParams.categoryId as string | undefined;
  const category = categoryFilter && Object.values(ProductCategory).includes(categoryFilter as ProductCategory)
    ? (categoryFilter as ProductCategory)
    : undefined;

  const searchQuery = searchParams.q as string | undefined;
  const page = parseInt(searchParams.page as string || "1");
  const limit = 12;

  // 3. Construir query base
  const where = {
    vendorId: vendor.id,
    ...(category && { category }),
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" as const } },
        { description: { contains: searchQuery, mode: "insensitive" as const } },
      ],
    }),
  };

  // 4. Obtener productos y conteo total (Parallel fetching)
  const [products] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        category: true,
        images: true,
        description: true,
        updatedAt: true,
        vendorId: true,
        createdAt: true,
        vendor: {
          select: {
            id: true,
            businessName: true,
            municipality: true,
            address: true,
          }
        },
        _count: {
          select: {
            orderItems: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // 5. Estadísticas de inventario GENERAL (sin filtros de búsqueda ni categoría)
  // Estas son para mostrar el total absoluto de productos del vendedor
  const categoryStats = await prisma.product.groupBy({
    by: ["category"],
    where: { vendorId: vendor.id },
    _count: true,
  });

  // 6. Estadísticas de BÚSQUEDA (solo con filtro de búsqueda, SIN filtro de categoría)
  // Estas son las que usaremos para los badges dinámicos
  const searchWhere = {
    vendorId: vendor.id,
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" as const } },
        { description: { contains: searchQuery, mode: "insensitive" as const } },
      ],
    }),
  };

  const [searchCategoryStats, searchTotalCount] = await Promise.all([
    prisma.product.groupBy({
      by: ["category"],
      where: searchWhere,
      _count: true,
    }),
    prisma.product.count({ where: searchWhere }),
  ]);

  // Calculamos métricas de negocio
  const inventoryStats = await prisma.product.aggregate({
    where: { vendorId: vendor.id },
    _sum: {
      stock: true,
    },
    _count: {
      id: true // Total de productos únicos
    }
  });

  const lowStockCount = await prisma.product.count({
    where: {
      vendorId: vendor.id,
      stock: { lte: 5 } // Alerta de stock bajo si hay 5 o menos
    }
  });

  const inStockCount = await prisma.product.count({
    where: { vendorId: vendor.id, stock: { gt: 0 } }
  });

  const outOfStockCount = await prisma.product.count({
    where: { vendorId: vendor.id, stock: 0 }
  });

  const allProductsCount = await prisma.product.count({
    where: { vendorId: vendor.id }
  });

  const categories = categoryStats
    .map((c: typeof categoryStats[0]) => ({
      name: c.category,
      count: c._count
    }))
    .sort((a: { name: string, count: number }, b: { name: string, count: number }) => a.name.localeCompare(b.name));

  const searchCategories = searchCategoryStats
    .map((c: typeof searchCategoryStats[0]) => ({
      name: c.category,
      count: c._count
    }))
    .sort((a: { name: string, count: number }, b: { name: string, count: number }) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/vendor" className="inline-flex items-center gap-2 mb-2 text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Mis Productos</h1>
          <p className="text-gray-500">Gestiona y administra tu inventario de productos</p>
        </div>
        <Link
          href="/vendor/products/new"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar Producto
        </Link>
      </div>

      <VendorStats
        total={inventoryStats._count.id || 0}
        inStock={inStockCount}
        outOfStock={outOfStockCount}
        lowStock={lowStockCount}
      />

      <ProductsClient
        initialProducts={products}
        categories={categories}
        allCount={allProductsCount}
        searchCategories={searchCategories}
        searchTotalCount={searchTotalCount}
      />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Server Component que orquesta la vista de inventario del vendedor.
 * Implementa validación robusta de estado de verificación del vendedor.
 *
 * Lógica Clave:
 * - Validación en Cascada (4 niveles):
 *   1. Autenticación -> redirección a /login?callbackUrl=/vendor/products.
 *   2. Rol VENDOR -> redirección a /unauthorized?reason=vendor_only.
 *   3. Verificación de Vendedor -> redirección a /unauthorized?reason=vendor_not_verified.
 *   4. Acceso Autorizado -> renderizado del dashboard de productos.
 * - Tipado Seguro de Categorías:
 *   Valida y castea el parámetro de categoría a ProductCategory para cumplir
 *   con el estándar estricto de base de datos de Prisma y evitar fallos de compilación.
 *
 * Dependencias Externas:
 * - Prisma Client: Acceso a la base de datos para productos y verificación.
 * - NextAuth: Verificación de sesión de usuario y rol.
 * - Lucide React: Iconografía consistente.
 *
 */