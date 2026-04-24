/**
 * scripts/test-live-emails.ts
 * Script para probar el envío real de correos en PawLig
 *
 * Uso: npx tsx scripts/test-live-emails.ts <tu-email> [tipo]
 */
import {
  sendPasswordResetEmail,
  sendAdoptionStatusEmail,
  sendNewAdoptionRequestEmail,
  sendUserBlockStatusEmail,
  sendShelterApprovalEmail,
  sendShelterRejectionEmail,
  sendVendorApprovalEmail,
  sendVendorRejectionEmail,
  sendOrderConfirmationEmail,
  sendNewSaleEmail,
  sendOrderStatusUpdateEmail,
} from "../lib/services/email.service";

async function runTests() {
  const targetEmail = process.argv[2];
  const testType = process.argv[3];

  if (!targetEmail) {
    console.error(
      "\x1b[31m❌ Error: Debes proporcionar un email de destino.\x1b[0m",
    );
    console.log(
      "Uso: npx tsx scripts/test-live-emails.ts mi@correo.com [tipo]",
    );
    console.log(
      "\nTipos disponibles: auth, adoption, new-adoption, block, shelter-ok, shelter-no, vendor-ok, vendor-no, order-ok, sale, order-status",
    );
    process.exit(1);
  }

  console.log(
    `\x1b[35m🚀 Iniciando pruebas de email para:\x1b[0m \x1b[1m${targetEmail}\x1b[0m\n`,
  );

  const tests: Record<string, () => Promise<any>> = {
    auth: () =>
      sendPasswordResetEmail({
        to: targetEmail,
        userName: "Usuario de Prueba",
        resetUrl: "https://pawlig.com/reset-password?token=test-123",
      }),
    adoption: () =>
      sendAdoptionStatusEmail({
        to: targetEmail,
        adopterName: "Juan Adoptante",
        petName: "Luna",
        status: "APPROVED",
        shelterName: "Refugio San Roque",
      }),
    "new-adoption": () =>
      sendNewAdoptionRequestEmail({
        to: targetEmail,
        shelterName: "Refugio San Roque",
        adopterName: "Maria Adoptante",
        petName: "Max",
        adoptionId: "adopt-999",
      }),
    block: () =>
      sendUserBlockStatusEmail({
        to: targetEmail,
        userName: "Usuario Bloqueado",
        action: "BLOCK",
        reason:
          "Incumplimiento recurrente de los términos de servicio sobre el trato a las mascotas.",
      }),
    "shelter-ok": () =>
      sendShelterApprovalEmail({
        to: targetEmail,
        representativeName: "Admin Refugio",
        shelterName: "Vida Animal",
        loginUrl: "https://pawlig.com/login",
      }),
    "shelter-no": () =>
      sendShelterRejectionEmail({
        to: targetEmail,
        representativeName: "Admin Refugio",
        shelterName: "Vida Animal",
        rejectionReason:
          "La documentación del NIT proporcionada está vencida o no es legible.",
      }),
    "vendor-ok": () =>
      sendVendorApprovalEmail({
        to: targetEmail,
        userName: "Carlos Vendedor",
        businessName: "PetShop Central",
        loginUrl: "https://pawlig.com/login",
      }),
    "vendor-no": () =>
      sendVendorRejectionEmail({
        to: targetEmail,
        userName: "Carlos Vendedor",
        businessName: "PetShop Central",
        rejectionReason:
          "No se pudo verificar la dirección física del establecimiento comercial.",
      }),
    "order-ok": () =>
      sendOrderConfirmationEmail({
        to: targetEmail,
        userName: "Cliente Feliz",
        orderId: "ord-123456789",
        totalAmount: 150000,
        products: [
          { name: "Cama Premium XL", quantity: 1 },
          { name: "Juguete Mordedor", quantity: 2 },
        ],
      }),
    sale: () =>
      sendNewSaleEmail({
        to: targetEmail,
        vendorName: "PetShop Central",
        orderId: "ord-123456789",
        productsSold: [{ name: "Cama Premium XL", quantity: 1 }],
      }),
    "order-status": () =>
      sendOrderStatusUpdateEmail({
        to: targetEmail,
        userName: "Cliente Feliz",
        orderId: "ord-123456789",
        newStatus: "SHIPPED",
        trackingNumber: "PAW-XYZ-987",
      }),
  };

  if (testType) {
    if (tests[testType]) {
      console.log(`\x1b[34mTesting [${testType}]...\x1b[0m`);
      const res = await tests[testType]();
      console.log(
        res.success
          ? "\x1b[32m✅ Enviado exitosamente\x1b[0m"
          : "\x1b[31m❌ Falló el envío\x1b[0m",
        res.error || "",
      );
    } else {
      console.error(`\x1b[31m❌ El tipo [${testType}] no existe.\x1b[0m`);
    }
  } else {
    console.log("\x1b[33mEnviando todos los tipos de prueba...\x1b[0m");
    for (const [name, fn] of Object.entries(tests)) {
      process.stdout.write(`- Enviando ${name}: `);
      const res = await fn();
      console.log(
        res.success ? "\x1b[32m✅ OK\x1b[0m" : "\x1b[31m❌ Error\x1b[0m",
      );
    }
  }

  console.log("\n\x1b[35m✨ Pruebas finalizadas.\x1b[0m");
}

runTests().catch(console.error);
