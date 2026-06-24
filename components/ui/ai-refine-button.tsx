"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AiRefineButtonProps {
  currentText: string;
  onRefined: (text: string) => void;
  type?: "pet" | "product" | "moderation";
  disabled?: boolean;
  className?: string;
  minLength?: number;
}

export function AiRefineButton({
  currentText,
  onRefined,
  type = "pet",
  disabled = false,
  className = "absolute bottom-2 right-2 h-8 text-primary hover:brightness-75 transition-all",
  minLength = 10,
}: AiRefineButtonProps) {
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!currentText || currentText.trim().length < minLength) {
      toast.error(`Ingresa al menos ${minLength} caracteres para refinar con IA.`);
      return;
    }

    setIsRefining(true);
    try {
      const response = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: currentText, type }),
      });

      if (!response.ok) {
        throw new Error("Error al contactar con la IA");
      }

      const { refinedText } = await response.json();
      onRefined(refinedText);
      toast.success("Texto refinado con éxito");
    } catch (error) {
      console.error("Error refining description:", error);
      toast.error("No se pudo refinar el texto. Intenta nuevamente.");
    } finally {
      setIsRefining(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleRefine}
      disabled={disabled || isRefining}
      className={className}
    >
      {isRefining ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      <span className="text-xs">{isRefining ? "Refinando..." : "Refinar con IA"}</span>
    </Button>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Componente reutilizable para encapsular la lógica de refinamiento de texto con IA.
 * Permite integrarse en cualquier formulario o modal.
 *
 * Lógica Clave:
 * - Valida la longitud mínima del texto antes de enviar.
 * - Gestiona su propio estado de carga ('isRefining').
 * - Soporta los tipos: pet, product y moderation.
 *
 * Dependencias Externas:
 * - @/components/ui/button: Para la UI del botón.
 * - lucide-react: Para los iconos.
 * - sonner: Para las notificaciones de éxito/error.
 *
 */
