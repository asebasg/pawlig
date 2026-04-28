import { Text, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderConfirmationProps {
  userName: string;
  orderId: string;
  totalAmount: number;
  products: OrderItem[];
}

export const OrderConfirmationEmail = ({
  userName,
  orderId,
  totalAmount,
  products,
}: OrderConfirmationProps) => (
  <EmailLayout title="Confirmación de tu Orden">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {userName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      ¡Gracias por tu compra en PawLig! Hemos recibido tu orden{" "}
      <strong>#{orderId.slice(-6).toUpperCase()}</strong>.
    </Text>
    <Section className="bg-gray-50 rounded p-4 my-4">
      <Text className="font-bold mb-2">Detalles del pedido:</Text>
      {products.map((p, i) => (
        <Row key={i} className="mb-2">
          <Column>
            <Text className="m-0 text-[14px]">
              {p.quantity}x {p.name}
            </Text>
          </Column>
        </Row>
      ))}
      <Row className="mt-4 pt-4 border-t border-gray-200">
        <Column>
          <Text className="font-bold m-0 text-[14px]">Total:</Text>
        </Column>
        <Column align="right">
          <Text className="font-bold m-0 text-[14px]">
            ${totalAmount.toLocaleString()}
          </Text>
        </Column>
      </Row>
    </Section>
    <Text className="text-black text-[14px] leading-[24px]">
      Te notificaremos cuando tu pedido sea enviado.
    </Text>
  </EmailLayout>
);

export default OrderConfirmationEmail;
