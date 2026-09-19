import { test, expect } from "@playwright/test";

/**
 * Descripción: Suite de pruebas E2E para auditar visual y funcionalmente las rutas principales de PawLig.
 * Requiere: Servidor web en http://localhost:3000
 * Implementa: Verificación de Navegación, Galería de Adopciones y Tienda de Productos.
 */

test.describe("Auditoría de Rutas Principales de PawLig", () => {
  test("1. Verificación de la Página de Inicio (Home)", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Inicio - PawLig|PawLig/i);
    
    // Verificar que los botones CTA principales de la sección Hero estén visibles
    const ctaBuscarAmigo = page.getByRole("link", { name: "Buscar un amigo" });
    const ctaVerProductos = page.getByRole("link", { name: "Ver Productos" });
    
    await expect(ctaBuscarAmigo).toBeVisible();
    await expect(ctaVerProductos).toBeVisible();
    
    // Tomar captura de pantalla de la home
    await page.screenshot({ path: "e2e/screenshots/home-page.png", fullPage: true });
  });

  test("2. Navegación y Carga de la Galería de Adopciones (/adopciones)", async ({ page }) => {
    await page.goto("/adopciones");
    await expect(page.locator("h1")).toContainText(/Encuentra tu compañero perfecto/i);
    
    await page.screenshot({ path: "e2e/screenshots/adopciones-page.png", fullPage: true });
  });

  test("3. Navegación y Carga de la Tienda de Productos (/productos)", async ({ page }) => {
    await page.goto("/productos");
    await expect(page.locator("h1")).toContainText(/Encuentra productos para tu mascota/i);
    
    await page.screenshot({ path: "e2e/screenshots/productos-page.png", fullPage: true });
  });

  test("4. Verificación de Autenticación - Login (/login)", async ({ page }) => {
    await page.goto("/login");
    await page.screenshot({ path: "e2e/screenshots/login-page.png", fullPage: true });
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Suite completa de inspección visual E2E usando Playwright para auditar la salud de
 * las páginas públicas clave de PawLig y generar capturas de pantalla para evaluación.
 *
 */
