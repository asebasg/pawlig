"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StarButtonProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

export function StarButton({ href, className, children }: StarButtonProps) {
    const [particles, setParticles] = useState<{ id: number; emoji: string; style: React.CSSProperties }[]>([]);

    const emojis = ["✨", "⭐", "🌟", "💫"];

    const triggerExplosion = () => {
        // Generar un lote de partículas
        const newParticles: { id: number; emoji: string; style: React.CSSProperties }[] = [];
        const count = 25; // Más partículas

        for (let i = 0; i < count; i++) {
            // Dispersión horizontal mucho más amplia (serpentina)
            // Rango de -6000px a 6000px
            const tx = (Math.random() - 0.5) * 6000;

            // Altura del disparo (más alto)
            const ty = -150 - Math.random() * 150;

            // Rotación intensa
            const rot = (Math.random() - 0.5) * 1400;

            const emoji = emojis[Math.floor(Math.random() * emojis.length)];

            // Variación aleatoria en la duración para naturalidad
            const duration = 5 + Math.random();

            newParticles.push({
                id: Date.now() + i,
                emoji,
                style: {
                    "--tx": `${tx}px`,
                    "--ty": `${ty}px`,
                    "--rot": `${rot}deg`,
                    "--duration": `${duration}s`,
                    left: "50%",
                    top: "50%",
                } as React.CSSProperties
            });
        }

        setParticles(prev => [...prev, ...newParticles]);

        // Limpieza después de que termine la animación (más larga ahora)
        setTimeout(() => {
            const idsToRemove = new Set(newParticles.map(p => p.id));
            setParticles(prev => prev.filter(p => !idsToRemove.has(p.id)));
        }, 3500);
    };

    return (
        <Link
            href={href}
            className={`relative group ${className}`} // Agregamos 'relative' para posicionar las partículas
            onMouseEnter={triggerExplosion}
        >
            {/* Estilos en línea para la animación específica de este componente */}
            <style jsx>{`
        @keyframes arc-fall {
            0% {
                transform: translate(-50%, -50%) translate(0, 0) scale(0.5);
                opacity: 0;
                /* Lanzamiento explosivo: sale muy rápido */
                animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1); 
            }
            8% {
                /* Alcanza la altura máxima (pico) muy rápido (en el 8% del tiempo total) */
                opacity: 1;
                transform: translate(-70%, -70%) translate(calc(var(--tx) * 0.2), var(--ty)) scale(1);
                /* Comienza a caer suavemente (resistencia del aire) */
                animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
            }
            100% {
                /* Cae lentamente hasta el final (papel flotando) */
                transform: translate(-50%, -50%) translate(var(--tx), 10000px) rotate(var(--rot)) scale(0.8);
                opacity: 1; 
            }
        }
        .particle {
            position: absolute;
            pointer-events: none;
            /* La duración (aprox 6s) se aplica mayormente a la caída gracias a los keyframes */
            animation: arc-fall var(--duration) linear forwards;
            font-size: 1.5rem;
            z-index: 100;
            line-height: 1;
        }
      `}</style>

            {/* Contenedor de partículas */}
            {particles.map((p) => (
                <span key={p.id} className="particle" style={p.style}>
                    {p.emoji}
                </span>
            ))}

            {/* Contenido del botón */}
            <span className="relative z-10 block">{children}</span>
        </Link>
    );
}
