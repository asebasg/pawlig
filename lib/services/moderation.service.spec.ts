import { describe, it, expect, vi, beforeEach } from "vitest";
import { moderationService } from "./moderation.service";
import { prisma } from "@/lib/utils/db";
import {
  sendShelterApprovalEmail,
  sendShelterRejectionEmail,
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
} from "@/lib/services/email.service";
import { UserRole } from "@prisma/client";

// Mocks
vi.mock("@/lib/utils/db", () => ({
  prisma: {
    shelter: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    vendor: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    systemAuditLog: {
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/services/email.service", () => ({
  sendShelterApprovalEmail: vi.fn().mockResolvedValue({}),
  sendShelterRejectionEmail: vi.fn().mockResolvedValue({}),
  sendVendorApprovalEmail: vi.fn().mockResolvedValue({}),
  sendVendorRejectionEmail: vi.fn().mockResolvedValue({}),
}));

describe("Moderation Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("approveShelter", () => {
    it("should approve a shelter, update role, and create audit log", async () => {
      const shelterId = "shelter-123";
      const adminId = "admin-123";
      const adminEmail = "admin@test.com";

      const mockShelter = {
        id: shelterId,
        verified: false,
        name: "Test Shelter",
        userId: "user-123",
        user: { email: "shelter@test.com", name: "Test Representative", role: UserRole.ADOPTER },
      };

      (prisma.shelter.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockShelter);

      // Simular la transacción que recibe un callback
      (prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          shelter: { update: vi.fn().mockResolvedValue({ ...mockShelter, verified: true }) },
          user: { update: vi.fn().mockResolvedValue({ id: "user-123", role: UserRole.SHELTER }) },
          systemAuditLog: { update: vi.fn(), create: vi.fn().mockResolvedValue({ id: "audit-1" }) },
        };
        return await callback(tx);
      });

      const result = await moderationService.approveShelter(shelterId, adminId, adminEmail);

      expect(prisma.shelter.findUnique).toHaveBeenCalledWith({
        where: { id: shelterId },
        include: { user: true },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(sendShelterApprovalEmail).toHaveBeenCalledWith({
        to: mockShelter.user.email,
        representativeName: mockShelter.user.name,
        shelterName: mockShelter.name,
        loginUrl: "http://localhost:3000/login",
      });
      expect(result.updatedShelter.verified).toBe(true);
      expect(result.updatedUser.role).toBe(UserRole.SHELTER);
    });

    it("should throw error if shelter is already verified", async () => {
      const mockShelter = { id: "123", verified: true };
      (prisma.shelter.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockShelter);

      await expect(
        moderationService.approveShelter("123", "admin", "admin@test.com")
      ).rejects.toThrow("El shelter ya está verificado.");
    });
  });

  describe("rejectVendor", () => {
    it("should reject a vendor, store reason, and create audit log", async () => {
      const vendorId = "vendor-123";
      const adminId = "admin-123";
      const adminEmail = "admin@test.com";
      const reason = "Faltan documentos";

      const mockVendor = {
        id: vendorId,
        verified: false,
        businessName: "Test Vendor",
        userId: "user-123",
        user: { email: "vendor@test.com", name: "Test Vendor User", role: UserRole.ADOPTER },
      };

      (prisma.vendor.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockVendor);

      (prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
        const tx = {
          vendor: { update: vi.fn().mockResolvedValue({ ...mockVendor, rejectionReason: reason }) },
          systemAuditLog: { create: vi.fn().mockResolvedValue({ id: "audit-1" }) },
        };
        return await callback(tx);
      });

      const result = await moderationService.rejectVendor(vendorId, adminId, adminEmail, reason);

      expect(prisma.vendor.findUnique).toHaveBeenCalledWith({
        where: { id: vendorId },
        include: { user: true },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(sendVendorRejectionEmail).toHaveBeenCalledWith({
        to: mockVendor.user.email,
        userName: mockVendor.user.name,
        businessName: mockVendor.businessName,
        rejectionReason: reason,
      });
      expect(result.updatedVendor.rejectionReason).toBe(reason);
    });

    it("should throw error if reason is empty", async () => {
      await expect(
        moderationService.rejectVendor("123", "admin", "admin@test.com", "   ")
      ).rejects.toThrow("El motivo de rechazo es obligatorio.");
    });
  });
});
