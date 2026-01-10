'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Resumen:
 * Componente de tarjeta de producto para el catálogo público.
 * Muestra imagen, información básica del producto, precio, stock y acciones.
 * Refactorizado para usar Card de shadcn y soportar personalización.
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
    accentColor?: 'default' | 'teal' | 'orange' | 'purple' | 'red' | 'blue' | 'green' | 'none';
}

export function ProductCard({
    product,
    onAddToCart,
    accentColor = 'default',
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
                <Badge variant="destructive" className="absolute top-2 right-2 z-10">
                    Agotado
                </Badge>
            );
        }
        if (product.stock <= 10) {
            return (
                <Badge
                    variant="secondary"
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
        <Link href={`/productos/${product.id}`} className="block h-full">
            <Card
                className={cn(
                    "group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    isOutOfStock && "opacity-75",
                    className
                )}
                accentColor={accentColor}
                {...props}
            >
                {/* Header: Imagen */}
                <CardHeader className="p-0 border-b border-gray-100 relative overflow-hidden bg-gray-100">
                    <div className="relative w-full aspect-square">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {getStockBadge()}
                    </div>
                </CardHeader>

                {/* Content: Info Producto */}
                <CardContent className="p-4 flex-1 flex flex-col gap-2">
                    {/* Categoría */}
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        {product.category}
                    </p>

                    {/* Nombre */}
                    <h3 className="font-bold text-gray-900 leading-tight mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    {/* Precio */}
                    <p className="text-lg font-bold text-primary mt-1">
                        {formatPrice(product.price)}
                    </p>

                    {/* Vendedor */}
                    <div className="mt-auto pt-2 space-y-1 text-xs text-muted-foreground border-t border-gray-50">
                        <p className="flex items-center gap-1">
                            <span className="font-medium">📍</span>
                            <span className="truncate">{product.vendor.municipality}</span>
                        </p>
                        <p className="flex items-center gap-1">
                            <span className="font-medium">🏪</span>
                            <span className="truncate">{product.vendor.businessName}</span>
                        </p>
                    </div>
                </CardContent>

                {/* Footer: Acciones */}
                <CardFooter className="p-4 pt-0 mt-auto flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        size="sm"
                    >
                        Ver Detalles
                    </Button>

                    <Button
                        variant="default"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Producto agotado" : "Agregar al carrito"}
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}