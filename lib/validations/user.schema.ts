import { z } from 'zod';
import { Municipality, UserRole } from '@prisma/client'

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

//  ========== ESQUEMA DE SOLICITUD DE VENDEDOR ==========
export const vendorApplicationSchema = z.object({
  //  ===== DATOS DEL USUARIO VENDEDOR =====
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
    .min(2, 'Nombre completo del vendedor requerido')
    .max(100, 'Nombre muy largo'),

  phone: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(15, 'Teléfono inválido'),

  municipality: z.nativeEnum(Municipality, {
    message: 'Municipio de residencia del vendedor inválido'
  }),

  address: z
    .string()
    .min(5, 'Dirección personal del vendedor requerida')
    .max(200, 'Dirección muy larga'),

  idNumber: z
    .string()
    .min(5, 'Número de identificación del vendedor requerido')
    .max(20, 'Número de identificación inválido'),

  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, 'El vendedor debe ser mayor de 18 años'),

  //  ===== DATOS DEL NEGOCIO =====
  businessName: z
    .string()
    .min(3, 'Nombre del negocio requerido')
    .max(100, 'Nombre muy largo'),

  businessDescription: z
    .string()
    .min(20, 'Descripción debe tener al menos 20 caracteres')
    .max(500, 'Descripción muy larga')
    .optional(),

  businessMunicipality: z.nativeEnum(Municipality, {
    message: 'Municipio donde opera el negocio es requerido'
  }),

  businessAddress: z
    .string()
    .min(5, 'Dirección física del negocio requerida')
    .max(200, 'Dirección muy larga'),

  businessPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Número inválido (debe incluir código de país)')
    .optional(),
})
  // Validación personalizada: Al menos un método de contacto requerido (RN-013)
  .refine(
    (data) => data.businessPhone,
    {
      message: 'El teléfono de contacto del negocio es requerido',
      path: ['businessPhone'],
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

/**
 * 📚 NOTAS DE IMPLEMENTACIÓN:
 * 
 * 1. ESQUEMA DE SOLICITUD DE ALBERGUE (shelterApplicationSchema):
 *    - NUEVO: Agregado para HU-002 (Solicitud y aprobación de cuenta)
 *    - Combina datos del usuario representante + datos del albergue
 *    - Validaciones estrictas para garantizar integridad de datos
 * 
 * 2. VALIDACIÓN DE NIT:
 *    - Formato: Solo números y guiones (ej. "123456789-0")
 *    - Opcional: Algunos albergues pequeños pueden no tener NIT formal
 *    - Si se proporciona, debe ser único (validado en el backend)
 * 
 * 3. VALIDACIÓN DE CONTACTOS (RN-013):
 *    - Al menos UN método de contacto obligatorio (WhatsApp o Instagram)
 *    - WhatsApp: Formato internacional +57300... (10-15 dígitos)
 *    - Instagram: Usuario válido (@username o username, máx 30 chars)
 *    - Validación con .refine() después del schema principal
 * 
 * 4. DIFERENCIAS CON REGISTRO DE ADOPTANTE:
 *    Adoptante:
 *      - Datos personales únicamente
 *      - Rol asignado automáticamente: ADOPTER
 *    
 *    Albergue:
 *      - Datos personales del representante
 *      - Datos del albergue (nombre, NIT, dirección, contactos)
 *      - Rol asignado: SHELTER
 *      - Estado inicial: verified = false (requiere aprobación)
 * 
 * 5. MENSAJES DE ERROR:
 *    - Claros y específicos para cada campo
 *    - Ayudan al usuario a corregir datos sin frustración
 *    - Ejemplo: "Número de WhatsApp inválido (debe incluir código de país)"
 * 
 * 6. TRAZABILIDAD:
 *    - HU-002: Solicitud y aprobación de cuenta de albergue ✅
 *    - RF-007: Administración de albergues ✅
 *    - RN-001: Contraseña mínima 8 caracteres ✅
 *    - RN-013: Al menos un contacto válido requerido ✅
 * 
 * 7. USO EN EL CÓDIGO:
 *    - Frontend: components/forms/shelter-request-form.tsx
 *      → shelterApplicationSchema.parse(formData)
 *    
 *    - Backend: app/api/auth/request-shelter-account/route.ts
 *      → shelterApplicationSchema.parse(body)
 *    
 *    - Tipado: ShelterApplicationInput para type-safety en TypeScript
 * 
 * 8. CONSISTENCIA:
 *    - Usa los mismos municipios del enum Municipality (Prisma)
 *    - Validaciones de edad y teléfono reutilizadas del registerUserSchema
 *    - Formato de contraseña idéntico (RN-001)
 */
