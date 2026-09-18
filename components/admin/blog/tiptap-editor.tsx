"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { springs } from "@/lib/motion/springs";
import { TipTapLinkModal } from "@/components/modals/tiptap-link-modal";
import type { ImageUploadItem } from "@/types/upload.types";

/**
 * Descripción: Editor de texto enriquecido TipTap para el formulario de blog.
 * Implementa: Subida de imágenes a Cloudinary vía props, modal propio para
 *   insertar URLs (reemplaza window.prompt), y HUD flotante de caracteres al foco.
 */

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** Item de imagen en proceso de subida al editor (estado granular de Cloudinary). */
  imageItem?: ImageUploadItem | null;
  /** Handler para procesar la selección de un archivo de imagen. */
  onImageFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TipTapEditor = React.memo(function TipTapEditor({
  value,
  onChange,
  imageItem,
  onImageFileSelect,
}: TipTapEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [currentLinkUrl, setCurrentLinkUrl] = useState("");
  const shouldReduceMotion = useReducedMotion();
  const hudTransition = shouldReduceMotion ? { duration: 0 } : springs.snap;
  // Ref para evitar doble inserción si el item pasa a success más de una vez
  const lastInsertedUrl = React.useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      const currentHTML = editor.getHTML();
      if (currentHTML !== value) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  // Cuando el padre completa la subida a Cloudinary, insertar la imagen
  useEffect(() => {
    if (
      editor &&
      imageItem?.status === "success" &&
      imageItem.cloudinaryUrl &&
      imageItem.cloudinaryUrl !== lastInsertedUrl.current
    ) {
      lastInsertedUrl.current = imageItem.cloudinaryUrl;
      editor.chain().focus().setImage({ src: imageItem.cloudinaryUrl }).run();
    }
  }, [editor, imageItem]);

  const isUploading =
    imageItem?.status === "uploading" || imageItem?.status === "pending";

  /**
   * Abre el modal de enlace, prellenando la URL si hay un enlace activo
   * en la posición actual del cursor.
   */
  const openLinkModal = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href ?? "";
    setCurrentLinkUrl(previousUrl);
    setLinkModalOpen(true);
  };

  const handleLinkConfirm = (url: string) => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleLinkRemove = () => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  if (!editor) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl min-h-[300px] flex items-center justify-center text-zinc-400">
        Cargando editor...
      </div>
    );
  }

  const charCount = editor.getText().length;

  return (
    <>
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl min-h-[300px] flex flex-col bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-zinc-200 dark:border-zinc-700 p-2 flex gap-1 flex-wrap bg-zinc-50 dark:bg-zinc-800/50">
          {/* Negrita */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
              editor.isActive("bold")
                ? "bg-zinc-200 dark:bg-zinc-700"
                : ""
            }`}
            title="Negrita"
          >
            <Bold size={16} />
          </motion.button>

          {/* Cursiva */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
              editor.isActive("italic")
                ? "bg-zinc-200 dark:bg-zinc-700"
                : ""
            }`}
            title="Cursiva"
          >
            <Italic size={16} />
          </motion.button>

          {/* Lista con viñetas */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
              editor.isActive("bulletList")
                ? "bg-zinc-200 dark:bg-zinc-700"
                : ""
            }`}
            title="Lista con viñetas"
          >
            <List size={16} />
          </motion.button>

          {/* Lista numerada */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
              editor.isActive("orderedList")
                ? "bg-zinc-200 dark:bg-zinc-700"
                : ""
            }`}
            title="Lista numerada"
          >
            <ListOrdered size={16} />
          </motion.button>

          {/* Separador */}
          <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1 self-center" />

          {/* Insertar enlace — abre modal propio */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            onClick={openLinkModal}
            className={`p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${
              editor.isActive("link")
                ? "bg-zinc-200 dark:bg-zinc-700"
                : ""
            }`}
            title="Insertar enlace"
          >
            <LinkIcon size={16} />
          </motion.button>

          {/* Subir imagen a Cloudinary */}
          <motion.label
            htmlFor="tiptap-image-upload"
            whileHover={{ scale: isUploading ? 1 : 1.05 }}
            whileTap={{ scale: isUploading ? 1 : 0.95 }}
            transition={springs.snap}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isUploading
                ? "opacity-50 cursor-not-allowed pointer-events-none"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
            title="Subir imagen"
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin text-purple-600" />
            ) : (
              <ImageIcon size={16} />
            )}
          </motion.label>
          <input
            id="tiptap-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onImageFileSelect}
            disabled={isUploading}
            className="hidden"
          />
        </div>

        {/* Área de contenido del editor con HUD flotante */}
        <div className="relative flex-grow">
          <EditorContent
            editor={editor}
            className="p-4 prose prose-sm dark:prose-invert max-w-none flex-grow focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:ring-0 min-h-[250px]"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* HUD flotante — contador inmersivo */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                key="editor-hud"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={hudTransition}
                className="absolute bottom-2 right-3 z-10 px-2 py-1 pointer-events-none"
              >
                <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 tabular-nums">
                  {charCount} {charCount === 1 ? "carácter" : "caracteres"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de URL — renderizado fuera del árbol del formulario via Portal */}
      <TipTapLinkModal
        isOpen={linkModalOpen}
        initialUrl={currentLinkUrl}
        onConfirm={handleLinkConfirm}
        onRemove={handleLinkRemove}
        onClose={() => setLinkModalOpen(false)}
      />
    </>
  );
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * El editor delega la lógica de subida de imágenes al blog-form padre mediante
 * las props onImageFileSelect e imageItem. Esto mantiene el estado granular
 * de Cloudinary en un único lugar (blog-form), siguiendo el mismo patrón
 * que pet-form y product-form. El modal de URL usa createPortal para evitar
 * problemas de z-index con el formulario padre.
 */
