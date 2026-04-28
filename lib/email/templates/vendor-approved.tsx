import { Text, Button } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface VendorApprovalProps {
  userName: string;
  businessName: string;
  loginUrl: string;
}

export const VendorApprovalEmail = ({
  userName,
  businessName,
  loginUrl,
}: VendorApprovalProps) => (
  <EmailLayout title="¡Solicitud de Vendedor Aprobada!">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {userName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      ¡Felicidades! Tu solicitud para registrar la tienda{" "}
      <strong>{businessName}</strong> ha sido aprobada por nuestro equipo de
      administración.
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Ya puedes acceder a tu panel de control para publicar tus productos y
      empezar a vender.
    </Text>
    <Button
      href={loginUrl}
      className="bg-[#7C3AED] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 block w-fit mx-auto my-[20px]"
    >
      Acceder a mi tienda
    </Button>
  </EmailLayout>
);

export default VendorApprovalEmail;
