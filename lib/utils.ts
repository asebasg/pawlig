import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Resúmen:
 * Utilidad para combinar clases de Tailwind CSS de manera segura.
 * Utiliza clsx para manejar condicionales y twMerge para resolver conflictos.
 */

/**
 * Combina clases de CSS utilizando clsx y tailwind-merge.
 * 
 * @param inputs - Clases CSS a combinar (strings, arrays, objetos condicionales)
 * @returns String con las clases CSS combinadas y sin conflictos
 * 
 * @example
 * cn("px-2 py-1", "px-4") // => "py-1 px-4" (px-4 sobrescribe px-2)
 * cn("text-red-500", condition && "text-blue-500") // Condicional
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo proporciona la función utilitaria `cn()` (classnames) que es
 * fundamental para trabajar con Tailwind CSS y shadcn/ui. Combina las
 * capacidades de `clsx` (manejo de clases condicionales) y `tailwind-merge`
 * (resolución de conflictos de clases de Tailwind).
 *
 * Lógica Clave:
 * - clsx: Permite pasar clases como strings, arrays, objetos condicionales,
 *   y las normaliza en un string único.
 * - tailwind-merge: Resuelve conflictos cuando hay clases de Tailwind que
 *   afectan la misma propiedad CSS (ej: px-2 y px-4). La última clase
 *   prevalece, evitando estilos duplicados o conflictivos.
 *
 * Casos de Uso:
 * - Componentes con variantes: Combinar clases base con clases condicionales
 * - Sobrescribir estilos: Permitir que props className sobrescriban estilos
 * - Clases dinámicas: Aplicar estilos basados en estado o props
 *
 * Dependencias Externas:
 * - clsx: Manejo de clases condicionales
 * - tailwind-merge: Resolución inteligente de conflictos de Tailwind CSS
 */
