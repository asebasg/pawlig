'use client';

import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { vendorApplicationSchema } from '@/lib/validations/user.schema';
import { $Enums } from '@prisma/client';
import Link from 'next/link';
import { z } from 'zod';

/**
 * POST /api/user/request-vendor-account
 * Descripción: Formulario para solicitar una cuenta de vendedor comercial.
 * Requiere: Sesión de usuario válida.
 * Implementa: HU-010 (Gestión de productos), RF-011 (Solicitud de cuenta de vendedor).
 */

type VendorApplicationInput = z.infer<typeof vendorApplicationSchema>;

interface VendorRequestFormProps {
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

export function VendorRequestForm({ userProfile }: VendorRequestFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VendorApplicationInput>({
        resolver: zodResolver(vendorApplicationSchema),
        defaultValues: {
            email: userProfile?.email || '',
            name: userProfile?.name || '',
            phone: userProfile?.phone || '',
            municipality: userProfile?.municipality || $Enums.Municipality.MEDELLIN,
            address: userProfile?.address || '',
            idNumber: userProfile?.idNumber || '',
            birthDate: userProfile?.birthDate ? new Date(userProfile.birthDate).toISOString().split('T')[0] : '',
            // Campos del negocio vacíos
            businessName: '',
            businessMunicipality: $Enums.Municipality.MEDELLIN,
            businessAddress: '',
            businessDescription: '',
            businessPhone: '',
        },
    });

    const onSubmit = async (data: VendorApplicationInput) => {
        const toastId = toast.loading("Enviando solicitud...");

        try {
            const response = await fetch('/api/user/request-vendor-account', {
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
                        throw new Error('Ya tienes una solicitud en proceso.');
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
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
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

            {/* Sección: Datos del Negocio */}
            <fieldset className="space-y-4 border-b pb-6">
                <legend className="text-lg font-semibold text-gray-900 mb-4">
                    Datos del Negocio o Emprendimiento
                </legend>

                <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Negocio <span className='text-red-500 font-bold'>*</span>
                    </label>
                    <input
                        {...register('businessName')}
                        type="text"
                        id="businessName"
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Pet Shop El Amigo FIel"
                    />
                    {errors.businessName && <p className="text-red-600 text-sm mt-1">{errors.businessName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="businessMunicipality" className="block text-sm font-medium text-gray-700 mb-1">
                            Municipio del Negocio <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <select
                            {...register('businessMunicipality')}
                            id="businessMunicipality"
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.businessMunicipality ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Selecciona un municipio</option>
                            {Object.values($Enums.Municipality).map((mun) => (
                                <option key={mun} value={mun}>
                                    {mun.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {errors.businessMunicipality && (
                            <p className="text-red-600 text-sm mt-1">{errors.businessMunicipality.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección del Negocio <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <input
                            {...register('businessAddress')}
                            type="text"
                            id="businessAddress"
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.businessAddress ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Calle Principal #100"
                        />
                        {errors.businessAddress && <p className="text-red-600 text-sm mt-1">{errors.businessAddress.message}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción del Negocio
                    </label>
                    <textarea
                        {...register('businessDescription')}
                        id="businessDescription"
                        rows={4}
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none ${errors.businessDescription ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Cuéntanos sobre tu negocio, qué productos vendes y cuál es tu especialidad..."
                    />
                    {errors.businessDescription && (
                        <p className="text-red-600 text-sm mt-1">{errors.businessDescription.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono o WhatsApp de Contacto <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <input
                            {...register('businessPhone')}
                            type="tel"
                            id="businessPhone"
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${errors.businessPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="+573001234567"
                        />
                        {errors.businessPhone && (
                            <p className="text-red-600 text-sm mt-1">{errors.businessPhone.message}</p>
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

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Formulario orquestador para la postulación de usuarios al rol de Vendedor, 
 * capturando la estructura básica del negocio para su posterior validación.
 *
 * Lógica Clave:
 * - Onboarding Asistido: Facilita el llenado del formulario mediante la inyección 
 *   de datos del perfil ya existente del adoptante.
 * - Validación por Etapas: El backend recibe esta solicitud y la marca como 
 *   'verified: false' hasta que un administrador revise los datos comerciales.
 * - Restricciones de Redundancia: El frontend previene el envío múltiple de 
 *   solicitudes mediante el manejo de estados de carga y errores 409 del servidor.
 *
 * Dependencias Externas:
 * - next/navigation: Para redirigir al usuario tras el envío exitoso de la propuesta.
 * - sonner: Framework de notificaciones para confirmación de recepción.
 *
 */
