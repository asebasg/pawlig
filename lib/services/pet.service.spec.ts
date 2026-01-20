import { describe, it, expect, vi, type Mock } from "vitest";
import { getPetsWithFilters } from "./pet.service";
import { prisma } from "@/lib/utils/db";

/**
 * Ruta/Componente/Servicio: Pruebas de Servicio de Mascotas
 * Descripción: Pruebas unitarias para el servicio de mascotas, verificando filtros y lógica de negocio.
 * Requiere: Vitest, Prisma Mock
 * Implementa: Pruebas de HU-004 (Listado de mascotas)
 */

vi.mock("@/lib/utils/db", () => ({
  prisma: {
    pet: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe("Pet Service - getPetsWithFilters", () => {
  it("should correctly filter pets by sex", async () => {
    const mockPets = [{ id: "1", name: "Buddy", sex: "Macho" }];
    (prisma.pet.findMany as Mock).mockResolvedValue(mockPets);
    (prisma.pet.count as Mock).mockResolvedValue(1);

    const result = await getPetsWithFilters({ sex: "Macho" });

    expect(prisma.pet.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          sex: "Macho",
        }),
      })
    );
    expect(result.data).toEqual(mockPets);
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo contiene las pruebas unitarias para las funciones del servicio
 * de mascotas, asegurando que los filtros se apliquen correctamente en Prisma.
 *
 * Lógica Clave:
 * - Mock de Prisma: Se utiliza vi.mock para simular el comportamiento de la
 *   base de datos y evitar llamadas reales durante las pruebas.
 * - Casting de Mocks: Se utiliza el tipo Mock de Vitest para permitir el
 *   acceso a métodos como mockResolvedValue en las funciones mockeadas.
 *
 * Dependencias Externas:
 * - vitest: Framework de pruebas utilizado para las aserciones y el mockeo.
 *
 */
