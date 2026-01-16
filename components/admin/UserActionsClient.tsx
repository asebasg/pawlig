"use client";

import { useRouter } from "next/navigation";
import BlockUserButton from "@/components/admin/BlockUserButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareChartGantt } from "lucide-react";

/**
 * Descripción: Contenedor cliente para acciones administrativas rápidas sobre un usuario (como bloqueo).
 * Requiere: Objeto de usuario básico.
 * Implementa: Interfaz de gestión rápida en perfil de usuario.
 */

interface UserActionsClientProps {
    user: {
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        role: string;
    };
}

export default function UserActionsClient({ user }: UserActionsClientProps) {
    const router = useRouter();

    return (
        <Card accentColor="red">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">
                    <div className="flex items-center gap-2">
                        <SquareChartGantt className="w-5 h-5" />
                        <span>Acciones de cuenta</span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <div className="w-full">
                            <BlockUserButton
                                user={user}
                                onSuccess={() => router.refresh()}
                                showLabel={true}
                                className="justify-start"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente agrupa acciones críticas que se pueden realizar sobre una cuenta
 * de usuario en una tarjeta visualmente diferenciada.
 *
 * Lógica Clave:
 * - useRouter: Utilizado para refrescar la ruta actual tras una acción exitosa.
 * - Composición: Delega la lógica específica de bloqueo al componente 'BlockUserButton'.
 *
 * Dependencias Externas:
 * - lucide-react: Para iconografía de gestión.
 * - @/components/ui/card: Para estructura de contenedor consistente.
 *
 */