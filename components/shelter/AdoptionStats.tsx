import { Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Resumen: Componente de presentación para mostrar estadísticas de adopción.
 * Muestra el total, pendientes, aprobadas y rechazadas.
 * Implementa: Estándar visual de PawLig.
 */

interface AdoptionStatsProps {
    data: {
        status: string;
        _count: number;
    }[];
}

export function AdoptionStats({ data }: AdoptionStatsProps) {
    // Procesamos la lógica de negocio internamente para mantener limpia la página principal
    const stats = {
        total: data.reduce((sum, s) => sum + s._count, 0),
        pending: data.find((s) => s.status === 'PENDING')?._count || 0,
        approved: data.find((s) => s.status === 'APPROVED')?._count || 0,
        rejected: data.find((s) => s.status === 'REJECTED')?._count || 0,
    };

    const statCards = [
        {
            title: "Total Postulaciones",
            value: stats.total,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            accentColor: "blue",
        },
        {
            title: "Pendientes",
            value: stats.pending,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
            accentColor: "yellow",
        },
        {
            title: "Aprobadas",
            value: stats.approved,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-100",
            accentColor: "green",
        },
        {
            title: "Rechazadas",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-100",
            accentColor: "red",
        },
    ] as const;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((stat) => (
                <Card key={stat.title} accentColor={stat.accentColor}>
                    <CardHeader className="flex flex-row items-center justify-start gap-4">
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                        <CardTitle className="text-sm font-semibold">
                            {stat.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-extrabold text-center">{stat.value}</div>
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
 * Componente visual que renderiza métricas de adopción en formato de tarjetas.
 * Diseñado para ser consistente con VendorStats.
 *
 * Lógica Clave:
 * - Mapeo de Datos: Transforma un objeto plano de estadísticas en un array
 *   configurado con iconos y colores para una renderización limpia.
 * - Estética: Utiliza el componente Card con accentColor para refuerzo visual.
 *
 * Dependencias Externas:
 * - Lucide React: Iconografía para identificar cada tipo de estado.
 * - Shadcn UI (Card): Contenedores base estandarizados.
 */
