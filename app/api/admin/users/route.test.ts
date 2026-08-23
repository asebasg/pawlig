import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getServerSession, type Session } from "next-auth";
import { Municipality, UserRole, User } from "@prisma/client";
import { prisma } from "@/lib/utils/db";
import { generateTempPassword, hashPassword } from "@/lib/auth/password";
import { createUserByAdmin } from "@/lib/services/user.service";
import { POST } from "./route";

/**
 * POST /api/admin/users
 * Descripción: Prueba el contrato de alta administrativa de usuarios.
 * Requiere: Mocks de autenticación, Prisma, contraseña y servicio de usuarios.
 * Implementa: ISSUE-174.
 */

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/utils/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth/password", () => ({
  generateTempPassword: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("@/lib/services/user.service", () => ({
  createUserByAdmin: vi.fn(),
}));

const adminSession: Session = {
  expires: "2099-01-01",
  user: {
    id: "admin-1",
    email: "admin@pawlig.com",
    role: UserRole.ADMIN,
    isActive: true,
  },
};

const validPayload = {
  email: "nuevo@pawlig.com",
  name: "Nuevo Usuario",
  phone: "3001234567",
  municipality: Municipality.MEDELLIN,
  address: "Calle 123 # 45-67",
  idNumber: "1234567890",
  birthDate: "1990-01-01",
  role: UserRole.ADOPTER,
};

function createRequest(body: unknown, headers?: HeadersInit): NextRequest {
  return new NextRequest("http://localhost/api/admin/users", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/admin/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rechaza solicitudes sin una sesión", async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rechaza usuarios que no tienen rol de administrador", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      ...adminSession,
      user: { ...adminSession.user, role: UserRole.ADOPTER },
    });

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({ code: "FORBIDDEN" });
  });

  it("devuelve los errores del schema antes de consultar el correo", async () => {
    vi.mocked(getServerSession).mockResolvedValue(adminSession);

    const response = await POST(createRequest({ ...validPayload, email: "invalido" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      code: "VALIDATION_ERROR",
      details: expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
      ]),
    });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it("distingue cuentas activas duplicadas de cuentas bloqueadas", async () => {
    vi.mocked(getServerSession).mockResolvedValue(adminSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ isActive: true } as unknown as User);

    const duplicateResponse = await POST(createRequest(validPayload));

    expect(duplicateResponse.status).toBe(409);
    await expect(duplicateResponse.json()).resolves.toMatchObject({ code: "EMAIL_ALREADY_EXISTS" });

    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ isActive: false } as unknown as User);
    const blockedResponse = await POST(createRequest(validPayload));

    expect(blockedResponse.status).toBe(409);
    await expect(blockedResponse.json()).resolves.toMatchObject({ code: "ACCOUNT_BLOCKED" });
  });

  it("crea el usuario con contraseña hasheada y conserva los metadatos de la petición", async () => {
    const createdUser = {
      id: "user-1",
      email: validPayload.email,
      name: validPayload.name,
      role: UserRole.ADOPTER,
    } as unknown as User;
    vi.mocked(getServerSession).mockResolvedValue(adminSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(generateTempPassword).mockReturnValue("Temporal@123");
    vi.mocked(hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(createUserByAdmin).mockResolvedValue(createdUser);

    const response = await POST(createRequest(validPayload, {
      "x-forwarded-for": "203.0.113.10",
      "user-agent": "Vitest",
    }));

    expect(response.status).toBe(201);
    expect(hashPassword).toHaveBeenCalledWith("Temporal@123");
    expect(createUserByAdmin).toHaveBeenCalledWith(
      { ...validPayload, hashedPassword: "hashed-password" },
      "admin-1",
      "admin@pawlig.com",
      "203.0.113.10",
      "Vitest"
    );
    await expect(response.json()).resolves.toEqual({
      message: "Usuario creado exitosamente",
      user: createdUser,
      tempPassword: "Temporal@123",
    });
  });

  it("no expone un error de creación como respuesta exitosa", async () => {
    vi.mocked(getServerSession).mockResolvedValue(adminSession);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(generateTempPassword).mockReturnValue("Temporal@123");
    vi.mocked(hashPassword).mockResolvedValue("hashed-password");
    vi.mocked(createUserByAdmin).mockRejectedValue(new Error("Fallo de transacción"));

    const response = await POST(createRequest(validPayload));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({ code: "INTERNAL_ERROR" });
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Comprueba las respuestas del endpoint para autorización, validación,
 * duplicados y creación satisfactoria.
 *
 * Lógica Clave:
 * - Aísla autenticación, persistencia, contraseña y servicio mediante mocks.
 * - Verifica que la ruta solo llame al servicio después de validar el payload.
 * - Comprueba el reenvío de IP y agente de usuario a la capa de negocio.
 *
 * Dependencias Externas:
 * - vitest: Runner y mocks de las dependencias.
 * - next/server: Construcción de solicitudes del Route Handler.
 *
 */
