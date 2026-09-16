"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion/springs";

/**
 * Componente: ScrollProgress
 * Descripción: Indicador interactivo de progreso de lectura y navegación por secciones.
 *   En reposo se muestra como una píldora flotante con indicador circular de avance y
 *   nombre de la sección actual. Al interactuar, se expande a un menú Surface 2 para
 *   desplazamiento suave entre encabezados.
 * Requiere: framer-motion, springs canónicos, Tailwind CSS.
 * Implementa: Componente RareUI adoptado según DESIGN.md §7.2 con estándar Apple / Glassmorphism.
 */

export interface ScrollProgressSection {
  id: string;
  label: string;
}

const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const LABEL_CROSSFADE = { duration: 0.22, ease: EASE_OUT } as const;
const LAYER_FADE = { duration: 0.22, ease: EASE_IN_OUT } as const;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

interface Size {
  width: number;
  height: number;
}

export interface ScrollProgressProps extends React.ComponentProps<"div"> {
  sections?: ScrollProgressSection[];
  containerRef?: React.RefObject<HTMLElement | null>;
  offset?: number;
}

export function ScrollProgress({
  className,
  sections = [],
  containerRef,
  offset = 120,
  ...props
}: ScrollProgressProps) {
  const layoutId = React.useId();
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll(
    containerRef ? { container: containerRef } : undefined
  );
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const [activeId, setActiveId] = React.useState(sections[0]?.id);
  const [open, setOpen] = React.useState(false);

  const scrollLock = React.useRef(false);
  const scrollLockTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    const scroller = containerRef?.current ?? window;

    const update = () => {
      if (scrollLock.current) return;
      const scrollY = containerRef?.current
        ? containerRef.current.scrollTop
        : typeof window !== "undefined"
        ? window.scrollY
        : 0;

      if (scrollY <= 10) {
        setActiveId(sections[0]?.id);
        return;
      }

      const anchor =
        (containerRef?.current?.getBoundingClientRect().top ?? 0) + offset;
      const active = sections.findLast(({ id }) => {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        return top !== undefined && top <= anchor;
      });
      setActiveId(active?.id ?? sections[0]?.id);
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections, containerRef, offset]);

  const label = sections.find((s) => s.id === activeId)?.label;

  const labelVersion = React.useRef(0);
  const prevLabel = React.useRef(label);
  if (label !== prevLabel.current) {
    prevLabel.current = label;
    labelVersion.current += 1;
  }

  const collapsedRef = React.useRef<HTMLDivElement>(null);
  const openRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  const [collapsedSize, setCollapsedSize] = React.useState<Size>();
  const [openSize, setOpenSize] = React.useState<Size>();
  const [labelWidth, setLabelWidth] = React.useState<number>();

  useIsoLayoutEffect(() => {
    const measure = () => {
      if (labelRef.current) setLabelWidth(labelRef.current.offsetWidth);
      if (collapsedRef.current) {
        setCollapsedSize({
          width: collapsedRef.current.offsetWidth,
          height: collapsedRef.current.offsetHeight,
        });
      }
      if (openRef.current) {
        setOpenSize({
          width: openRef.current.offsetWidth,
          height: openRef.current.offsetHeight,
        });
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (labelRef.current) ro.observe(labelRef.current);
    if (collapsedRef.current) ro.observe(collapsedRef.current);
    if (openRef.current) ro.observe(openRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [sections]);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => () => clearTimeout(scrollLockTimer.current), []);

  const selectSection = (id: string) => {
    scrollLock.current = true;
    clearTimeout(scrollLockTimer.current);
    scrollLockTimer.current = setTimeout(
      () => {
        scrollLock.current = false;
      },
      reduceMotion ? 0 : 700
    );

    setActiveId(id);
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const size = open ? openSize : collapsedSize;
  const radius = open ? 20 : (collapsedSize?.height ?? 36) / 2;

  // Si no hay secciones disponibles, no renderizar
  if (sections.length === 0) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      role="navigation"
      aria-label="Progreso de lectura y secciones"
      data-slot="scroll-progress"
      className={cn("fixed bottom-6 left-1/2 z-40 -translate-x-1/2", className)}
      {...props}
    >
      {/* Medición invisible de tamaños previos */}
      <div className="pointer-events-none invisible absolute" aria-hidden>
        <div
          ref={collapsedRef}
          className="inline-flex items-center gap-2.5 py-1.5 pl-2.5 pr-4"
        >
          <span className="h-5 w-5" />
          <span
            ref={labelRef}
            className="whitespace-nowrap text-sm font-medium leading-none"
          >
            {label}
          </span>
        </div>
        <div ref={openRef} className="w-max p-2">
          <div className="px-3 py-1.5 mb-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Secciones del artículo
          </div>
          {sections.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium leading-none"
            >
              <span className="h-2 w-2" />
              <span className="whitespace-nowrap">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {size && (
        <motion.div
          data-slot="scroll-progress-surface"
          className={cn(
            "relative overflow-hidden",
            "bg-white/85 dark:bg-zinc-900/85 backdrop-blur-2xl",
            "border border-white/60 dark:border-white/10",
            "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)]"
          )}
          initial={false}
          animate={{
            width: size.width,
            height: size.height,
            borderRadius: radius,
          }}
          transition={reduceMotion ? { duration: 0 } : springs.modal}
        >
          {/* Luz ambiental canónica en Surface 2 (DESIGN.md §1.193) */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent pointer-events-none" />

          <AnimatePresence initial={false} mode="popLayout">
            {open ? (
              <motion.div
                key="list"
                className="absolute inset-0 flex flex-col p-2"
                initial={{
                  opacity: 0,
                  filter: reduceMotion ? undefined : "blur(4px)",
                }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  filter: reduceMotion ? undefined : "blur(4px)",
                }}
                transition={LAYER_FADE}
              >
                <div className="px-3 py-1.5 mb-1 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider select-none">
                  Secciones del artículo
                </div>
                <ul className="flex flex-col gap-0.5">
                  {sections.map((s, i) => {
                    const isActive = s.id === activeId;
                    return (
                      <li key={s.id}>
                        <motion.button
                          type="button"
                          onClick={() => selectSection(s.id)}
                          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          transition={springs.snap}
                          className={cn(
                            "relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium leading-none transition-colors",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
                            isActive
                              ? "text-purple-950 dark:text-purple-100"
                              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId={`${layoutId}-active`}
                              className="absolute inset-0 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40"
                              transition={
                                reduceMotion ? { duration: 0 } : springs.layout
                              }
                            />
                          )}
                          <motion.span
                            className={cn(
                              "relative h-1.5 w-1.5 shrink-0 rounded-full",
                              isActive
                                ? "bg-purple-600 dark:bg-purple-400"
                                : "bg-zinc-400/50 dark:bg-zinc-600/50"
                            )}
                            initial={
                              reduceMotion
                                ? undefined
                                : { opacity: 0, y: 4, filter: "blur(3px)" }
                            }
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                              duration: 0.25,
                              ease: EASE_IN_OUT,
                              delay: reduceMotion ? 0 : 0.03 + i * 0.02,
                            }}
                          />
                          <motion.span
                            className="relative whitespace-nowrap"
                            initial={
                              reduceMotion
                                ? undefined
                                : { opacity: 0, y: 4, filter: "blur(3px)" }
                            }
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                              duration: 0.25,
                              ease: EASE_IN_OUT,
                              delay: reduceMotion ? 0 : 0.03 + i * 0.02,
                            }}
                          >
                            {s.label}
                          </motion.span>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : (
              <motion.button
                key="pill"
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Sección actual: ${label || "Inicio"}. Click para ver todas las secciones`}
                aria-expanded={false}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                className={cn(
                  "absolute inset-0 flex items-center gap-2.5 py-1.5 pl-2.5 pr-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 rounded-full"
                )}
                initial={{
                  opacity: 0,
                  filter: reduceMotion ? undefined : "blur(4px)",
                }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{
                  opacity: 0,
                  filter: reduceMotion ? undefined : "blur(4px)",
                }}
                transition={LAYER_FADE}
              >
                <span className="shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 -rotate-90"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="2.5"
                      className="stroke-purple-100/80 dark:stroke-purple-950/40"
                    />
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="stroke-purple-600 dark:stroke-purple-400"
                      style={{ pathLength: progress }}
                    />
                  </svg>
                </span>

                <span
                  className="relative h-5 shrink-0 overflow-hidden"
                  style={{ width: labelWidth }}
                >
                  <AnimatePresence initial={false}>
                    {label && (
                      <motion.span
                        key={labelVersion.current}
                        data-slot="scroll-progress-label"
                        className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100"
                        initial={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, filter: "blur(1.5px)" }
                        }
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, filter: "blur(1.5px)" }
                        }
                        transition={LABEL_CROSSFADE}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default ScrollProgress;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente interactivo de indicador de scroll y tabla de contenidos flotante.
 * Realiza un seguimiento fluido de la posición de lectura del usuario y permite
 * desplegar un menú de navegación contextual.
 *
 * Lógica Clave:
 * - Detección continua de sección activa mediante intersección geométrica y offset.
 * - Animación física del medidor circular con useSpring y pathLength.
 * - Morphing de dimensiones y radio de curvatura usando el resorte canónico springs.modal.
 * - Indicador de ítem activo animado con layoutId mediante springs.layout.
 * - Soporte de WCAG AA y reducción de movimiento con useReducedMotion().
 * - Soporte de cierre mediante Escape y click fuera del componente.
 *
 * Dependencias Externas:
 * - framer-motion para resortes físicos e interpolación de progreso.
 * - clsx / tailwind-merge (vía cn) para composición de clases.
 * - springs desde @/lib/motion/springs.
 *
 */
