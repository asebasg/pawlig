import { describe, it, expect, vi, type Mock, beforeEach } from "vitest";
import { getPetsWithFilters, deletePet } from "./pet.service";
import { prisma } from "@/lib/utils/db";
import { deleteImagesFromCloudinary } from "@/lib/cloudinary";

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
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    adoption: {
      count: vi.fn(),
    }
  },
}));

vi.mock("@/lib/cloudinary", () => ({
  deleteImagesFromCloudinary: vi.fn().mockResolvedValue(true),
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

describe("Pet Service - deletePet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debería eliminar mascota con imágenes y confirmar borrado en Cloudinary", async () => {
    const mockPetId = "pet123";
    const mockShelterId = "shelter123";
    
    // Configurar mock de findUnique para que la mascota exista y pertenezca al shelter
    (prisma.pet.findUnique as Mock).mockResolvedValue({
      id: mockPetId,
      shelterId: mockShelterId,
    });
    
    // Configurar mock de adopciones para que no existan dependientes
    (prisma.adoption.count as Mock).mockResolvedValue(0);

    // Configurar mock de delete para que devuelva la mascota con imágenes
    const mockDeletedPet = {
      id: mockPetId,
      name: "Buddy",
      images: ["image1.jpg", "image2.jpg"],
    };
    (prisma.pet.delete as Mock).mockResolvedValue(mockDeletedPet);

    // Ejecutar el método
    const result = await deletePet(mockPetId, mockShelterId);

    // Verificaciones
    expect(prisma.pet.delete).toHaveBeenCalledWith({
      where: { id: mockPetId },
    });
    expect(deleteImagesFromCloudinary).toHaveBeenCalledWith(["image1.jpg", "image2.jpg"]);
    expect(result).toEqual(mockDeletedPet);
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
