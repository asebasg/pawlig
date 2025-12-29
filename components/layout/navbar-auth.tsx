"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart } from "lucide-react";
import { UserMenu } from "./user-menu";
import { CartButton } from "./cart-button";
import { NAVIGATION_BY_ROLE } from "@/lib/constants";

interface NavbarAuthProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export function NavbarAuth({ user }: NavbarAuthProps) {
  const pathname = usePathname();
  const navigation = NAVIGATION_BY_ROLE[user.role as keyof typeof NAVIGATION_BY_ROLE] || [];
  const displayNav = navigation;
  // const displayNav = user.role === "ADMIN" ? navigation.slice(0, 3) : navigation.slice(0, 3);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="flex items-center gap-6">
        {displayNav.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-base transition-colors pb-1 border-b-2 ${
                isActive
                  ? "text-purple-600 border-purple-600"
                  : "text-gray-700 border-transparent hover:text-purple-600"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Cart & Favorites - Sólo para rol ADOPTER */}
        {user.role === "ADOPTER" && (
          <>
            <Link
              href="/user/favorites"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Heart size={24} className="text-gray-600" />
            </Link>
            <CartButton itemCount={0} />
          </>
        )}

        {/* User Menu */}
        <UserMenu user={user} />
      </div>
    </>
  );
}
