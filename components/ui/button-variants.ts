import { cva } from "class-variance-authority";

/**
 * Variantes de estilo para el componente Button.
 * Este archivo NO tiene "use client" para permitir su uso en Server Components.
 */
export const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                teal: "bg-teal-500 text-white hover:bg-teal-600",
                orange: "bg-orange-500 text-white hover:bg-orange-600",
                yellow: "bg-yellow-400 text-yellow-900 hover:bg-yellow-500",
                purple: "bg-purple-600 text-white hover:bg-purple-700",
                red: "bg-red-500 text-white hover:bg-red-600",
                blue: "bg-blue-600 text-white hover:bg-blue-700",
                green: "bg-green-600 text-white hover:bg-green-700",
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
