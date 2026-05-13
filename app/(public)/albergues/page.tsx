import { SheltersMapClient } from "@/components/map/shelters-map-client";
import { Metadata } from "next";

/**
 * Descripción: Página principal de Albergues con mapa interactivo.
 * Implementa: ISSUE-91 (Ruta /albergues).
 */

export const metadata: Metadata = {
  title: "Albergues y Fundaciones",
  description: "Encuentra albergues verificados en el Valle de Aburrá a través de nuestro mapa interactivo.",
};

export default function SheltersPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Encuentra albergues cerca de ti
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Localiza fundaciones verificadas en el Valle de Aburrá. Conoce su labor y encuentra a tu próximo mejor amigo.
        </p>
      </div>

      <SheltersMapClient />
    </main>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Página principal de la funcionalidad de albergues adaptada al estándar visual.
 *
 */

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
