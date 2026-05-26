"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODERATION_NAV_LINKS } from "@/lib/constants";

/**
 * /components/admin/moderation-tabs.tsx
 * Descripción: Barra de navegación para el Moderation Hub usando un diseño de Tabs elegantes.
 * Requiere: MODERATION_NAV_LINKS
 */
export function ModerationTabs() {
  const pathname = usePathname();

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1 border border-gray-100">
        {MODERATION_NAV_LINKS.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                isActive
                  ? "bg-purple-100 text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
