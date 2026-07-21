import { renderHook, act } from "@testing-library/react";
import { useUnsavedImagesGuard } from "./use-unsaved-images-guard";
import { useRouter } from "next/navigation";
import type { ImageUploadItem } from "@/types/upload.types";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock de useRouter y next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock de extractPublicId y helper
vi.mock("@/lib/utils/cloudinary-helpers", () => ({
  extractPublicId: vi.fn((url: string) => {
    if (url.includes("pawlig")) return "mocked_id";
    return null;
  }),
}));

describe("useUnsavedImagesGuard", () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  const mockSetImageItems = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue(mockRouter as unknown as ReturnType<typeof useRouter>);

    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    // Mock navigator.sendBeacon
    Object.defineProperty(navigator, "sendBeacon", {
      writable: true,
      value: vi.fn(() => true),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const getMockImageItems = (): ImageUploadItem[] => [
    {
      id: "1",
      file: new File([""], "test.png"),
      previewUrl: "blob:test",
      status: "success",
      cloudinaryUrl: "https://res.cloudinary.com/demo/image/upload/pawlig/test1.png",
      error: null,
    },
  ];

  it("should not block navigation if no unsaved images", () => {
    const { result } = renderHook(() =>
      useUnsavedImagesGuard({ imageItems: [], setImageItems: mockSetImageItems })
    );

    act(() => {
      result.current.requestNavigation("/home");
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/home");
    expect(result.current.showLeaveModal).toBe(false);
  });

  it("should open leave modal if there are unsaved images", () => {
    const { result } = renderHook(() =>
      useUnsavedImagesGuard({
        imageItems: getMockImageItems(),
        setImageItems: mockSetImageItems,
      })
    );

    act(() => {
      result.current.requestNavigation("/home");
    });

    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(result.current.showLeaveModal).toBe(true);
  });

  it("should lock form and show timeout modal after inactivity", async () => {
    const { result } = renderHook(() =>
      useUnsavedImagesGuard({
        imageItems: getMockImageItems(),
        setImageItems: mockSetImageItems,
      })
    );

    act(() => {
      result.current.registerActivity();
    });

    expect(result.current.isLocked).toBe(false);

    await act(async () => {
      vi.advanceTimersByTime(10 * 60 * 1000); // 10 minutes
      await Promise.resolve();
    });

    expect(result.current.isLocked).toBe(true);
    expect(result.current.showTimeoutModal).toBe(true);
    expect(mockSetImageItems).toHaveBeenCalledWith([]);
    expect(global.fetch).toHaveBeenCalled();
  });

  it("should allow navigation if markAsSubmitted is called", () => {
    const { result } = renderHook(() =>
      useUnsavedImagesGuard({
        imageItems: getMockImageItems(),
        setImageItems: mockSetImageItems,
      })
    );

    act(() => {
      result.current.markAsSubmitted();
      result.current.requestNavigation("/home");
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/home");
    expect(result.current.showLeaveModal).toBe(false);
  });

  it("should confirm leave and delete images", async () => {
    const { result } = renderHook(() =>
      useUnsavedImagesGuard({
        imageItems: getMockImageItems(),
        setImageItems: mockSetImageItems,
      })
    );

    act(() => {
      result.current.requestNavigation("/home");
    });

    expect(result.current.showLeaveModal).toBe(true);

    await act(async () => {
      await result.current.onConfirmLeave();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockSetImageItems).toHaveBeenCalledWith([]);
    expect(result.current.showLeaveModal).toBe(false);
    expect(mockRouter.push).toHaveBeenCalledWith("/home");
  });
});
