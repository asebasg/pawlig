import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UserViewClient from '@/components/admin/UserViewClient';
import { AuditHistoryCard } from '@/components/admin/AuditHistoryCard';
import { UserRole, AuditAction } from '@prisma/client';

// Mock de dependencias
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));
vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  }
}));

// Mock para PointerEvent y otros métodos necesarios para Radix UI en JSDOM
if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
}

describe('UserViewClient', () => {
  const mockUser = {
    id: 'user-123',
    name: 'Juan Pérez',
    role: UserRole.ADOPTER,
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('renders user role correctly in the selector', () => {
    render(<UserViewClient user={mockUser} />);
    const roleSelect = screen.getByLabelText('Rol del Usuario');
    expect(roleSelect).toHaveTextContent(UserRole.ADOPTER);
  });

  test('save button is disabled initially', () => {
    render(<UserViewClient user={mockUser} />);
    const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
    expect(saveButton).toBeDisabled();
  });

  test('save button becomes enabled after changing role and adding a reason', async () => {
    const user = userEvent.setup();
    render(<UserViewClient user={mockUser} />);

    const roleSelect = screen.getByLabelText('Rol del Usuario');
    const reasonInput = screen.getByLabelText(/Razón del cambio/i);
    const saveButton = screen.getByRole('button', { name: /guardar cambios/i });

    // En las pruebas con Radix Select y JSDOM, a veces es difícil interactuar con el dropdown real.
    // Una alternativa es disparar el cambio directamente si el componente lo permite,
    // pero aquí intentaremos la interacción de usuario simulada.

    await user.click(roleSelect);

    // Radix Select renderiza las opciones fuera del árbol principal (Portal).
    // En JSDOM esto puede ser problemático. Buscamos por texto si findByRole falla.
    const option = await screen.findByText(UserRole.SHELTER, { selector: 'span' });
    await user.click(option);

    await user.type(reasonInput, 'Razón de prueba válida');

    expect(saveButton).toBeEnabled();
  });
});

describe('AuditHistoryCard', () => {
    const mockAuditRecords = [
        {
          action: AuditAction.BLOCK,
          reason: 'Contenido inapropiado',
          createdAt: new Date('2024-01-01T10:00:00Z'),
          performedBy: { name: 'Admin Principal', email: 'admin@pawlig.com' },
          ipAddress: '192.168.1.1',
        },
        {
            action: AuditAction.CHANGE_ROLE,
            reason: 'Promoción a moderador',
            oldValue: 'ADOPTER',
            newValue: 'SHELTER',
            createdAt: new Date('2024-02-01T11:00:00Z'),
            performedBy: { name: 'Admin Principal', email: 'admin@pawlig.com' },
        }
    ];

    test('shows audit history with correct details', () => {
        render(<AuditHistoryCard auditRecords={mockAuditRecords} />);

        expect(screen.getByText('Bloqueo de Usuario')).toBeInTheDocument();
        expect(screen.getByText(/Razón: Contenido inapropiado/i)).toBeInTheDocument();

        expect(screen.getByText('Cambio de Rol')).toBeInTheDocument();
        expect(screen.getByText(/ADOPTER → SHELTER/i)).toBeInTheDocument();
    });

    test('shows empty state when there are no records', () => {
        render(<AuditHistoryCard auditRecords={[]} />);
        expect(screen.getByText(/No hay registros de auditoría/i)).toBeInTheDocument();
    });
});
