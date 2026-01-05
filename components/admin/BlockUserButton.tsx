"use client";

import { useState } from "react";
import { UserX, UserCheck } from "lucide-react";
import BlockUserModal from "@/app/(dashboard)/admin/users/BlockUserModal";

interface BlockUserButtonProps {
    user: {
        id: string;
        name: string;
        email: string;
        isActive: boolean;
        role: string;
    };
    onSuccess: () => void;
}

export default function BlockUserButton({ user, onSuccess }: BlockUserButtonProps) {
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
                    }`}
                aria-label={user.isActive ? "Bloquear usuario" : "Desbloquear usuario"}
            >
                {user.isActive ? (
                    <UserX className="w-4 h-4" />
                ) : (
                    <UserCheck className="w-4 h-4" />
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
