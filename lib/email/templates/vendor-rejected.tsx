import { Text, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface VendorRejectionProps {
  userName: string;
  businessName: string;
  rejectionReason: string;
}

export const VendorRejectionEmail = ({
  userName,
  businessName,
  rejectionReason,
}: VendorRejectionProps) => (
  <EmailLayout title="Actualización de Solicitud de Tienda">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {userName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Te escribimos respecto a tu solicitud para registrar la tienda{" "}
      <strong>{businessName}</strong>.
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Lamentablemente, después de revisar los datos proporcionados, no hemos
      podido aprobar tu solicitud.
    </Text>
    <Section className="bg-red-50 p-4 my-4 rounded text-red-800">
      <Text className="font-bold m-0 mb-2 text-[14px]">
        Motivo del rechazo:
      </Text>
      <Text className="m-0 text-[14px]">{rejectionReason}</Text>
    </Section>
    <Text className="text-black text-[14px] leading-[24px]">
      Te invitamos a corregir los detalles mencionados e intentar enviar tu
      solicitud nuevamente, o responde a este correo si tienes alguna duda.
    </Text>
  </EmailLayout>
);

export default VendorRejectionEmail;
