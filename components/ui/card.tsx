import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground shadow-md rounded-lg overflow-hidden",
  {
    variants: {
      accentColor: {
        default: "border-t-4 border-t-border",
        teal: "border-t-4 border-t-teal-500",
        orange: "border-t-4 border-t-orange-500",
        yellow: "border-t-4 border-t-yellow-400",
        purple: "border-t-4 border-t-purple-600",
        red: "border-t-4 border-t-red-600",
        blue: "border-t-4 border-t-blue-600",
        green: "border-t-4 border-t-green-600",
        none: "border-t-0",
      },
    },
    defaultVariants: {
      accentColor: "default",
    },
  }
)

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, accentColor, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ accentColor }), className)}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border-b border-border flex flex-col space-y-1.5", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold text-foreground leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-4", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * **Descripción General:**
 * Componente Card estandarizado y personalizable. Extiende la funcionalidad
 * base de shadcn/ui con soporte para "acentos de color" personalizados
 * mediante `class-variance-authority`.
 *
 * **Lógica Clave:**
 * - Soporte para `accentColor`: Permite definir un borde superior de color
 *   (teal, orange, purple, etc.) para categorizar visualmente las tarjetas,
 *   manteniendo compatibilidad total con la API estándar de shadcn (CardHeader, CardContent).
 * - ForwardRefs: Todos los subcomponentes exponen refs para máxima flexibilidad.
 * - Soporte de Temas: Utiliza variables semánticas (bg-card, text-card-foreground)
 *   para adaptarse automáticamente a los temas Light, Dark y Solarized.
 *
 * **Dependencias Externas:**
 * - React, class-variance-authority (cva).
 */
