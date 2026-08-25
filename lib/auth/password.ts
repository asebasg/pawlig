import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";

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

/**
 * Genera una contraseña temporal segura de 12 caracteres (supera el mínimo
 * de 8 chars de registerUserSchema / RN-001) usando crypto.randomBytes
 * del módulo nativo de Node.js. La contraseña se retorna en texto plano
 * únicamente al flujo que la hashea y la envía por email; nunca se persiste
 * en claro en base de datos ni en logs.
 */
export function generateTempPassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "@#$%&*!";
  const all = uppercase + lowercase + digits + symbols;

  const LENGTH = 12;

  // Se solicitan LENGTH (12) bytes: los primeros 4 garantizan un carácter
  // obligatorio de cada grupo; los 8 restantes completan los 12 caracteres.
  const buf = randomBytes(LENGTH);

  const mandatory = [
    uppercase[buf[0] % uppercase.length],
    lowercase[buf[1] % lowercase.length],
    digits[buf[2] % digits.length],
    symbols[buf[3] % symbols.length],
  ];

  const rest = Array.from(buf.subarray(4)).map(
    (byte) => all[byte % all.length]
  );

  // Mezcla Fisher-Yates usando un segundo bloque de bytes independiente
  // para no reutilizar los mismos bytes de construcción como índices.
  const combined = [...mandatory, ...rest];
  const shuffleBytes = randomBytes(LENGTH);

  for (let i = combined.length - 1; i > 0; i--) {
    const j = shuffleBytes[i % shuffleBytes.length] % (i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join("");
}

/**
 * Genera un token aleatorio y seguro para la recuperación de contraseña.
 * Retorna el token en texto plano (para el correo) y el hash SHA-256 (para la BD).
 */
export function generateResetToken(): { token: string; hashedToken: string } {
  const token = randomBytes(32).toString("hex");
  const hashedToken = hashResetToken(token);
  return { token, hashedToken };
}

/**
 * Hashea un token de recuperación con SHA-256 para validarlo o almacenarlo de forma segura.
 */
export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
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
 * - 'generateTempPassword': Genera una contraseña temporal de 12 caracteres
 *   usando 'randomBytes' del módulo nativo 'node:crypto'. Garantiza la presencia
 *   de al menos un carácter de cada grupo de complejidad (mayúscula, minúscula,
 *   dígito, símbolo) mediante 4 bytes dedicados por grupo, más 8 bytes para
 *   completar la longitud. El mezclado usa un segundo bloque de bytes
 *   independiente (Fisher-Yates) para no reutilizar los mismos índices de
 *   construcción. La contraseña se retorna en texto plano únicamente al flujo
 *   que la hashea y la envía por email; nunca se persiste en claro.
 *   Supera el mínimo de 8 chars de RN-001 / registerUserSchema.
 *   Usada exclusivamente por el flujo administrativo de alta de usuarios.
 *
 * Dependencias Externas:
 * - 'node:crypto': randomBytes para generación criptográfica segura de bytes.
 * - 'bcryptjs': Librería utilizada para todas las operaciones de hashing y
 *   comparación de contraseñas. Es el núcleo de la seguridad de las credenciales.
 *
 */
