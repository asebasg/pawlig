import { expect, test, describe, vi, beforeEach } from "vitest";
import { GET as getAdminBlog, POST as postAdminBlog } from "@/app/api/admin/blog/route";
import { GET as getPublicBlog } from "@/app/api/blog/route";
import { NextRequest } from "next/server";
import * as blogService from "@/lib/services/blog.service";
import { getServerSession } from "next-auth";

// Mocks
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth/auth-options", () => ({
  authOptions: {},
}));

vi.mock("@/lib/services/blog.service", () => ({
  createBlogPost: vi.fn(),
  getBlogPosts: vi.fn(),
}));

describe("Blog API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/blog", () => {
    test("Debería retornar 401 si no hay sesión", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);
      const request = new NextRequest("http://localhost/api/admin/blog");
      const response = await getAdminBlog(request);
      
      expect(response.status).toBe(401);
    });

    test("Debería retornar 403 si el rol no es ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "USER" } } as any);
      const request = new NextRequest("http://localhost/api/admin/blog");
      const response = await getAdminBlog(request);
      
      expect(response.status).toBe(403);
    });

    test("Debería retornar 200 y los artículos si es ADMIN", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "ADMIN" } } as any);
      vi.mocked(blogService.getBlogPosts).mockResolvedValueOnce({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 }
      } as any);

      const request = new NextRequest("http://localhost/api/admin/blog?page=1&limit=10");
      const response = await getAdminBlog(request);
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(blogService.getBlogPosts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 10 }),
        true
      );
    });
  });

  describe("GET /api/blog", () => {
    test("Debería retornar 200 y llamar a getBlogPosts sin privilegios de admin", async () => {
      vi.mocked(blogService.getBlogPosts).mockResolvedValueOnce({
        data: [{ id: "1", title: "Publicado" }],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 }
      } as any);

      const request = new NextRequest("http://localhost/api/blog");
      const response = await getPublicBlog(request);
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(1);
      expect(blogService.getBlogPosts).toHaveBeenCalledWith(
        expect.any(Object),
        false
      );
    });
  });
});
