import { z } from 'zod';
import { Municipality } from '@prisma/client'

// - Esquema de registro
export const registerUserSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email es requerido'),

  password: z
    .string()
    .min(8, 'La contraseña debe tener mínimo 8 caracteres') // RN-001
    .max(100, 'La contraseña es muy larga'),

  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre muy largo'),

  phone: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(15, 'Teléfono inválido'),

  municipality: z.nativeEnum(Municipality, {
    message: 'Municipio inválido'
  }),

  address: z
    .string()
    .min(5, 'Dirección debe tener al menos 5 caracteres')
    .max(200, 'Dirección muy larga'),

  idNumber: z
    .string()
    .min(5, 'Número de identificación inválido')
    .max(20, 'Número de identificación inválido'),

  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, 'Debes ser mayor de 18 años'),
});

// - Esquema del login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email es requerido'),

  password: z
    .string()
    .min(1, 'Contraseña es requerida'),
});

// - Esquema de solicitud de albergue
export const shelterApplicationSchema = z.object({
  // Datos del usuario
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener mínimo 8 caracteres'),
  name: z.string().min(2, 'Nombre completo del representante requerido'),
  phone: z.string().min(7, 'Teléfono inválido'),
  municipality: z.nativeEnum(Municipality),
  address: z.string().min(5, 'Dirección personal requerida'),
  idNumber: z.string().min(5, 'Número de identificación requerido'),
  birthDate: z.string(),

  // Datos del albergue
  shelterName: z
    .string()
    .min(3, 'Nombre del albergue requerido')
    .max(100, 'Nombre muy largo'),

  shelterMunicipality: z.nativeEnum(Municipality, {
    message: 'Municipio del albergue es requerido'
  }),


  shelterAddress: z
    .string()
    .min(5, 'Dirección del albergue requerida')
    .max(200, 'Dirección muy larga'),

  shelterDescription: z
    .string()
    .min(20, 'Descripción debe tener al menos 20 caracteres')
    .max(500, 'Descripción muy larga')
    .optional(),

  contactWhatsApp: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Número de WhatsApp inválido')
    .optional(),

  contactInstagram: z
    .string()
    .regex(/^@?[a-zA-Z0-9._]{1,30}$/, 'Usuario de Instagram inválido')
    .optional(),
});

//  Tipo TypeScript inferido del schema
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ShelterApplicationInput = z.infer<typeof shelterApplicationSchema>;

/**
 * 📚 NOTAS:
 * 
 * 1. ¿QUÉ ES ZOD?
 *    - Librería de validación TypeScript-first
 *    - Valida datos en runtime (cliente y servidor)
 *    - Genera tipos TypeScript automáticamente
 * 
 * 2. LOGINSCHEMA:
 *    - Solo valida email y password
 *    - Validación mínima (campo requerido + formato email)
 *    - La validación real (credenciales correctas) ocurre en el backend
 * 
 * 3. USO EN LOGIN-FORM:
 *    - loginSchema.parse(formData) valida antes de enviar
 *    - Si falla: lanza ZodError con mensajes específicos
 *    - Si pasa: datos seguros para enviar a NextAuth
 * 
 * 4. TIPO LOGININPUT:
 *    - Generado automáticamente por Zod
 *    - Define la estructura: { email: string, password: string }
 *    - Usado en el estado del LoginForm
 */