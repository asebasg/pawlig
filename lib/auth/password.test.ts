import { describe, expect, it } from "vitest";
import { generateTempPassword, hashPassword, isValidPassword, verifyPassword } from "./password";

/**
 * Descripción: Prueba las utilidades de contraseñas utilizadas en el alta administrativa.
 * Requiere: bcryptjs y crypto de Node.js.
 * Implementa: ISSUE-174.
 */

describe("password", () => {
  it("genera una contraseña temporal de 12 caracteres con todos los grupos requeridos", () => {
    const password = generateTempPassword();

    expect(password).toHaveLength(12);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[@#$%&*!]/);
  });

  it("hashea y verifica una contraseña sin aceptar una diferente", async () => {
    const hashedPassword = await hashPassword("Temporal@123");

    await expect(verifyPassword("Temporal@123", hashedPassword)).resolves.toBe(true);
    await expect(verifyPassword("Incorrecta@123", hashedPassword)).resolves.toBe(false);
  });

  it("aplica la longitud mínima de ocho caracteres", () => {
    expect(isValidPassword("1234567")).toBe(false);
    expect(isValidPassword("12345678")).toBe(true);
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Verifica la complejidad, el hash y la regla mínima de contraseñas.
 *
 * Lógica Clave:
 * - La contraseña temporal debe incluir mayúscula, minúscula, número y símbolo.
 * - bcrypt debe validar la contraseña original y rechazar una distinta.
 *
 * Dependencias Externas:
 * - vitest: Runner de pruebas.
 *
 */
