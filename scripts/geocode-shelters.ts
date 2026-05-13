import { PrismaClient } from "@prisma/client";
import { geocodeAddress } from "../lib/services/geocoding.service";

const prisma = new PrismaClient();

async function main() {
  try {
    const shelters = await prisma.shelter.findMany({
      where: {
        verified: true,
        latitude: null, // Solo procesar albergues que no tengan coordenadas
      },
    });
    
    console.log(`\n=============================================`);
    console.log(`🐾 Iniciando geocodificación de ${shelters.length} albergues...`);
    console.log(`=============================================\n`);
    
    for (const shelter of shelters) {
      console.log(`Procesando: ${shelter.name}`);
      console.log(`Dirección: ${shelter.address}, ${shelter.municipality}`);
      
      const coords = await geocodeAddress(shelter.address, shelter.municipality);
      
      if (coords) {
        await prisma.shelter.update({
          where: { id: shelter.id },
          data: {
            latitude: coords.lat,
            longitude: coords.lng,
            geocodedAt: new Date(),
          },
        });
        console.log(`✅ Éxito: Coordenadas guardadas -> Lat: ${coords.lat}, Lng: ${coords.lng}\n`);
      } else {
        console.log(`❌ Error: No se pudo geocodificar\n`);
      }
    }
    
    console.log(`=============================================`);
    console.log("✅ Proceso de geocodificación completado");
    console.log(`=============================================`);
  } catch (error) {
    console.error("Error inesperado en el script de geocodificación:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
