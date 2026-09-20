import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./input";

/**
 * Ruta/Componente/Servicio: Input Test
 * Descripción: Pruebas unitarias para el componente primitivo Input y su integración de errores.
 * Requiere: @testing-library/react, vitest.
 * Implementa: DESIGN.md §2, §3 (Contrato de Formularios) y §5 (A11y WCAG AA).
 */

describe("Input", () => {
  it("renders label and input correctly when no error is present", () => {
    render(<Input id="username" label="Nombre de usuario" placeholder="Ej: tian" />);
    const input = screen.getByPlaceholderText("Ej: tian");
    const label = screen.getByText("Nombre de usuario");

    expect(input).toBeInTheDocument();
    expect(label).toHaveAttribute("for", "username");
    expect(input).not.toHaveAttribute("aria-invalid", "true");
    expect(input).not.toHaveClass("border-red-400");
  });

  it("automatically configures error variant, a11y attributes, and renders InputErrorMessage when error prop is passed", () => {
    render(
      <Input
        id="email"
        label="Correo electrónico"
        error="El correo no es válido"
        placeholder="correo@ejemplo.com"
      />
    );
    const input = screen.getByPlaceholderText("correo@ejemplo.com");
    const alert = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(input).toHaveClass("border-red-400");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "email-error");
    expect(alert).toHaveTextContent("El correo no es válido");
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Pruebas unitarias para validar la integración automática de Input con InputErrorMessage.
 *
 * Lógica Clave:
 * - Renderizado de label asociable por ID.
 * - Conmutación de variante de error y configuración automática de atributos ARIA.
 * - Despliegue de mensaje de error accesible sin requerir marcado duplicado.
 *
 * Dependencias Externas:
 * - @testing-library/react y vitest.
 *
 */
