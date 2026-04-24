import { Resend } from "resend";
import { PasswordResetEmail } from "../email/templates/password-reset";
import { AdoptionStatusEmail } from "../email/templates/adoption-status";
import { NewAdoptionEmail } from "../email/templates/new-adoption";
import { OrderConfirmationEmail } from "../email/templates/order-confirmation";
import { NewSaleEmail } from "../email/templates/new-order-vendor";
import { OrderStatusEmail } from "../email/templates/order-status";
import { UserBlockStatusEmail } from "../email/templates/account-blocked";
import { ShelterApprovalEmail } from "../email/templates/shelter-approved";
import { ShelterRejectionEmail } from "../email/templates/shelter-rejected";
import { VendorApprovalEmail } from "../email/templates/vendor-approved";
import { VendorRejectionEmail } from "../email/templates/vendor-rejected";

import {
  PasswordResetEmailPayload,
  AdoptionStatusEmailPayload,
  NewAdoptionRequestEmailPayload,
  UserBlockStatusEmailPayload,
  OrderConfirmationEmailPayload,
  NewSaleEmailPayload,
  OrderStatusUpdateEmailPayload,
  ShelterApprovalEmailPayload,
  ShelterRejectionEmailPayload,
  VendorApprovalEmailPayload,
  VendorRejectionEmailPayload,
} from "@/types/email.types";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.EMAIL_FROM || "noreply@pawlig.vercel.app";

/**
 * Función genérica de manejo de errores
 */
const sendEmail = async (payload: any) => {
  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Exception in sendEmail:", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (
  payload: PasswordResetEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${fromEmail}>`,
    to: [payload.to],
    subject: "Recuperación de contraseña - PawLig",
    react: PasswordResetEmail({
      userName: payload.userName,
      resetUrl: payload.resetUrl,
    }),
  });
};

export const sendAdoptionStatusEmail = async (
  payload: AdoptionStatusEmailPayload,
) => {
  return sendEmail({
    from: `PawLig Adopciones <${fromEmail}>`,
    to: [payload.to],
    subject: `Actualización de tu solicitud para ${payload.petName}`,
    react: AdoptionStatusEmail({
      adopterName: payload.adopterName,
      petName: payload.petName,
      status: payload.status,
      shelterName: payload.shelterName,
      rejectionReason: payload.rejectionReason,
    }),
  });
};

export const sendNewAdoptionRequestEmail = async (
  payload: NewAdoptionRequestEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${fromEmail}>`,
    to: [payload.to],
    subject: `Nueva solicitud de adopción para ${payload.petName}`,
    react: NewAdoptionEmail({
      shelterName: payload.shelterName,
      adopterName: payload.adopterName,
      petName: payload.petName,
      adoptionId: payload.adoptionId,
    }),
  });
};

export const sendUserBlockStatusEmail = async (
  payload: UserBlockStatusEmailPayload,
) => {
  const subject =
    payload.action === "BLOCK"
      ? "Aviso Importante: Tu cuenta ha sido suspendida"
      : "Tu cuenta ha sido reactivada en PawLig";

  return sendEmail({
    from: `PawLig Soporte <${fromEmail}>`,
    to: [payload.to],
    subject,
    react: UserBlockStatusEmail({
      userName: payload.userName,
      action: payload.action,
      reason: payload.reason,
    }),
  });
};

export const sendOrderConfirmationEmail = async (
  payload: OrderConfirmationEmailPayload,
) => {
  return sendEmail({
    from: `PawLig Tienda <${fromEmail}>`,
    to: [payload.to],
    subject: `Confirmación de orden #${payload.orderId.slice(-6).toUpperCase()}`,
    react: OrderConfirmationEmail({
      userName: payload.userName,
      orderId: payload.orderId,
      totalAmount: payload.totalAmount,
      products: payload.products,
    }),
  });
};

export const sendNewSaleEmail = async (payload: NewSaleEmailPayload) => {
  return sendEmail({
    from: `PawLig Vendedores <${fromEmail}>`,
    to: [payload.to],
    subject: `¡Nueva Venta! Orden #${payload.orderId.slice(-6).toUpperCase()}`,
    react: NewSaleEmail({
      vendorName: payload.vendorName,
      orderId: payload.orderId,
      productsSold: payload.productsSold,
    }),
  });
};

export const sendOrderStatusUpdateEmail = async (
  payload: OrderStatusUpdateEmailPayload,
) => {
  return sendEmail({
    from: `PawLig Tienda <${fromEmail}>`,
    to: [payload.to],
    subject: `Actualización de tu orden #${payload.orderId.slice(-6).toUpperCase()}`,
    react: OrderStatusEmail({
      userName: payload.userName,
      orderId: payload.orderId,
      newStatus: payload.newStatus,
      trackingNumber: payload.trackingNumber,
    }),
  });
};

export const sendShelterApprovalEmail = async (
  payload: ShelterApprovalEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${fromEmail}>`,
    to: [payload.to],
    subject: "¡Solicitud de Albergue Aprobada!",
    react: ShelterApprovalEmail({
      representativeName: payload.representativeName,
      shelterName: payload.shelterName,
      loginUrl: payload.loginUrl,
    }),
  });
};

export const sendShelterRejectionEmail = async (
  payload: ShelterRejectionEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${fromEmail}>`,
    to: [payload.to],
    subject: "Actualización de tu solicitud de Albergue",
    react: ShelterRejectionEmail({
      representativeName: payload.representativeName,
      shelterName: payload.shelterName,
      rejectionReason: payload.rejectionReason,
    }),
  });
};

export const sendVendorApprovalEmail = async (
  payload: VendorApprovalEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${fromEmail}>`,
    to: [payload.to],
    subject: "¡Solicitud de Vendedor Aprobada!",
    react: VendorApprovalEmail({
      userName: payload.userName,
      businessName: payload.businessName,
      loginUrl: payload.loginUrl,
    }),
  });
};

export const sendVendorRejectionEmail = async (
  payload: VendorRejectionEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${fromEmail}>`,
    to: [payload.to],
    subject: "Actualización de tu solicitud de Tienda",
    react: VendorRejectionEmail({
      userName: payload.userName,
      businessName: payload.businessName,
      rejectionReason: payload.rejectionReason,
    }),
  });
};
