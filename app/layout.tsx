"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/context/CartContext";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BadgeCheck, BadgeX, BadgeAlert, BadgeInfo, LoaderCircle } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProvider>
          <CartProvider>
            {/* Navbar */}
            <Navbar />
            {/* Contenido de las paginas */}
            <main className="flex-1">
              {children}
            </main>
            {/* Footer */}
            <Footer />
          </CartProvider>
          <Toaster
            position="top-center"
            closeButton
            duration={5000}
            toastOptions={{
              classNames: {
                toast: "toast group font-sans text-base border-2 flex items-center justify-center shadow-md cursor-pointer",
                success: "!bg-green-100 !text-green-700 !border-green-400",
                error: "!bg-red-100 !text-red-700 !border-red-400",
                warning: "!bg-yellow-100 !text-yellow-700 !border-yellow-400",
                info: "!bg-blue-100 !text-blue-700 !border-blue-400",
                loading: "!bg-indigo-100 !text-indigo-700 !border-indigo-400",
              },
            }}
            icons={{
              success: <BadgeCheck className=" text-green-100 fill-green-600" size={25} />,
              error: <BadgeX className=" text-red-100 fill-red-600" size={25} />,
              warning: <BadgeAlert className=" text-yellow-100 fill-yellow-600" size={25} />,
              info: <BadgeInfo className=" text-blue-100 fill-blue-600" size={25} />,
              loading: <LoaderCircle className="animate-spin text-indigo-600" size={25} />,
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
