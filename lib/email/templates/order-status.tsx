import { Text, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface OrderStatusProps {
  userName: string;
  orderId: string;
  newStatus: string;
  trackingNumber?: string;
}

const statusMap: Record<string, string> = {
  CONFIRMED: "Confirmada",
  SHIPPED: "En Camino",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
};

export const OrderStatusEmail = ({
  userName,
  orderId,
  newStatus,
  trackingNumber,
}: OrderStatusProps) => {
  const statusEs = statusMap[newStatus] || newStatus;

  return (
    <EmailLayout title="Actualización de tu Orden">
      <Text className="text-black text-[14px] leading-[24px]">
        Hola {userName},
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        El estado de tu orden{" "}
        <strong>#{orderId.slice(-6).toUpperCase()}</strong> ha sido actualizado.
      </Text>
      <Section className="bg-blue-50 p-4 my-4 rounded text-blue-800 text-center">
        <Text className="text-[16px] font-bold m-0">
          NUEVO ESTADO: {statusEs.toUpperCase()}
        </Text>
      </Section>
      {trackingNumber && (
        <Text className="text-black text-[14px] leading-[24px]">
          <strong>Número de seguimiento:</strong> {trackingNumber}
        </Text>
      )}
    </EmailLayout>
  );
};

export default OrderStatusEmail;
