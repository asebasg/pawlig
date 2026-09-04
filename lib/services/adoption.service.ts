import { prisma } from "@/lib/utils/db";
import { AdoptionStatus, PetStatus } from "@prisma/client";
import { CreateAdoptionInput } from "../validations/adoption.schema";
import { ShelterAdoption, UserAdoption } from "@/types/adoption";
import {
  sendAdoptionStatusEmail,
  sendNewAdoptionRequestEmail,
} from "./email.service";

/**
 * Servicio: Adopciones
 * Descripción: Maneja la lógica de negocio para las postulaciones de adopción.
 * Requiere: -
 * Implementa: HU-007, RF-011
 */

export const adoptionService = {
  /**
   * Obtiene las postulaciones realizadas por un adoptante
   */
  async getUserAdoptions(userId: string): Promise<UserAdoption[]> {
    return prisma.adoption.findMany({
      where: { adopterId: userId },
      include: {
        pet: {
          include: {
            shelter: {
              select: {
                id: true,
                name: true,
                municipality: true,
                contactWhatsApp: true,
                contactInstagram: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Obtiene las postulaciones recibidas por un albergue
   */
  async getShelterAdoptions(shelterId: string, status?: AdoptionStatus): Promise<ShelterAdoption[]> {
    return prisma.adoption.findMany({
      where: {
        pet: { shelterId },
        ...(status ? { status } : {}),
      },
      include: {
        adopter: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            municipality: true,
          },
        },
        pet: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Crea una nueva postulación de adopción
   */
  async createAdoption(data: CreateAdoptionInput) {
    // Verificar si la mascota existe y está disponible
    const pet = await prisma.pet.findUnique({
      where: { id: data.petId },
      include: { shelter: true },
    });

    if (!pet) {
      throw new Error("Mascota no encontrada");
    }

    if (pet.status !== PetStatus.AVAILABLE) {
      throw new Error("La mascota no está disponible para adopción");
    }

    // Verificar que no exista postulación previa
    const existingAdoption = await prisma.adoption.findUnique({
      where: {
        adopterId_petId: {
          adopterId: data.userId,
          petId: data.petId,
        },
      },
    });

    if (existingAdoption) {
      throw new Error("Ya existe una postulación para esta mascota");
    }

    // Obtener datos del adoptante
    const adopter = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!adopter) {
      throw new Error("Usuario no encontrado");
    }

    // Crear la adopción
    const adoption = await prisma.adoption.create({
      data: {
        adopterId: data.userId,
        petId: data.petId,
        message: data.message,
        status: AdoptionStatus.PENDING,
      },
    });

    // Enviar notificación por correo de forma asíncrona (RN-012)
    const shelterUser = await prisma.user.findUnique({
      where: { id: pet.shelter.userId },
    });

    if (shelterUser) {
      sendNewAdoptionRequestEmail({
        to: shelterUser.email,
        shelterName: pet.shelter.name,
        adopterName: adopter.name,
        petName: pet.name,
        adoptionId: adoption.id,
      })
        .then((res) => {
          if (!res.success) console.error("[ERROR] Fallo al enviar correo de nueva adopción (API/Resend):", res.error);
        })
        .catch((e) => console.error("[ERROR] Excepción enviando correo de nueva adopción:", e));
    }

    return adoption;
  },

  /**
   * Actualiza el estado de una postulación (Aprobar/Rechazar)
   */
  async updateAdoptionStatus(
    id: string,
    status: AdoptionStatus,
    rejectionReason?: string
  ) {
    const adoption = await prisma.adoption.findUnique({
      where: { id },
      include: {
        pet: { include: { shelter: true } },
        adopter: true,
      },
    });

    if (!adoption) {
      throw new Error("Postulación no encontrada");
    }

    // Si se aprueba, usar transacción para actualizar mascota y rechazar las demás
    if (status === AdoptionStatus.APPROVED) {
      const [, updatedAdoption] = await prisma.$transaction([
        // Cambiar estado de la mascota
        prisma.pet.update({
          where: { id: adoption.petId },
          data: { status: PetStatus.IN_PROCESS },
        }),
        // Actualizar la postulación aprobada
        prisma.adoption.update({
          where: { id },
          data: { status, message: rejectionReason },
        }),
        // Rechazar o marcar como no disponibles otras postulaciones
        prisma.adoption.updateMany({
          where: {
            petId: adoption.petId,
            id: { not: id },
            status: AdoptionStatus.PENDING,
          },
          data: {
            status: AdoptionStatus.REJECTED,
            message: "La mascota fue asignada a otro adoptante.",
          },
        }),
      ]);

      // Enviar correo al adoptante aprobado
      sendAdoptionStatusEmail({
        to: adoption.adopter.email,
        adopterName: adoption.adopter.name,
        petName: adoption.pet.name,
        shelterName: adoption.pet.shelter.name,
        status: "APPROVED",
      })
        .then((res) => {
          if (!res.success) console.error("[ERROR] Fallo al enviar correo de adopción aprobada (API/Resend):", res.error);
        })
        .catch((e) => console.error("[ERROR] Excepción enviando correo de adopción aprobada:", e));

      return updatedAdoption;
    }

    // Si se rechaza
    const updatedAdoption = await prisma.adoption.update({
      where: { id },
      data: { status, message: rejectionReason },
    });

    // Enviar correo de rechazo
    sendAdoptionStatusEmail({
      to: adoption.adopter.email,
      adopterName: adoption.adopter.name,
      petName: adoption.pet.name,
      shelterName: adoption.pet.shelter.name,
      status: "REJECTED",
      rejectionReason: rejectionReason || "No cumple con los requisitos del albergue.",
    })
      .then((res) => {
        if (!res.success) console.error("[ERROR] Fallo al enviar correo de adopción rechazada (API/Resend):", res.error);
      })
      .catch((e) => console.error("[ERROR] Excepción enviando correo de adopción rechazada:", e));

    return updatedAdoption;
  },
};

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Este archivo encapsula la lógica de negocio para gestionar postulaciones
 * de adopción, aislando las interacciones con la base de datos y servicios
 * externos (como el envío de emails).
 *
 * Lógica Clave:
 * - Tipado Estricto: Usa interfaces generadas a partir del payload de Prisma
 *   para garantizar que no haya 'any' en el flujo de datos.
 * - createAdoption: Verifica disponibilidad de la mascota y existencia de 
 *   postulaciones previas. Notifica al albergue asíncronamente.
 * - updateAdoptionStatus: Si se aprueba una adopción, utiliza una
 *   transacción de Prisma para asegurar la atomicidad: aprueba la
 *   solicitud, cambia el estado de la mascota a IN_PROCESS y rechaza
 *   automáticamente el resto de postulaciones pendientes para esa mascota.
 *
 * Dependencias Externas:
 * - '@prisma/client' y la instancia de Prisma.
 * - 'email.service.ts' para el envío de notificaciones asíncronas.
 *
 */
