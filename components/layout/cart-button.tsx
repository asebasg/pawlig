"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  itemCount?: number;
}

export function CartButton({ itemCount = 0 }: CartButtonProps) {
  return (
    <Link 
      href="/productos/cart"
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <ShoppingCart 
        size={24} 
        className={itemCount > 0 ? "text-purple-600" : "text-gray-600"}
      />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
