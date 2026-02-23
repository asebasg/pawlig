import "@testing-library/jest-dom";
import { vi } from "vitest";

// Polyfill for PointerEvent which is missing in JSDOM
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
    }
  }
  // @ts-ignore
  global.PointerEvent = PointerEvent;
}

// Polyfill for HTMLElement methods that Radix UI expects
if (typeof window !== "undefined") {
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
}

// Polyfill for ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
