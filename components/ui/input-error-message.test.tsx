import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { InputErrorMessage } from "./input-error-message";

/**
 * Ruta/Componente/Servicio: InputErrorMessage Test
 * Descripción: Pruebas unitarias para el componente atómico InputErrorMessage.
 * Requiere: @testing-library/react, vitest.
 * Implementa: DESIGN.md §2 (Semántica Danger), §4 (Micro-interacciones) y §5 (A11y WCAG AA).
 */

describe("InputErrorMessage", () => {
  it("does not render any content when message is undefined or empty", () => {
    const { container } = render(<InputErrorMessage />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the error message and alert role when message is provided", () => {
    render(<InputErrorMessage id="title-error" message="El título es obligatorio" />);
    const alert = screen.getByRole("alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "title-error");
    expect(alert).toHaveTextContent("El título es obligatorio");
  });

  it("applies semantic danger styling to error text and icon", () => {
    render(<InputErrorMessage message="Error de prueba" />);
    const alert = screen.getByRole("alert");
    const content = alert.querySelector("div");

    expect(content?.className).toContain("text-red-600");
    expect(content?.className).toContain("dark:text-red-400");
  });

  it("merges custom className on root motion container", () => {
    render(<InputErrorMessage message="Error con clase" className="mt-2" />);
    const alert = screen.getByRole("alert");

    expect(alert.className).toContain("mt-2");
    expect(alert.className).toContain("overflow-hidden");
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Suite de pruebas unitarias para garantizar el comportamiento visual y
 * accesible de InputErrorMessage conforme al estándar de DESIGN.md.
 *
 * Lógica Clave:
 * - Renderizado condicional basado en la presencia de mensaje.
 * - Validación de atributo role="alert" e ID para soporte de lectores de pantalla.
 * - Verificación de tokens semánticos de peligro (text-red-600 dark:text-red-400).
 *
 * Dependencias Externas:
 * - @testing-library/react y vitest.
 *
 */
