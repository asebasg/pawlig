'use client';

import { useState } from 'react';
import { vendorApplicationSchema } from '@/lib/validations/user.schema';
import { $Enums } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ZodError } from 'zod';
import Link from 'next/link';

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
            businessName: formData.get('businessName'),
            businessMunicipality: formData.get('businessMunicipality'),
            businessAddress: formData.get('businessAddress'),
            businessDescription: formData.get('businessDescription'),
            businessPhone: formData.get('businessPhone'),
        };

        try {
            // Validar con el schema
            const validatedData = vendorApplicationSchema.parse(data);

            // Enviar al servidor
            const response = await axios.post('/api/user/request-vendor-account', validatedData);

            if (response.status === 201) {
                setSuccess(true);
                e.currentTarget.reset();
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            }
        } catch (err) {
            if (err instanceof ZodError) {
                // Errores de validación de Zod
                const errors: Record<string, string> = {};
                err.issues.forEach((zodError) => {
                    const field = zodError.path[0] as string;
                    errors[field] = zodError.message;
                });
                setFieldErrors(errors);
                setError('Por favor revisa los campos marcados en rojo');
            } else if (err instanceof AxiosError && err.response?.status === 409) {
                // Error 409: Conflicto
                const errorData = err.response.data;
                if (errorData.code === 'EMAIL_ALREADY_EXISTS') {
                    setError('Este correo electrónico ya está registrado. Por favor, intenta con uno distinto o inicia sesión en tu cuenta.');
                } else if (errorData.code === 'PENDING_REQUEST_EXISTS') {
                    setError('Ya tienes una solicitud de albergue en proceso. Espera la respuesta del administrador.');
                } else {
                    setError('Los datos ingresados ya están en uso. Verifica la información.');
                }
            } else if (err instanceof AxiosError && err.response?.status === 403) {
                setError('No tienes permisos para realizar esta acción. Contacta al administrador.');
            } else if (err instanceof AxiosError && err.response?.status === 401) {
                setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            } else if (err instanceof AxiosError && err.response?.status && err.response.status >= 500) {
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
            <div className="block">
                <div className="w-full max-w-2xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">¡Solicitud enviada exitosamente!</h3>
                    <p className="text-green-700">
                        Tu solicitud ha sido recibida. Un administrador la revisará y te notificará en breve sobre el estado de tu aprobación.
                        Te recomendamos estar atento a tu correo electrónico.
                    </p>
                </div>
                <div className="mt-4 flex justify-center">
                    <Link
                        href="/"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-800 transition"
                    >
                        Ir al inicio
                    </Link>
                </div>
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
                        defaultValue={userProfile?.name}
                        readOnly={!!userProfile?.name}
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                            } ${userProfile?.name ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            defaultValue={userProfile?.idNumber}
                            readOnly={!!userProfile?.idNumber}
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.idNumber ? 'border-red-500' : 'border-gray-300'
                                } ${userProfile?.idNumber ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            defaultValue={userProfile?.birthDate ? new Date(userProfile.birthDate).toISOString().split('T')[0] : ''}
                            readOnly={!!userProfile?.birthDate}
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.birthDate ? 'border-red-500' : 'border-gray-300'
                                } ${userProfile?.birthDate ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            defaultValue={userProfile?.email}
                            readOnly={!!userProfile?.email}
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                                } ${userProfile?.email ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            defaultValue={userProfile?.phone}
                            readOnly={!!userProfile?.phone}
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                                } ${userProfile?.phone ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                            defaultValue={userProfile?.municipality || ""}
                            disabled={!!userProfile?.municipality}
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.municipality ? 'border-red-500' : 'border-gray-300'
                                } ${userProfile?.municipality ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="">Selecciona un municipio</option>
                            {Object.values($Enums.Municipality).map((mun) => (
                                <option key={mun} value={mun}>
                                    {mun.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {/* Hidden input for disabled select to ensure data is submitted if using FormData, 
                            though FormData usually ignores disabled inputs, we might need to append it manually or ensure 
                            defaultValue is sufficient if re-enabling on submit. 
                            However, the request collects data from FormData(e.currentTarget). Disabled inputs are NOT included int FormData.
                            We need to ensure the value is sent. Let's add a hidden input if disabled. 
                        */}
                        {userProfile?.municipality && <input type="hidden" name="municipality" value={userProfile.municipality} />}

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
                            defaultValue={userProfile?.address}
                            readOnly={!!userProfile?.address}
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.address ? 'border-red-500' : 'border-gray-300'
                                } ${userProfile?.address ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                        type="text"
                        id="businessName"
                        name="businessName"
                        required
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.businessName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Pet Shop El Amigo FIel"
                    />
                    {fieldErrors.businessName && <p className="text-red-600 text-sm mt-1">{fieldErrors.businessName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="businessMunicipality" className="block text-sm font-medium text-gray-700 mb-1">
                            Municipio del Negocio <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <select
                            id="businessMunicipality"
                            name="businessMunicipality"
                            required
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.businessMunicipality ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Selecciona un municipio</option>
                            {Object.values($Enums.Municipality).map((mun) => (
                                <option key={mun} value={mun}>
                                    {mun.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.businessMunicipality && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.businessMunicipality}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección del Negocio <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <input
                            type="text"
                            id="businessAddress"
                            name="businessAddress"
                            required
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.businessAddress ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Calle Principal #100"
                        />
                        {fieldErrors.businessAddress && <p className="text-red-600 text-sm mt-1">{fieldErrors.businessAddress}</p>}
                    </div>
                </div>

                <div>
                    <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción del Negocio
                    </label>
                    <textarea
                        id="businessDescription"
                        name="businessDescription"
                        rows={4}
                        className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none ${fieldErrors.businessDescription ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Cuéntanos sobre tu negocio, qué productos vendes y cuál es tu especialidad..."
                    />
                    {fieldErrors.businessDescription && (
                        <p className="text-red-600 text-sm mt-1">{fieldErrors.businessDescription}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono o WhatsApp de Contacto <span className='text-red-500 font-bold'>*</span>
                        </label>
                        <input
                            type="tel"
                            id="businessPhone"
                            name="businessPhone"
                            required
                            className={`text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none ${fieldErrors.businessPhone ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="+573001234567"
                        />
                        {fieldErrors.businessPhone && (
                            <p className="text-red-600 text-sm mt-1">{fieldErrors.businessPhone}</p>
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
