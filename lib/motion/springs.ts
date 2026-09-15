import type { Transition } from "framer-motion";

export const springs = {
  /** Micro-interacciones: botones, íconos, badges */
  snap:     { type: "spring", bounce: 0,    duration: 0.15 } as Transition,
  /** Default de UI: cards, paneles, transiciones de página */
  default:  { type: "spring", bounce: 0,    duration: 0.4  } as Transition,
  /** Modales y drawers: leve sensación física */
  modal:    { type: "spring", bounce: 0.1,  duration: 0.35 } as Transition,
  /** Interacciones con momentum (flick, drag release) */
  physical: { type: "spring", bounce: 0.2,  duration: 0.4  } as Transition,
  /** Tabs y shared layout con layoutId */
  layout:   { type: "spring", bounce: 0.15, duration: 0.3  } as Transition,
} as const;
