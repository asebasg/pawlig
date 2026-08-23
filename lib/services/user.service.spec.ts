import { beforeEach, describe, expect, it, vi } from "vitest";
import { Municipality, UserRole } from "@prisma/client";
import { prisma } from "@/lib/utils/db";
import { revalidateTag } from "next/cache";
import { createUserByAdmin } from "./user.service";

/**
 * Descripción: Verifica la creación administrativa de usuarios y su auditoría.
 * Requiere: Mocks de Prisma y de la caché de Next.js.
 * Implementa: ISSUE-174.
 */

vi.mock("@/lib/utils/db", () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((callback: () => unknown) => callback),
  revalidateTag: vi.fn(),
}));

const basePayload = {
  email: "test@pawlig.com",
  name: "Juan Pérez",
  phone: "3001234567",
  municipality: Municipality.MEDELLIN,
  address: "Calle 123 # 45-67",
  idNumber: "1234567890",
  birthDate: "1990-01-01",
  role: UserRole.ADOPTER,
  hashedPassword: "$2a$12$hashedpassword",
};

describe("createUserByAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("crea un adoptante, registra la auditoría e invalida la caché", async () => {
    const createdUser = {
      id: "user-123",
      email: basePayload.email,
      name: basePayload.name,
      role: basePayload.role,
      phone: basePayload.phone,
      municipality: basePayload.municipality,
      createdAt: new Date("2026-01-01"),
    };
    const createUser = vi.fn().mockResolvedValue(createdUser);
    const createAuditRecord = vi.fn().mockResolvedValue({ id: "audit-1" });
    const transaction = {
      user: { create: createUser },
      systemAuditLog: { create: createAuditRecord },
    };

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: unknown) => {
      const cb = callback as (tx: unknown) => Promise<unknown>;
      return cb(transaction);
    });

    const result = await createUserByAdmin(basePayload, "admin-1", "admin@pawlig.com", "127.0.0.1", "Vitest");

    expect(result).toEqual(createdUser);
    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        birthDate: new Date(basePayload.birthDate),
        isActive: true,
        password: basePayload.hashedPassword,
      }),
    }));
    expect(createAuditRecord).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        action: "CREATE",
        actorId: "admin-1",
        actorEmail: "admin@pawlig.com",
        resourceId: createdUser.id,
        reason: "Usuario creado manualmente por administrador",
        ipAddress: "127.0.0.1",
        userAgent: "Vitest",
      }),
    }));
    expect(revalidateTag).toHaveBeenCalledWith("user-detail");
  });

  it("conserva la justificación personalizada al crear otro administrador", async () => {
    const payload = {
      ...basePayload,
      email: "admin2@pawlig.com",
      role: UserRole.ADMIN,
      reason: "Alta de administrador para el equipo de moderación",
    };
    const createAuditRecord = vi.fn().mockResolvedValue({ id: "audit-2" });

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: unknown) => {
      const cb = callback as (tx: unknown) => Promise<unknown>;
      return cb({
        user: {
          create: vi.fn().mockResolvedValue({
            id: "admin-2",
            email: payload.email,
            name: payload.name,
            role: payload.role,
          }),
        },
        systemAuditLog: { create: createAuditRecord },
      });
    });

    await createUserByAdmin(payload, "admin-1", "superadmin@pawlig.com");

    expect(createAuditRecord).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ reason: payload.reason }),
    }));
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Cubre los dos caminos de la razón de auditoría de la creación administrativa.
 *
 * Lógica Clave:
 * - Simula la transacción interactiva con las dos operaciones necesarias.
 * - Verifica los datos persistidos y la invalidación de caché.
 *
 * Dependencias Externas:
 * - vitest: Runner y mocks de las dependencias.
 *
 */
