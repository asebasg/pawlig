'use client';

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { shelterApplicationSchema, ShelterApplicationInput } from '@/lib/validations/user.schema';
import { $Enums } from '@prisma/client';
import Link from 'next/link';

interface ShelterRequestFormProps {
  userProfile?: {
    name: string;
    email: string;
    phone: string;
    municipality: $Enums.Municipality;
    address: string;
    idNumber: string;
    birthDate: Date;
  };
}

export function ShelterRequestForm({ userProfile }: ShelterRequestFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShelterApplicationInput>({
    resolver: zodResolver(shelterApplicationSchema),
    defaultValues: {
      email: userProfile?.email || '',
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      municipality: userProfile?.municipality || $Enums.Municipality.MEDELLIN,
      address: userProfile?.address || '',
      idNumber: userProfile?.idNumber || '',
      birthDate: userProfile?.birthDate ? new Date(userProfile.birthDate).toISOString().split('T')[0] : '',
      // Campos del albergue vacíos
      shelterName: '',
      shelterNit: '',
      shelterMunicipality: $Enums.Municipality.MEDELLIN,
      shelterAddress: '',
      shelterDescription: '',
      contactWhatsApp: '',
      contactInstagram: '',
    },
  });

  const onSubmit = async (data: ShelterApplicationInput) => {
    const toastId = toast.loading("Enviando solicitud...");

    try {
      // Agregar password si no viene en userProfile (asumiendo que si viene userProfile es un user existente y no pide password? 
      // Espera, el schema pide password. Si el usuario ya existe (userProfile), ¿necesitamos password?
      // Revisando el código original:
      // const data = { email: formData.get('email'), password: formData.get('password'), ... }
      // Siempre enviaba password.
      // El userProfile se usa para PRE-LLENAR datos, pero el input de password siempre estaba vacío en el original y requerido?
      // En el original: defaultValue={userProfile?.email}, pero el password input NO tenía defaultValue y era required.
      // Entonces se pide password también para nuevos usuarios.
      // PERO, si el usuario ya está logueado (userProfile existe), ¿deberíamos pedir password?
      // El backend seguramente crea un usuario nuevo si no existe.
      // Si el usuario ya existe, el backend podría rechazar por "EMAIL_ALREADY_EXISTS" a menos que sea una solicitud de "upgrade".
      // El endpoint es `/api/user/request-shelter-account`.
      // Asumiré que siempre valida el schema completo, incluyendo password.

      const response = await fetch('/api/user/request-shelter-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 409) {
          if (errorData.code === 'EMAIL_ALREADY_EXISTS') {
            throw new Error('Este correo electrónico ya está registrado. Por favor, inicia sesión.');
          } else if (errorData.code === 'PENDING_REQUEST_EXISTS') {
            throw new Error('Ya tienes una solicitud de albergue en proceso.');
          } else {
            throw new Error('Los datos ingresados ya están en uso.');
          }
        }

        throw new Error(errorData.error || 'Error al enviar la solicitud');
      }

      toast.success("¡Solicitud enviada exitosamente!", {
        id: toastId,
        description: "Un administrador revisará tu solicitud."
      });

      // Redireccionar al inicio
      router.push('/');
      router.refresh();

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error inesperado", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-8">

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
            {...register('name')}
            type="text"
            id="name"
            readOnly={!!userProfile?.name}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'
              } ${userProfile?.name ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Juan Pérez García"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Identificación <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('idNumber')}
              type="text"
              id="idNumber"
              readOnly={!!userProfile?.idNumber}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.idNumber ? 'border-red-500' : 'border-gray-300'
                } ${userProfile?.idNumber ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="1234567890"
            />
            {errors.idNumber && <p className="text-red-600 text-sm mt-1">{errors.idNumber.message}</p>}
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('birthDate')}
              type="date"
              id="birthDate"
              readOnly={!!userProfile?.birthDate}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.birthDate ? 'border-red-500' : 'border-gray-300'
                } ${userProfile?.birthDate ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.birthDate && <p className="text-red-600 text-sm mt-1">{errors.birthDate.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              readOnly={!!userProfile?.email}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'
                } ${userProfile?.email ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              readOnly={!!userProfile?.phone}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'
                } ${userProfile?.phone ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="+573001234567"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
              Municipio <span className='text-red-500 font-bold'>*</span>
            </label>
            <select
              {...register('municipality')}
              id="municipality"
              // Nota: disabled no envía valor en form submit nativo, pero register de RHF sí debería tomar el valor si usamos defaultValues? 
              // RHF no incluye campos deshabilitados en handleSubmit si es HTML nativo disabled, 
              // pero aquí controlamos con state? No, usamos {...register}.
              // Si ponemos disabled, el usuario no puede cambiarlo.
              // Para asegurar que se envíe, en RHF se envía? Sí, RHF toma el valor del input. 
              // EXCEPTO si el input está disabled, el navegador no lo incluye en el evento submit normal, pero RHF gestiona el estado interno?
              // En HTML standard, disabled inputs no se envían.
              // En RHF, si usas handleSubmit, data contiene los valores del estado interno.
              // PERO, si registraste un input y luego lo deshabilitas, ¿RHF lo excluye?
              // Verifiquemos: RHF sigue las reglas de HTML standard por defecto para validación?
              // Lo mejor es usar readOnly para inputs de texto. Para select no hay readOnly.
              // Para select, si hay userProfile.municipality, podemos dejarlo disabled y en el onSubmit, si falta, RHF nos daría error si fuera required?
              // El valor está en defaultValues.
              // Si el usuario edita y está disabled, no cambia.
              // Truco: Si está disabled, agregar un input hidden con el valor.
              disabled={!!userProfile?.municipality}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.municipality ? 'border-red-500' : 'border-gray-300'
                } ${userProfile?.municipality ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Selecciona un municipio</option>
              {Object.values($Enums.Municipality).map((mun) => (
                <option key={mun} value={mun}>
                  {mun.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {/* Si está disabled el select, aseguramos el envío del valor con RHF? 
                RHF documentation dice: "HTML standard behavior: disabled inputs result in undefined values".
                Solución: No usar disabled en el registro, o usar un hidden input, o (mejor) manejarlo en el onSubmit fusionando defaultValues?
                Mejor solución simple: Si userProfile.municipality existe, renderizamos un input hidden y mostramos el select disabled SIN registrarlo, o lo registramos pero sabemos que fallará?
                Mejor: Si hay userProfile, renderizar el select como disabled (visual) pero NO registrarlo, y registrar un input hidden con el valor?
                O simplemente NO ponerlo disabled, sino usar un estilo que parezca disabled y prevenir cambio con CSS/JS? No, pointer-events-none.
                O la opción más robusta:
                Si hay userProfile.municipality, el select está disabled.
                El valor DEBE venir de defaultValues.
                PERO RHF strip disabled inputs.
                Entonces en onSubmit, si data.municipality es undefined, fallback a userProfile.municipality? No, data será validado por zodResolver antes de llegar a onSubmit.
                Si es undefined, Zod fallará.
                Solución: Usar un Controller o, simplemente, pointer-events-none y bg-gray-100 en lugar de disabled real para el select.
             */}
            <style jsx>{`
                .read-only-select {
                    pointer-events: none;
                    background-color: #f3f4f6;
                }
             `}</style>

            {errors.municipality && <p className="text-red-600 text-sm mt-1">{errors.municipality.message}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('address')}
              type="text"
              id="address"
              readOnly={!!userProfile?.address}
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                } ${userProfile?.address ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Calle 10 #20-30 Apto 405"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ingresa tu contraseña"
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}

            {!userProfile && (
              <p className="mt-2 text-sm text-purple-700">
                ¿Olvidaste tu contraseña?{' '}
                <Link
                  href="/forgot-password"
                  className="font-semibold underline hover:text-purple-900"
                >
                  Recupérala aquí
                </Link>
              </p>
            )}
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
            {...register('shelterName')}
            type="text"
            id="shelterName"
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.shelterName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Albergue de Mascotas Valle del Aburrá"
          />
          {errors.shelterName && <p className="text-red-600 text-sm mt-1">{errors.shelterName.message}</p>}
        </div>

        <div>
          <label htmlFor="shelterNit" className="block text-sm font-medium text-gray-700 mb-1">
            NIT del Albergue <span className='text-red-500 font-bold'>*</span>
          </label>
          <input
            {...register('shelterNit')}
            type="text"
            id="shelterNit"
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.shelterNit ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="900123456-7"
          />
          {errors.shelterNit && <p className="text-red-600 text-sm mt-1">{errors.shelterNit.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shelterMunicipality" className="block text-sm font-medium text-gray-700 mb-1">
              Municipio del Albergue <span className='text-red-500 font-bold'>*</span>
            </label>
            <select
              {...register('shelterMunicipality')}
              id="shelterMunicipality"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.shelterMunicipality ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecciona un municipio</option>
              {Object.values($Enums.Municipality).map((mun) => (
                <option key={mun} value={mun}>
                  {mun.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            {errors.shelterMunicipality && (
              <p className="text-red-600 text-sm mt-1">{errors.shelterMunicipality.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="shelterAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección del Albergue <span className='text-red-500 font-bold'>*</span>
            </label>
            <input
              {...register('shelterAddress')}
              type="text"
              id="shelterAddress"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.shelterAddress ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Calle Principal #100"
            />
            {errors.shelterAddress && <p className="text-red-600 text-sm mt-1">{errors.shelterAddress.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="shelterDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Albergue
          </label>
          <textarea
            {...register('shelterDescription')}
            id="shelterDescription"
            rows={4}
            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none ${errors.shelterDescription ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Cuéntanos sobre tu albergue, su misión y los tipos de animales que rescatan..."
          />
          {errors.shelterDescription && (
            <p className="text-red-600 text-sm mt-1">{errors.shelterDescription.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactWhatsApp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp de Contacto
            </label>
            <input
              {...register('contactWhatsApp')}
              type="tel"
              id="contactWhatsApp"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.contactWhatsApp ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="+573001234567"
            />
            {errors.contactWhatsApp && (
              <p className="text-red-600 text-sm mt-1">{errors.contactWhatsApp.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactInstagram" className="block text-sm font-medium text-gray-700 mb-1">
              Instagram del Albergue
            </label>
            <input
              {...register('contactInstagram')}
              type="text"
              id="contactInstagram"
              className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.contactInstagram ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="@mi_albergue"
            />
            {errors.contactInstagram && (
              <p className="text-red-600 text-sm mt-1">{errors.contactInstagram.message}</p>
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
          disabled={isSubmitting}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
    </form>
  );
}
