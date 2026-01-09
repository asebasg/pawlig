"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Resumen:
 * Componente de tarjeta de producto para el catálogo público.
 * Muestra imagen, información básica del producto, precio, stock y acciones.
 */

interface ProductCardProps {
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
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
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
                <Badge variant="destructive" className="absolute top-2 right-2">
                    Agotado
                </Badge>
            );
        }
        if (product.stock <= 10) {
            return (
                <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
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
        <Link href={`/productos/${product.id}`}>
            <div
                className={cn(
                    "group relative bg-white rounded-lg border shadow-sm overflow-hidden transition-all duration-200",
                    "hover:shadow-md hover:-translate-y-1",
                    isOutOfStock && "opacity-75"
                )}
            >
                {/* Imagen del producto */}
                <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {getStockBadge()}
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-4 space-y-2">
                    {/* Categoría */}
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {product.category}
                    </p>

                    {/* Nombre del producto */}
                    <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem]">
                        {product.name}
                    </h3>

                    {/* Precio */}
                    <p className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                    </p>

                    {/* Información del vendedor */}
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1">
                            <span className="font-medium">📍</span>
                            {product.vendor.municipality}
                        </p>
                        <p className="flex items-center gap-1">
                            <span className="font-medium">🏪</span>
                            {product.vendor.businessName}
                        </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 pt-2">
                        <Button
                            variant="outline"
                            className="flex-1"
                            asChild
                        >
                            <span>Ver Detalles</span>
                        </Button>

                        <Button
                            variant="default"
                            size="icon"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            title={isOutOfStock ? "Producto agotado" : "Agregar al carrito"}
                        >
                            <ShoppingCart className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente de tarjeta de producto para mostrar en el catálogo público.
 * Muestra imagen, precio, stock, información del vendedor y acciones.
 *
 * Lógica Clave:
 * - Badges de Stock:
 *   • stock === 0 → Badge rojo "Agotado"
 *   • stock <= 10 → Badge amarillo "Stock Bajo"
 *   • stock > 10 → Sin badge
 * 
 * - Formato de Precio:
 *   Usa Intl.NumberFormat para formato COP sin decimales.
 *   Ejemplo: 45000 → "$45.000"
 * 
 * - Optimización de Imágenes:
 *   Next.js Image con fill + aspect-square para mantener proporción 1:1.
 *   sizes optimiza carga según viewport.
 * 
 * - Interacción con Carrito:
 *   onClick del botón carrito ejecuta callback onAddToCart.
 *   e.preventDefault() evita navegación al hacer clic en botón.
 * 
 * - Estados Visuales:
 *   • Hover: Elevación (shadow-md) + traslación (-1px)
 *   • Agotado: Opacidad reducida + botón disabled
 *   • Imagen hover: Scale 1.05 en transición suave
 * 
 * - Accesibilidad:
 *   • title en botón carrito para tooltip
 *   • disabled en botón si stock === 0
 *   • alt text en imagen
 *   • line-clamp-2 para limitar nombre a 2 líneas
 *
 * Dependencias Externas:
 * - next/image: Optimización automática de imágenes
 * - lucide-react: Icono ShoppingCart
 * - shadcn/ui: Badge, Button components
 * - cn utility: Combinar clases Tailwind condicionalmente
 */