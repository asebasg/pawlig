'use client';

import { useState } from 'react';
import { shelterApplicationSchema, type ShelterApplicationInput } from '@/lib/validations/user.schema';
import { $Enums } from '@prisma/client';
import axios from 'axios';
import Link from 'next/link';

export function ShelterRequestForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      phone: formData.get('phone'),
      municipality: formData.get('municipality'),
      address: formData.get('address'),
      idNumber: formData.get('idNumber'),
      birthDate: formData.get('birthDate'),
      shelterName: formData.get('shelterName'),
      shelterNit: formData.get('shelterNit'),
      shelterMunicipality: formData.get('shelterMunicipality'),
      shelterAddress: formData.get('shelterAddress'),
      shelterDescription: formData.get('shelterDescription'),
      contactWhatsApp: formData.get('contactWhatsApp'),
      contactInstagram: formData.get('contactInstagram'),
    };

    try {
      // Validar con el schema
      const validatedData = shelterApplicationSchema.parse(data);

      // Enviar al servidor
      const response = await axios.post('/api/auth/request-shelter-account', validatedData);

      if (response.status === 201) {
        setSuccess(true);
        e.currentTarget.reset();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (err: any) {
      if (err.errors) {
        // Errores de validación de Zod
        const errors: Record<string, string> = {};
        err.errors.forEach((e: any) => {
          const field = e.path[0] as string;
          errors[field] = e.message;
        });
        setFieldErrors(errors);
        setError('Por favor revisa los campos marcados en rojo');
      } else if (err.response?.status === 409) {
        // Error 409: Conflicto
        const errorData = err.response.data;
        if (errorData.code === 'EMAIL_ALREADY_EXISTS') {
          setError('Este correo electrónico ya está registrado. Por favor, intenta con uno distinto o inicia sesión en tu cuenta.');
        } else if (errorData.code === 'PENDING_REQUEST_EXISTS') {
          setError('Ya tienes una solicitud de albergue en proceso. Espera la respuesta del administrador.');
        } else {
          setError('Los datos ingresados ya están en uso. Verifica la información.');
        }
      } else if (err.response?.status === 403) {
        setError('No tienes permisos para realizar esta acción. Contacta al administrador.');
      } else if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (err.response?.status >= 500) {
        setError('Hay un problema con el servidor. Inténtalo más tarde.');
      } else {
        setError('Ocurrió un error inesperado. Verifica tu conexión e inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">¡Solicitud enviada exitosamente!</h3>
        <p className="text-green-700">
          Tu solicitud ha sido recibida. Un administrador la revisará y te notificará en breve sobre el estado de tu aprobación.
          Te recomendamos estar atento a tu correo electrónico.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Sección: Datos del Representante */}
      <fieldset className="space-y-4 border-b pb-6">
        <legend className="text-lg font-semibold text-gray-900 mb-4">
          Datos del Representante
        </legend>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre Completo <span className='text-red-500 font-bold'>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Juan Pérez García"
          />
          {fieldErrors.name && <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Identificación <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.idNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="1234567890"
            />
            {fieldErrors.idNumber && <p className="text-red-600 text-sm mt-1">{fieldErrors.idNumber}</p>}
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {fieldErrors.birthDate && <p className="text-red-600 text-sm mt-1">{fieldErrors.birthDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="usuario@ejemplo.com"
            />
            {fieldErrors.email && <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="+573001234567"
            />
            {fieldErrors.phone && <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
              Municipio <span className='text-red-500 font-bold'>*</span>
            </label>
            <select
              id="municipality"
              name="municipality"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.municipality ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Selecciona un municipio</option>
              {Object.values($Enums.Municipality).map((mun) => (
                <option key={mun} value={mun}>
                  {mun.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {fieldErrors.municipality && <p className="text-red-600 text-sm mt-1">{fieldErrors.municipality}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Calle 10 #20-30 Apto 405"
            />
            {fieldErrors.address && <p className="text-red-600 text-sm mt-1">{fieldErrors.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Ingresa tu contraseña actual"
            />
            {fieldErrors.password && <p className="text-red-600 text-sm mt-1">{fieldErrors.password}</p>}
            <p className="mt-2 text-sm text-purple-700">
              ¿Olvidaste tu contraseña?{' '}
              <Link
                href="/forgot-password"
                className="font-semibold underline hover:text-purple-900"
              >
                Recupérala aquí
              </Link>
            </p>
          </div>
        </div>
      </fieldset>

      {/* Sección: Datos del Albergue */}
      <fieldset className="space-y-4 border-b pb-6">
        <legend className="text-lg font-semibold text-gray-900 mb-4">
          Datos del Albergue o Entidad de Rescate
        </legend>

        <div>
          <label htmlFor="shelterName" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Albergue <span className='text-red-500 font-bold'>*</span>
          </label>
          <input
            type="text"
            id="shelterName"
            name="shelterName"
            required
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.shelterName ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Albergue de Mascotas Valle del Aburrá"
          />
          {fieldErrors.shelterName && <p className="text-red-600 text-sm mt-1">{fieldErrors.shelterName}</p>}
        </div>

        <div>
          <label htmlFor="shelterNit" className="block text-sm font-medium text-gray-700 mb-1">
            NIT del Albergue <span className='text-red-500 font-bold'>*</span>
          </label>
          <input
            type="text"
            id="shelterNit"
            name="shelterNit"
            required
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.shelterNit ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="900123456-7"
          />
          {fieldErrors.shelterNit && <p className="text-red-600 text-sm mt-1">{fieldErrors.shelterNit}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shelterMunicipality" className="block text-sm font-medium text-gray-700 mb-1">
              Municipio del Albergue <span className='text-red-500 font-bold'>*</span>
            </label>
            <select
              id="shelterMunicipality"
              name="shelterMunicipality"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.shelterMunicipality ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Selecciona un municipio</option>
              {Object.values($Enums.Municipality).map((mun) => (
                <option key={mun} value={mun}>
                  {mun.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {fieldErrors.shelterMunicipality && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.shelterMunicipality}</p>
            )}
          </div>

          <div>
            <label htmlFor="shelterAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección del Albergue <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              type="text"
              id="shelterAddress"
              name="shelterAddress"
              required
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.shelterAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Calle Principal #100"
            />
            {fieldErrors.shelterAddress && <p className="text-red-600 text-sm mt-1">{fieldErrors.shelterAddress}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="shelterDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Albergue
          </label>
          <textarea
            id="shelterDescription"
            name="shelterDescription"
            rows={4}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none ${fieldErrors.shelterDescription ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Cuéntanos sobre tu albergue, su misión y los tipos de animales que rescatan..."
          />
          {fieldErrors.shelterDescription && (
            <p className="text-red-600 text-sm mt-1">{fieldErrors.shelterDescription}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactWhatsApp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp de Contacto
            </label>
            <input
              type="tel"
              id="contactWhatsApp"
              name="contactWhatsApp"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.contactWhatsApp ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="+573001234567"
            />
            {fieldErrors.contactWhatsApp && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.contactWhatsApp}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactInstagram" className="block text-sm font-medium text-gray-700 mb-1">
              Instagram del Albergue
            </label>
            <input
              type="text"
              id="contactInstagram"
              name="contactInstagram"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.contactInstagram ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="@mi_albergue"
            />
            {fieldErrors.contactInstagram && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.contactInstagram}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Botones */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </form>
  );
}
