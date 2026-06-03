import { prisma } from "@/lib/utils/db";
import { UserRole, AuditCategory } from "@prisma/client";
import { revalidateTag } from "next/cache";
import {
  sendShelterApprovalEmail,
  sendShelterRejectionEmail,
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
} from "@/lib/services/email.service";

/**
 * /lib/services/moderation.service.ts
 * Descripción: Servicio de moderación para gestionar la aprobación y rechazo de albergues y negocios.
 * Requiere: Base de datos y EmailService.
 * Implementa: HU-ModerationHub (ISSUE_134)
 */

export const moderationService = {
  async getPendingShelters() {
    return prisma.shelter.findMany({
      where: { 
        verified: false, 
        OR: [
          { rejectionReason: null },
          { rejectionReason: { isSet: false } }
        ]
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getPendingVendors() {
    return prisma.vendor.findMany({
      where: { 
        verified: false, 
        OR: [
          { rejectionReason: null },
          { rejectionReason: { isSet: false } }
        ]
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getApprovedShelters() {
    return prisma.shelter.findMany({
      where: { verified: true },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getApprovedVendors() {
    return prisma.vendor.findMany({
      where: { verified: true },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getRejectedShelters() {
    return prisma.shelter.findMany({
      where: { 
        verified: false, 
        rejectionReason: { not: null, isSet: true }
      },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
    });
  },

  async getRejectedVendors() {
    return prisma.vendor.findMany({
      where: { 
        verified: false, 
        rejectionReason: { not: null, isSet: true }
      },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
    });
  },

  async approveShelter(shelterId: string, adminId: string, adminEmail: string) {
    const requestId = crypto.randomUUID();
    const shelter = await prisma.shelter.findUnique({
      where: { id: shelterId },
      include: { user: true },
    });

    if (!shelter) throw new Error("Shelter no encontrado.");
    if (shelter.verified) throw new Error("El shelter ya está verificado.");

    const result = await prisma.$transaction(async (tx) => {
      const updatedShelter = await tx.shelter.update({
        where: { id: shelterId },
        data: { verified: true, rejectionReason: null },
      });

      const updatedUser = await tx.user.update({
        where: { id: shelter.userId },
        data: { role: UserRole.SHELTER },
      });

      const auditLog = await tx.systemAuditLog.create({
        data: {
          category: AuditCategory.SHELTER_MODERATION,
          action: "APPROVE",
          actorId: adminId,
          actorEmail: adminEmail,
          resourceType: "SHELTER",
          resourceId: shelterId,
          before: JSON.stringify({ verified: shelter.verified, role: shelter.user.role }),
          after: JSON.stringify({ verified: true, role: UserRole.SHELTER }),
          reason: "Aprobación de albergue",
          requestId,
        },
      });

      return { updatedShelter, updatedUser, auditLog };
    });

    // Despacho asíncrono
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendShelterApprovalEmail({
      to: shelter.user.email,
      representativeName: shelter.user.name,
      shelterName: shelter.name,
      loginUrl: `${appUrl}/login`,
    }).catch(console.error);

    revalidateTag("user-detail");
    return result;
  },

  async rejectShelter(shelterId: string, adminId: string, adminEmail: string, reason: string) {
    if (!reason || reason.trim() === "") throw new Error("El motivo de rechazo es obligatorio.");
    const requestId = crypto.randomUUID();

    const shelter = await prisma.shelter.findUnique({
      where: { id: shelterId },
      include: { user: true },
    });

    if (!shelter) throw new Error("Shelter no encontrado.");
    if (shelter.verified) throw new Error("El shelter ya está verificado y no puede ser rechazado por esta vía.");

    const result = await prisma.$transaction(async (tx) => {
      const updatedShelter = await tx.shelter.update({
        where: { id: shelterId },
        data: { rejectionReason: reason },
      });

      const auditLog = await tx.systemAuditLog.create({
        data: {
          category: AuditCategory.SHELTER_MODERATION,
          action: "REJECT",
          actorId: adminId,
          actorEmail: adminEmail,
          resourceType: "SHELTER",
          resourceId: shelterId,
          before: JSON.stringify({ rejectionReason: shelter.rejectionReason }),
          after: JSON.stringify({ rejectionReason: reason }),
          reason: reason,
          requestId,
        },
      });

      return { updatedShelter, auditLog };
    });

    sendShelterRejectionEmail({
      to: shelter.user.email,
      representativeName: shelter.user.name,
      shelterName: shelter.name,
      rejectionReason: reason,
    }).catch(console.error);

    revalidateTag("user-detail");
    return result;
  },

  async approveVendor(vendorId: string, adminId: string, adminEmail: string) {
    const requestId = crypto.randomUUID();
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: true },
    });

    if (!vendor) throw new Error("Vendor no encontrado.");
    if (vendor.verified) throw new Error("El vendor ya está verificado.");

    const result = await prisma.$transaction(async (tx) => {
      const updatedVendor = await tx.vendor.update({
        where: { id: vendorId },
        data: { verified: true, rejectionReason: null },
      });

      const updatedUser = await tx.user.update({
        where: { id: vendor.userId },
        data: { role: UserRole.VENDOR },
      });

      const auditLog = await tx.systemAuditLog.create({
        data: {
          category: AuditCategory.VENDOR_MODERATION,
          action: "APPROVE",
          actorId: adminId,
          actorEmail: adminEmail,
          resourceType: "VENDOR",
          resourceId: vendorId,
          before: JSON.stringify({ verified: vendor.verified, role: vendor.user.role }),
          after: JSON.stringify({ verified: true, role: UserRole.VENDOR }),
          reason: "Aprobación de negocio",
          requestId,
        },
      });

      return { updatedVendor, updatedUser, auditLog };
    });

    // Despacho asíncrono
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    sendVendorApprovalEmail({
      to: vendor.user.email,
      userName: vendor.user.name,
      businessName: vendor.businessName,
      loginUrl: `${appUrl}/login`,
    }).catch(console.error);

    revalidateTag("user-detail");
    return result;
  },

  async rejectVendor(vendorId: string, adminId: string, adminEmail: string, reason: string) {
    if (!reason || reason.trim() === "") throw new Error("El motivo de rechazo es obligatorio.");
    const requestId = crypto.randomUUID();

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: true },
    });

    if (!vendor) throw new Error("Vendor no encontrado.");
    if (vendor.verified) throw new Error("El vendor ya está verificado y no puede ser rechazado por esta vía.");

    const result = await prisma.$transaction(async (tx) => {
      const updatedVendor = await tx.vendor.update({
        where: { id: vendorId },
        data: { rejectionReason: reason },
      });

      const auditLog = await tx.systemAuditLog.create({
        data: {
          category: AuditCategory.VENDOR_MODERATION,
          action: "REJECT",
          actorId: adminId,
          actorEmail: adminEmail,
          resourceType: "VENDOR",
          resourceId: vendorId,
          before: JSON.stringify({ rejectionReason: vendor.rejectionReason }),
          after: JSON.stringify({ rejectionReason: reason }),
          reason: reason,
          requestId,
        },
      });

      return { updatedVendor, auditLog };
    });

    sendVendorRejectionEmail({
      to: vendor.user.email,
      userName: vendor.user.name,
      businessName: vendor.businessName,
      rejectionReason: reason,
    }).catch(console.error);

    revalidateTag("user-detail");
    return result;
  },

  async getAuditLogs(params?: { skip?: number; take?: number; startDate?: Date; endDate?: Date }) {
    const { skip = 0, take = 50, startDate, endDate } = params || {};

    return prisma.systemAuditLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Servicio para gestionar solicitudes de albergues y negocios (vendors), 
 * aplicando transacciones atómicas para el registro y actualización de estado.
 *
 * Lógica Clave:
 * - Aprobaciones: Modifica el usuario a ROL SHELTER/VENDOR, actualiza la entidad
 *   a verified = true, y registra log de auditoría.
 * - Rechazos: Mantiene el rol del usuario, setea rejectionReason y registra auditoría.
 * - requestId: Generado por cada operación para trazabilidad correlacionada.
 * - Paginación y Filtros: Soporta skip, take y rango de fechas para el visor de auditoría.
 *
 * Dependencias Externas:
 * - emailService para despacho asíncrono de notificaciones.
 *
 */
