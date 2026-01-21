'use client';

import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerUserSchema } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';

/**
 * GET /api/users/profile
 * PUT /api/users/profile
 * Descripción: Formulario para consultar y actualizar la información del perfil del usuario adoptante.
 * Requiere: Sesión de usuario válida.
 * Implementa: HU-003 (Actualización del perfil del usuario).
 */

// Schema parcial para actualización (sin email ni password)
const userProfileUpdateSchema = registerUserSchema.pick({
  name: true,
  phone: true,
  municipality: true,
  address: true,
  idNumber: true,
  birthDate: true,
});

type UserProfileUpdateInput = {
  name: string;
  phone: string;
  municipality: Municipality;
  address: string;
  idNumber: string;
  birthDate: string;
};

interface UserProfileResponse {
  id: string;
  email: string; // Se recibe pero no se edita
  name: string;
  phone: string;
  municipality: Municipality;
  address: string;
  idNumber: string;
  birthDate: string; // ISO String
}

export default function UserProfileForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileUpdateInput>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      name: '',
      phone: '',
      municipality: Municipality.MEDELLIN,
      address: '',
      idNumber: '',
      birthDate: '',
    }
  });

  // Cargar datos actuales del usuario al montar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) throw new Error("Error al cargar perfil");
        const data: UserProfileResponse = await response.json();

        reset({
          name: data.name,
          phone: data.phone,
          municipality: data.municipality,
          address: data.address,
          idNumber: data.idNumber,
          birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
        });
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar la información del perfil");
      }
    };

    fetchUserProfile();
  }, [reset]);

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: UserProfileUpdateInput) => {
    const toastId = toast.loading("Guardando cambios...");

    try {
      const response = await fetch('/api/user/profile', {
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
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Editar Perfil Personal</h2>
        <p className="text-gray-600 mt-2">
          Actualiza tu información personal. Los cambios se aplicarán inmediatamente.
        </p>
      </div>

      {/* Nombre Completo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre Completo *
        </label>
        <input
          {...register('name')}
          type="text"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: Juan Pérez García"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          {...register('phone')}
          type="tel"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: 3001234567"
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Número de Identificación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Número de Identificación *
        </label>
        <input
          {...register('idNumber')}
          type="text"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.idNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: 1234567890"
        />
        {errors.idNumber && (
          <p className="text-red-600 text-sm mt-1">{errors.idNumber.message}</p>
        )}
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fecha de Nacimiento *
        </label>
        <input
          {...register('birthDate')}
          type="date"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.birthDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm mt-1">{errors.birthDate.message}</p>
        )}
      </div>

      {/* Municipio */}
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

      {/* Dirección */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dirección *
        </label>
        <input
          {...register('address')}
          type="text"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          placeholder="Ej: Carrera 50 #10-20, Apartamento 5"
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este componente permite al usuario gestionar su identidad digital dentro de la 
 * plataforma, asegurando que los datos de contacto estén siempre vigentes.
 *
 * Lógica Clave:
 * - Pick Schema: Reutiliza el esquema de registro mediante .pick() para asegurar 
 *   que las reglas de validación sean consistentes en toda la app.
 * - Sincronización Inicial: Utiliza useEffect para poblar el formulario con los 
 *   datos actuales del usuario servidor tras el montaje.
 * - Validación de Seguridad: Verifica el estado de bloqueo de la cuenta antes de 
 *   permitir cualquier modificación persistente.
 *
 * Dependencias Externas:
 * - react-hook-form: Para la gestión reactiva de los campos del perfil.
 * - sonner: Para notificaciones de éxito persistentes tras la actualización.
 *
 */
