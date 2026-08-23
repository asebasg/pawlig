import { Transition } from "framer-motion";

/**
 * PawLig Motion Standards (Apple Design)
 * 
 * Este archivo actúa como el "Single Source of Truth" para todas las animaciones 
 * físicas del proyecto. En lugar de quemar duraciones o curvas CSS (`transition-all`),
 * utilizamos estas configuraciones estándar de resortes (springs).
 */

// 1. UI Base (Critically Damped - Sin rebote)
// Uso: Apertura de contenedores, cambio de pestañas, modales.
// Características: Rápido, elegante, sin overshoot que distraiga.
export const springUI: Transition = {
  type: "spring",
  bounce: 0, // Damping ratio 1.0
  duration: 0.3,
};

// 2. Momentum / Interacción Física (Under-damped - Con rebote sutil)
// Uso: Efectos de hover, pulsación (whileTap), menús que brotan desde un origen físico (Select).
// Características: Imita la inercia del dedo; sobrepasa su tamaño y se asienta.
export const springMomentum: Transition = {
  type: "spring",
  bounce: 0.25, // Damping ratio ~0.8
  duration: 0.35,
};

// 3. Opciones de Accesibilidad (prefers-reduced-motion)
// Uso: Pasar a `transition` en componentes de Framer Motion cuando reduceMotion es verdadero.
export const reducedMotionTransition: Transition = {
  type: "tween",
  duration: 0,
};
