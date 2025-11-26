"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

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
    const actionLabel = user.isActive ? "bloquear" : "desbloquear";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${user.isActive ? 'bg-red-100' : 'bg-green-100'}`}>
                            <AlertTriangle className={`w-5 h-5 ${user.isActive ? 'text-red-600' : 'text-green-600'}`} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {user.isActive ? "Bloquear usuario" : "Desbloquear usuario"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600">Usuario:</p>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivo {user.isActive ? "del bloqueo" : "del desbloqueo"} <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder={
                                user.isActive
                                    ? "Ejemplo: Publicación de contenido inapropiado..."
                                    : "Ejemplo: Se resolvió el problema reportado..."
                            }
                            rows={4}
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
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            <strong>Nota:</strong> Esta acción se registrará en el historial de auditoría
                            y el usuario recibirá una notificación por email.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
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
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                `${user.isActive ? "Bloquear" : "Desbloquear"} usuario`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}