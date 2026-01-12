"use client";

import React, { useState } from "react";
import Link from "next/link";

/**
 * Descripción: Componente de UI que renderiza un enlace con un efecto de
 *              explosión de partículas (emojis) al pasar el cursor por encima.
 * Requiere: La URL de destino ('href') y el contenido del enlace ('children').
 * Implementa: Requisito de UI para un llamado a la acción (CTA) destacado y
 *             visualmente atractivo en la página de inicio.
 */

interface StarButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function StarButton({ href, className, children }: StarButtonProps) {
  const [particles, setParticles] = useState<
    { id: number; emoji: string; style: React.CSSProperties }[]
  >([]);

  const emojis = ["✨", "⭐", "🌟", "💫"];

  const triggerExplosion = () => {
    const newParticles: {
      id: number;
      emoji: string;
      style: React.CSSProperties;
    }[] = [];
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
        } as React.CSSProperties,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      const idsToRemove = new Set(newParticles.map((p) => p.id));
      setParticles((prev) => prev.filter((p) => !idsToRemove.has(p.id)));
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
            transform: translate(
              -70%,
              -70%
            )
              translate(calc(var(--tx) * 0.2), var(--ty)) scale(1);
            animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--tx), 10000px)
              rotate(var(--rot)) scale(0.8);
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
 * Este componente es un elemento de UI puramente presentacional, diseñado para
 * crear un llamado a la acción (CTA) memorable. Envuelve un enlace estándar
 * y le añade un efecto visual de "explosión de estrellas" que se activa cuando
 * el usuario pasa el cursor sobre él ('onMouseEnter').
 *
 * Lógica Clave:
 * - 'Gestión de Estado de Partículas': El estado 'particles' (un array de objetos)
 *   almacena las partículas activas en el DOM. Cada partícula tiene un 'id' único,
 *   un 'emoji' y un objeto de 'style' con propiedades CSS personalizadas.
 * - 'triggerExplosion': Esta función se llama en el evento 'onMouseEnter'. Genera
 *   un número determinado de partículas con trayectorias, rotaciones y duraciones
 *   aleatorias. Estas propiedades se asignan como variables CSS ('--tx', '--ty', etc.)
 *   que son utilizadas por la animación 'arc-fall'.
 * - 'Animación CSS con Keyframes': La animación 'arc-fall' se define dentro de
 *   una etiqueta '<style jsx>'. Utiliza las variables CSS para crear un efecto de
 *   arco y caída, simulando una explosión de confeti.
 * - 'Limpieza Automática': Se utiliza 'setTimeout' para eliminar las partículas
 *   del estado después de que su animación ha concluido, evitando así la
 *   acumulación de nodos en el DOM.
 *
 * Dependencias Externas:
 * - 'react': Para la gestión del estado con 'useState'.
 * - 'next/link': Para la funcionalidad de navegación del lado del cliente.
 *
 */
