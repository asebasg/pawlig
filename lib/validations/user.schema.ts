import { z } from "zod";
import { Municipality, UserRole } from "@prisma/client";

/**
 * Ruta/Componente/Servicio: Esquemas de Usuario
 * Descripción: Define los esquemas de validación de Zod para las operaciones relacionadas con los usuarios, como registro, login y actualizaciones de perfil.
 * Requiere: -
 * Implementa: HU-001, HU-002, RN-001, RN-013
 */

export const registerUserSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email es requerido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener mínimo 8 caracteres")
    .max(100, "La contraseña es muy larga"),

  name: z
    .string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre muy largo"),

  phone: z
    .string()
    .min(7, "Teléfono inválido")
    .max(15, "Teléfono inválido"),

  municipality: z.nativeEnum(Municipality, {
    message: "Municipio inválido"
  }),

  address: z
    .string()
    .min(5, "Dirección debe tener al menos 5 caracteres")
    .max(200, "Dirección muy larga"),

  idNumber: z
    .string()
    .min(5, "Número de identificación inválido")
    .max(20, "Número de identificación inválido"),

  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "Debes ser mayor de 18 años"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email es requerido"),

  password: z
    .string()
    .min(1, "Contraseña es requerida"),
});

export const shelterApplicationSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email es requerido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener mínimo 8 caracteres")
    .max(100, "La contraseña es muy larga"),

  name: z
    .string()
    .min(2, "Nombre completo del representante requerido")
    .max(100, "Nombre muy largo"),

  phone: z
    .string()
    .min(7, "Teléfono inválido")
    .max(15, "Teléfono inválido"),

  municipality: z.nativeEnum(Municipality, {
    message: "Municipio de residencia del representante inválido"
  }),

  address: z
    .string()
    .min(5, "Dirección personal del representante requerida")
    .max(200, "Dirección muy larga"),

  idNumber: z
    .string()
    .min(5, "Número de identificación del representante requerido")
    .max(20, "Número de identificación inválido"),

  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "El representante debe ser mayor de 18 años"),

  shelterName: z
    .string()
    .min(3, "Nombre del albergue requerido")
    .max(100, "Nombre muy largo"),

  shelterNit: z
    .string()
    .regex(
      /^[0-9]{9}-[0-9]$/,
      "NIT inválido. Formato esperado: 900123456-7 (9 dígitos + guion + dígito de verificación)"
    )
    .min(11, "NIT debe tener 11 caracteres (ejemplo: 900123456-7)")
    .max(11, "NIT debe tener 11 caracteres (ejemplo: 900123456-7)"),

  shelterMunicipality: z.nativeEnum(Municipality, {
    message: "Municipio donde opera el albergue es requerido"
  }),

  shelterAddress: z
    .string()
    .min(5, "Dirección física del albergue requerida")
    .max(200, "Dirección muy larga"),

  shelterDescription: z
    .string()
    .min(20, "Descripción debe tener al menos 20 caracteres")
    .max(500, "Descripción muy larga")
    .optional(),

  contactWhatsApp: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Número de WhatsApp inválido (debe incluir código de país)")
    .optional(),

  contactInstagram: z
    .string()
    .regex(/^@?[a-zA-Z0-9._]{1,30}$/, "Usuario de Instagram inválido")
    .optional(),
})
  .refine(
    (data) => data.contactWhatsApp || data.contactInstagram,
    {
      message: "Debes proporcionar al menos un método de contacto (WhatsApp o Instagram)",
      path: ["contactWhatsApp"],
    }
  );

