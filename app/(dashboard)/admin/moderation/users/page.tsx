/**
 * Descripción: Página principal para la gestión y moderación de usuarios dentro del Moderation Hub.
 * Requiere: Sesión de Administrador válida (controlada globalmente por middleware).
 * Implementa: HU-014 (Gestión de usuarios)
 */

import UsersManagementClient from "./users-management-client";

export const metadata = {
  title: "Gestión de usuarios",
  description: "Panel de administración general para usuarios del sistema",
};

export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <UsersManagementClient />
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Punto de entrada para la administración de usuarios integrado en el hub de moderación.
 *
 * Lógica Clave:
 * - Integración con el layout de moderación común sin duplicar el menú o el enlace de retorno.
 * - Renderizado directo del componente cliente de gestión.
 *
 * Dependencias Externas:
 * - Componente local UsersManagementClient.
 *
 */

