import { Text, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface ShelterRejectionProps {
  representativeName: string;
  shelterName: string;
  rejectionReason: string;
}

export const ShelterRejectionEmail = ({
  representativeName,
  shelterName,
  rejectionReason,
}: ShelterRejectionProps) => (
  <EmailLayout title="Actualización de Solicitud de Albergue">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {representativeName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Te escribimos respecto a tu solicitud para registrar el albergue{" "}
      <strong>{shelterName}</strong>.
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Lamentablemente, después de revisar tu solicitud, no hemos podido
      aprobarla en este momento.
    </Text>
    <Section className="bg-red-50 p-4 my-4 rounded text-red-800">
      <Text className="font-bold m-0 mb-2 text-[14px]">
        Motivo del rechazo:
      </Text>
      <Text className="m-0 text-[14px]">{rejectionReason}</Text>
    </Section>
    <Text className="text-black text-[14px] leading-[24px]">
      Si logras solventar los motivos mencionados, puedes volver a intentar
      enviar tu solicitud en el futuro o responder a este correo para
      comunicarte con nosotros.
    </Text>
  </EmailLayout>
);

export default ShelterRejectionEmail;
