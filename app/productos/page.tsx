import { Metadata } from 'next';
import ProductGalleryClient from "@/components/ProductGalleryClient";

export const metadata: Metadata = {
  title: 'Productos - PawLig',
  description: 'Encuentra productos para tu mascota. ¡Nuestra tienda está siempre disponible para ti!',
};

export default function ProductosPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Encuentra productos para tu mascota
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas para ver feliz a tu mejor amigo. Porque sabemos que son parte de tu familia, cuidamos su bienestar tanto como tú.
            </p>
          </div>

          {/* Layout principal: Filtros + Galería */}
          <ProductGalleryClient />
        </div>
      </div>
    </main>

  );
}
