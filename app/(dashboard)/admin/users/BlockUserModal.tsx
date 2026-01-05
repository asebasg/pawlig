// app/(dashboard)/admin/users/BlockUserModal.tsx

"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BlockUserModalProps {
    user: {
        id: string;
        name: string;
        email: string;
        isActive: boolean;
    };
    onClose: () => void;
    onSuccess: () => void;
}

export default function BlockUserModal({ user, onClose, onSuccess }: BlockUserModalProps) {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const action = user.isActive ? "BLOCK" : "UNBLOCK";

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (reason.trim().length < 10) {
            setError("El motivo debe tener al menos 10 caracteres");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/admin/users/${user.id}/block`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    reason: reason.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al procesar la acción");
            }

            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader className="flex flex-col items-center gap-4 border-b border-gray-200 pb-6">
                    <div className={`p-3 rounded-full ${user.isActive ? 'bg-red-100' : 'bg-green-100'}`}>
                        <AlertTriangle className={`w-10 h-10 ${user.isActive ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <DialogTitle className="text-xl font-bold text-gray-900 text-center">
                        {user.isActive ? "Bloquear usuario" : "Desbloquear usuario"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg text-left">
                        <p className="text-sm text-gray-600 font-bold">Usuario:</p>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo del {user.isActive ? "bloqueo" : "desbloqueo"} <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={
                                user.isActive
                                    ? "Ejemplo: Publicación de contenido inapropiado..."
                                    : "Ejemplo: Se resolvió el problema reportado..."
                            }
                            rows={3}
                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            disabled={loading}
                            required
                            minLength={10}
                            maxLength={500}
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Mínimo 10 caracteres ({reason.length}/500)
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 text-left">
                            {error}
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left w-full">
                        <p className="text-sm text-yellow-800 break-words whitespace-normal">
                            <strong>Nota:</strong> Esta acción se registrará en el historial de auditoría y el usuario recibirá una notificación por email.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || reason.trim().length < 10}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 ${user.isActive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                `${user.isActive ? "Bloquear" : "Desbloquear"} usuario`
                            )}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}