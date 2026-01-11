"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit, Package, Trash2, AlertCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import StockUpdateModal from "./StockUpdateModal";
import { toast } from "sonner";
import { ProductWithVendor } from "@/lib/services/product.service";

/**
 * ProductTable
 * Descripción: Tabla interactiva de productos para vendedores
 * Requiere: Lista de productos del vendedor autenticado
 * Implementa: RF-013 (Gestión de inventario), HU-010
 */

interface ProductTableProps {
    products: ProductWithVendor[];
    onProductUpdated?: () => void;
}

export function ProductTable({
    products,
    onProductUpdated,
}: ProductTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<ProductWithVendor | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return (
                <Badge variant="destructive" className="font-semibold">
                    Agotado
                </Badge>
            );
        }
        if (stock <= 10) {
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Stock Bajo ({stock})
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
                {stock} unidades
            </Badge>
        );
    };

    const handleOpenStockModal = (product: ProductWithVendor) => {
        setSelectedProduct(product);
        setStockModalOpen(true);
    };

    const handleOpenDeleteDialog = (product: ProductWithVendor) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedProduct) return;

        try {
            setIsDeleting(true);

            const response = await fetch(`/api/products/${selectedProduct.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al eliminar producto");
            }

            toast.success("Producto eliminado", {
                description: `"${selectedProduct.name}" ha sido eliminado exitosamente`,
            });

            onProductUpdated?.();
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error al eliminar producto:", error);

            if (error instanceof Error) {
                toast.error("Error", {
                    description: error.message,
                });
            } else {
                toast.error("Error", {
                    description: "No se pudo eliminar el producto",
                });
            }
        } finally {
            setIsDeleting(false);
        }
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes productos</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                    Comienza agregando tu primer producto a la tienda
                </p>
                <Button asChild>
                    <Link href="/dashboard/vendor/products/new">Agregar Producto</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Imagen</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="text-center">Precio</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-center">Categoría</TableHead>
                            <TableHead className="text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted mx-auto">
                                        {product.images.length > 0 ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Package className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="font-medium">{product.name}</TableCell>

                                <TableCell className="text-center">{formatPrice(product.price)}</TableCell>

                                <TableCell className="text-center">{getStockBadge(product.stock)}</TableCell>

                                <TableCell className="text-center">
                                    <Badge variant="outline">
                                        {product.category.charAt(0).toUpperCase() +
                                            product.category.slice(1).toLowerCase()}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link
                                                href={`/vendor/products/${product.id}/edit`}
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Editar producto</span>
                                            </Link>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleOpenStockModal(product)}
                                        >
                                            <Package className="h-4 w-4" />
                                            <span className="sr-only">Actualizar stock</span>
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleOpenDeleteDialog(product)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Eliminar producto</span>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedProduct && (
                <StockUpdateModal
                    product={{
                        id: selectedProduct.id,
                        name: selectedProduct.name,
                        stock: selectedProduct.stock,
                    }}
                    isOpen={stockModalOpen}
                    onClose={() => {
                        setStockModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onStockUpdated={() => {
                        onProductUpdated?.();
                        setStockModalOpen(false);
                        setSelectedProduct(null);
                    }}
                />
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            ¿Eliminar producto?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar{" "}
                            <span className="font-semibold">{selectedProduct?.name}</span>?
                            Esta acción no se puede deshacer.
                            {selectedProduct && selectedProduct.stock > 0 && (
                                <span className="block mt-2 text-yellow-600 font-semibold">
                                    ⚠️ Este producto aún tiene {selectedProduct.stock} unidades en
                                    stock.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Tabla completa de gestión de productos para vendedores. Incluye visualización
 * de datos, indicadores de stock, y acciones (editar, actualizar stock, eliminar).
 *
 * Lógica Clave:
 * - formatPrice: Formatea números a COP con separadores de miles usando
 *   Intl.NumberFormat para mantener consistencia con el locale colombiano.
 * - getStockBadge: Retorna badge con color según nivel de stock:
 *   Rojo (stock = 0), Amarillo (stock <= 10), Verde (stock > 10).
 * - handleDelete: Elimina producto con confirmación previa mediante AlertDialog.
 *   Valida respuesta de API y muestra feedback apropiado.
 * - Empty state: Muestra mensaje amigable cuando no hay productos registrados,
 *   con botón directo para agregar el primero.
 *
 * Dependencias Externas:
 * - Table: Componentes de tabla de shadcn/ui para estructura semántica.
 * - AlertDialog: Confirmación de eliminación con contexto del producto.
 * - StockUpdateModal: Modal especializado para actualización rápida de inventario.
 * - sonner: Librería para notificaciones toast (toast.success, toast.error).
 * - next/image: Optimización automática de imágenes de productos.
 * - lucide-react: Iconos consistentes con el sistema de diseño.
 *
 * Estados:
 * - deleteDialogOpen: Controla visibilidad de diálogo de confirmación.
 * - stockModalOpen: Controla visibilidad de modal de actualización de stock.
 * - selectedProduct: Producto seleccionado para operación actual.
 * - isDeleting: Loading state durante proceso de eliminación.
 */