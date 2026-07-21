import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LeaveFormConfirmModal } from "./leave-form-confirm-modal";

describe("LeaveFormConfirmModal", () => {
  it("should render null when isOpen is false", () => {
    const { container } = render(
      <LeaveFormConfirmModal isOpen={false} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render modal content when isOpen is true", () => {
    render(
      <LeaveFormConfirmModal isOpen={true} onCancel={vi.fn()} onConfirm={vi.fn()} />
    );
    expect(screen.getByText("¿Abandonar el formulario?")).toBeInTheDocument();
    expect(
      screen.getByText(/Si abandonas ahora, las imágenes que subiste serán/)
    ).toBeInTheDocument();
  });

  it("should call onCancel when clicking 'Quedarse y guardar'", () => {
    const onCancelMock = vi.fn();
    render(
      <LeaveFormConfirmModal isOpen={true} onCancel={onCancelMock} onConfirm={vi.fn()} />
    );

    const cancelButton = screen.getByText("Quedarme aquí");
    fireEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when clicking 'Sí, salir y descartar'", () => {
    const onConfirmMock = vi.fn();
    render(
      <LeaveFormConfirmModal isOpen={true} onCancel={vi.fn()} onConfirm={onConfirmMock} />
    );

    const confirmButton = screen.getByText("Sí, abandonar");
    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });
});
