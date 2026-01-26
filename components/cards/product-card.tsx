'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, MapPin, Store } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Descripción: Tarjeta de producto para el catálogo público.
 * Requiere: Objeto de producto con información de precio, stock y vendedor.
 * Implementa: HU-004 (Galería de productos).
 */

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
    product: {
        id: string;
        name: string;
        price: number;
        stock: number;
        category: string;
        images: string[];
        vendor: {
            businessName: string;
            municipality: string;
        };
    };
    onAddToCart?: (productId: string) => void;
    /** Color de acento para el borde superior */
    accentColor?: 'default' | 'teal' | 'orange' | 'yellow' | 'purple' | 'red' | 'blue' | 'green' | 'none';
}

export function ProductCard({
    product,
    onAddToCart,
    accentColor = 'purple',
    className,
    ...props
}: ProductCardProps) {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onAddToCart) {
            onAddToCart(product.id);
        }
    };

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStockBadge = () => {
        if (product.stock === 0) {
            return (
                <Badge variant="red" className="absolute top-2 right-2 z-10">
                    Agotado
                </Badge>
            );
        }
        if (product.stock <= 10) {
            return (
                <Badge
                    variant="yellow"
                    className="absolute top-2 right-2 z-10 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                >
                    Stock Bajo
                </Badge>
            );
        }
        return null;
    };

    const mainImage = product.images[0] || "/images/placeholder-product.png";
    const isOutOfStock = product.stock === 0;

    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl h-full flex flex-col",
                isOutOfStock && "opacity-75",
                className
            )}
            accentColor={accentColor}
            {...props}
        >
            {/* Enlace absoluto para cubrir toda la tarjeta (manteniendo botones accesibles) */}
            <Link
                href={`/productos/${product.id}`}
                className="absolute inset-0 z-0"
                aria-label={`Ver detalles de ${product.name}`}
            />

            {/* Header: Imagen */}
            <div className="relative overflow-hidden w-full z-10 pointer-events-none">
                <div className="relative w-full aspect-square">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {getStockBadge()}
                </div>
            </div>

            {/* Content: Info Producto */}
            <CardContent className="p-4 flex-1 flex flex-col gap-2 z-10 pointer-events-none">
                {/* Categoría */}
                {/* Nombre */}
                <h3 className="text-lg text-center font-bold text-foreground leading-tight mb-1 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {/* Precio y Categoría */}
                <div className="flex items-center justify-between gap-2 mt-auto">
                    <p className="text-xl font-bold text-primary">
                        {formatPrice(product.price)} COP
                    </p>
                    <Badge variant="teal" className="py-0 px-2 font-normal uppercase">
                        {product.category}
                    </Badge>
                </div>

                {/* Vendedor y Ubicación */}
                <div className="pt-3 space-y-1.5 text-sm text-muted-foreground font-medium border-t border-gray-50 mt-2">
                    <div className="flex items-center gap-1.5">
                        <Store className={cn(
                            "w-5 h-5",
                            "text-teal-600",
                        )} />
                        <span className="line-clamp-1 text-teal-600">{product.vendor.businessName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground font-normal">
                        <MapPin className="w-5 h-5" />
                        <span className="line-clamp-1">{product.vendor.municipality}, ANTIOQUIA</span>
                    </div>
                </div>
            </CardContent>

            {/* Footer: Acciones */}
            <CardFooter className="p-4 pt-0 mt-auto flex gap-2 z-20">
                <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    asChild
                >
                    <Link href={`/productos/${product.id}`}>Ver Detalles</Link>
                </Button>

                <Button
                    variant="default"
                    size="icon"
                    className="h-9 w-9 shrink-0 relative"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    title={isOutOfStock ? "Producto agotado" : "Agregar al carrito"}
                >
                    <ShoppingCart className="h-5 w-5" />
                </Button>
            </CardFooter>
        </Card>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente es la pieza fundamental para la visualización de productos en el
 * catálogo público, proporcionando una vista previa atractiva y funcional que
 * incentiva la conversión.
 *
 * Lógica Clave:
 * - formatPrice: Formatea valores numéricos a moneda colombiana (COP) de forma legible.
 * - getStockBadge: Determina visualmente la disponibilidad del producto mediante
 *   insignias de "Agotado" o "Stock Bajo" según el inventario.
 * - handleAddToCart: Gestiona la adición al carrito deteniendo la propagación para
 *   evitar la navegación accidental al detalle del producto.
 * - accentColor: Permite una personalización visual dinámica del borde y los iconos.
 *
 * Dependencias Externas:
 * - lucide-react: Iconografía para carrito, ubicación y tienda.
 * - next/image: Optimización de imágenes de producto con placeholders.
 * - next/link: Navegación integrada hacia la página de detalles.
 *
 */