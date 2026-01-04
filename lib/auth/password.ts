import bcrypt from 'bcryptjs';

/**
 * Ruta/Componente/Servicio: Servicio de Contraseñas
 * Descripción: Proporciona funciones de utilidad para el hashing, la verificación y la validación de contraseñas de usuario.
 * Requiere: -
 * Implementa: RN-001, RNF-002
 */

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function isValidPassword(password: string): boolean {
  // Mínimo 8 caracteres (RN-001)
  return password.length >= 8;
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo centraliza la lógica de seguridad relacionada con las contraseñas.
 * Abstrae las operaciones de 'bcryptjs' para asegurar que el hashing y la
 * comparación se realicen de manera consistente en toda la aplicación, siguiendo
 * las políticas de seguridad definidas.
 *
 * Lógica Clave:
 * - 'hashPassword': Utiliza 'bcrypt' para generar un hash seguro de una contraseña
 *   en texto plano. Se configura con un 'SALT_ROUNDS' de 12 para un equilibrio
 *   adecuado entre seguridad y rendimiento, cumpliendo el requisito 'RNF-002'.
 * - 'verifyPassword': Compara de forma segura una contraseña en texto plano con un
 *   hash almacenado. Utiliza la función 'compare' de 'bcrypt', que previene
 *   ataques de temporización.
 * - 'isValidPassword': Implementa la regla de negocio 'RN-001' que requiere que
 *   las contraseñas tengan una longitud mínima de 8 caracteres. Sirve como una
 *   validación básica del lado del servidor.
 *
 * Dependencias Externas:
 * - 'bcryptjs': Librería utilizada para todas las operaciones de hashing y
 *   comparación de contraseñas. Es el núcleo de la seguridad de las credenciales.
 *
 */
