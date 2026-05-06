import { Text, Section } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface AdoptionStatusProps {
  adopterName: string;
  petName: string;
  status: "APPROVED" | "REJECTED";
  shelterName: string;
  rejectionReason?: string;
}

export const AdoptionStatusEmail = ({
  adopterName,
  petName,
  status,
  shelterName,
  rejectionReason,
}: AdoptionStatusProps) => {
  const isApproved = status === "APPROVED";

  return (
    <EmailLayout title="Actualización de tu Solicitud de Adopción">
      <Text className="text-black text-[14px] leading-[24px]">
        Hola {adopterName},
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        El albergue <strong>{shelterName}</strong> ha actualizado el estado de
        tu solicitud de adopción para <strong>{petName}</strong>.
      </Text>
      <Section
        className={`p-4 my-4 rounded ${isApproved ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
      >
        <Text className="text-[16px] font-bold text-center m-0">
          ESTADO: {isApproved ? "APROBADA 🎉" : "RECHAZADA"}
        </Text>
      </Section>
      {!isApproved && rejectionReason && (
        <Text className="text-black text-[14px] leading-[24px] mt-4">
          <strong>Motivo:</strong> {rejectionReason}
        </Text>
      )}
      {isApproved && (
        <Text className="text-black text-[14px] leading-[24px]">
          ¡Felicidades! El albergue se pondrá en contacto contigo pronto para
          los siguientes pasos.
        </Text>
      )}
    </EmailLayout>
  );
};

export default AdoptionStatusEmail;
