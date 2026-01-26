import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getProductById, getSimilarProducts } from '@/lib/services/product.service';
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link';

/**
 * Página de Detalle de Producto
 * 
 * Ruta: /productos/[id]
 * Acceso: Público (cualquier usuario)
 * 
 * Requerimientos:
 * - HU-010: Desarrollar galería pública de productos
 * - Mostrar detalle completo de producto
 * - Opción de agregar a favoritos
 * - Opción de comprar/agregar al carrito
 * 
 * Funcionalidades:
 * ✅ Galería de imágenes expandida
 * ✅ Información completa de producto
 * ✅ Descripción y precio
 * ✅ Información del vendedor
 * ✅ Botón de favoritos
 * ✅ Botón de compra
 * ✅ Recomendaciones de productos similares
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
                title: 'Producto no encontrado - PawLig',
            };
        }

        return {
            title: `Compra ${product.name}`,
            description: `${product.category} en venta. ${product.description?.substring(0, 150) || 'Encuentra lo que necesitas'}...`,
            openGraph: {
                title: `${product.name} en venta en PawLig`,
                description: product.description || '',
                images: product.images && product.images.length > 0 ? [product.images[0]] : [],
            },
        };
    } catch (error) {
        console.error(`Error detectado: ${error}`)
        return {
            title: 'Detalle de producto - PawLig',
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
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || '',
    } : null;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/productos" className="inline-flex items-center gap-2 text-primary hover:text-purple-700 text-base font-semibold">
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
