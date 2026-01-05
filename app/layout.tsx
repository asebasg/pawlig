"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

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
          </main>
          {/* Footer */}
          <Footer />
          <Toaster
            position="top-center"
            richColors
            closeButton
            duration={3000}
            toastOptions={{
              className: "font-sans text-base p-1"
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
