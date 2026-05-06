export interface BaseEmailPayload {
  to: string;
}

export interface PasswordResetEmailPayload extends BaseEmailPayload {
  userName: string;
  resetUrl: string;
}

export interface AdoptionStatusEmailPayload extends BaseEmailPayload {
  adopterName: string;
  petName: string;
  status: "APPROVED" | "REJECTED";
  shelterName: string;
  rejectionReason?: string;
}

export interface NewAdoptionRequestEmailPayload extends BaseEmailPayload {
  shelterName: string;
  adopterName: string;
  petName: string;
  adoptionId: string;
}

export interface UserBlockStatusEmailPayload extends BaseEmailPayload {
  userName: string;
  action: "BLOCK" | "UNBLOCK";
  reason?: string;
}

export interface ShelterApprovalEmailPayload extends BaseEmailPayload {
  representativeName: string;
  shelterName: string;
  loginUrl: string;
}

export interface ShelterRejectionEmailPayload extends BaseEmailPayload {
  representativeName: string;
  shelterName: string;
  rejectionReason: string;
}

export interface VendorApprovalEmailPayload extends BaseEmailPayload {
  userName: string;
  businessName: string;
  loginUrl: string;
}

export interface VendorRejectionEmailPayload extends BaseEmailPayload {
  userName: string;
  businessName: string;
  rejectionReason: string;
}

export interface OrderItemPayload {
  name: string;
  quantity: number;
}

export interface OrderConfirmationEmailPayload extends BaseEmailPayload {
  userName: string;
  orderId: string;
  totalAmount: number;
  products: OrderItemPayload[];
}

export interface NewSaleEmailPayload extends BaseEmailPayload {
  vendorName: string;
  orderId: string;
  productsSold: OrderItemPayload[];
}

export interface OrderStatusUpdateEmailPayload extends BaseEmailPayload {
  userName: string;
  orderId: string;
  newStatus: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber?: string;
}
