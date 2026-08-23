"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import FloatingCartButton from "@/components/layout/floating-cart-button";
import { BadgeCheck, BadgeX, BadgeAlert, BadgeInfo, LoaderCircle } from 'lucide-react'

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
          {/* Navbar */}
          <Navbar />
          {/* Contenido de las paginas */}
          <main className="flex-1">
            {children}
          <FloatingCartButton />
          </main>
          {/* Footer */}
          <Footer />
          <Toaster
            position="top-center"
            closeButton
            duration={5000}
            toastOptions={{
              classNames: {
                toast: "group font-sans text-[15px] font-medium tracking-tight bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.2)] rounded-2xl flex items-center px-4 py-3 cursor-pointer",
                success: "!bg-green-50/80 !text-green-800 !border-green-200/60",
                error: "!bg-red-50/80 !text-red-800 !border-red-200/60",
                warning: "!bg-yellow-50/80 !text-yellow-800 !border-yellow-200/60",
                info: "!bg-blue-50/80 !text-blue-800 !border-blue-200/60",
                loading: "!bg-indigo-50/80 !text-indigo-800 !border-indigo-200/60",
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
