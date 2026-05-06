import { Text, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface UserBlockProps {
  userName: string;
  action: "BLOCK" | "UNBLOCK";
  reason?: string;
}

export const UserBlockStatusEmail = ({
  userName,
  action,
  reason,
}: UserBlockProps) => {
  const isBlocked = action === "BLOCK";

  return (
    <EmailLayout
      title={
        isBlocked ? "Aviso Importante: Cuenta Suspendida" : "Cuenta Reactivada"
      }
    >
      <Text className="text-black text-[14px] leading-[24px]">
        Hola {userName},
      </Text>
      {isBlocked ? (
        <>
          <Text className="text-black text-[14px] leading-[24px]">
            Te informamos que tu cuenta en PawLig ha sido{" "}
            <strong>suspendida temporalmente</strong> por un administrador.
          </Text>
          <Section className="bg-red-50 p-4 my-4 rounded text-red-800">
            <Text className="font-bold m-0 mb-2 text-[14px]">
              Motivo de la suspensión:
            </Text>
            <Text className="m-0 text-[14px]">
              {reason || "Incumplimiento de los términos de servicio."}
            </Text>
          </Section>
          <Text className="text-black text-[14px] leading-[24px]">
            Si consideras que esto es un error, por favor responde a este correo
            para comunicarte con soporte.
          </Text>
        </>
      ) : (
        <>
          <Text className="text-black text-[14px] leading-[24px]">
            ¡Buenas noticias! Tu cuenta en PawLig ha sido{" "}
            <strong>reactivada</strong> y ya puedes acceder nuevamente.
          </Text>
          <Text className="text-black text-[14px] leading-[24px]">
            Gracias por tu paciencia. Si tienes alguna duda, no dudes en
            contactarnos.
          </Text>
        </>
      )}
    </EmailLayout>
  );
};

export default UserBlockStatusEmail;
