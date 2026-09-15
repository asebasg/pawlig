/**
 * Tests: Unit / Services / BlogService
 * Descripción: Pruebas unitarias para la generación de slugs únicos en el servicio de blog.
 * Requiere: Mock de Prisma Client (prisma.blogPost.findUnique).
 * Implementa: HU-Blog
 */

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

type FindUniqueBlogPostResult = Awaited<ReturnType<typeof prisma.blogPost.findUnique>>;

describe("Blog Service - generateUniqueSlug", () => {
  test("debería generar un slug simple", async () => {
    vi.mocked(prisma.blogPost.findUnique).mockResolvedValue(null);
    const slug = await generateUniqueSlug("Mi Primer Artículo");
    expect(slug).toBe("mi-primer-articulo");
  });

  test("debería generar un slug con sufijo si ya existe", async () => {
    vi.mocked(prisma.blogPost.findUnique)
      .mockResolvedValueOnce({ id: "1" } as unknown as FindUniqueBlogPostResult)
      .mockResolvedValueOnce(null);
    
    const slug = await generateUniqueSlug("Mi Primer Artículo");
    expect(slug).toBe("mi-primer-articulo-1");
  });
});
