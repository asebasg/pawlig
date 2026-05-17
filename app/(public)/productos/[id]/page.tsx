import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductById, getSimilarProducts } from "@/lib/services/product.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * Descripción: Página pública de detalle de un producto específico.
 * Requiere: Identificador del producto en los parámetros de la ruta.
 * Implementa: HU-010 (Visualización detallada de productos y recomendaciones).
 */

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: ProductDetailPageProps
): Promise<Metadata> {
  try {
    const product = await getProductById(params.id);

    if (!product) {
      return {
        title: "Producto no encontrado - PawLig",
      };
    }

    return {
      title: `Compra ${product.name}`,
      description: `${product.category} en venta. ${product.description?.substring(0, 150) || "Encuentra lo que necesitas"}...`,
      openGraph: {
        title: `${product.name} en venta en PawLig`,
        description: product.description || "",
        images: product.images && product.images.length > 0 ? [product.images[0]] : [],
      },
    };
  } catch (error) {
    console.error(`Error detectado: ${error}`);
    return {
      title: "Detalle de producto - PawLig",
    };
  }
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const similarProducts = await getSimilarProducts(params.id, product.vendorId, product.category);

  const userSession = session?.user ? {
    id: session.user.id || "",
    name: session.user.name || "",
    email: session.user.email || "",
    role: session.user.role || "",
  } : null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link href="/productos" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-base font-semibold">
          <ArrowLeft className="w-4 h-4" />
          Volver a Productos
        </Link>
      </div>
      <ProductDetailClient
        product={product}
        userSession={userSession}
        similarProducts={similarProducts}
      />
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Server Component para renderizar la página de detalle de un producto de forma pública.
 * Integra SEO dinámico y generación de metadatos basados en la información del producto.
 *
 * Lógica Clave:
 * - Recuperación Paralela y en Cascada:
 *   1. Obtiene los detalles de producto por ID. Si no existe, lanza notFound().
 *   2. Obtiene de manera asíncrona la lista de productos similares y la sesión del usuario.
 * - Recomendaciones Dinámicas:
 *   Utiliza el servicio getSimilarProducts filtrando por categoría (con tipo estricto)
 *   para poblar la sección de productos relacionados de forma automatizada.
 *
 * Dependencias Externas:
 * - Next.js App Router: Soporte de parámetros dinámicos, notFound y generación de metadatos.
 * - NextAuth: Recuperación de la sesión de usuario activa para integraciones de compra.
 * - ProductService: Capa de acceso a datos para productos.
 *
 */
