import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BlogTable } from "./blog-table";
import useSWR from "swr";
import type { BlogPost } from "@prisma/client";
import { toast } from "sonner";

vi.mock("swr");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("BlogTable", () => {
  const mockMutate = vi.fn();
  const mockPosts: BlogPost[] = [
    {
      id: "post-1",
      title: "Artículo de prueba",
      slug: "articulo-de-prueba",
      content: "Contenido",
      excerpt: "Extracto",
      featured: null,
      status: "PUBLISHED",
      views: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: "user-1",
      tags: ["tech"],
      publishedAt: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("renders posts and destructive DeleteButton", () => {
    vi.mocked(useSWR).mockReturnValue({
      data: { success: true, data: mockPosts, meta: { total: 1, page: 1, limit: 10, totalPages: 1 } },
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    } as unknown as ReturnType<typeof useSWR>);

    render(<BlogTable />);

    expect(screen.getByText("Artículo de prueba")).toBeInTheDocument();
    expect(screen.getByText("Publicado")).toBeInTheDocument();
    expect(screen.getByText("Editar")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: "Eliminar Artículo de prueba" });
    expect(deleteBtn).toBeInTheDocument();

    const container = deleteBtn.closest("[data-variant]");
    expect(container).toHaveAttribute("data-variant", "destructive");
  });

  it("executes in-place deletion without window.confirm", async () => {
    const windowConfirmSpy = vi.spyOn(window, "confirm");
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    vi.mocked(useSWR).mockReturnValue({
      data: { success: true, data: mockPosts, meta: { total: 1, page: 1, limit: 10, totalPages: 1 } },
      error: undefined,
      isLoading: false,
      mutate: mockMutate,
      isValidating: false,
    } as unknown as ReturnType<typeof useSWR>);

    render(<BlogTable />);

    const deleteBtn = screen.getByRole("button", { name: "Eliminar Artículo de prueba" });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: "Confirmar eliminación" });
    fireEvent.click(confirmBtn);

    expect(windowConfirmSpy).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/admin/blog/post-1", { method: "DELETE" });
      expect(toast.success).toHaveBeenCalledWith("Artículo eliminado");
      expect(mockMutate).toHaveBeenCalled();
    });

    windowConfirmSpy.mockRestore();
  });
});