//  ========== ESQUEMA DE SOLICITUD DE VENDEDOR ==========
export const vendorApplicationSchema = z.object({
  //  ===== DATOS DEL USUARIO VENDEDOR =====
  email: z
    .string()
    .email("Email inválido")
    .min(1, "Email es requerido"),

  password: z
    .string()
    .min(8, "La contraseña debe tener mínimo 8 caracteres") // RN-001
    .max(100, "La contraseña es muy larga"),

  name: z
    .string()
    .min(2, "Nombre completo del vendedor requerido")
    .max(100, "Nombre muy largo"),

  phone: z
    .string()
    .min(7, "Teléfono inválido")
    .max(15, "Teléfono inválido"),

  municipality: z.nativeEnum(Municipality, {
    message: "Municipio de residencia del vendedor inválido"
  }),

  address: z
    .string()
    .min(5, "Dirección personal del vendedor requerida")
    .max(200, "Dirección muy larga"),

  idNumber: z
    .string()
    .min(5, "Número de identificación del vendedor requerido")
    .max(20, "Número de identificación inválido"),

  birthDate: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
    }, "El vendedor debe ser mayor de 18 años"),

  //  ===== DATOS DEL NEGOCIO =====
  businessName: z
    .string()
    .min(3, "Nombre del negocio requerido")
    .max(100, "Nombre muy largo"),

  businessDescription: z
    .string()
    .min(20, "Descripción debe tener al menos 20 caracteres")
    .max(500, "Descripción muy larga")
    .optional(),

  businessMunicipality: z.nativeEnum(Municipality, {
    message: "Municipio donde opera el negocio es requerido"
  }),

  businessAddress: z
    .string()
    .min(5, "Dirección física del negocio requerida")
    .max(200, "Dirección muy larga"),

  businessPhone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Número inválido (debe incluir código de país)")
    .optional(),
})
  // Validación personalizada: Al menos un método de contacto requerido (RN-013)
  .refine(
    (data) => data.businessPhone,
    {
      message: "El teléfono de contacto del negocio es requerido",
      path: ["businessPhone"],
    }
  );

//  ========== ESQUEMA DE ACTUALIZACIÓN DE PERFIL DE VENDEDOR ==========
export const vendorProfileUpdateSchema = z.object({
  businessName: z
    .string()
    .min(3, "Nombre del negocio debe tener al menos 3 caracteres")
    .max(100, "Nombre del negocio muy largo"),

  businessPhone: z
    .string()
    .min(7, "Teléfono del negocio inválido")
    .max(15, "Teléfono del negocio inválido")
    .optional(),

  description: z
    .string()
    .min(20, "Descripción debe tener al menos 20 caracteres")
    .max(1000, "Descripción muy larga")
    .optional(),

  logo: z
    .string()
    .url("Logo debe ser una URL válida")
    .optional(),

  municipality: z.nativeEnum(Municipality, {
    message: "Municipio inválido"
  }),

  address: z
    .string()
    .min(5, "Dirección debe tener al menos 5 caracteres")
    .max(200, "Dirección muy larga"),
});

export const roleUpdateSchema = z.object({
  newRole: z.nativeEnum(UserRole, {
    message: "Rol inválido",
  }),
  reason: z.string().min(10, "La razón debe tener al menos 10 caracteres."),
});

//  ========== TIPOS TYPESCRIPT INFERIDOS ==========
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ShelterApplicationInput = z.infer<typeof shelterApplicationSchema>;
export type VendorApplicationInput = z.infer<typeof vendorApplicationSchema>;
export type VendorProfileUpdateInput = z.infer<typeof vendorProfileUpdateSchema>;
export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo agrupa todos los esquemas de validación de Zod relacionados
 * con la gestión de usuarios y sus perfiles. Es una pieza clave para
 * garantizar la integridad y el formato correcto de los datos que entran
 * al sistema a través de formularios y endpoints de API.
 *
 * Lógica Clave:
 * - registerUserSchema: Valida el formulario de registro para nuevos
 *   adoptantes. Incluye la regla de negocio RN-001 para la longitud
 *   mínima de la contraseña y una validación de edad mínima de 18 años.
 * - shelterApplicationSchema: Un esquema complejo que combina datos de un
 *   usuario representante y los datos específicos del albergue. Utiliza
 *   el método refine para aplicar la regla RN-013, que exige al menos un
 *   método de contacto (WhatsApp o Instagram).
 * - Expresiones Regulares (regex): Se utilizan para validaciones de
 *   formato precisas, como en shelterNit para el NIT colombiano y en
 *   contactWhatsApp para números de teléfono internacionales.
 * - Centralización de Tipos: Los tipos TypeScript se infieren de los esquemas
 *   y se exportan al final del archivo para evitar duplicidad y mantener la
 *   consistencia en toda la aplicación.
 *
 * Dependencias Externas:
 * - zod: Para la creación de todos los esquemas de validación.
 * - @prisma/client: Para los enums Municipality y UserRole, que
 *   mantienen la consistencia con las opciones definidas en la base de datos.
 *
 */
