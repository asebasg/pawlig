"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";

/**
 * Descripción: Componente DeleteButton interactivo con confirmación in-place.
 * Requiere: Prop onConfirm para ejecutar la acción confirmada, framer-motion.
 * Implementa: Componente RareUI adoptado según DESIGN.md §7.1 con soporte para variantes default y destructive.
 */

const HINGE = "3px 6px";
const LID_OPEN = -35;
const WALL_TOP = 6;
const WALL_TOP_OPEN = 13.5;
const WALL_BASE = 20;

const HOLD = { deleted: 1400, kept: 600 };
const INSTANT = { duration: 0 } as Transition;

export type DeleteButtonVariant = "default" | "destructive";
export type DeleteButtonSize = "default" | "sm";

interface VariantStyle {
  surface: string;
  recess: string;
  glyph: string;
  focus: string;
  accent: string;
  circleFocus: string;
}

const VARIANTS: Record<DeleteButtonVariant, VariantStyle> = {
  default: {
    surface: "bg-zinc-100 dark:bg-zinc-800",
    recess: "bg-zinc-200/50 dark:bg-zinc-900/50",
    glyph:
      "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
    focus:
      "outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
    accent: "text-purple-600 dark:text-purple-400",
    circleFocus:
      "outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
  },
  destructive: {
    surface:
      "bg-red-50/80 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/40",
    recess: "bg-red-100/50 dark:bg-red-950/50",
    glyph:
      "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300",
    focus:
      "outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
    accent: "text-red-600 dark:text-red-400",
    circleFocus:
      "outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
  },
};

interface SizeStyle {
  tile: number;
  panel: number;
  radiusClass: string;
  panelLeftClass: string;
  containerClass: string;
  triggerClass: string;
  svgSize: number;
  circleClass: string;
  circleSvgSize: number;
  gapClass: string;
}

const SIZES: Record<DeleteButtonSize, SizeStyle> = {
  default: {
    tile: 48,
    panel: 84,
    radiusClass: "rounded-2xl",
    panelLeftClass: "left-12",
    containerClass: "h-12 rounded-2xl",
    triggerClass: "h-12 w-12 rounded-2xl",
    svgSize: 20,
    circleClass: "h-7 w-7",
    circleSvgSize: 14,
    gapClass: "gap-2",
  },
  sm: {
    tile: 36,
    panel: 68,
    radiusClass: "rounded-xl",
    panelLeftClass: "left-9",
    containerClass: "h-9 rounded-xl",
    triggerClass: "h-9 w-9 rounded-xl",
    svgSize: 16,
    circleClass: "h-6 w-6",
    circleSvgSize: 12,
    gapClass: "gap-1.5",
  },
};

const ICON = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const panelMotion = {
  hidden: { opacity: 0, x: -6, transition: springs.snap },
  shown: {
    opacity: 1,
    x: 0,
    transition: { ...springs.modal, staggerChildren: 0.07 },
  },
};

const circleMotion = {
  hidden: { opacity: 0, scale: 0.9, transition: springs.snap },
  shown: { opacity: 1, scale: 1, transition: springs.modal },
};

function Circle({
  label,
  onClick,
  circleClass,
  focusClass,
  svgSize,
  children,
}: {
  label: string;
  onClick: () => void;
  circleClass: string;
  focusClass: string;
  svgSize: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div className="flex" variants={reduced ? undefined : circleMotion}>
      <motion.button
        type="button"
        aria-label={label}
        onClick={onClick}
        whileHover={reduced ? undefined : { scale: 1.04 }}
        whileTap={reduced ? undefined : { scale: 0.84 }}
        transition={springs.snap}
        className={cn(
          "grid place-items-center rounded-full transition-colors duration-200",
          circleClass,
          "hover:bg-zinc-200 dark:hover:bg-zinc-700 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200/50 dark:border-zinc-700/50",
          focusClass,
        )}
      >
        <svg
          {...ICON}
          width={svgSize}
          height={svgSize}
          stroke="currentColor"
          strokeWidth="3.5"
        >
          {children}
        </svg>
      </motion.button>
    </motion.div>
  );
}

type Status = "idle" | "deleted" | "kept";

export type DeleteButtonProps = Omit<
  ComponentProps<"div">,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
> & {
  variant?: DeleteButtonVariant;
  size?: DeleteButtonSize;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  disabled?: boolean;
  "aria-label"?: string;
};

