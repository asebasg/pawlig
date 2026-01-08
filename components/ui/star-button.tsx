"use client";

import React, { useState } from "react";
import Link from "next/link";

/**
 * Ruta/Componente/Servicio: Componente StarButton
 * Descripción: Un componente de enlace estilizado que dispara una animación de partículas (estrellas) al pasar el cursor sobre él.
 * Requiere: -
 * Implementa: -
 */

interface StarButtonProps {
    href: string;
    className?: string;
    children: React.ReactNode;
}

export function StarButton({ href, className, children }: StarButtonProps) {
    const [particles, setParticles] = useState<{ id: number; emoji: string; style: React.CSSProperties }[]>([]);

    const emojis = ["✨", "⭐", "🌟", "💫", "🪅", "🎉", "🎊", "🪩", "🐶", "🐱", "🐾"];

    const triggerExplosion = () => {
        const newParticles: { id: number; emoji: string; style: React.CSSProperties }[] = [];
        const count = 25;

        for (let i = 0; i < count; i++) {
            const tx = (Math.random() - 0.5) * 6000;
            const ty = -150 - Math.random() * 150;
            const rot = (Math.random() - 0.5) * 1400;
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
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

        setTimeout(() => {
            const idsToRemove = new Set(newParticles.map(p => p.id));
            setParticles(prev => prev.filter(p => !idsToRemove.has(p.id)));
        }, 3500);
    };

    return (
        <Link
            href={href}
            className={`relative group ${className}`}
            onMouseEnter={triggerExplosion}
        >
            <style jsx>{`
        @keyframes arc-fall {
            0% {
                transform: translate(-50%, -50%) translate(0, 0) scale(0.5);
                opacity: 0;
                animation-timing-function: cubic-bezier(0.2, 0.8, 0.2, 1); 
            }
            8% {
                opacity: 1;
                transform: translate(-70%, -70%) translate(calc(var(--tx) * 0.2), var(--ty)) scale(1);
                animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
            }
            100% {
                transform: translate(-50%, -50%) translate(var(--tx), 10000px) rotate(var(--rot)) scale(0.8);
                opacity: 1; 
            }
        }
        .particle {
            position: absolute;
            pointer-events: none;
            animation: arc-fall var(--duration) linear forwards;
            font-size: 1.5rem;
            z-index: 100;
            line-height: 1;
        }
      `}</style>

            {particles.map((p) => (
                <span key={p.id} className="particle" style={p.style}>
                    {p.emoji}
                </span>
            ))}

            <span className="relative z-10 block">{children}</span>
        </Link>
    );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente es un 'Link' de Next.js envuelto con una funcionalidad de
 * animación de partículas. Cuando el usuario pasa el cursor sobre el enlace,
 * se genera una "explosión" de emojis de estrellas para crear un efecto visual
 * llamativo y agradable.
 *
 * Lógica Clave:
 * - 'triggerExplosion': Esta función se activa con el evento 'onMouseEnter'.
 *   Genera dinámicamente un array de nuevas partículas con posiciones,
 *   rotaciones y duraciones aleatorias.
 * - 'Estado de Partículas': El estado 'particles' almacena el array de
 *   partículas activas que se renderizan en el DOM. Cada partícula es un 'span'
 *   absolutamente posicionado.
 * - 'Animación CSS': La animación se define usando 'styled-jsx' y keyframes
 *   ('arc-fall'). Las propiedades de la animación de cada partícula (como
 *   '--tx', '--ty') se pasan a través de variables CSS personalizadas,
 *   permitiendo que cada una siga una trayectoria única.
 * - 'Limpieza del DOM': Se utiliza un 'setTimeout' para eliminar las partículas
 *   del estado después de que la animación ha terminado. Esto es crucial para
 *   prevenir la acumulación de miles de nodos en el DOM si el usuario
 *   interactúa repetidamente con el botón.
 *
 * Dependencias Externas:
 * - 'react': Para el manejo del estado con 'useState'.
 * - 'next/link': Para el componente de enlace subyacente.
 *
 */
