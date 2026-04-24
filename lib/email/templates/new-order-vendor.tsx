import { Text, Section, Row, Column } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface OrderItem {
  name: string;
  quantity: number;
}

interface NewSaleProps {
  vendorName: string;
  orderId: string;
  productsSold: OrderItem[];
}

export const NewSaleEmail = ({
  vendorName,
  orderId,
  productsSold,
}: NewSaleProps) => (
  <EmailLayout title="¡Nueva Venta Realizada!">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {vendorName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      ¡Tienes una nueva venta en PawLig! Orden{" "}
      <strong>#{orderId.slice(-6).toUpperCase()}</strong>.
    </Text>
    <Section className="bg-gray-50 rounded p-4 my-4">
      <Text className="font-bold mb-2">Productos vendidos:</Text>
      {productsSold.map((p, i) => (
        <Row key={i} className="mb-2">
          <Column>
            <Text className="m-0 text-[14px]">
              {p.quantity}x {p.name}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
    <Text className="text-black text-[14px] leading-[24px]">
      Por favor, revisa tu panel de vendedor para gestionar el envío.
    </Text>
  </EmailLayout>
);

export default NewSaleEmail;
