"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PUBLIC_LINKS } from "@/lib/constants";

export function NavbarPublic() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {PUBLIC_LINKS.slice(0, 4).map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-base transition-colors pb-1 border-b-2 ${isActive
                ? "text-purple-600 border-purple-600"
                : "text-gray-700 border-transparent hover:text-purple-600"
                }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Auth Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="px-2 sm:px-4 py-2 text-sm sm:text-base font-semibold text-gray-700 hover:text-purple-600 transition-colors"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
        >
          Registrarse
        </Link>
      </div>
    </>
  );
}
