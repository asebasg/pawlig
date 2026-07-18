import { PrismaClient } from "@prisma/client";
import cloudinary from "../lib/cloudinary";
import { extractPublicId } from "../lib/utils/cloudinary-helpers";

/**
 * Script de mantenimiento para identificar y eliminar imágenes de Cloudinary que
 * ya no están asociadas a mascotas ni productos registrados en la base de datos.
 * Se ejecuta de forma manual y está pensado para liberar espacio cuando queden
 * recursos huérfanos tras operaciones incompletas.
 */

const prisma = new PrismaClient();

// Constantes
const HOURS_CUTOFF = 48;
const MAX_RESULTS_PER_PAGE = 500; // Máximo permitido por Cloudinary Search API

async function main() {
  console.log(`\n=============================================`);
  console.log(`🧹 Iniciando limpieza de imágenes huérfanas...`);
  console.log(`=============================================\n`);

  try {
    // 1. Calcular fecha de corte (hace 48 horas)
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - HOURS_CUTOFF);
    const cutoffIso = cutoffDate.toISOString();

    console.log(`Buscando imágenes subidas antes de: ${cutoffIso}`);

    // 2. Obtener todas las imágenes referenciadas en la base de datos
    console.log(`\nConsultando base de datos para construir lista de imágenes activas...`);
    
    // Optimizamos obteniendo solo el campo 'images'
    const pets = await prisma.pet.findMany({ select: { images: true } });
    const products = await prisma.product.findMany({ select: { images: true } });

    // Construir un Set con todos los public_ids activos para búsqueda O(1)
    const activePublicIds = new Set<string>();
    
    for (const pet of pets) {
      for (const url of pet.images) {
        const pid = extractPublicId(url);
        if (pid) activePublicIds.add(pid);
      }
    }
    
    for (const product of products) {
      for (const url of product.images) {
        const pid = extractPublicId(url);
        if (pid) activePublicIds.add(pid);
      }
    }

    console.log(`-> Se encontraron ${activePublicIds.size} imágenes activas referenciadas en la BD.`);

    // 3. Buscar en Cloudinary por lotes
    let nextCursor: string | undefined = undefined;
    let totalScanned = 0;
    const toDelete: string[] = [];

    console.log(`\nConsultando API de Cloudinary...`);
    
    // Expresión de búsqueda: imágenes antiguas
    // (Filtramos manualmente las carpetas de PawLig por si la cuenta tiene otros proyectos)
    const searchExpr = `resource_type:image AND uploaded_at<${cutoffIso}`;

    do {
      const result: any = await cloudinary.search
        .expression(searchExpr)
        .max_results(MAX_RESULTS_PER_PAGE)
        .next_cursor(nextCursor)
        .execute();

      const resources = result.resources || [];
      totalScanned += resources.length;
      nextCursor = result.next_cursor;

      for (const resource of resources) {
        const publicId = resource.public_id;
        
        // Filtro de seguridad: solo tocar imágenes de las carpetas de este proyecto
        if (!publicId.startsWith("pawlig/") && 
            !publicId.startsWith("pawlig-dev/") && 
            !publicId.startsWith("pawlig-prod/")) {
          continue;
        }

        // Si no está en el Set de activos, es huérfana
        if (!activePublicIds.has(publicId)) {
          toDelete.push(publicId);
        }
      }
    } while (nextCursor);

    console.log(`-> Se escanearon ${totalScanned} imágenes antiguas en Cloudinary.`);

    // 4. Eliminar las imágenes huérfanas encontradas
    if (toDelete.length === 0) {
      console.log(`\n✨ No se encontraron imágenes huérfanas. ¡Todo limpio!`);
    } else {
      console.log(`\n🗑️ Se detectaron ${toDelete.length} imágenes huérfanas. Procediendo a eliminar...`);
      
      // Eliminamos en lotes pequeños (Cloudinary Admin API permite hasta 100 por petición en bulk)
      const BATCH_SIZE = 100;
      let deletedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
        const batch = toDelete.slice(i, i + BATCH_SIZE);
        try {
          await cloudinary.api.delete_resources(batch);
          deletedCount += batch.length;
          console.log(`   Progreso: ${deletedCount}/${toDelete.length} eliminadas...`);
        } catch (error) {
          console.error(`   ❌ Error eliminando lote:`, error);
          errorCount += batch.length;
        }
      }
      
      console.log(`\nResumen de limpieza:`);
      console.log(`✅ Eliminadas: ${deletedCount}`);
      if (errorCount > 0) console.log(`❌ Errores: ${errorCount}`);
    }

    console.log(`\n=============================================`);
    console.log("✅ Script de limpieza completado");
    console.log(`=============================================\n`);

  } catch (error) {
    console.error("\n❌ Error inesperado en el script de limpieza:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
