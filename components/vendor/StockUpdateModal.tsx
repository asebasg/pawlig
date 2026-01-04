"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Minus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateStockSchema } from "@/lib/validations/product.schema";
import { ZodError } from "zod";

/**
 * StockUpdateModal
 * Descripción: Modal para actualización rápida de inventario de productos
 * Estilo: Basado en BlockUserModal (Custom Tailwind implementation)
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

    if (!isOpen) return null;

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-100">
                            <Package className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Actualizar Stock
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Stock Actual</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {product.stock} <span className="text-sm font-normal text-gray-500">unidades</span>
                        </p>
                        <p className="text-sm font-medium mt-1 text-purple-600">
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
                                <input
                                    type="number"
                                    value={newStock}
                                    onChange={handleInputChange}
                                    className="w-20 text-center text-xl font-bold border rounded-md py-1 focus:ring-2 focus:ring-purple-500 outline-none"
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
                                <p className="text-sm text-gray-500">
                                    Nuevo stock:{" "}
                                    <span className="font-bold text-gray-900">
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

                {/* Footer / Actions */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!hasChanges || isLoading}
                        className="flex-1 px-4 py-2 bg-purple-600 rounded-lg font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Guardar Cambios"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}