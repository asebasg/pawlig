"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button-variants";
// import EditUserModal from "@/app/(dashboard)/admin/moderation/users/edit-user-modal";

/**
 * PUT /api/admin/users/[id] (Pendiente)
 * Descripción: Botón para editar la información de un usuario con modal de actualización.
 * Requiere: Usuario autenticado con privilegios de administrador.
 * Implementa: Gestión de información de cuenta de usuario.
 */

interface EditUserButtonProps {
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
  "aria-label"?: string;
}

export default function EditUserButton({
  user,
  onSuccess,
  showLabel = false,
  className = "",
  ...props
}: EditUserButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = () => {
    setShowModal(false);
    onSuccess();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition text-blue-600 hover:bg-blue-50 ${className}`}
        aria-label={props["aria-label"] || "Editar usuario"}
      >
        <Edit className="w-5 h-5" />
        {showLabel && <span className="font-medium">Editar usuario</span>}
      </button>

      {/* 
        TODO: Reemplazar con el componente real EditUserModal
        {showModal && (
          <EditUserModal
            user={user}
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Editar Usuario</h2>
            <p className="text-gray-700 mb-6 text-sm">
              Formulario de edición en construcción para {user.name}...
            </p>
            <div className="flex justify-center gap-3">
              {/* <Link href={`/admin/moderation/users/edit/${user.id`}`}> */}
              <button
                onClick={handleSuccess}
                className={cn(buttonVariants({ variant: "default", size: "sm" }))}
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setShowModal(false)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
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
 * Este componente proporciona un botón interactivo que permite abrir un modal
 * de edición para modificar la información de un usuario.
 *
 * Lógica Clave:
 * - Integración de Modal: Gestiona el estado de apertura del modal de edición
 *   (actualmente mostrando un placeholder).
 * - Callback onSuccess: Permite notificar al componente padre para refrescar
 *   los datos tras guardar los cambios.
 *
 * Dependencias Externas:
 * - lucide-react: Para icono de edición (Edit).
 *
 */
