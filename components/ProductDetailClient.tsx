"use client";

import { useState } from "react";
import {
  MapPin,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Tag,
  DollarSign,
  Package,
  ShoppingCart,
  CreditCard,
  Map
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "./cards/product-card";
import Badge from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PaymentModal from "./products/PaymentModal";
import { useCart } from "@/lib/context/CartContext";
import { useRouter } from "next/navigation";
import { Municipality } from "@prisma/client";

/**
 * Descripción: Componente de detalle para un producto, con galería, información del vendedor y opciones de compra.
 * Requiere: Usuario autenticado y CartProvider.
 * Implementa: HU-009 (Simulación de compra de productos y generación de pedido).
 */

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  images: string[];
  vendorId: string;
  vendor: {
    id: string;
    businessName: string;
    municipality: string;
    address: string;
    description: string | null;
    businessPhone: string | null;
  };
}

interface SimilarProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  vendor: {
    id: string;
    businessName: string;
    municipality: string;
  };
}

interface CustomUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
  municipality?: Municipality;
  address?: string;
}

interface ProductDetailClientProps {
  product: Product;
  userSession: CustomUser | null;
  similarProducts: SimilarProduct[];
}

export default function ProductDetailClient({
  product,
  userSession,
  similarProducts,
}: ProductDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0] || "/images/placeholder-product.png",
      stock: product.stock,
      vendorId: product.vendor.id,
    });
    toast.success(`"${product.name}" agregado al carrito`);
  };

  const handleOpenPaymentModal = () => {
    if (!userSession) {
      toast.error("Debes iniciar sesión para comprar");
      router.push("/auth/login");
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => setIsPaymentModalOpen(false);

  const handleConfirmPayment = async () => {
    if (!userSession) return;

    setIsProcessingPayment(true);
    const toastId = toast.loading("Procesando pedido simulado...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              quantity: 1,
              price: product.price,
            }
          ],
          shippingMunicipality: userSession.municipality || Municipality.MEDELLIN,
          shippingAddress: userSession.address || "Dirección no especificada",
          paymentMethod: "SIMULATED_CARD",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al procesar el pedido");
      }

      toast.success("¡Gracias por tu compra simulada! Tu pedido ha sido registrado.", { id: toastId });
      setIsPaymentModalOpen(false);
      setTimeout(() => router.push("/user"), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo procesar el pedido";
      toast.error(message, { id: toastId });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="mb-6 overflow-hidden" accentColor="none">
          <CardContent className="p-0">
            <div className="relative h-96 bg-gray-200 overflow-hidden rounded-t-lg">
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Sin imagen disponible
                </div>
              )}

              {hasMultipleImages && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="p-4 bg-gray-50 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? "border-purple-600" : "border-gray-200"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6" accentColor="none">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">{product.name}</CardTitle>
                <Badge
                  className={cn(
                    "text-white border-0",
                    product.stock > 10 && "bg-teal-500 hover:bg-teal-600",
                    product.stock > 0 && product.stock <= 10 && "bg-amber-500 hover:bg-amber-600",
                    product.stock === 0 && "bg-red-500 hover:bg-red-600"
                  )}
                >
                  {product.stock > 10 ? "En Stock" : product.stock > 0 ? "Últimas unidades" : "Agotado"}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-6 border-b border-gray-200 mb-6">
              <div className="text-center">
                <Tag className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Categoría</p>
                <p className="font-semibold text-gray-900">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase()}
                </p>
              </div>

              <div className="text-center">
                <DollarSign className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Precio</p>
                <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
              </div>

              <div className="text-center">
                <Package className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Disponibilidad</p>
                <p className="font-semibold text-gray-900">
                  {product.stock} unidad{product.stock !== 1 ? "es" : ""}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Sobre este producto</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {product.description || "Sin descripción disponible."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="mb-6 sticky top-20" accentColor="none">
          <CardHeader>
            <div className="mb-6">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2 text-center">Vendido por</CardTitle>
              <p className="text-purple-600 font-bold text-xl block text-center">
                {product.vendor.businessName}
              </p>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{product.vendor.municipality}, ANTIOQUIA</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {product.vendor.address && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-900 mb-2 font-semibold">Ubicación</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <p className="text-sm text-gray-900">{product.vendor.address}</p>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      product.vendor.address
                    )}`}
                    target="_blank"
                    className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
                  >
                    <Map className="w-5 h-5 mr-1" />
                    Ver en Google Maps
                  </Link>
                </div>
              </div>
            )}

            {product.vendor.description && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-900 mb-2 font-semibold">Acerca del Vendedor</p>
                <p className="text-sm text-gray-700 line-clamp-3">{product.vendor.description}</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                {product.vendor.businessPhone && (
                  <a
                    href={`https://wa.me/${product.vendor.businessPhone}?text=Hola, estoy interesado en el producto ${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                )}

                {product.stock > 0 ? (
                  <Button onClick={handleAddToCart} className="flex-1 py-2 text-sm" variant="outline">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Al Carrito
                  </Button>
                ) : (
                  <div className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-500 text-center font-medium text-sm">
                    Sin Stock
                  </div>
                )}
              </div>

              <Button
                onClick={handleOpenPaymentModal}
                variant="default"
                className="w-full py-6 text-base font-bold shadow-lg"
                disabled={product.stock <= 0}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Comprar ahora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        onConfirm={handleConfirmPayment}
        isLoading={isProcessingPayment}
      />

      {similarProducts.length > 0 && (
        <div className="lg:col-span-3 mt-12 border-t pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Otros productos que podrían interesarte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProducts.slice(0, 3).map((similarProduct) => (
              <ProductCard key={similarProduct.id} product={similarProduct} accentColor="none" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente proporciona una vista detallada de un producto específico, permitiendo
 * a los usuarios ver su galería de imágenes, conocer al vendedor y añadir al carrito o contactar.
 *
 * Lógica Clave:
 * - Galería: Manejo de estado local para el índice de la imagen actual y navegación circular.
 * - Carrito: Integra el CartContext para gestionar la persistencia de productos seleccionados.
 * - Checkout Simulado: Al usar Comprar ahora, se inicia un proceso de pago simulado que se
 *   registra en el servidor mediante el endpoint /api/orders.
 * - Similitud: Muestra componentes ProductCard filtrados por criterios de similitud.
 *
 * Dependencias Externas:
 * - next/image: Para carga optimizada y prioritaria de las imágenes del producto.
 * - sonner: Para feedback interactivo (toasts).
 * - lucide-react: Para iconografía de características y redes sociales.
 *
 */
