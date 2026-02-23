"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionSectionProps {
    icon: React.ReactNode;
    number: string;
    title: string;
    id: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

/**
 * Componente acordeón para las secciones del Centro de Ayuda.
 * - Es un Client Component para manejar el estado de apertura/cierre.
 * - Detecta el hash de la URL para abrir automáticamente la sección
 *   correspondiente cuando el usuario hace clic en el sidebar.
 * - Usa la técnica CSS grid-template-rows para animaciones suaves
 *   sin necesidad de medir alturas con JS.
 */
export function AccordionSection({
    icon,
    number,
    title,
    id,
    defaultOpen = false,
    children,
}: AccordionSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    useEffect(() => {
        // Abre la sección si el hash de la URL coincide con su id
        const checkHash = () => {
            if (window.location.hash === `#${id}`) {
                setIsOpen(true);
            }
        };

        checkHash(); // Revisar al montar el componente
        window.addEventListener("hashchange", checkHash);
        return () => window.removeEventListener("hashchange", checkHash);
    }, [id]);

    return (
        <div
            id={id}
            className="scroll-mt-24 border border-slate-200 rounded-3xl overflow-hidden transition-shadow hover:shadow-sm"
        >
            {/* Cabecera clicable */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls={`${id}-content`}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                        {icon}
                    </div>
                    <span className="text-base font-bold text-slate-900 uppercase tracking-tight">
                        {number}. {title}
                    </span>
                </div>
                <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/*
        Truco de animación con grid-template-rows:
        - Colapsado: grid-template-rows: 0fr  → el hijo ocupa 0 de alto
        - Expandido: grid-template-rows: 1fr  → el hijo ocupa su alto natural
        - El hijo interno con overflow:hidden evita que el contenido
          sea visible durante la transición de 0.
      */}
            <div
                id={`${id}-content`}
                role="region"
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
                <div className="overflow-hidden">
                    <div className="px-6 pb-7 pt-4 border-t border-slate-100 space-y-8 text-slate-700 leading-relaxed">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
