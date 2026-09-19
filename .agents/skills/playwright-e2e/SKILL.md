---
name: playwright-e2e
description: Configura e inicializa el entorno de pruebas E2E con Playwright en PawLig, creando la configuración base, la prueba de humo inicial y los scripts de ejecución. Invocable con /playwright-e2e.
---

# Playwright E2E Skill — PawLig

Esta skill instruye al agente para inicializar, configurar y ejecutar pruebas End-to-End (E2E) con **Playwright** en el proyecto **PawLig**, garantizando la coherencia con las reglas de estilo de [.rules.md](file:///c:/Users/ultra/Proyectos/pawlig/.rules.md) y `DESIGN.md`.

---

## 1. Verificación e Instalación de Dependencias

Antes de ejecutar las pruebas, comprueba si las dependencias necesarias están presentes en `package.json`:

1. **Paquetes en `devDependencies`**:
   - `playwright` (`^1.63.0` o superior).
   - `@playwright/test` (`^1.63.0` o superior).

2. **Instalación si faltan paquetes**:
   ```bash
   npm i -D playwright @playwright/test
   ```

---

## 2. Configuración Estándar (`playwright.config.ts`)

La skill debe garantizar la existencia del archivo de configuración `playwright.config.ts` en la raíz del proyecto con la siguiente estructura estandarizada:

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Usar Google Chrome local para evitar bloqueos CDN en entornos con firewall
        channel: "chrome",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## 3. Estructura de Pruebas Iniciales (`e2e/`)

Toda prueba creada dentro del directorio `e2e/` debe cumplir con las siguientes reglas:
- **Nombres de archivo**: Usar formato `kebab-case.spec.ts` (ejemplo: `home.spec.ts`, `auth.spec.ts`).
- **Encabezados JSDoc y Pie de página**: Incluir cabeceras JSDoc descriptivas y notas de implementación en el pie del archivo según `.rules.md`.
- **Localizadores Semánticos**: Preferir siempre `getByRole`, `getByText` o `getByLabel` sobre selecciones por clase CSS frágil.

### Plantilla de Prueba de Humo (`e2e/home.spec.ts`):

```typescript
import { test, expect } from "@playwright/test";

/**
 * Descripción: Prueba E2E básica para verificar el renderizado y carga de la página de inicio.
 * Requiere: Servidor web en http://localhost:3000
 * Implementa: Verificación básica de UI
 */

test.describe("Página Principal (Home)", () => {
  test("debe cargar la página principal correctamente", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Inicio - PawLig|PawLig/i);

    const ctaBuscarAmigo = page.getByRole("link", { name: "Buscar un amigo" });
    const ctaVerProductos = page.getByRole("link", { name: "Ver Productos" });

    await expect(ctaBuscarAmigo).toBeVisible();
    await expect(ctaVerProductos).toBeVisible();
  });
});

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Prueba inicial de humo (smoke test) para validar que Next.js levanta correctamente
 * y renderiza los elementos visuales clave de la página de inicio.
 *
 */
```

---

## 4. Scripts en `package.json`

Asegúrate de registrar los scripts para la ejecución ágil de pruebas en `package.json`:

```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

---

## 5. Comandos de Ejecución y Auditoría Visual

- **Ejecutar suite completa en consola**:
  ```bash
  npm run test:e2e
  ```

- **Ejecutar con interfaz interactiva**:
  ```bash
  npm run test:e2e:ui
  ```

- **Inspección de capturas visuales**:
  Al fallar o auditar rutas, guardar o visualizar capturas en `e2e/screenshots/` utilizando la herramienta de visualización de archivos de imágenes para análisis multimodal.
