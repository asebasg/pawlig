'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { registerUserSchema, RegisterUserInput } from '@/lib/validations/user.schema';
import { Municipality } from '@prisma/client';

/**
 * Componente de formulario de registro para nuevos adoptantes
 * Implementa HU-001 con validación en cliente y manejo de errores
 */
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
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError('');
    setErrors({});

    try {
      // 1. Validar datos en el cliente con Zod
      const validatedData = registerUserSchema.parse(formData);

      // 2. Enviar petición al API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores del servidor
        if (data.details) {
          // Errores de validación campo por campo
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((detail: { field: string; message: string }) => {
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

      // 4. Redirigir a la galería de adopciones
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
        <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="text-gray-600 mt-2">Regístrate para adoptar una mascota</p>
      </div>

      {/* Error general del servidor */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {serverError}
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Mínimo 8 caracteres"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Juan Pérez"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="3001234567"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Calle 123 #45-67"
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
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
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.idNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="1234567890"
        />
        {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
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
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split('T')[0]}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.birthDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
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
      <p className="text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
          Inicia sesión
        </a>
      </p>
    </form>
  );
}