import { Text, Button } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface PasswordResetProps {
  userName: string;
  resetUrl: string;
}

export const PasswordResetEmail = ({
  userName,
  resetUrl,
}: PasswordResetProps) => (
  <EmailLayout title="Recuperación de Contraseña">
    <Text className="text-black text-[14px] leading-[24px]">
      Hola {userName},
    </Text>
    <Text className="text-black text-[14px] leading-[24px]">
      Recibimos una solicitud para restablecer la contraseña de tu cuenta en
      PawLig. Si no fuiste tú, puedes ignorar este correo.
    </Text>
    <Button
      href={resetUrl}
      className="bg-[#7C3AED] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 block w-fit mx-auto my-[20px]"
    >
      Restablecer contraseña
    </Button>
    <Text className="text-black text-[14px] leading-[24px]">
      Este enlace expirará en 1 hora.
    </Text>
  </EmailLayout>
);

export default PasswordResetEmail;
