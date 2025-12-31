'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { registerUserSchema, RegisterUserInput } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';
import Link from 'next/link';
import { PawPrint } from 'lucide-react';

/**
 * Componente de formulario de registro para nuevos adoptantes
 * Implementa HU-001 con validación en cliente y manejo de errores mejorado
 */

//  Interfaz para respuestas de error estructuradas
interface ApiErrorResponse {
  error: string;
  code?: string;
  suggestion?: string;
  recoveryUrl?: string;
  details?: Array<{ field: string; message: string }>;
}

export default function RegisterForm() {
  const router = useRouter();

  // Estados del formulario
  const [formData, setFormData] = useState<RegisterUserInput>({
    email: '',
    password: '',
    name: '',
    phone: '',
    municipality: Municipality.MEDELLIN,
    address: '',
    idNumber: '',
    birthDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  //  Estado para manejar sugerencia de recuperación
  const [showRecoverySuggestion, setShowRecoverySuggestion] = useState(false);
  const [recoveryUrl, setRecoveryUrl] = useState<string>('');

  /**
   * Maneja cambios en los inputs del formulario
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    //  Limpiar sugerencia de recuperación al editar email
    if (name === 'email' && showRecoverySuggestion) {
      setShowRecoverySuggestion(false);
      setServerError('');
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError('');
    setErrors({});
    setShowRecoverySuggestion(false); // Reset sugerencia

    try {
      // 1. Validar datos en el cliente con Zod
      const validatedData = registerUserSchema.parse(formData);

      // 2. Enviar petición al API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      //  Parsear respuesta como ApiErrorResponse
      const data: ApiErrorResponse = await response.json();

      if (!response.ok) {
        //  Manejo específico de email duplicado
        if (data.code === 'EMAIL_ALREADY_EXISTS') {
          setServerError(data.error);
          setShowRecoverySuggestion(true);
          setRecoveryUrl(data.recoveryUrl || '/forgot-password');
          return;
        }

        // Manejar errores de validación campo por campo
        if (data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          // Error general
          setServerError(data.error || 'Error al registrar usuario');
        }
        return;
      }

      // 3. Registro exitoso: iniciar sesión automáticamente
      const signInResult = await signIn('credentials', {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setServerError('Usuario creado, pero error al iniciar sesión');
        return;
      }

      // 4. Redirigir al dashboard del usuario
      router.push('/adopciones');
      router.refresh();
    } catch (error) {
      // Manejar errores de validación de Zod
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: (string | number)[]; message: string }> };
        const fieldErrors: Record<string, string> = {};
        zodError.errors.forEach((err) => {
          const field = err.path[0];
          if (typeof field === 'string') {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setServerError('Error inesperado. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <PawPrint className="w-12 h-12 text-orange-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="text-gray-600 mt-2">Regístrate en PawLig</p>
      </div>

      {/*  Error con sugerencia de recuperación */}
      {serverError && (
        <div
          className={`px-4 py-3 rounded-lg ${showRecoverySuggestion
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
            }`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {showRecoverySuggestion ? (
                // Icono de advertencia (amarillo)
                <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                // Icono de error (rojo)
                <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${showRecoverySuggestion ? 'text-yellow-800' : 'text-red-700'
                }`}>
                {serverError}
              </p>
              {/*  Sugerencia con enlace a recuperación */}
              {showRecoverySuggestion && (
                <p className="mt-2 text-sm text-yellow-700">
                  ¿Olvidaste tu contraseña?{' '}
                  <Link
                    href={recoveryUrl}
                    className="font-semibold underline hover:text-yellow-900"
                  >
                    Recupérala aquí
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1" id="email-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          aria-required="true"
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'password-error' : 'password-hint'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Mínimo 8 caracteres"
        />
        {errors.password ? (
          <p className="text-red-500 text-sm mt-1" id="password-error" role="alert">
            {errors.password}
          </p>
        ) : (
          <p className="text-gray-500 text-sm mt-1" id="password-hint">
            Mínimo 8 caracteres
          </p>
        )}
      </div>

      {/* Nombre completo */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre completo *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Juan Pérez"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          aria-required="true"
          className={` text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="3001234567"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Municipio */}
      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-2">
          Municipio *
        </label>
        <select
          id="municipality"
          name="municipality"
          value={formData.municipality}
          onChange={handleChange}
          required
          aria-required="true"
          className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
        >
          <option value={Municipality.MEDELLIN}>Medellín</option>
          <option value={Municipality.BELLO}>Bello</option>
          <option value={Municipality.ITAGUI}>Itagüí</option>
          <option value={Municipality.ENVIGADO}>Envigado</option>
          <option value={Municipality.SABANETA}>Sabaneta</option>
          <option value={Municipality.LA_ESTRELLA}>La Estrella</option>
          <option value={Municipality.CALDAS}>Caldas</option>
          <option value={Municipality.COPACABANA}>Copacabana</option>
          <option value={Municipality.GIRARDOTA}>Girardota</option>
          <option value={Municipality.BARBOSA}>Barbosa</option>
        </select>
      </div>

      {/* Dirección */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Dirección *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          aria-required="true"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="Calle 123 #45-67"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.address}
          </p>
        )}
      </div>

      {/* Número de identificación */}
      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Número de identificación *
        </label>
        <input
          type="text"
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
          required
          aria-required="true"
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.idNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          placeholder="1234567890"
        />
        {errors.idNumber && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.idNumber}
          </p>
        )}
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de nacimiento *
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
          aria-required="true"
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split('T')[0]}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.birthDate ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.birthDate && (
          <p className="text-red-500 text-sm mt-1" role="alert">
            {errors.birthDate}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">Debes ser mayor de 18 años</p>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Registrando...' : 'Crear cuenta'}
      </button>

      {/* Link a login */}
      <p className="pb-4 mb-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. MEJORAS DE UX:
 *    - Alert diferenciado por color (rojo = error, amarillo = advertencia)
 *    - Enlace directo a recuperación de contraseña
 *    - Limpieza automática de sugerencia al editar email
 * 
 * 2. ACCESIBILIDAD:
 *    - role="alert" en mensajes de error
 *    - aria-live="polite" en alerta principal
 *    - aria-invalid en campos con error
 *    - aria-describedby vincula errores con inputs
 * 
 * 3. ESTADOS MANEJADOS:
 *    - showRecoverySuggestion: Controla visibilidad de sugerencia
 *    - recoveryUrl: URL dinámica desde el backend
 *    - serverError: Mensaje principal de error
 * 
 * 4. FLUJO DE EMAIL DUPLICADO:
 *    1. Usuario ingresa email existente
 *    2. Backend responde con code: 'EMAIL_ALREADY_EXISTS'
 *    3. Frontend detecta el código
 *    4. Muestra alerta amarilla con enlace de recuperación
 *    5. Usuario puede hacer clic directamente o editar el email
 */