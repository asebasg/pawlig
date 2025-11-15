import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashea una contraseña usando bcrypt con 12 salt rounds (RNF-002)
 * @param password - Contraseña en texto plano
 * @returns Contraseña hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con un hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Hash almacenado en la base de datos
 * @returns true si coinciden, false si no
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Valida que la contraseña cumpla con los requisitos mínimos (RN-001)
 * @param password - Contraseña a validar
 * @returns true si es válida, false si no
 */
export function isValidPassword(password: string): boolean {
  // Mínimo 8 caracteres (RN-001)
  return password.length >= 8;
}