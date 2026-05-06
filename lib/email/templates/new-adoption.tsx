import { Text, Button } from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import React from "react";

interface NewAdoptionProps {
  shelterName: string;
  adopterName: string;
  petName: string;
  adoptionId: string;
}

export const NewAdoptionEmail = ({
  shelterName,
  adopterName,
  petName,
  adoptionId,
}: NewAdoptionProps) => {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/shelter/adoptions/${adoptionId}`;

  return (
    <EmailLayout title="Nueva Solicitud de Adopción">
      <Text className="text-black text-[14px] leading-[24px]">
        Hola {shelterName},
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        ¡Tienes una nueva solicitud de adopción! <strong>{adopterName}</strong>{" "}
        está interesado(a) en adoptar a <strong>{petName}</strong>.
      </Text>
      <Button
        href={url}
        className="bg-[#7C3AED] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3 block w-fit mx-auto my-[20px]"
      >
        Revisar Solicitud
      </Button>
    </EmailLayout>
  );
};

export default NewAdoptionEmail;
