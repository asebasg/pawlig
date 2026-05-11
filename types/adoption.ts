import { Prisma } from "@prisma/client";

/**
 * Tipo para la vista del albergue (incluye adoptante)
 * Se utiliza en el panel de gestión de postulaciones para albergues.
 */
export type ShelterAdoption = Prisma.AdoptionGetPayload<{
  include: { 
    adopter: { 
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true, 
        municipality: true 
      } 
    },
    pet: true 
  }
}>;

/**
 * Tipo para la vista del adoptante (incluye mascota y albergue)
 * Se utiliza en el panel de usuario para ver el estado de sus solicitudes.
 */
export type UserAdoption = Prisma.AdoptionGetPayload<{
  include: { 
    pet: { 
      include: { 
        shelter: {
          select: {
            id: true,
            name: true,
            municipality: true,
            contactWhatsApp: true,
            contactInstagram: true
          }
        } 
      } 
    } 
  }
}>;

/**
 * Unión de tipos para las respuestas de la API de adopciones
 */
export type AdoptionResult = ShelterAdoption | UserAdoption;
