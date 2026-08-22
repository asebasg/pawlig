'use client';

import { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { shelterProfileUpdateSchema, ShelterProfileUpdateInput } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';
import { AddressInput } from '@/components/ui/address-input';

interface ShelterProfileResponse {
  id: string;
  name: string;
  description?: string;
  municipality: Municipality;
  address: string;
  contactWhatsApp?: string;
  contactInstagram?: string;
  verified: boolean;
  updatedAt: string;
}

export default function ShelterProfileForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ShelterProfileUpdateInput>({
    resolver: zodResolver(shelterProfileUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      municipality: Municipality.MEDELLIN,
      address: '',
      contactWhatsApp: '',
      contactInstagram: '',
    }
  });

  useEffect(() => {
    const fetchShelterProfile = async () => {
      try {
        const response = await fetch('/api/shelter/profile');
        if (!response.ok) throw new Error("Error al cargar perfil del albergue");

        const data: ShelterProfileResponse = await response.json();

        reset({
          name: data.name,
          description: data.description || '',
          municipality: data.municipality,
          address: data.address,
          contactWhatsApp: data.contactWhatsApp || '',
          contactInstagram: data.contactInstagram || '',
        });
      } catch (error) {
        console.error('Error fetching shelter profile:', error);
        toast.error('Error al cargar la información del albergue');
      }
    };

    fetchShelterProfile();
  }, [reset]);

  const onSubmit = async (data: ShelterProfileUpdateInput) => {
    const toastId = toast.loading("Guardando cambios...");

    try {
      const response = await fetch('/api/shelter/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          throw new Error('Tu cuenta está bloqueada.');
        }
        throw new Error(errorData.error || 'Error al actualizar perfil del albergue');
      }

      toast.success("¡Perfil del albergue actualizado exitosamente!", {
        id: toastId,
        description: "Los cambios se aplicarán inmediatamente."
      });

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error inesperado", { id: toastId });
    }
  };

  const municipalities = Object.values(Municipality);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Editar Perfil del Albergue</h2>
        <p className="text-gray-600 mt-2">
          Actualiza la información pública de tu albergue.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre del Albergue *
        </label>
        <input
          {...register('name')}
          type="text"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: Refugio Patitas"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción del Albergue
        </label>
        <textarea
          {...register('description')}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Describe tu labor, misión, instalaciones, etc."
          rows={4}
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          WhatsApp de Contacto
        </label>
        <input
          {...register('contactWhatsApp')}
          type="tel"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.contactWhatsApp ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: +573001234567"
        />
        {errors.contactWhatsApp && (
          <p className="text-red-600 text-sm mt-1">{errors.contactWhatsApp.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Instagram del Albergue
        </label>
        <input
          {...register('contactInstagram')}
          type="text"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.contactInstagram ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: @refugiopatitas"
        />
        {errors.contactInstagram && (
          <p className="text-red-600 text-sm mt-1">{errors.contactInstagram.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Municipio *
        </label>
        <select
          {...register('municipality')}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.municipality ? 'border-red-500 bg-red-50' : 'border-gray-300'
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dirección Física *
        </label>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <AddressInput
              value={field.value}
              onChange={field.onChange}
              error={!!errors.address}
            />
          )}
        />
        {errors.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
        </button>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Los campos marcados con * son obligatorios.
      </p>
    </form>
  );
}
