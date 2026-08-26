import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserViewClient from "@/components/admin/UserViewClient";
import { AuditHistoryCard } from "@/components/admin/AuditHistoryCard";
import { UserRole } from "@prisma/client";

// Mock de dependencias de navegacion y notificaciones
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));
vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

/*
 * Mock del Select de Radix UI: jsdom no implementa los eventos de puntero
 * que Radix necesita para abrir/cerrar el portal del dropdown, lo que provoca
 * que los tests se cuelguen hasta agotar el timeout.
 *
 * Estrategia: Se inspeccionan los children de Select para extraer el id del
 * SelectTrigger y las opciones de SelectContent/SelectItem, y se construye
 * un <select> nativo accesible con el id y las opciones correctas.
 * Se usa require("react") dentro del factory porque vi.mock se hoistea.
 */
vi.mock("@/components/ui/select", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const R = require("react") as typeof import("react");

  // Tag symbols para identificar subcomponentes en la inspeccion
  const TRIGGER_TAG = "@@SelectTrigger";
  const CONTENT_TAG = "@@SelectContent";
  const ITEM_TAG = "@@SelectItem";

  function SelectTrigger({ id }: { id?: string; children?: React.ReactNode }) {
    void id;
    return null;
  }
  (SelectTrigger as unknown as Record<string, unknown>).__tag = TRIGGER_TAG;

  function SelectContent({ children }: { children?: React.ReactNode }) {
    void children;
    return null;
  }
  (SelectContent as unknown as Record<string, unknown>).__tag = CONTENT_TAG;

  function SelectItem({ value, children }: { value: string; children?: React.ReactNode }) {
    void value; void children;
    return null;
  }
  (SelectItem as unknown as Record<string, unknown>).__tag = ITEM_TAG;

  function Select({ onValueChange, defaultValue, children, disabled }: {
    onValueChange: (value: string) => void;
    defaultValue: string;
    disabled?: boolean;
    children: React.ReactNode;
  }) {
    let triggerId: string | undefined;
    const options: Array<{ value: string; label: React.ReactNode }> = [];

    R.Children.forEach(children, (child) => {
      if (!R.isValidElement(child)) return;
      const childType = child.type as { __tag?: string };
      const childProps = child.props as { id?: string; children?: React.ReactNode };

      if (childType.__tag === TRIGGER_TAG) {
        triggerId = childProps.id;
      }
      if (childType.__tag === CONTENT_TAG) {
        R.Children.forEach(childProps.children, (item) => {
          if (!R.isValidElement(item)) return;
          const itemType = item.type as { __tag?: string };
          if (itemType.__tag === ITEM_TAG) {
            const itemProps = item.props as { value: string; children?: React.ReactNode };
            options.push({ value: itemProps.value, label: itemProps.children });
          }
        });
      }
    });

    return R.createElement(
      "select",
      {
        id: triggerId,
        defaultValue,
        disabled,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onValueChange(e.target.value),
      },
      ...options.map((opt) =>
        R.createElement("option", { key: opt.value, value: opt.value }, opt.label),
      ),
    );
  }

  return { Select, SelectTrigger, SelectContent, SelectItem, SelectValue: () => null };
});

// Mock del boton de refinamiento IA para evitar fetch reales en tests
vi.mock("@/components/ui/ai-refine-button", () => ({
  AiRefineButton: () => null,
}));

// Mock del loader para simplificar el render
vi.mock("@/components/ui/loader", () => ({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  default: () => (require("react") as typeof import("react")).createElement("span", null, "Cargando..."),
}));

describe("UserViewClient", () => {
  const mockUser = {
    id: "user-123",
    name: "Juan Perez",
    role: UserRole.ADOPTER,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders user role correctly in the selector", () => {
    render(<UserViewClient user={mockUser} />);
    const roleSelect = screen.getByLabelText("Rol del Usuario");
    expect(roleSelect).toHaveValue(UserRole.ADOPTER);
  });

  test("save button is disabled initially", () => {
    render(<UserViewClient user={mockUser} />);
    const saveButton = screen.getByRole("button", { name: /guardar cambios/i });
    expect(saveButton).toBeDisabled();
  });

  test("save button becomes enabled after changing role and adding a reason", async () => {
    const user = userEvent.setup();
    render(<UserViewClient user={mockUser} />);

    const roleSelect = screen.getByLabelText("Rol del Usuario");
    // Usa selector parcial del label para compatibilidad con tildes
    const reasonInput = screen.getByLabelText(/cambio/i);
    const saveButton = screen.getByRole("button", { name: /guardar cambios/i });

    // El Select mockeado es un <select> nativo: se interactua con selectOptions
    await user.selectOptions(roleSelect, UserRole.SHELTER);
    await user.type(reasonInput, "Razon de prueba valida");

    expect(saveButton).toBeEnabled();
  });
});

describe("AuditHistoryCard", () => {
  const mockAuditRecords = [
    {
      id: "log-1",
      action: "BLOCK",
      reason: "Contenido inapropiado",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      actorEmail: "admin@pawlig.com",
      actorId: "admin-123",
      ipAddress: "192.168.1.1",
    },
    {
      id: "log-2",
      action: "CHANGE_ROLE",
      reason: "Promocion a moderador",
      before: JSON.stringify({ role: "ADOPTER" }),
      after: JSON.stringify({ role: "SHELTER" }),
      createdAt: new Date("2024-02-01T11:00:00Z"),
      actorEmail: "admin@pawlig.com",
      actorId: "admin-123",
    },
  ];

  test("shows audit history with correct details", () => {
    render(<AuditHistoryCard auditRecords={mockAuditRecords} />);

    expect(screen.getByText("Bloqueo de Usuario")).toBeInTheDocument();
    expect(screen.getByText(/Contenido inapropiado/i)).toBeInTheDocument();

    expect(screen.getByText("Cambio de Rol")).toBeInTheDocument();
    // El componente renderiza "ADOPTER <flecha_unicode> SHELTER"
    expect(screen.getByText(/ADOPTER.*SHELTER/i)).toBeInTheDocument();
  });

  test("shows empty state when there are no records", () => {
    render(<AuditHistoryCard auditRecords={[]} />);
    expect(screen.getByText(/No hay registros/i)).toBeInTheDocument();
  });
});