import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/utils/db";
import { petSearchSchema } from "@/lib/validations/pet-search.schema";
import { PetStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const queryData = {
      species: searchParams.get("species") || undefined,
      size: searchParams.get("size") || undefined,
      municipality: searchParams.get("municipality") || undefined,
      status: searchParams.get("status") || PetStatus.AVAILABLE,
    };

    // Validate input using Zod schema
    const validationResult = petSearchSchema.safeParse(queryData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Parámetros de búsqueda inválidos",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const filters = validationResult.data;

    // Build Prisma filter object
    const where: any = {
      status: filters.status,
    };

    if (filters.species) {
      where.species = {
        contains: filters.species,
        mode: "insensitive",
      };
    }

    if (filters.size) {
      where.size = filters.size;
    }

    if (filters.municipality) {
      where.shelter = {
        is: {
          municipality: filters.municipality,
        },
      };
    }

    // Query database
    const pets = await prisma.pet.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      count: pets.length,
      pets,
      hasMore: false, // Can be extended for pagination
    });
  } catch (error) {
    console.error("Error in pet search:", error);
    return NextResponse.json(
      { error: "Error al buscar mascotas" },
      { status: 500 }
    );
  }
}
