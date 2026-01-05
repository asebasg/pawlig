"use client";

import { useSession } from "next-auth/react";
import { Logo } from "@/components/ui/logo";
import { NavbarPublic } from "./navbar-public";
import { NavbarAuth } from "./navbar-auth";
import { NavbarMobile } from "./navbar-mobile";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-4">
            <NavbarMobile user={session?.user || null} />
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
            <div className="hidden lg:block">
              <Logo size="md" />
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          {status === "loading" ? (
            <div className="hidden lg:flex h-10 w-96 bg-gray-100 animate-pulse rounded" />
          ) : session?.user ? (
            <div className="flex items-center gap-8 flex-1 justify-end">
              <NavbarAuth user={session.user} />
            </div>
          ) : (
            <div className="flex items-center gap-8 flex-1 justify-end">
              <NavbarPublic />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
