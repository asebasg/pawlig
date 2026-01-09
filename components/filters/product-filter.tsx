"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
 * Componente de filtros para el catálogo de productos.
 * Permite filtrar por categoría, rango de precio, disponibilidad, municipio y búsqueda por texto.
 */

const CATEGORIES = [
    { value: "ALIMENTO_PERROS", label: "Alimento para perros" },
    { value: "ALIMENTO_GATOS", label: "Alimento para gatos" },
    { value: "ACCESORIOS", label: "Accesorios" },
    { value: "MEDICAMENTOS", label: "Medicamentos" },
    { value: "JUGUETES", label: "Juguetes" },
    { value: "HIGIENE", label: "Higiene y cuidado" },
];

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
    { value: "in_stock", label: "Solo en stock" },
    { value: "low_stock", label: "Stock bajo (≤ 10)" },
];

interface ProductFilterProps {
    onFiltersChange?: (filters: Record<string, string | string[]>) => void;
}

export function ProductFilter({ onFiltersChange }: ProductFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get("category")?.split(",").filter(Boolean) || []
    );
    const [municipality, setMunicipality] = useState(
        searchParams.get("municipality") || "all"
    );
    const [availability, setAvailability] = useState(
        searchParams.get("availability") || "all"
    );
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    const updateURL = (filters: Record<string, string | string[]>) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== "all" && (Array.isArray(value) ? value.length > 0 : true)) {
                params.set(key, Array.isArray(value) ? value.join(",") : String(value));
            }
        });

        router.push(`/productos?${params.toString()}`, { scroll: false });
    };

    const handleApplyFilters = () => {
        const filters = {
            search,
            category: selectedCategories,
            municipality: municipality !== "all" ? municipality : "",
            availability: availability !== "all" ? availability : "",
            minPrice,
            maxPrice,
        };

        updateURL(filters);
        if (onFiltersChange) {
            onFiltersChange(filters);
        }
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedCategories([]);
        setMunicipality("all");
        setAvailability("all");
        setMinPrice("");
        setMaxPrice("");

        router.push("/productos", { scroll: false });
        if (onFiltersChange) {
            onFiltersChange({});
        }
    };

    const handleCategoryChange = (category: string, checked: boolean) => {
        setSelectedCategories((prev) =>
            checked ? [...prev, category] : prev.filter((c) => c !== category)
        );
    };

    const hasActiveFilters =
        search ||
        selectedCategories.length > 0 ||
        municipality !== "all" ||
        availability !== "all" ||
        minPrice ||
        maxPrice;

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
                        onClick={handleResetFilters}
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                        className="pl-9"
                    />
                </div>
            </div>

            {/* Categorías */}
            <div className="space-y-3">
                <Label>Categoría</Label>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <div key={category.value} className="flex items-center gap-2">
                            <Checkbox
                                id={category.value}
                                checked={selectedCategories.includes(category.value)}
                                onCheckedChange={(checked) =>
                                    handleCategoryChange(category.value, checked as boolean)
                                }
                            />
                            <Label
                                htmlFor={category.value}
                                className="text-sm font-normal cursor-pointer"
                            >
                                {category.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rango de precio */}
            <div className="space-y-3">
                <Label>Rango de precio (COP)</Label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div>
                        <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Disponibilidad */}
            <div className="space-y-3">
                <Label>Disponibilidad</Label>
                <RadioGroup value={availability} onValueChange={setAvailability}>
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
                <Select value={municipality} onValueChange={setMunicipality}>
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

            {/* Botón aplicar filtros */}
            <Button onClick={handleApplyFilters} className="w-full">
                Aplicar Filtros
            </Button>
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente de filtros para el catálogo de productos. Maneja estado local
 * de filtros y sincroniza con URL query params para persistencia.
 *
 * Lógica Clave:
 * - Sincronización con URL:
 *   Los filtros se sincronizan con query params en la URL mediante useSearchParams.
 *   Al aplicar filtros, se actualiza la URL con router.push().
 *   Esto permite compartir enlaces con filtros aplicados y persistencia al recargar.
 * 
 * - Estado Local:
 *   Cada filtro tiene su propio useState para manejar cambios antes de aplicar.
 *   Los cambios no se aplican inmediatamente, sino al hacer clic en "Aplicar Filtros".
 * 
 * - Categorías Múltiples:
 *   Usa checkboxes para permitir selección múltiple.
 *   Se almacena como array y se serializa como string separado por comas en URL.
 * 
 * - Validaciones:
 *   minPrice y maxPrice aceptan solo números.
 *   Valores vacíos o "all" no se incluyen en query params.
 * 
 * - Limpiar Filtros:
 *   Botón "Limpiar" visible solo cuando hay filtros activos.
 *   Resetea todos los estados y limpia query params de la URL.
 * 
 * - Enter en búsqueda:
 *   Presionar Enter en el input de búsqueda aplica filtros automáticamente.
 *
 * Dependencias Externas:
 * - next/navigation: useRouter, useSearchParams para manejo de URL
 * - lucide-react: Iconos Search, X, SlidersHorizontal
 * - shadcn/ui: Button, Input, Label, Checkbox, RadioGroup, Select
 */