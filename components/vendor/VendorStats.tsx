import { Package, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Resúmen:
 * Componente de presentación que muestra un resumen estadístico del inventario
 * del vendedor mediante tarjetas visuales con métricas clave.
 */

interface VendorStatsProps {
    stats: {
        total: number;
        inStock: number;
        outOfStock: number;
        lowStock: number;
    };
}

export function VendorStats({ stats }: VendorStatsProps) {
    const statCards = [
        {
            title: "Total Productos",
            value: stats.total,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            accentColor: "teal",
        },
        {
            title: "En Stock",
            value: stats.inStock,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-100",
            accentColor: "green",
        },
        {
            title: "Agotados",
            value: stats.outOfStock,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-100",
            accentColor: "red",
        },
        {
            title: "Stock Bajo",
            value: stats.lowStock,
            icon: AlertTriangle,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
            accentColor: "yellow",
        },
    ] as const;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat) => (
                <Card key={stat.title} accentColor={stat.accentColor}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className={`p-2 mb-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-center">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Visualización dashboard-style de métricas de inventario. Utiliza un diseño
 * de grid responsivo para adaptarse a diferentes tamaños de pantalla.
 *
 * Lógica Clave:
 * - Configuración dinámica: Utiliza un array `statCards` para iterar y generar
 *   las tarjetas, facilitando la adición de nuevas métricas en el futuro sin
 *   duplicar código JSX.
 * - Estilos condicionales: Aplica colores semánticos (verde para stock ok,
 *   rojo para agotado, etc.) basados en la configuración de cada métrica.
 *
 * Dependencias Externas:
 * - Lucide React: Iconografía consistente.
 * - Shadcn UI (Card): Componentes base para contenedores visuales.
 */
