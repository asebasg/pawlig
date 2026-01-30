"use client";

import { useState, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

/**
 * Resumen:
 * Componente de filtros CONTROLADO para el catálogo de productos.
 * Recibe estado y handlers del padre, eliminando manipulación directa de URL para evitar throttling.
 */

// const CATEGORIES = [
//     { value: "ALIMENTO", label: "Alimento" },
//     { value: "HIGIENE", label: "Higiene" },
//     { value: "JUGUETES", label: "Juguetes" },
//     { value: "MEDICAMENTOS", label: "Medicamentos" },
//     { value: "OTROS", label: "Otros" },
// ];

const MUNICIPALITIES = [
    { value: "MEDELLIN", label: "Medellín" },
    { value: "BELLO", label: "Bello" },
    { value: "ITAGUI", label: "Itagüí" },
    { value: "ENVIGADO", label: "Envigado" },
    { value: "SABANETA", label: "Sabaneta" },
    { value: "LA_ESTRELLA", label: "La Estrella" },
    { value: "CALDAS", label: "Caldas" },
    { value: "COPACABANA", label: "Copacabana" },
    { value: "GIRARDOTA", label: "Girardota" },
    { value: "BARBOSA", label: "Barbosa" },
];

const AVAILABILITY_OPTIONS = [
    { value: "all", label: "Todos los productos" },
    { value: "in_stock", label: "En Stock" },
    { value: "low_stock", label: "Stock bajo (≤ 10)" },
];

interface ProductFilters {
    search: string;
    minPrice: string;
    maxPrice: string;
    category: string[];
    municipality: string;
    availability: string;
}

interface ProductFilterProps {
    filters: ProductFilters;
    onFilterChange: (key: keyof ProductFilters, value: string | string[]) => void;
    onClearFilters: () => void;
}

export function ProductFilter({ filters, onFilterChange, onClearFilters }: ProductFilterProps) {
    // Estados locales solo para inputs de texto (debounce)
    const [localSearch, setLocalSearch] = useState(filters.search);
    const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
    const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

    // Sincronizar estado local si las props cambian externamente (ej: botón limpiar)
    useEffect(() => {
        setLocalSearch(filters.search);
        setLocalMinPrice(filters.minPrice);
        setLocalMaxPrice(filters.maxPrice);
    }, [filters.search, filters.minPrice, filters.maxPrice]);

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== filters.search) {
                onFilterChange("search", localSearch);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch, filters.search, onFilterChange]);

    // Debounce para precios
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localMinPrice !== filters.minPrice) {
                onFilterChange("minPrice", localMinPrice);
            }
            if (localMaxPrice !== filters.maxPrice) {
                onFilterChange("maxPrice", localMaxPrice);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localMinPrice, localMaxPrice, filters.minPrice, filters.maxPrice, onFilterChange]);

    // const handleCategoryChange = (category: string, checked: boolean) => {
    //     const currentCategories = filters.category || [];
    //     const newCategories = checked
    //         ? [...currentCategories, category]
    //         : currentCategories.filter((c) => c !== category);

    //     onFilterChange("category", newCategories);
    // };

    const hasActiveFilters =
        filters.search ||
        (filters.category && filters.category.length > 0) ||
        (filters.municipality && filters.municipality !== "all") ||
        (filters.availability && filters.availability !== "all") ||
        filters.minPrice ||
        filters.maxPrice;

    return (
        <div className="space-y-6">
            {/* Header con título y reset */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">Filtros</h2>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-muted-foreground"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Búsqueda por texto */}
            <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="search"
                        type="text"
                        placeholder="Buscar productos..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Categorías (Deshabilitado temporalmente) */}
            {/* <div className="space-y-3">
                <Label className="flex flex-inline items-center">Categoría</Label>
                <div className="space-y-2 opacity-60 cursor-not-allowed">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.value} className="flex items-center gap-2">
                            <Checkbox
                                id={cat.value}
                                checked={filters.category?.includes(cat.value)}
                                disabled={true}
                                onCheckedChange={(checked) =>
                                    handleCategoryChange(cat.value, checked as boolean)
                                }
                            />
                            <Label
                                htmlFor={cat.value}
                                className="text-sm font-normal cursor-not-allowed"
                            >
                                {cat.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Rango de precio */}
            <div className="space-y-3">
                <Label>Rango de precio (COP)</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Input
                            type="number"
                            placeholder="Min"
                            value={localMinPrice}
                            onChange={(e) => setLocalMinPrice(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={localMaxPrice}
                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Disponibilidad */}
            <div className="space-y-3">
                <Label>Disponibilidad</Label>
                <RadioGroup
                    value={filters.availability || "all"}
                    onValueChange={(val) => onFilterChange("availability", val)}
                >
                    {AVAILABILITY_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label
                                htmlFor={option.value}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Municipio */}
            <div className="space-y-2">
                <Label htmlFor="municipality">Municipio</Label>
                <Select
                    value={filters.municipality || "all"}
                    onValueChange={(val) => onFilterChange("municipality", val)}
                >
                    <SelectTrigger id="municipality">
                        <SelectValue placeholder="Todos los municipios" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los municipios</SelectItem>
                        {MUNICIPALITIES.map((mun) => (
                            <SelectItem key={mun.value} value={mun.value}>
                                {mun.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}