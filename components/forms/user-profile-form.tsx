'use client';

import { useState, useEffect } from 'react';
import { registerUserSchema, RegisterUserInput } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';
import axios from 'axios';

/**
 * Componente de formulario para actualizar perfil de usuario adoptante
 * Implementa HU-003: Actualización del perfil del usuario
 */

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  municipality: Municipality;
  address: string;
  idNumber: string;
  birthDate: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
}

export default function UserProfileForm() {
  const [formData, setFormData] = useState<Omit<RegisterUserInput, 'email' | 'password'>>({
    name: '',
    phone: '',
    municipality: Municipality.MEDELLIN,
    address: '',
    idNumber: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Cargar datos actuales del usuario al montar
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<UserProfile>('/api/users/profile');
        setFormData({
          name: response.data.name,
          phone: response.data.phone,
          municipality: response.data.municipality,
          address: response.data.address,
          idNumber: response.data.idNumber,
          birthDate: response.data.birthDate.split('T')[0], // Convertir a formato YYYY-MM-DD
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setServerError('Error al cargar el perfil. Intenta de nuevo.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || undefined }));

    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Limpiar mensaje de éxito al editar
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setServerError('');
    setSuccessMessage('');

    try {
      // 1. Crear schema de validación sin email y password
      const updateSchema = registerUserSchema.pick({
        name: true,
        phone: true,
        municipality: true,
        address: true,
        idNumber: true,
        birthDate: true,
      });

      // 2. Validar datos en el cliente con Zod
      const validatedData = updateSchema.parse(formData);

      // 3. Enviar petición al API
      const response = await axios.put<{ message: string; user: UserProfile }>(
        '/api/users/profile',
        validatedData
      );

      // 4. Mostrar mensaje de éxito
      setSuccessMessage('¡Perfil actualizado exitosamente! Los cambios se aplicarán inmediatamente.');
      setFormData(validatedData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        
        if (apiError.details) {
          // Errores de validación del backend
          setErrors(apiError.details);
        } else {
          // Error general del servidor
          setServerError(apiError.error || 'Error al guardar los cambios. Intenta de nuevo.');
        }
      } else if (error instanceof Error) {
        // Errores de Zod (validación en cliente)
        if ('errors' in error) {
          const zodError = error as any;
          const fieldErrors: Record<string, string> = {};
          zodError.errors.forEach((err: any) => {
            const field = err.path[0];
            if (typeof field === 'string') {
              fieldErrors[field] = err.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setServerError('Error inesperado. Intenta de nuevo.');
        }
      } else {
        setServerError('Error inesperado. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const municipalities = Object.values(Municipality);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Editar Perfil Personal</h2>
        <p className="text-gray-600 mt-2">
          Actualiza tu información personal. Los cambios se aplicarán inmediatamente.
        </p>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Éxito</h3>
              <p className="text-sm text-green-700 mt-1">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de error general */}
      {serverError && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{serverError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nombre Completo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre Completo *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: Juan Pérez García"
          required
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: 3001234567"
          required
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Número de Identificación */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Número de Identificación *
        </label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.idNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: 1234567890"
          required
        />
        {errors.idNumber && (
          <p className="text-red-600 text-sm mt-1">{errors.idNumber}</p>
        )}
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Fecha de Nacimiento *
        </label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.birthDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>
        )}
      </div>

      {/* Municipio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Municipio *
        </label>
        <select
          name="municipality"
          value={formData.municipality}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.municipality ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Selecciona un municipio</option>
          {municipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        {errors.municipality && (
          <p className="text-red-600 text-sm mt-1">{errors.municipality}</p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Dirección *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: Carrera 50 #10-20, Apartamento 5"
          required
        />
        {errors.address && (
          <p className="text-red-600 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Guardando cambios...' : 'Guardar Cambios'}
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
