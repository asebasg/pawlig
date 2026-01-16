"use client";

import { useState } from "react";
import { UserX, UserCheck } from "lucide-react";
import BlockUserModal from "@/app/(dashboard)/admin/users/BlockUserModal";

/**
 * POST /api/admin/users/[id]/block
 * Descripción: Botón para alternar el estado de bloqueo de un usuario con modal de confirmación.
 * Requiere: Usuario autenticado con privilegios de administrador.
 * Implementa: Gestión de estado de cuenta de usuario.
 */

interface BlockUserButtonProps {
    user: {
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        role: string;
    };
    onSuccess: () => void;
    showLabel?: boolean;
    className?: string;
    "aria-label"?: string; // Aceptar aria-label explícito si se pasa
}

export default function BlockUserButton({ user, onSuccess, showLabel = false, className = "", ...props }: BlockUserButtonProps) {
    const [showModal, setShowModal] = useState(false);

    // No permitir bloquear administradores
    if (user.role === "ADMIN") {
        return null;
    }

    const handleSuccess = () => {
        setShowModal(false);
        onSuccess();
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${user.isActive
                    ? "text-red-600 hover:bg-red-50"
                    : "text-green-600 hover:bg-green-50"
                    } ${className}`}
                aria-label={props["aria-label"] || `${user.isActive ? "Bloquear usuario" : "Desbloquear usuario"}`}
            >
                {user.isActive ? (
                    <UserX className="w-5 h-5" />
                ) : (
                    <UserCheck className="w-5 h-5" />
                )}
                {showLabel && (
                    <span className="font-medium">
                        {user.isActive ? "Bloquear usuario" : "Desbloquear usuario"}
                    </span>
                )}
            </button>

            {showModal && (
                <BlockUserModal
                    user={user}
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente proporciona un botón interactivo que permite bloquear o 
 * desbloquear a un usuario, integrando un modal para capturar la razón de la acción.
 *
 * Lógica Clave:
 * - Filtro Admin: El componente retorna null si el usuario a gestionar tiene rol 'ADMIN',
 *   previniendo que administradores se auto-bloqueen o bloqueen a otros.
 * - Integración de Modal: Gestiona el estado de apertura de 'BlockUserModal'.
 * - Callback onSuccess: Permite notificar al componente padre para refrescar los datos.
 *
 * Dependencias Externas:
 * - lucide-react: Para iconos de estado de cuenta (UserX, UserCheck).
 * - BlockUserModal: Componente para gestionar la lógica de negocio del bloqueo.
 *
 */
