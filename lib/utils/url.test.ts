import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getAppBaseUrl } from "./url";

/**
 * Descripción: Tests unitarios para el helper getAppBaseUrl.
 * Cubre los 4 escenarios de resolución de URL base del entorno.
 */

describe("getAppBaseUrl", () => {
  // Guarda y restaura las variables de entorno entre tests para evitar contaminación
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };

    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_URL;
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("debería usar NEXT_PUBLIC_APP_URL si está definida", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://pawlig.lat";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("debería eliminar la barra final de NEXT_PUBLIC_APP_URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://pawlig.lat/";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("debería usar pawlig.lat cuando VERCEL_ENV es production (ignorando VERCEL_URL)", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_URL = "pawlig-git-feature.vercel.app";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("debería usar VERCEL_URL con prefijo https:// cuando VERCEL_ENV es preview", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_URL = "pawlig-git-feature-abc123.vercel.app";
    expect(getAppBaseUrl()).toBe("https://pawlig-git-feature-abc123.vercel.app");
  });

  it("debería usar NEXT_PUBLIC_VERCEL_URL como alternativa a VERCEL_URL en preview", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.NEXT_PUBLIC_VERCEL_URL = "pawlig-git-feature-nextpublic.vercel.app";
    expect(getAppBaseUrl()).toBe("https://pawlig-git-feature-nextpublic.vercel.app");
  });

  it("debería devolver localhost en entorno de desarrollo local", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    expect(getAppBaseUrl()).toBe("http://localhost:3000");
  });

  it("debería devolver el dominio de producción como último fallback", () => {
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    expect(getAppBaseUrl()).toBe("https://pawlig.lat");
  });

  it("NEXT_PUBLIC_APP_URL tiene máxima prioridad incluso sobre VERCEL_ENV=production", () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3001";
    process.env.VERCEL_ENV = "production";
    expect(getAppBaseUrl()).toBe("http://localhost:3001");
  });
});
