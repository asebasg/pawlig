import { expect, test, describe, vi, beforeEach } from "vitest";
import { GET as getAdminBlog, POST as postAdminBlog } from "@/app/api/admin/blog/route";
import { GET as getAdminBlogById, PUT as putAdminBlogById, DELETE as deleteAdminBlogById } from "@/app/api/admin/blog/[id]/route";
import { POST as publishAdminBlog } from "@/app/api/admin/blog/[id]/publish/route";
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
  getBlogPostById: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
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

  describe("POST /api/admin/blog", () => {
    test("Debería crear un artículo exitosamente", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "1", role: "ADMIN" } } as any);
      const mockPost = { id: "p1", title: "Test" };
      vi.mocked(blogService.createBlogPost).mockResolvedValueOnce(mockPost as any);

      const request = new NextRequest("http://localhost/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({
          title: "Test title valid",
          excerpt: "This is a valid excerpt",
          content: "This is a long content to pass validation.",
          status: "DRAFT",
          tags: ["test"]
        })
      });
      const response = await postAdminBlog(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("p1");
    });
  });

  describe("GET /api/admin/blog/[id]", () => {
    test("Debería retornar el artículo por ID", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { role: "ADMIN" } } as any);
      const mockPost = { id: "1", title: "Test" };
      vi.mocked(blogService.getBlogPostById).mockResolvedValueOnce(mockPost as any);

      const request = new NextRequest("http://localhost/api/admin/blog/1");
      const response = await getAdminBlogById(request, { params: { id: "1" } });
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.data.id).toBe("1");
    });
  });

  describe("PUT /api/admin/blog/[id]", () => {
    test("Debería actualizar el artículo por ID", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "1", role: "ADMIN" } } as any);
      const mockPost = { id: "1", title: "Test Updated" };
      vi.mocked(blogService.updateBlogPost).mockResolvedValueOnce(mockPost as any);

      const request = new NextRequest("http://localhost/api/admin/blog/1", {
        method: "PUT",
        body: JSON.stringify({ title: "Test title valid updated" })
      });
      const response = await putAdminBlogById(request, { params: { id: "1" } });
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.data.title).toBe("Test Updated");
    });
  });

  describe("DELETE /api/admin/blog/[id]", () => {
    test("Debería eliminar el artículo por ID", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "1", role: "ADMIN" } } as any);
      vi.mocked(blogService.deleteBlogPost).mockResolvedValueOnce(undefined as any);

      const request = new NextRequest("http://localhost/api/admin/blog/1", { method: "DELETE" });
      const response = await deleteAdminBlogById(request, { params: { id: "1" } });
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });

  describe("POST /api/admin/blog/[id]/publish", () => {
    test("Debería cambiar el estado de publicación", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce({ user: { id: "1", role: "ADMIN" } } as any);
      vi.mocked(blogService.getBlogPostById).mockResolvedValueOnce({ id: "1", status: "DRAFT" } as any);
      vi.mocked(blogService.updateBlogPost).mockResolvedValueOnce({ id: "1", status: "PUBLISHED" } as any);

      const request = new NextRequest("http://localhost/api/admin/blog/1/publish", { method: "POST" });
      const response = await publishAdminBlog(request, { params: { id: "1" } });
      const json = await response.json();
      
      expect(response.status).toBe(200);
      expect(json.data.status).toBe("PUBLISHED");
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
