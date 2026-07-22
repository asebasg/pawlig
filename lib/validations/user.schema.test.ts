import { describe, expect, it } from "vitest";
import { Municipality, UserRole } from "@prisma/client";
import { createUserByAdminSchema } from "./user.schema";

/**
 * Descripción: Valida las reglas del payload de creación administrativa de usuarios.
 * Requiere: Enums de Prisma y esquema Zod de usuarios.
 * Implementa: ISSUE-174.
 */

const validPayload = {
  email: "usuario@pawlig.com",
  name: "Usuario de Prueba",
  phone: "3001234567",
  municipality: Municipality.MEDELLIN,
  address: "Calle 123 # 45-67",
  idNumber: "1234567890",
  birthDate: "1990-01-01",
  role: UserRole.ADOPTER,
};

describe("createUserByAdminSchema", () => {
  it("valida correctamente un payload con rol ADOPTER", () => {
    const result = createUserByAdminSchema.parse(validPayload);

    expect(result.role).toBe(UserRole.ADOPTER);
  });

  it("exige una justificación válida para el rol ADMIN", () => {
    const result = createUserByAdminSchema.safeParse({
      ...validPayload,
      role: UserRole.ADMIN,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(expect.arrayContaining([
        expect.objectContaining({ path: ["reason"] }),
      ]));
    }
  });

  it("acepta un administrador con justificación de al menos diez caracteres", () => {
    const result = createUserByAdminSchema.safeParse({
      ...validPayload,
      role: UserRole.ADMIN,
      reason: "Acceso para moderación",
    });

    expect(result.success).toBe(true);
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Asegura el rol por defecto y la regla especial de auditoría para administradores.
 *
 * Lógica Clave:
 * - El schema provee ADOPTER si no se envía role.
 * - ADMIN exige una justificación con la longitud requerida.
 *
 * Dependencias Externas:
 * - vitest: Runner de pruebas.
 * - zod: Motor de validación consumido por el esquema.
 *
 */
