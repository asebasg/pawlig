import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeleteButton } from "./delete-button";

describe("DeleteButton", () => {
  it("renders with default variant and idle state", () => {
    render(<DeleteButton />);
    const trigger = screen.getByRole("button", { name: "Eliminar" });

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger.closest("[data-variant]")).toHaveAttribute("data-variant", "default");
    expect(trigger.closest("[data-size]")).toHaveAttribute("data-size", "default");
  });

  it("renders with destructive variant and respective red styling classes", () => {
    render(<DeleteButton variant="destructive" size="sm" aria-label="Eliminar post" />);
    const trigger = screen.getByRole("button", { name: "Eliminar post" });

    expect(trigger).toBeInTheDocument();
    const container = trigger.closest("[data-variant]");
    expect(container).toHaveAttribute("data-variant", "destructive");
    expect(container).toHaveAttribute("data-size", "sm");
    expect(container?.className).toContain("text-red-600");
  });

  it("opens confirmation panel upon clicking trigger button", () => {
    render(<DeleteButton variant="destructive" />);
    const trigger = screen.getByRole("button", { name: "Eliminar" });

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Confirmar eliminación" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("calls onConfirm when clicking confirm button", async () => {
    const onConfirmMock = vi.fn();
    render(<DeleteButton variant="destructive" onConfirm={onConfirmMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const confirmButton = screen.getByRole("button", { name: "Confirmar eliminación" });

    fireEvent.click(confirmButton);

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when clicking cancel button", async () => {
    const onCancelMock = vi.fn();
    render(<DeleteButton variant="destructive" onCancel={onCancelMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });

    fireEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Confirmar eliminación" })).not.toBeInTheDocument();
    });
  });

  it("closes when pressing Escape key while open", async () => {
    const onCancelMock = vi.fn();
    render(<DeleteButton variant="destructive" onCancel={onCancelMock} />);

    const trigger = screen.getByRole("button", { name: "Eliminar" });
    fireEvent.click(trigger);

    const container = trigger.closest("[data-slot='delete-button']");
    expect(container).toBeInTheDocument();

    if (container) {
      fireEvent.keyDown(container, { key: "Escape" });
    }

    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("does not open when disabled", () => {
    render(<DeleteButton disabled />);
    const trigger = screen.getByRole("button", { name: "Eliminar" });

    expect(trigger).toBeDisabled();
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("button", { name: "Confirmar eliminación" })).not.toBeInTheDocument();
  });
});
