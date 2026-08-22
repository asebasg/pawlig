"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Moon, Sun, Monitor, Palette, ChevronDown } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Asegura que el componente solo se renderice en el cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Cierra el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"></div>
    );
  }

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "solarized-light", label: "Solarized Light", icon: Sun },
    { value: "solarized-dark", label: "Solarized Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-gray-200"
        aria-label="Seleccionar tema"
      >
        <div className="flex items-center justify-center text-foreground">
          <Palette size={20} className="sm:w-5 sm:h-5 text-gray-600" />
        </div>
        <span className="hidden sm:block font-medium text-gray-700 text-sm">
          Tema
        </span>
        <ChevronDown size={14} className="text-gray-500 sm:w-4 sm:h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-100 mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Apariencia
            </span>
          </div>
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} className={isActive ? "text-purple-600" : "text-gray-500"} />
                <span className="text-sm">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
