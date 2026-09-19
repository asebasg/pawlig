import { test, expect } from "@playwright/test";

/**
 * Descripción: Prueba E2E básica para verificar la carga de la página de inicio.
 * Requiere: Servidor web en http://localhost:3000
 * Implementa: Verificación básica de UI
 */

test.describe("Página Principal (Home)", () => {
  test("debe cargar la página principal correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/PawLig/i);
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Prueba inicial de humo (smoke test) para validar que Next.js levanta correctamente
 * y renderiza el título esperado de PawLig.
 *
 */
