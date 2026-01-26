"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Minus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateStockSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

/**
 * StockUpdateModal
 * Descripción: Modal para actualización rápida de inventario de productos
 * Estilo: shadcn/ui Dialog (Customized to match BlockUserModal visual)
 */

interface StockUpdateModalProps {
    product: {
        id: string;
        name: string;
        stock: number;
    };
    isOpen: boolean;
    onClose: () => void;
    onStockUpdated: () => void;
}

export default function StockUpdateModal({
    product,
    isOpen,
    onClose,
    onStockUpdated,
}: StockUpdateModalProps) {
    const [newStock, setNewStock] = useState(product.stock);
    const [isLoading, setIsLoading] = useState(false);

    // Reset stock cuando cambia el producto o se abre el modal
    useEffect(() => {
        if (isOpen) {
            setNewStock(product.stock);
        }
    }, [isOpen, product.stock]);

    // Handle dialog open change
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    // Incrementar stock por cantidad específica
    const increment = (amount: number) => {
        setNewStock((prev) => prev + amount);
    };

    // Decrementar stock por cantidad específica (sin permitir negativos)
    const decrement = (amount: number) => {
        setNewStock((prev) => Math.max(0, prev - amount));
    };

    // Manejar cambio directo en input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setNewStock(value);
        } else if (e.target.value === "") {
            setNewStock(0);
        }
    };

    // Guardar cambios
    const handleSave = async () => {
        try {
            // Validar con Zod
            updateStockSchema.parse({ stock: newStock });

            setIsLoading(true);

            const response = await fetch(`/api/products/${product.id}/stock`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stock: newStock }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al actualizar stock");
            }

            toast.success(`Stock de "${product.name}" actualizado a ${newStock} unidades`);

            onStockUpdated();
            onClose();
        } catch (error) {
            console.error("Error al actualizar stock:", error);

            if (error instanceof ZodError) {
                toast.error(error.issues[0].message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("No se pudo actualizar el stock");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Deshabilitar guardado si no hay cambios
    const hasChanges = newStock !== product.stock;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-card">
                <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
                    <div className="p-3 rounded-full bg-purple-100">
                        <Package className="w-10 h-10 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                        Actualizar Stock
                    </DialogTitle>

                </DialogHeader>

                {/* Content */}
                <div className="pb-2">
                    <div className="bg-muted rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1 font-semibold">Stock actual del producto:</p>
                        <p className="text-2xl font-bold text-foreground">
                            {product.stock} <span className="text-sm font-normal text-muted-foreground">{product.stock === 1 ? 'unidad' : 'unidades'}</span>
                        </p>
                        <p className="text-sm font-medium mt-1 text-primary">
                            {product.name}
                        </p>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center justify-center gap-2 w-full">
                            {/* Decrement Group */}
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => decrement(10)}
                                    disabled={newStock < 10}
                                >
                                    -10
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => decrement(5)}
                                    disabled={newStock < 5}
                                >
                                    -5
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => decrement(1)}
                                    disabled={newStock < 1}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Input */}
                            <div className="relative">
                                <Input
                                    type="number"
                                    value={newStock}
                                    onChange={handleInputChange}
                                    className="w-24 text-center text-xl font-bold h-10 p-1"
                                    min={0}
                                />
                            </div>

                            {/* Increment Group */}
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => increment(1)}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => increment(5)}
                                >
                                    +5
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => increment(10)}
                                >
                                    +10
                                </Button>
                            </div>
                        </div>

                        {/* Indicador de cambios */}
                        {hasChanges && (
                            <div className="text-center animate-in fade-in zoom-in duration-200">
                                <p className="text-sm text-muted-foreground">
                                    Nuevo stock:{" "}
                                    <span className="font-bold text-foreground">
                                        {newStock}
                                    </span>
                                </p>
                                <p className={`text-xs font-medium mt-1 ${newStock > product.stock ? 'text-green-600' : 'text-red-600'}`}>
                                    {newStock > product.stock ? "Aumentando" : "Disminuyendo"} {Math.abs(newStock - product.stock)} unidades
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="flex gap-3 pt-2 sm:justify-between w-full">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={!hasChanges || isLoading}
                        className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-white"
                    >
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Modal especializado para la actualización rápida del stock de un producto.
 * Permite ajustes incrementales o entrada directa de valores numéricos.
 *
 * Lógica Clave:
 * - useState(newStock): Mantiene el estado local del stock durante la edición.
 * - increment/decrement: Helpers para modificar stock en pasos predefinidos (1, 5, 10).
 * - handleSave: Valida con Zod (updateStockSchema) y envía petición PUT a la API.
 * - hasChanges: Deshabilita el guardado si no hay modificaciones reales.
 *
 * Dependencias Externas:
 * - shadcn/ui: Dialog, Button, Input para consistencia visual.
 * - sonner: Feedback al usuario (éxito/error).
 * - lucide-react: Iconografía (Package, Plus, Minus, etc).
 * - zod: Validación de tipos y restricciones de negocio.
 *
 * Estados:
 * - isLoading: Bloquea la interfaz durante la petición asíncrona.
 * - isOpen: Controlado por el componente padre (ProductTable).
 */
