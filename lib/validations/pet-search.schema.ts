import { z } from "zod";
import { Municipality, PetStatus } from "@prisma/client";

// Temporary PetSize enum until Prisma regenerates properly
enum PetSize {
  PEQUEÑO = "PEQUEÑO",
  MEDIANO = "MEDIANO",
  GRANDE = "GRANDE",
}

export const petSearchSchema = z.object({
  species: z.string().optional(),
  size: z.nativeEnum(PetSize).optional(),
  municipality: z.nativeEnum(Municipality).optional(),
  status: z.nativeEnum(PetStatus).default(PetStatus.AVAILABLE),
});

export type PetSearchInput = z.infer<typeof petSearchSchema>;
