import { expect, test, describe, vi } from "vitest";
import { generateUniqueSlug } from "@/lib/services/blog.service";
import { prisma } from "@/lib/utils/db";

vi.mock("@/lib/utils/db", () => ({
  prisma: {
    blogPost: {
      findUnique: vi.fn(),
    },
  },
}));

describe("Blog Service - generateUniqueSlug", () => {
  test("debería generar un slug simple", async () => {
    (prisma.blogPost.findUnique as any).mockResolvedValue(null);
    const slug = await generateUniqueSlug("Mi Primer Artículo");
    expect(slug).toBe("mi-primer-articulo");
  });

  test("debería generar un slug con sufijo si ya existe", async () => {
    (prisma.blogPost.findUnique as any)
      .mockResolvedValueOnce({ id: "1" }) // 1ra vez existe
      .mockResolvedValueOnce(null); // 2da vez no existe
    
    const slug = await generateUniqueSlug("Mi Primer Artículo");
    expect(slug).toBe("mi-primer-articulo-1");
  });
});
