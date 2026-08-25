import { Resend, type CreateEmailOptions } from "resend";
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

/**
 * Descripción: Servicio para el envío de correos electrónicos transaccionales mediante Resend.
 * Requiere: Variables de entorno RESEND_API_KEY y EMAIL_FROM.
 * Implementa: Notificaciones por correo electrónico del sistema.
 */

/**
 * Ofusca un correo electrónico para su uso seguro en logs.
 * Ejemplo: "usuario@dominio.com" → "u***@dominio.com"
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***.***";
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no configurada");
  }
  return new Resend(apiKey);
}

export function getFromEmail(): string {
  const fromEmail = process.env.EMAIL_FROM;
  if (!fromEmail) {
    throw new Error(
      "EMAIL_FROM no está definido. Por favor, defínelo en tu archivo .env.",
    );
  }
  return fromEmail;
}

/**
 * Función genérica de manejo de errores
 */
const sendEmail = async (payload: CreateEmailOptions) => {
  try {
    const resend = getResendClient();
    const recipient = Array.isArray(payload.to) ? payload.to[0] : payload.to;
    const maskedRecipient = maskEmail(String(recipient));
    console.log("[EMAIL] Enviando a:", maskedRecipient, "desde:", payload.from);

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[EMAIL] ❌ Error:", JSON.stringify(error, null, 2));
      } else {
        console.error("[EMAIL] ❌ Error al enviar correo.");
      }
      return { success: false, error };
    }

    console.log("[EMAIL] ✅ Enviado:", data?.id);
    return { success: true, data };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[EMAIL] ❌ Exception:", error);
    } else {
      console.error("[EMAIL] ❌ Excepción al intentar enviar correo.");
    }
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (
  payload: PasswordResetEmailPayload,
) => {
  return sendEmail({
    from: `PawLig <${getFromEmail()}>`,
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
    from: `PawLig Adopciones <${getFromEmail()}>`,
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
    from: `PawLig <${getFromEmail()}>`,
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
    from: `PawLig Soporte <${getFromEmail()}>`,
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
    from: `PawLig Tienda <${getFromEmail()}>`,
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
    from: `PawLig Vendedores <${getFromEmail()}>`,
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
    from: `PawLig Tienda <${getFromEmail()}>`,
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
    from: `PawLig <${getFromEmail()}>`,
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
    from: `PawLig <${getFromEmail()}>`,
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
    from: `PawLig <${getFromEmail()}>`,
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
    from: `PawLig <${getFromEmail()}>`,
    to: [payload.to],
    subject: "Actualización de tu solicitud de Tienda",
    react: VendorRejectionEmail({
      userName: payload.userName,
      businessName: payload.businessName,
      rejectionReason: payload.rejectionReason,
    }),
  });
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Módulo encargado del envío de correos electrónicos transaccionales (restablecimiento de contraseña,
 * notificaciones de adopción, confirmaciones de compra, avisos de moderación y aprobación de cuentas).
 *
 * Lógica Clave:
 * - Inicialización Lazy: El cliente de Resend se instancia bajo demanda mediante getResendClient(),
 *   evitando fallos en tiempo de compilación (Build Time) si las credenciales no están presentes.
 * - Obtención de Remitente Lazy: getFromEmail() valida EMAIL_FROM en tiempo de ejecución.
 * - Manejo de Errores: Centralizado en sendEmail para capturar tanto errores de la API de Resend
 *   como excepciones de red sin interrumpir el flujo principal de la aplicación.
 *
 * Dependencias Externas:
 * - Resend: SDK oficial para la entrega de correos electrónicos y plantillas React Email.
 *
 */
