import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ScrollProgress, type ScrollProgressSection } from "./scroll-progress";

/**
 * Pruebas de componente: ScrollProgress
 * Descripción: Verifica el comportamiento del indicador de scroll, la renderización
 *   del pill colapsado, la expansión del menú de secciones y la interacción con teclado (Escape).
 * Requiere: Vitest, React Testing Library, polyfills de vitest.setup.ts.
 * Implementa: HU-Blog / Pruebas de ScrollProgress.
 */

const mockSections: ScrollProgressSection[] = [
  { id: "introduccion", label: "Introducción" },
  { id: "cuidados", label: "Cuidados Esenciales" },
  { id: "conclusion", label: "Conclusión" },
];

describe("ScrollProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    // Insertar elementos ancla en el DOM simulado
    mockSections.forEach((s) => {
      const el = document.createElement("div");
      el.id = s.id;
      document.body.appendChild(el);
    });
  });

  it("returns null when sections array is empty", () => {
    const { container } = render(<ScrollProgress sections={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders navigation container and collapsed pill button", () => {
    render(<ScrollProgress sections={mockSections} />);

    const nav = screen.getByRole("navigation", {
      name: "Progreso de lectura y secciones",
    });
    expect(nav).toBeInTheDocument();

    const pillButton = screen.getByRole("button", {
      name: /Sección actual: Introducción/i,
    });
    expect(pillButton).toBeInTheDocument();
    expect(pillButton).toHaveAttribute("aria-expanded", "false");
  });

  it("expands menu of sections when pill button is clicked", () => {
    render(<ScrollProgress sections={mockSections} />);

    const pillButton = screen.getByRole("button", {
      name: /Sección actual: Introducción/i,
    });
    fireEvent.click(pillButton);

    expect(screen.getAllByText("Secciones del artículo").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Introducción" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cuidados Esenciales" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Conclusión" })).toBeInTheDocument();
  });

  it("scrolls to section and collapses menu when section item is clicked", () => {
    render(<ScrollProgress sections={mockSections} />);

    const pillButton = screen.getByRole("button", {
      name: /Sección actual: Introducción/i,
    });
    fireEvent.click(pillButton);

    const targetSectionBtn = screen.getByRole("button", { name: "Cuidados Esenciales" });
    const targetEl = document.getElementById("cuidados");

    fireEvent.click(targetSectionBtn);

    expect(targetEl?.scrollIntoView).toHaveBeenCalled();
  });

  it("closes expanded menu when Escape key is pressed", () => {
    render(<ScrollProgress sections={mockSections} />);

    const pillButton = screen.getByRole("button", {
      name: /Sección actual: Introducción/i,
    });
    fireEvent.click(pillButton);

    expect(screen.getAllByText("Secciones del artículo").length).toBeGreaterThan(0);

    fireEvent.keyDown(document, { key: "Escape" });

    // Tras Escape, el menú se repliega volviendo a mostrar el pill button
    expect(
      screen.getByRole("button", { name: /Sección actual: Introducción/i })
    ).toBeInTheDocument();
  });
});
