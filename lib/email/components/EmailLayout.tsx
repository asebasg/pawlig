import {
  Html,
  Head,
  Body,
  Container,
  Tailwind,
  Text,
  Hr,
} from "@react-email/components";
import React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const EmailLayout = ({ children, title }: EmailLayoutProps) => {
  return (
    <Html>
      <Head>
        <title>{title || "PawLig"}</title>
      </Head>
      <Tailwind>
        <Body className="bg-[#f6f9fc] my-auto mx-auto font-sans">
          <Container className="bg-white border border-[#e6ebf1] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Text className="text-[#7C3AED] text-[24px] font-bold text-center my-[30px]">
              PawLig
            </Text>
            {children}
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Este es un mensaje automático de PawLig. Por favor no respondas a
              este correo.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
