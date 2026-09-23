"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { DeleteButton } from "@/components/ui/delete-button";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

/**
 * Componente: TipTapImageNode
 * Descripción: Vista personalizada de nodo para imágenes dentro del editor TipTap.
 *   Integra el componente DeleteButton interactivo en la esquina superior derecha,
 *   soporte para arrastrar y soltar (Drag & Drop) y protección visual.
 * Requiere: Prop deleteNode de TipTap, storage.image.onDeleteImage en el editor.
 * Implementa: DESIGN.md §1 (Surface Glassmorphic), §7.1 (DeleteButton in-place).
 */

export interface CustomImageStorage {
  onDeleteImage?: ((src: string) => void) | null;
}

export function TipTapImageNode({
  node,
  deleteNode,
  selected,
  editor,
}: NodeViewProps) {
  const src = (node.attrs.src as string) || "";
  const alt = (node.attrs.alt as string) || "Imagen del artículo";
  const title = node.attrs.title as string | undefined;

  const handleDelete = useCallback(async () => {
    deleteNode();
    const imageStorage = (
      editor?.storage as { image?: CustomImageStorage } | undefined
    )?.image;
    if (typeof imageStorage?.onDeleteImage === "function") {
      imageStorage.onDeleteImage(src);
    }
  }, [deleteNode, editor, src]);

  return (
    <NodeViewWrapper
      className={cn(
        "relative my-6 block max-w-full rounded-2xl overflow-hidden border transition-[box-shadow,border-color] duration-200 group bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md",
        selected
          ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-zinc-950 shadow-md"
          : "border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700",
      )}
      data-drag-handle
    >
      {/* Botón interactivo de arrastre visual en la esquina superior izquierda */}
      <div
        className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/60 dark:bg-black/70 backdrop-blur-md text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none shadow-sm"
        aria-hidden="true"
      >
        <GripVertical className="w-3.5 h-3.5" />
        <span>Arrastrar</span>
      </div>

      {/* Botón interactivo DeleteButton en la esquina superior derecha */}
      <div className="absolute top-3 right-3 z-20" contentEditable={false}>
        <DeleteButton
          size="sm"
          variant="destructive"
          aria-label="Eliminar imagen del post"
          onConfirm={handleDelete}
        />
      </div>

      {src ? (
        <Image
          src={src}
          alt={alt}
          title={title}
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          className="w-full max-h-[540px] h-auto object-cover rounded-2xl block select-none pointer-events-none"
          draggable={false}
        />
      ) : null}
    </NodeViewWrapper>
  );
}

export default TipTapImageNode;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Nodo de imagen enriquecido para TipTap que sustituye la etiqueta básica <img>
 * por un contenedor interactivo con DeleteButton in-place y feedback de Drag & Drop.
 *
 * Lógica Clave:
 * - contentEditable={false} en el contenedor de DeleteButton para que ProseMirror
 *   no capture eventos de clic o foco destinados a la animación de confirmación.
 * - data-drag-handle en el NodeViewWrapper para habilitar reubicación fluida por arrastre.
 * - Invocación síncrona/asíncrona a editor.storage.image.onDeleteImage para mantener
 *   sincronizada la galería de archivos subidos y la limpieza en Cloudinary.
 *
 * Dependencias Externas:
 * - DeleteButton desde @/components/ui/delete-button.
 * - NodeViewWrapper desde @tiptap/react.
 */
