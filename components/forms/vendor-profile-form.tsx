'use client';

import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { vendorProfileUpdateSchema, VendorProfileUpdateInput } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';
import Image from 'next/image';

/**
 * Componente de formulario para actualizar perfil de vendedor
 * Implementa HU-003: Actualización del perfil del vendedor
 */

interface VendorProfileResponse {
  id: string;
  businessName: string;
  businessPhone?: string;
  description?: string;
  logo?: string;
  municipality: Municipality;
  address: string;
  verified: boolean;
  updatedAt: string;
}

export default function VendorProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VendorProfileUpdateInput>({
    resolver: zodResolver(vendorProfileUpdateSchema),
    defaultValues: {
      businessName: '',
      businessPhone: '',
      description: '',
      logo: '',
      municipality: Municipality.MEDELLIN,
      address: '',
    }
  });

  const logoUrl = watch('logo'); // Observar cambios en el logo para preview

  // Cargar datos actuales del vendedor al montar
  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const response = await fetch('/api/vendors/profile');
        if (!response.ok) throw new Error("Error al cargar perfil");

        const data: VendorProfileResponse = await response.json();

        reset({
          businessName: data.businessName,
          businessPhone: data.businessPhone || '',
          description: data.description || '',
          logo: data.logo || '',
          municipality: data.municipality,
          address: data.address,
        });
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
        toast.error('Error al cargar la información del negocio');
      }
    };

    fetchVendorProfile();
  }, [reset]);

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: VendorProfileUpdateInput) => {
    const toastId = toast.loading("Guardando cambios...");

    try {
      const response = await fetch('/api/vendors/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          throw new Error('Tu cuenta está bloqueada.');
        }
        throw new Error(errorData.error || 'Error al actualizar perfil');
      }

      toast.success("¡Perfil actualizado exitosamente!", {
        id: toastId,
        description: "Los cambios se aplicarán inmediatamente en tu tienda."
      });

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error inesperado", { id: toastId });
    }
  };

  const municipalities = Object.values(Municipality);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Editar Perfil de Negocio</h2>
        <p className="text-gray-600 mt-2">
          Actualiza la información de tu negocio. Los cambios se aplicarán inmediatamente.
        </p>
      </div>

      {/* Nombre del Negocio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre del Negocio *
        </label>
        <input
          {...register('businessName')}
          type="text"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: PawShop Premium"
        />
        {errors.businessName && (
          <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>
        )}
      </div>

      {/* Teléfono del Negocio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Teléfono del Negocio
        </label>
        <input
          {...register('businessPhone')}
          type="tel"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.businessPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: 3001234567"
        />
        {errors.businessPhone && (
          <p className="text-red-600 text-sm mt-1">{errors.businessPhone.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción del Negocio
        </label>
        <textarea
          {...register('description')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition h-32 resize-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Describe tu negocio, productos especiales, misión, etc. (mínimo 20 caracteres)"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          URL del Logo
        </label>
        <input
          {...register('logo')}
          type="url"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.logo ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="https://ejemplo.com/logo.png"
        />
        {errors.logo && (
          <p className="text-red-600 text-sm mt-1">{errors.logo.message}</p>
        )}
        {logoUrl && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Vista previa del logo:</p>
            <div className="relative h-16 w-16">
              {/* Usamos unimg normal o NEXT Image. Si es URL externa dinamica, Next Image requiere configuración de dominio.
                     Para seguridad, mejor usar img tag normal si no sabemos los dominios, o configurar next.config. 
                     El código original usaba Image de next/image. Asumiré que está configurado o usaré <img /> para evitar problemas de dominios no configurados si el usuario pega cualquier link.
                     Pero el original usaba Image. Seguiré con Image pero manejaré onError.
                  */}
              <Image
                src={logoUrl}
                alt="Logo preview"
                className="h-16 w-16 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Municipio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Municipio *
        </label>
        <select
          {...register('municipality')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.municipality ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        >
          <option value="">Selecciona un municipio</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {errors.municipality && (
          <p className="text-red-600 text-sm mt-1">{errors.municipality.message}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dirección Física *
        </label>
        <input
          {...register('address')}
          type="text"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: Carrera 50 #10-20, Centro"
        />
        {errors.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>

      {/* Nota de campos obligatorios */}
      <p className="text-sm text-gray-500 mt-4">
        Los campos marcados con * son obligatorios.
      </p>
    </form>
  );
}
