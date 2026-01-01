import { z } from 'zod';
import { Municipality, UserRole } from '@prisma/client'

/**
 * Esquemas: Validación de Usuario
 * Descripción: Define los esquemas de Zod para la validación de datos de usuario.
 * Requiere: -
 * Implementa: Reglas de negocio para el registro, login y actualización de perfiles.
 */
//  ========== ESQUEMA DE REGISTRO (ADOPTANTE) ==========
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

//  ========== ESQUEMA DE LOGIN ==========
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'Email es requerido'),

  password: z
    .string()
    .min(1, 'Contraseña es requerida'),
});

//  ========== ESQUEMA DE SOLICITUD DE ALBERGUE ==========
export const shelterApplicationSchema = z.object({
  //  ===== DATOS DEL USUARIO REPRESENTANTE =====
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
    .min(2, 'Nombre completo del representante requerido')
    .max(100, 'Nombre muy largo'),

  phone: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(15, 'Teléfono inválido'),

  municipality: z.nativeEnum(Municipality, {
    message: 'Municipio de residencia del representante inválido'
  }),

  address: z
    .string()
    .min(5, 'Dirección personal del representante requerida')
    .max(200, 'Dirección muy larga'),

  idNumber: z
    .string()
    .min(5, 'Número de identificación del representante requerido')
    .max(20, 'Número de identificación inválido'),

  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, 'El representante debe ser mayor de 18 años'),

  //  ===== DATOS DEL ALBERGUE =====
  shelterName: z
    .string()
    .min(3, 'Nombre del albergue requerido')
    .max(100, 'Nombre muy largo'),

  shelterNit: z
    .string()
    .regex(
      /^[0-9]{9}-[0-9]$/,
      'NIT inválido. Formato esperado: 900123456-7 (9 dígitos + guion + dígito de verificación)'
    )
    .min(11, 'NIT debe tener 11 caracteres (ejemplo: 900123456-7)')
    .max(11, 'NIT debe tener 11 caracteres (ejemplo: 900123456-7)'),

  shelterMunicipality: z.nativeEnum(Municipality, {
    message: 'Municipio donde opera el albergue es requerido'
  }),

  shelterAddress: z
    .string()
    .min(5, 'Dirección física del albergue requerida')
    .max(200, 'Dirección muy larga'),

  shelterDescription: z
    .string()
    .min(20, 'Descripción debe tener al menos 20 caracteres')
    .max(500, 'Descripción muy larga')
    .optional(),

  contactWhatsApp: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Número de WhatsApp inválido (debe incluir código de país)')
    .optional(),

  contactInstagram: z
    .string()
    .regex(/^@?[a-zA-Z0-9._]{1,30}$/, 'Usuario de Instagram inválido')
    .optional(),
})
  // Validación personalizada: Al menos un método de contacto requerido (RN-013)
  .refine(
    (data) => data.contactWhatsApp || data.contactInstagram,
    {
      message: 'Debes proporcionar al menos un método de contacto (WhatsApp o Instagram)',
      path: ['contactWhatsApp'], // Muestra error en el campo WhatsApp
    }
  );

//  ========== TIPOS TYPESCRIPT INFERIDOS ==========
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ShelterApplicationInput = z.infer<typeof shelterApplicationSchema>;

//  ========== ESQUEMA DE ACTUALIZACIÓN DE PERFIL DE VENDEDOR ==========
export const vendorProfileUpdateSchema = z.object({
  businessName: z
    .string()
    .min(3, 'Nombre del negocio debe tener al menos 3 caracteres')
    .max(100, 'Nombre del negocio muy largo'),

  businessPhone: z
    .string()
    .min(7, 'Teléfono del negocio inválido')
    .max(15, 'Teléfono del negocio inválido')
    .optional(),

  description: z
    .string()
    .min(20, 'Descripción debe tener al menos 20 caracteres')
    .max(1000, 'Descripción muy larga')
    .optional(),

  logo: z
    .string()
    .url('Logo debe ser una URL válida')
    .optional(),

  municipality: z.nativeEnum(Municipality, {
    message: 'Municipio inválido'
  }),

  address: z
    .string()
    .min(5, 'Dirección debe tener al menos 5 caracteres')
    .max(200, 'Dirección muy larga'),
});

export type VendorProfileUpdateInput = z.infer<typeof vendorProfileUpdateSchema>;

//  ========== ESQUEMA DE ACTUALIZACIÓN DE ROL (ADMIN) ==========
export const roleUpdateSchema = z.object({
  newRole: z.nativeEnum(UserRole, {
    message: "Rol inválido",
  }),
  reason: z.string().min(10, "La razón debe tener al menos 10 caracteres."),
});

export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo centraliza todas las validaciones de datos relacionadas con
 * los usuarios utilizando la librería Zod. Define esquemas para diferentes
 * casos de uso (registro, login, solicitud de albergue, etc.), asegurando
 * que los datos sean consistentes y cumplan con las reglas de negocio
 * tanto en el frontend como en el backend.
 *
 * Lógica Clave:
 * - 'registerUserSchema': Define las reglas para el registro de un
 *   adoptante estándar, incluyendo validaciones de formato de email,
 *   longitud de contraseña y la edad mínima de 18 años, que se calcula
 *   dinámicamente usando '.refine'.
 * - 'shelterApplicationSchema': Es un esquema más complejo que combina
 *   datos del representante legal (similares a 'registerUserSchema') con
 *   datos específicos del albergue (nombre, NIT, etc.).
 *   - 'Validación de NIT': Utiliza una expresión regular para asegurar que
 *     el formato del NIT sea correcto.
 *   - 'Validación Condicional de Contacto': Emplea '.refine' a nivel de
 *     objeto para hacer cumplir la regla de negocio de que al menos un
 *     método de contacto (WhatsApp o Instagram) debe ser proporcionado.
 * - 'Inferencia de Tipos': Se exportan tipos de TypeScript inferidos de
 *   los esquemas (ej: 'RegisterUserInput'). Esto promueve el 'type-safety'
 *   y reduce la duplicación de código, ya que los tipos se derivan
 *   automáticamente de las validaciones.
 *
 * Dependencias Externas:
 * - 'zod': La librería principal para la declaración y ejecución de los
 *   esquemas de validación.
 * - '@prisma/client': Se importa 'Municipality' y 'UserRole' para
 *   utilizar los enums de la base de datos directamente en los esquemas,
 *   asegurando la consistencia entre la validación y el modelo de datos.
 *
 */
