import { SheltersMapClient } from "@/components/map/shelters-map-client";
import { PawPrint, Map as MapIcon, Heart } from "lucide-react";
import { Metadata } from "next";

/**
 * Descripción: Página principal de Albergues con mapa interactivo.
 * Implementa: ISSUE-91 (Ruta /albergues).
 */

export const metadata: Metadata = {
  title: "Albergues y Fundaciones | PawLig",
  description: "Encuentra albergues verificados en el Valle de Aburrá a través de nuestro mapa interactivo. Conecta con fundaciones y adopta con responsabilidad.",
};

export default function SheltersPage() {
  return (
    <main className="min-h-screen bg-background pb-24">
      
      {/* Banner Hero: Estética Premium PawLig */}
      <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        {/* Decoración de fondo: Huellas animadas */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-[10%] animate-bounce duration-[6000ms]">
            <PawPrint className="w-24 h-24 text-primary rotate-12" />
          </div>
          <div className="absolute bottom-10 right-[15%] animate-pulse">
            <PawPrint className="w-32 h-32 text-primary -rotate-12" />
          </div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 border border-primary/20">
            <MapIcon className="w-4 h-4" />
            <span className="uppercase tracking-widest">Módulo Educativo e Informativo</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-foreground mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            Localiza albergues <br />
            <span className="text-primary italic underline decoration-primary/20">cerca de ti</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 font-medium">
            Navega por nuestro mapa interactivo para encontrar fundaciones verificadas en el Valle de Aburrá. 
            Conoce su labor, consulta su información legal y encuentra a tu próximo compañero de vida.
          </p>
        </div>
      </section>

      {/* Contenedor Principal: Mapa y Filtros */}
      <section className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-white">
          <SheltersMapClient />
        </div>
      </section>

      {/* Sección Informativa Inferior */}
      <section className="container mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/20 p-8 rounded-3xl border border-border/50 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MapIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Ubicación Precisa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Geolocalización exacta de cada fundación para que sepas exactamente a dónde ir.
            </p>
          </div>
          
          <div className="bg-secondary/20 p-8 rounded-3xl border border-border/50 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <PawPrint className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Transparencia Total</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Consulta el NIT y la representación legal de cada entidad antes de iniciar tu proceso.
            </p>
          </div>

          <div className="bg-secondary/20 p-8 rounded-3xl border border-border/50 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Conexión Directa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accede a sus redes sociales y WhatsApp con un solo clic para una comunicación fluida.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Página principal de la funcionalidad de albergues. 
 *
 * Lógica Clave:
 * - El mapa se integra dentro de un contenedor con sombra y desenfoque para 
 *   separarlo del hero y darle profundidad.
 * - Se usan animaciones de entrada nativas de Tailwind para una carga progresiva
 *   del contenido.
 *
 * SEO:
 * - Metadatos configurados para visibilidad en buscadores.
 * - Uso correcto de H1 y estructura semántica.
 *
 */
