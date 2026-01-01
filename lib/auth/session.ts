import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";

/**
 * Ruta/Componente/Servicio: Utilidades de Sesión del Servidor
 * Descripción: Proporciona funciones de ayuda para obtener y validar la sesión del usuario en el lado del servidor, principalmente para API routes.
 * Requiere: -
 * Implementa: RNF-002
 */

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("No autenticado");
  }
  return session;
}

export async function requireRole(allowedRoles: string[]) {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("No autorizado");
  }
  return session;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo ofrece un conjunto de funciones de utilidad para simplificar el
 * acceso y la validación de la sesión del usuario en contextos del lado del
 * servidor, como las API routes. Abstrae la lógica de 'getServerSession' y
 * proporciona métodos concisos para comprobaciones comunes de autenticación y
 * autorización. A diferencia de 'require-role.ts' que redirige, estas funciones
 * lanzan errores, lo que es apropiado para el contexto de una API.
 *
 * Lógica Clave:
 * - 'getSession': Es una envoltura (wrapper) simple alrededor de 'getServerSession(authOptions)'
 *   para obtener la sesión actual. Sirve como base para las demás funciones.
 * - 'getCurrentUser': Devuelve solo el objeto 'user' de la sesión, o 'undefined'
 *   si no hay sesión. Es útil cuando solo se necesitan los datos del usuario.
 * - 'requireAuth': Asegura que una sesión exista. Si no, lanza un error 'No autenticado'.
 *   Se usa para proteger endpoints que requieren que cualquier usuario esté logueado.
 * - 'requireRole': Primero llama a 'requireAuth' y luego verifica si el rol del
 *   usuario está en la lista de 'allowedRoles'. Si no, lanza un error 'No autorizado'.
 *   Se usa para proteger endpoints con requisitos de rol específicos.
 *
 * Dependencias Externas:
 * - 'next-auth': Utilizada para obtener la sesión del usuario en el servidor a través
 *   de 'getServerSession'.
 *
 */
