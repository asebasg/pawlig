import { Text, Button } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface ShelterApprovalProps {
  representativeName: string;
  shelterName: string;
  loginUrl: string;
}

export const ShelterApprovalEmail = ({
  representativeName,
  shelterName,
  loginUrl,
}: ShelterApprovalProps) => (
  <EmailLayout title="¡Solicitud de Albergue Aprobada!">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {representativeName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      ¡Excelentes noticias! Tu solicitud para registrar el albergue{" "}
      <strong>{shelterName}</strong> ha sido aprobada por nuestro equipo de
      administración.
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Ya puedes acceder a tu panel de control y empezar a publicar a las
      mascotas que buscan un nuevo hogar.
    </Text>
    <Button
      href={loginUrl}
      className="bg-[#7C3AED] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 block w-fit mx-auto my-[20px]"
    >
      Acceder a mi panel
    </Button>
  </EmailLayout>
);

export default ShelterApprovalEmail;
