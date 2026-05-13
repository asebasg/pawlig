"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, User, FileText, AlignLeft } from "lucide-react";

/**
 * Descripción: Modal que muestra la información legal verificada de un albergue.
 * Requiere: ID del albergue para realizar el fetch.
 * Implementa: ISSUE-91 (Información legal).
 */

interface LegalInfoModalProps {
  shelterId: string | null;
  onClose: () => void;
}

export function LegalInfoModal({ shelterId, onClose }: LegalInfoModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    nit: string;
    representative: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (shelterId) {
      setLoading(true);
      fetch(`/api/shelters/${shelterId}`)
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [shelterId]);

  return (
    <Dialog open={!!shelterId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Información Legal
          </DialogTitle>
          <DialogDescription>
            Datos oficiales verificados por el equipo de PawLig.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">Cargando datos...</p>
          </div>
        ) : data ? (
          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> NIT / Identificación
              </label>
              <div className="text-sm font-semibold bg-muted/50 p-3 rounded-xl border border-border/50">
                {data.nit}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Representante Legal
              </label>
              <div className="text-sm font-semibold bg-muted/50 p-3 rounded-xl border border-border/50">
                {data.representative}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5" /> Sobre el Albergue
              </label>
              <div className="text-sm text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/10">
                {data.description || "Este albergue aún no ha proporcionado una descripción detallada."}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-destructive font-medium">No se pudo cargar la información.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Modal de transparencia. Se comunica con el endpoint público de detalles.
 *
 * Lógica Clave:
 * - Efecto de limpieza: El estado 'data' se resetea a null cuando el shelterId es nulo.
 * - Estilos: Uso de bordes redondeados amplios (xl) y fondos sutiles (muted/50)
 *   para mantener la estética premium de PawLig.
 *
 */
