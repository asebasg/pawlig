import { describe, it, expect, vi, beforeEach } from "vitest";

// Para testear el script necesitamos hacer mock completo de Prisma y Cloudinary
const mockFindManyPets = vi.fn();
const mockFindManyProducts = vi.fn();
const mockDisconnect = vi.fn();

vi.mock("@prisma/client", () => {
  function PrismaClient() {
    return {
      pet: { findMany: mockFindManyPets },
      product: { findMany: mockFindManyProducts },
      $disconnect: mockDisconnect,
    };
  }
  return { PrismaClient };
});

const mockSearchExecute = vi.fn();
const mockDeleteResources = vi.fn();

vi.mock("../lib/cloudinary", () => {
  return {
    default: {
      search: {
        expression: vi.fn().mockReturnThis(),
        max_results: vi.fn().mockReturnThis(),
        next_cursor: vi.fn().mockReturnThis(),
        execute: mockSearchExecute,
      },
      api: {
        delete_resources: mockDeleteResources,
      },
    },
  };
});

describe("cleanup-orphaned-images script", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Silenciar console.log/error para no ensuciar la salida del test
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should identify orphaned images and delete them", async () => {
    // 1. Mock de Base de Datos
    mockFindManyPets.mockResolvedValue([
      { images: ["https://res.cloudinary.com/demo/image/upload/pawlig/active1.png"] }
    ]);
    mockFindManyProducts.mockResolvedValue([
      { images: ["https://res.cloudinary.com/demo/image/upload/pawlig/active2.png"] }
    ]);

    // 2. Mock de Cloudinary Search
    // Retorna 'active1' (usada), 'orphan1' y 'orphan2' (no usadas), 'other/test' (ignorada por carpeta)
    mockSearchExecute.mockResolvedValueOnce({
      resources: [
        { public_id: "pawlig/active1" },
        { public_id: "pawlig/orphan1" },
        { public_id: "pawlig/orphan2" },
        { public_id: "otra-carpeta/ignorada" }
      ],
      next_cursor: undefined // Un solo lote
    });

    // 3. Importar y ejecutar el script.
    // Al ser un script autoejecutable, aislar su ejecución puede ser tricky. 
    // Limpiamos la caché de módulos y hacemos un import dinámico.
    vi.resetModules();
    await import("./cleanup-orphaned-images");

    // Como require es síncrono pero el script main es asíncrono, necesitamos esperar los promises
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);
    await new Promise(process.nextTick);

    // 4. Verificaciones
    expect(mockFindManyPets).toHaveBeenCalledTimes(1);
    expect(mockFindManyProducts).toHaveBeenCalledTimes(1);
    expect(mockSearchExecute).toHaveBeenCalledTimes(1);
    expect(mockDeleteResources).toHaveBeenCalledTimes(1);
    expect(mockDeleteResources).toHaveBeenCalledWith(["pawlig/orphan1", "pawlig/orphan2"]);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
