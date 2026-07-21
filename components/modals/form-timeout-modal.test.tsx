import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FormTimeoutModal } from "./form-timeout-modal";

describe("FormTimeoutModal", () => {
  beforeEach(() => {
    // Mock window.location.reload
    Object.defineProperty(window, "location", {
      writable: true,
      value: { reload: vi.fn() },
    });
  });

  it("should render null when isOpen is false", () => {
    const { container } = render(<FormTimeoutModal isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render modal content when isOpen is true", () => {
    render(<FormTimeoutModal isOpen={true} />);
    expect(screen.getByText("Tiempo límite alcanzado")).toBeInTheDocument();
    expect(
      screen.getByText(/El formulario estuvo inactivo por 10 minutos/)
    ).toBeInTheDocument();
  });

  it("should call window.location.reload when clicking 'Entendido — Reiniciar'", () => {
    render(<FormTimeoutModal isOpen={true} />);

    const button = screen.getByText("Entendido — Reiniciar");
    fireEvent.click(button);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
