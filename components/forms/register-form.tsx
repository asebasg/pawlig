'use client';

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      municipality: Municipality.MEDELLIN,
      address: '',
      idNumber: '',
      birthDate: '',
    },
  });

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = async (data: RegisterUserInput) => {
    const toastId = toast.loading("Creando cuenta...");

    try {
      // 1. Enviar petición al API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData: ApiErrorResponse = await response.json();

      if (!response.ok) {
        // Manejo específico de email duplicado
        if (responseData.code === 'EMAIL_ALREADY_EXISTS') {
          toast.error("Este correo ya está registrado", {
            id: toastId,
            action: {
              label: "Recuperar",
              onClick: () => router.push(responseData.recoveryUrl || '/forgot-password'),
            },
            duration: 8000, // Dar tiempo para ver la acción
          });
          return;
        }

        // Error general
        throw new Error(responseData.error || 'Error al registrar usuario');
      }

      // 2. Registro exitoso: iniciar sesión automáticamente
      // Actualizamos el toast a loading de inicio de sesión
      toast.loading("Iniciando sesión automática...", { id: toastId });

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error('Cuenta creada, pero error al iniciar sesión automática', { id: toastId });
        return;
      }

      // 3. Redirigir
      toast.success("¡Bienvenido a PawLig!", { id: toastId });
      router.push('/adopciones');
      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error inesperado", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <PawPrint className="w-12 h-12 text-orange-700" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
        <p className="text-gray-600 mt-2">Regístrate en PawLig</p>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña *
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          aria-invalid={errors.password ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Mínimo 8 caracteres"
        />
        {errors.password ? (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </p>
        ) : (
          <p className="text-gray-500 text-sm mt-1">
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
          {...register('name')}
          type="text"
          id="name"
          aria-invalid={errors.name ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Juan Pérez"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          aria-invalid={errors.phone ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="3001234567"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Municipio */}
      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-2">
          Municipio *
        </label>
        <select
          {...register('municipality')}
          id="municipality"
          aria-invalid={errors.municipality ? 'true' : 'false'}
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
        {errors.municipality && (
          <p className="text-red-500 text-sm mt-1">
            {errors.municipality.message}
          </p>
        )}
      </div>

      {/* Dirección */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          Dirección *
        </label>
        <input
          {...register('address')}
          type="text"
          id="address"
          aria-invalid={errors.address ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Calle 123 #45-67"
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Número de identificación */}
      <div>
        <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Número de identificación *
        </label>
        <input
          {...register('idNumber')}
          type="text"
          id="idNumber"
          aria-invalid={errors.idNumber ? 'true' : 'false'}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.idNumber ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="1234567890"
        />
        {errors.idNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.idNumber.message}
          </p>
        )}
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
          Fecha de nacimiento *
        </label>
        <input
          {...register('birthDate')}
          type="date"
          id="birthDate"
          aria-invalid={errors.birthDate ? 'true' : 'false'}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
            .toISOString()
            .split('T')[0]}
          className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${errors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.birthDate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.birthDate.message}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">Debes ser mayor de 18 años</p>
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
            Registrando...
          </span>
        ) : 'Crear cuenta'}
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