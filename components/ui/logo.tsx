"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

interface LogoProps {
  variant?: "full" | "icon-only";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ variant = "full", size = "md", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 text-xl",
    md: "h-10 text-2xl",
    lg: "h-12 text-3xl"
  };

  const iconSizes = {
    sm: 24,
    md: 28,
    lg: 32
  };

  return (
    <Link 
      href={href}
      className="flex items-center gap-2 transition-transform hover:scale-105"
    >
      <PawPrint 
        size={iconSizes[size]} 
        className="text-purple-600" 
        strokeWidth={2.5}
      />
      {variant === "full" && (
        <span className={`font-poppins font-bold text-purple-600 ${sizeClasses[size]}`}>
          PawLig
        </span>
      )}
    </Link>
  );
}
