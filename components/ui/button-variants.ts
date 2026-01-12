import { cva } from "class-variance-authority";

/**
 * Variantes de estilo para el componente Button.
 * Este archivo NO tiene "use client" para permitir su uso en Server Components.
 */
export const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/20 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-purple-600 text-white hover:bg-purple-700",
                destructive: "bg-red-600 text-white hover:bg-red-500",
                outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
                ghost: "hover:bg-gray-100",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-3 rounded-md",
                lg: "h-11 px-8 rounded-md",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);
