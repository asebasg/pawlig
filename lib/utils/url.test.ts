import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAppBaseUrl } from "./url";

/**
 * Descripción: Tests unitarios para el helper getAppBaseUrl.
 * Cubre los 4 escenarios de resolución de URL base del entorno.
 */

describe("getAppBaseUrl", () => {
  // Guarda y restaura las variables de entorno entre tests para evitar contaminación
  let originalNextPublicAppUrl: string | undefined;
  let originalVercelUrl: string | undefined;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    originalNextPublicAppUrl = process.env.NEXT_PUBLIC_APP_URL;
    originalVercelUrl = process.env.VERCEL_URL;
    originalNodeEnv = process.env.NODE_ENV;

    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_URL;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = originalNextPublicAppUrl;
    process.env.VERCEL_URL = originalVercelUrl;
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("debería usar NEXT_PUBLIC_APP_URL si está definida", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://pawlig.lat";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("debería eliminar la barra final de NEXT_PUBLIC_APP_URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://pawlig.lat/";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("debería usar VERCEL_URL con prefijo https:// cuando NEXT_PUBLIC_APP_URL no está definida", () => {
    process.env.VERCEL_URL = "pawlig-git-feature-abc123.vercel.app";
    expect(getAppBaseUrl()).toBe("https://pawlig-git-feature-abc123.vercel.app");
  });

  it("debería devolver localhost en entorno de desarrollo sin otras variables", () => {
    process.env.NODE_ENV = "development";
    expect(getAppBaseUrl()).toBe("http://localhost:3000");
  });

  it("debería devolver el dominio de producción como último fallback", () => {
    process.env.NODE_ENV = "production";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("NEXT_PUBLIC_APP_URL tiene prioridad sobre VERCEL_URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://pawlig.lat";
    process.env.VERCEL_URL = "pawlig-git-feature-abc123.vercel.app";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });
});
