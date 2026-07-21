import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { getServerSession } from "next-auth";
import { deleteImagesFromCloudinary } from "@/lib/cloudinary";

// Mocks
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/cloudinary", () => ({
  deleteImagesFromCloudinary: vi.fn(),
}));

// Generador de Requests mock
function createMockRequest(body: any) {
  return new Request("http://localhost/api/cloudinary/cleanup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/cloudinary/cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    (getServerSession as any).mockResolvedValueOnce(null);

    const req = createMockRequest({ images: [{ url: "http://example.com/img.png" }] });
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("No autorizado. Se requiere una sesión activa.");
  });

  it("should return 400 if validation fails (empty array)", async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: "1", isActive: true } });

    const req = createMockRequest({ images: [] });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Datos inválidos en la solicitud.");
  });

  it("should return 400 if validation fails (missing url)", async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: "1", isActive: true } });

    const req = createMockRequest({ images: [{ notUrl: "something" }] });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it("should call deleteImagesFromCloudinary and return 200 on success", async () => {
    (getServerSession as any).mockResolvedValueOnce({ user: { id: "1", isActive: true } });
    (deleteImagesFromCloudinary as any).mockResolvedValueOnce(undefined);

    const images = [
      { url: "https://res.cloudinary.com/demo/image/upload/pawlig/test1.png" },
      { url: "https://res.cloudinary.com/demo/image/upload/pawlig/test2.png" },
    ];
    const req = createMockRequest({ images });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(deleteImagesFromCloudinary).toHaveBeenCalledTimes(2);
    expect(deleteImagesFromCloudinary).toHaveBeenNthCalledWith(1, [
      "https://res.cloudinary.com/demo/image/upload/pawlig/test1.png",
    ]);
    expect(deleteImagesFromCloudinary).toHaveBeenNthCalledWith(2, [
      "https://res.cloudinary.com/demo/image/upload/pawlig/test2.png",
    ]);
  });

  it("should return 500 if an internal error occurs", async () => {
    (getServerSession as any).mockImplementationOnce(() => {
      throw new Error("Unexpected database or session error");
    });

    const req = createMockRequest({
      images: [{ url: "https://res.cloudinary.com/demo/image/upload/pawlig/test1.png" }],
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Error interno al procesar la limpieza de imágenes.");
  });
});
