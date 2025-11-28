'use client';

import { useState, useEffect } from 'react';
import { vendorProfileUpdateSchema, VendorProfileUpdateInput } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';
import axios from 'axios';

/**
 * Componente de formulario para actualizar perfil de vendedor
 * Implementa HU-003: Actualización del perfil del vendedor
 */

interface VendorProfile {
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

interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
}

export default function VendorProfileForm() {
  const [formData, setFormData] = useState<VendorProfileUpdateInput>({
    businessName: '',
    businessPhone: undefined,
    description: undefined,
    logo: undefined,
    municipality: Municipality.MEDELLIN,
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [serverError, setServerError] = useState('');

  // Cargar datos actuales del vendedor al montar
  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const response = await axios.get<VendorProfile>('/api/vendors/profile');
        setFormData({
          businessName: response.data.businessName,
          businessPhone: response.data.businessPhone,
          description: response.data.description,
          logo: response.data.logo,
          municipality: response.data.municipality,
          address: response.data.address,
        });
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          setServerError('Tu cuenta está bloqueada. Contacta al administrador.');
        } else {
          setServerError('Error al cargar el perfil. Intenta de nuevo.');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchVendorProfile();
  }, []);

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      // 1. Validar datos en el cliente con Zod
      const validatedData = vendorProfileUpdateSchema.parse(formData);

      // 2. Enviar petición al API
      const response = await axios.put<{ message: string; vendor: VendorProfile }>(
        '/api/vendors/profile',
        validatedData
      );

      // 3. Mostrar mensaje de éxito
      setSuccessMessage('¡Perfil actualizado exitosamente! Los cambios se aplicarán inmediatamente en tu tienda.');
      setFormData(validatedData);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const apiError = error.response.data as ApiErrorResponse;
        
        // Cuenta bloqueada
        if (error.response.status === 403) {
          setServerError('Tu cuenta está bloqueada. No puedes actualizar tu perfil. Contacta al administrador.');
        } else if (apiError.details) {
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
        <h2 className="text-3xl font-bold text-gray-900">Editar Perfil de Negocio</h2>
        <p className="text-gray-600 mt-2">
          Actualiza la información de tu negocio. Los cambios se aplicarán inmediatamente.
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

      {/* Nombre del Negocio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre del Negocio *
        </label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: PawShop Premium"
          required
        />
        {errors.businessName && (
          <p className="text-red-600 text-sm mt-1">{errors.businessName}</p>
        )}
      </div>

      {/* Teléfono del Negocio */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Teléfono del Negocio
        </label>
        <input
          type="tel"
          name="businessPhone"
          value={formData.businessPhone || ''}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.businessPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: 3001234567"
        />
        {errors.businessPhone && (
          <p className="text-red-600 text-sm mt-1">{errors.businessPhone}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Descripción del Negocio
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition h-32 resize-none ${
            errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Describe tu negocio, productos especiales, misión, etc. (mínimo 20 caracteres)"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">
          {formData.description ? formData.description.length : 0}/1000 caracteres
        </p>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          URL del Logo
        </label>
        <input
          type="url"
          name="logo"
          value={formData.logo || ''}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.logo ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="https://ejemplo.com/logo.png"
        />
        {errors.logo && (
          <p className="text-red-600 text-sm mt-1">{errors.logo}</p>
        )}
        {formData.logo && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Vista previa del logo:</p>
            <img
              src={formData.logo}
              alt="Logo preview"
              className="h-16 w-16 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
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
          Dirección Física *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition ${
            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ej: Carrera 50 #10-20, Centro"
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
