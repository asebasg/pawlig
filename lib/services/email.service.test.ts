import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { Resend } from "resend";
import * as emailService from "./email.service";

// Mock de Resend para evitar envíos reales
vi.mock("resend", () => {
  const sendMock = vi
    .fn()
    .mockResolvedValue({ data: { id: "mocked_email_id" }, error: null });
  return {
    Resend: class {
      emails = {
        send: sendMock,
      };
    },
  };
});

describe("Email Service", () => {
  // Obtenemos la referencia al mock de 'send' instanciado en el servicio
  const mockedResend = new Resend("fake_key");
  const sendMock = mockedResend.emails.send as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call sendPasswordResetEmail correctly", async () => {
    const payload = {
      to: "test@example.com",
      userName: "Test User",
      resetUrl: "http://localhost:3000/reset",
    };

    const response = await emailService.sendPasswordResetEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain("Recuperación de contraseña");
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("should call sendAdoptionStatusEmail correctly (APPROVED)", async () => {
    const payload = {
      to: "adopter@example.com",
      adopterName: "John",
      petName: "Firulais",
      status: "APPROVED" as const,
      shelterName: "Refugio Esperanza",
    };

    const response = await emailService.sendAdoptionStatusEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain(
      "Actualización de tu solicitud para Firulais",
    );
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("should call sendUserBlockStatusEmail correctly (BLOCK)", async () => {
    const payload = {
      to: "blocked@example.com",
      userName: "Bad User",
      action: "BLOCK" as const,
      reason: "Violación de políticas",
    };

    const response = await emailService.sendUserBlockStatusEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain(
      "Aviso Importante: Tu cuenta ha sido suspendida",
    );
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("should call sendShelterApprovalEmail correctly", async () => {
    const payload = {
      to: "shelter@example.com",
      representativeName: "Ana",
      shelterName: "Huellitas",
      loginUrl: "http://localhost:3000/login",
    };

    const response = await emailService.sendShelterApprovalEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain("¡Solicitud de Albergue Aprobada!");
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("should call sendShelterRejectionEmail correctly", async () => {
    const payload = {
      to: "shelter@example.com",
      representativeName: "Ana",
      shelterName: "Huellitas",
      rejectionReason: "Falta información del NIT",
    };

    const response = await emailService.sendShelterRejectionEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain(
      "Actualización de tu solicitud de Albergue",
    );
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("should call sendVendorApprovalEmail correctly", async () => {
    const payload = {
      to: "vendor@example.com",
      userName: "Carlos",
      businessName: "PetShop Plus",
      loginUrl: "http://localhost:3000/login",
    };

    const response = await emailService.sendVendorApprovalEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain("¡Solicitud de Vendedor Aprobada!");
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("should call sendVendorRejectionEmail correctly", async () => {
    const payload = {
      to: "vendor@example.com",
      userName: "Carlos",
      businessName: "PetShop Plus",
      rejectionReason: "Documentación incompleta",
    };

    const response = await emailService.sendVendorRejectionEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const callArgs = sendMock.mock.calls[0][0];

    expect(callArgs.to).toEqual([payload.to]);
    expect(callArgs.subject).toContain(
      "Actualización de tu solicitud de Tienda",
    );
    expect(callArgs.react).toBeDefined();
    expect(response.success).toBe(true);
  });

  it("handles resend error gracefully", async () => {
    // Override the mock implementation for this specific test
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "API Error", name: "error" },
    });

    const payload = {
      to: "test@example.com",
      userName: "Test User",
      resetUrl: "http://localhost:3000/reset",
    };

    const response = await emailService.sendPasswordResetEmail(payload);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(response.success).toBe(false);
    expect(response.error).toBeDefined();
  });

  describe("getResendClient", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    it("throws error if RESEND_API_KEY is not defined", () => {
      delete process.env.RESEND_API_KEY;
      expect(() => emailService.getResendClient()).toThrow(
        "RESEND_API_KEY no configurada",
      );
    });

    it("returns Resend instance if RESEND_API_KEY is defined", () => {
      process.env.RESEND_API_KEY = "re_test_key";
      const client = emailService.getResendClient();
      expect(client).toBeDefined();
      expect(client.emails).toBeDefined();
    });
  });

  describe("getFromEmail", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    it("throws error if EMAIL_FROM is not defined", () => {
      delete process.env.EMAIL_FROM;
      expect(() => emailService.getFromEmail()).toThrow(
        "EMAIL_FROM no está definido. Por favor, defínelo en tu archivo .env.",
      );
    });

    it("returns email if EMAIL_FROM is defined", () => {
      process.env.EMAIL_FROM = "test@pawlig.com";
      expect(emailService.getFromEmail()).toBe("test@pawlig.com");
    });
  });
});

