"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion/springs";
import { DeleteButton } from "@/components/ui/delete-button";

/**
 * Descripción: Modal propio para insertar o editar un enlace en el editor TipTap.
 * Reemplaza el window.prompt() nativo — completamente prohibido en PawLig.
 * Implementa: Estética Surface 2 Glassmorphic + físicas Apple Design.
 */

interface TipTapLinkModalProps {
  /** Controla la visibilidad del modal. */
  isOpen: boolean;
  /** URL preexistente cuando se edita un enlace ya insertado. */
  initialUrl?: string;
  /** Callback al confirmar. Recibe la URL validada. */
  onConfirm: (url: string) => void;
  /** Callback para quitar/desvincular el enlace actual (solo si hay initialUrl). */
  onRemove: () => void;
  /** Callback para cerrar sin cambios. */
  onClose: () => void;
}

export function TipTapLinkModal({
  isOpen,
  initialUrl = "",
  onConfirm,
  onRemove,
  onClose,
}: TipTapLinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : springs.modal;
  const snapTransition = shouldReduceMotion ? { duration: 0 } : springs.snap;

  // Necesario para evitar errores de hidratación con createPortal en SSR
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Sincronizar la URL cuando se abre el modal con una URL inicial (edición)
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setError(null);
    }
  }, [isOpen, initialUrl]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("El enlace no puede estar vacío.");
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      setError("El enlace debe comenzar con http:// o https://");
      return;
    }
    setError(null);
    onConfirm(trimmed);
    onClose();
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  if (!isMounted) return null;

  const isEditing = Boolean(initialUrl);

  return createPortal(
    <div data-portal-wrapper>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay oscuro */}
            <motion.div
              key="tiptap-link-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={snapTransition}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Contenedor centrado */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              {/* Card Surface 2 Glassmorphic */}
              <motion.div
                key="tiptap-link-modal"
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={transition}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-[2rem] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] w-full max-w-md overflow-hidden relative pointer-events-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="tiptap-link-modal-title"
              >
                {/* Luz ambiental — obligatoria en toda Surface 2 */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

                {/* Header */}
                <div className="flex justify-between items-center px-7 pt-7 pb-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/30">
                      <LinkIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
                    </div>
                    <h2
                      id="tiptap-link-modal-title"
                      className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                    >
                      {isEditing ? "Editar enlace" : "Insertar enlace"}
                    </h2>
                  </div>
                  <motion.button
                    onClick={onClose}
                    whileTap={{ scale: 0.93 }}
                    transition={snapTransition}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                    aria-label="Cerrar modal"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Body */}
                <div className="px-7 pt-5 pb-7 space-y-4">
                  <div>
                    <label
                      htmlFor="tiptap-link-url"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1.5"
                    >
                      URL del enlace
                    </label>
                    <input
                      id="tiptap-link-url"
                      type="url"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleConfirm();
                        }
                      }}
                      placeholder="https://ejemplo.com"
                      autoFocus
                      className={`h-10 w-full rounded-xl border bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 transition-colors ${
                        error
                          ? "border-red-400 dark:border-red-500 focus-visible:ring-red-500"
                          : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    />
                    {error && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-1">
                    {/* DeleteButton para quitar enlace existente */}
                    <div>
                      {isEditing && (
                        <DeleteButton
                          size="sm"
                          variant="destructive"
                          aria-label="Quitar enlace"
                          onConfirm={handleRemove}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.button
                        type="button"
                        onClick={onClose}
                        whileTap={{ scale: 0.97 }}
                        transition={snapTransition}
                        className="px-4 h-10 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                      >
                        Cancelar
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleConfirm}
                        whileTap={{ scale: 0.97 }}
                        transition={snapTransition}
                        className="bg-purple-600 text-white px-4 h-10 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                      >
                        {isEditing ? "Actualizar" : "Insertar"}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Este modal reemplaza el window.prompt() del editor TipTap. Usa createPortal
 * para renderizar fuera del árbol del formulario, evitando problemas de z-index
 * y stacking context. El DeleteButton se usa para la acción de quitar enlace,
 * respetando el estándar de DESIGN.md §7.1.
 */