export function DeleteButton({
  className,
  variant = "default",
  size = "default",
  onConfirm,
  onCancel,
  disabled,
  "aria-label": ariaLabel = "Eliminar",
  ...props
}: DeleteButtonProps) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const trigger = useRef<HTMLButtonElement>(null);
  const timing = (transition: Transition) => (reduced ? INSTANT : transition);

  const variantStyle = VARIANTS[variant] || VARIANTS.default;
  const sizeStyle = SIZES[size] || SIZES.default;

  const top = useMotionValue(WALL_TOP);
  const wall = useTransform(top, (y) => WALL_BASE - y);
  const bin = useMotionTemplate`M19 ${top}v${wall}a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V${top}`;
  const settle = useMotionValue(1);

  useEffect(() => {
    const walls = animate(
      top,
      open ? WALL_TOP_OPEN : WALL_TOP,
      reduced ? INSTANT : springs.snap,
    );
    return () => walls.stop();
  }, [open, reduced, top]);

  useEffect(() => {
    if (status === "idle") return;
    let active = true;
    let currentAnim: ReturnType<typeof animate> | null = null;

    if (status === "kept" && !reduced) {
      currentAnim = animate(settle, 0.86, springs.snap);
      currentAnim.then(() => {
        if (active) {
          currentAnim = animate(settle, 1, springs.snap);
        }
      });
    }

    const done = setTimeout(() => setStatus("idle"), HOLD[status]);
    return () => {
      active = false;
      currentAnim?.stop();
      clearTimeout(done);
    };
  }, [status, reduced, settle]);

  const resolve = async (next: Exclude<Status, "idle">) => {
    setOpen(false);
    setStatus(next);
    trigger.current?.focus();
    if (next === "deleted") {
      await onConfirm?.();
    } else {
      await onCancel?.();
    }
  };

  return (
    <motion.div
      data-slot="delete-button"
      data-state={open ? "open" : "closed"}
      data-status={status}
      data-variant={variant}
      data-size={size}
      className={cn(
        "relative inline-flex items-center",
        sizeStyle.containerClass,
        variantStyle.surface,
        variantStyle.glyph,
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
      animate={{
        width: open ? sizeStyle.tile + sizeStyle.panel : sizeStyle.tile,
      }}
      transition={timing(springs.modal)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) resolve("kept");
      }}
      {...props}
    >
      <motion.button
        ref={trigger}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => {
          if (open) return resolve("kept");
          setStatus("idle");
          setOpen(true);
        }}
        whileTap={reduced ? undefined : { scale: 0.94 }}
        transition={springs.snap}
        className={cn(
          "relative z-10 grid place-items-center",
          sizeStyle.triggerClass,
          variantStyle.focus,
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "deleted" ? (
            <motion.svg
              key="done"
              {...ICON}
              width={sizeStyle.svgSize}
              height={sizeStyle.svgSize}
              stroke="currentColor"
              className={variantStyle.accent}
              strokeWidth="2.5"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={timing(springs.default)}
            >
              <motion.path
                d="M4 12.5 9.5 18 20 7"
                initial={reduced ? undefined : { pathLength: 0 }}
                animate={reduced ? undefined : { pathLength: 1 }}
                transition={springs.snap}
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="bin"
              {...ICON}
              width={sizeStyle.svgSize}
              height={sizeStyle.svgSize}
              stroke="currentColor"
              strokeWidth="2"
              className="overflow-visible"
              style={{ scale: settle }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={timing(springs.default)}
            >
              <motion.path d={bin} />
              <motion.g
                style={{ transformBox: "view-box", transformOrigin: HINGE }}
                animate={{ rotate: open ? LID_OPEN : 0 }}
                transition={timing(springs.snap)}
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </motion.g>
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <span role="status" aria-live="polite" className="sr-only">
        {status === "deleted"
          ? "Eliminado"
          : status === "kept"
            ? "Cancelado"
            : ""}
      </span>

      {/* Capa de recorte: el panel nunca se dibuja fuera del contenedor mientras este anima su ancho */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          sizeStyle.radiusClass,
        )}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              style={{ width: sizeStyle.panel }}
              className={cn(
                "pointer-events-auto absolute inset-y-0 flex items-center justify-center rounded-2xl",
                sizeStyle.panelLeftClass,
                sizeStyle.gapClass,
                variantStyle.recess,
              )}
              variants={reduced ? undefined : panelMotion}
              initial="hidden"
              animate="shown"
              exit="hidden"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute -left-1 top-1/2 z-20 h-2.5 w-1.5 -translate-y-1/2 [clip-path:polygon(100%_0,0_50%,100%_100%)]",
                  variantStyle.recess,
                )}
              />
              <Circle
                label="Confirmar eliminación"
                onClick={() => resolve("deleted")}
                circleClass={sizeStyle.circleClass}
                focusClass={variantStyle.circleFocus}
                svgSize={sizeStyle.circleSvgSize}
              >
                <path
                  d="M4 12.5 9.5 18 20 7"
                  className={variantStyle.accent}
                  stroke="currentColor"
                />
              </Circle>
              <Circle
                label="Cancelar"
                onClick={() => resolve("kept")}
                circleClass={sizeStyle.circleClass}
                focusClass="outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                svgSize={sizeStyle.circleSvgSize}
              >
                <path
                  d="M6 6 18 18M18 6 6 18"
                  className="text-zinc-600 dark:text-zinc-400"
                />
              </Circle>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default DeleteButton;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Botón interactivo de eliminación con animación física y confirmación in-place.
 * Integra apertura de tapa con resortes y panel retráctil de opciones.
 *
 * Lógica Clave:
 * - Soporte para variantes default (púrpura) y destructive (rojo eliminación).
 * - Soporte de tamaños default (h-12) y sm (h-9) para tablas y listas compactas.
 * - El panel de confirmación se ancla por la izquierda (panelLeftClass, igual al
 *   ancho del tile) dentro de una capa con overflow-hidden. Así nunca invade la
 *   papelera mientras el contenedor anima su ancho, ni al abrir ni al cerrar.
 *   La capa de recorte es independiente del contenedor para no cortar el anillo
 *   de foco del botón principal.
 * - panelLeftClass debe coincidir con tile (left-12 = 48px, left-9 = 36px).
 * - Animaciones impulsadas por framer-motion con resortes canónicos de springs.ts.
 * - Cumplimiento de WCAG AA y reducción de movimiento con useReducedMotion.
 *
 * Dependencias Externas:
 * - framer-motion para las animaciones y resortes físicos.
 * - clsx / tailwind-merge (via cn) para composición de clases utilitarias.
 *
 */
