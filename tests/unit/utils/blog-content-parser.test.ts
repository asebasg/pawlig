import { describe, it, expect } from "vitest";
import { parseBlogContent, slugifyHeading, extractImageUrlsFromHtml } from "@/lib/utils/blog-content-parser";

/**
 * Pruebas unitarias: blog-content-parser
 * Descripción: Verifica la correcta extracción de encabezados, asignación de IDs únicos,
 *   clases de margen de scroll y extracción de URLs de imágenes en artículos.
 * Requiere: Vitest.
 * Implementa: Pruebas unitarias de HU-Blog / Scroll Progress & Cloudinary cleanup.
 */

describe("blog-content-parser", () => {
  describe("slugifyHeading", () => {
    it("converts regular text to clean kebab-case", () => {
      expect(slugifyHeading("Guía de Adopción Responsable")).toBe("guia-de-adopcion-responsable");
    });

    it("handles accents, punctuation and special characters", () => {
      expect(slugifyHeading("¿Cómo cuidar a tu cachorro en 2026?")).toBe("como-cuidar-a-tu-cachorro-en-2026");
    });

    it("provides fallback for empty or non-alphanumeric text", () => {
      expect(slugifyHeading("???")).toBe("seccion");
      expect(slugifyHeading("")).toBe("seccion");
    });
  });

  describe("extractImageUrlsFromHtml", () => {
    it("returns empty array for empty or falsy HTML", () => {
      expect(extractImageUrlsFromHtml("")).toEqual([]);
      expect(extractImageUrlsFromHtml(null as unknown as string)).toEqual([]);
    });

    it("extracts image URLs embedded in img tags", () => {
      const html = `
        <p>Texto</p>
        <img src="https://res.cloudinary.com/demo/image/upload/pawlig/blog/img1.png" alt="Img 1" />
        <p>Más texto</p>
        <img class="w-full" src="https://res.cloudinary.com/demo/image/upload/pawlig/blog/img2.jpg">
      `;
      const urls = extractImageUrlsFromHtml(html);
      expect(urls).toEqual([
        "https://res.cloudinary.com/demo/image/upload/pawlig/blog/img1.png",
        "https://res.cloudinary.com/demo/image/upload/pawlig/blog/img2.jpg",
      ]);
    });

    it("avoids duplicate URLs", () => {
      const html = `
        <img src="https://res.cloudinary.com/demo/image/upload/pawlig/blog/img1.png" />
        <img src="https://res.cloudinary.com/demo/image/upload/pawlig/blog/img1.png" />
      `;
      expect(extractImageUrlsFromHtml(html)).toEqual([
        "https://res.cloudinary.com/demo/image/upload/pawlig/blog/img1.png",
      ]);
    });
  });

  describe("parseBlogContent", () => {
    it("returns empty structure when html is empty or falsy", () => {
      expect(parseBlogContent("")).toEqual({ contentWithIds: "", sections: [] });
      expect(parseBlogContent(null as unknown as string)).toEqual({ contentWithIds: "", sections: [] });
    });

    it("extracts h2 and h3 headings and assigns unique ids", () => {
      const html = `
        <h2>Introducción</h2>
        <p>Texto de bienvenida.</p>
        <h3>Requisitos Previos</h3>
        <p>Lista de requisitos.</p>
        <h2>Conclusión</h2>
        <p>Despedida.</p>
      `;

      const result = parseBlogContent(html);

      expect(result.sections).toHaveLength(3);
      expect(result.sections[0]).toEqual({
        id: "introduccion",
        label: "Introducción",
      });
      expect(result.sections[1]).toEqual({
        id: "requisitos-previos",
        label: "Requisitos Previos",
      });
      expect(result.sections[2]).toEqual({
        id: "conclusion",
        label: "Conclusión",
      });

      expect(result.contentWithIds).toContain('id="introduccion"');
      expect(result.contentWithIds).toContain('id="requisitos-previos"');
      expect(result.contentWithIds).toContain('id="conclusion"');
      expect(result.contentWithIds).toContain('class="scroll-mt-20"');
    });

    it("handles duplicate heading names by appending counter suffixes", () => {
      const html = `
        <h2>Recomendaciones</h2>
        <p>Parte 1</p>
        <h2>Recomendaciones</h2>
        <p>Parte 2</p>
      `;

      const result = parseBlogContent(html);

      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].id).toBe("recomendaciones");
      expect(result.sections[1].id).toBe("recomendaciones-1");
      expect(result.contentWithIds).toContain('id="recomendaciones"');
      expect(result.contentWithIds).toContain('id="recomendaciones-1"');
    });

    it("strips nested html tags inside headings for clean labels", () => {
      const html = `<h2><strong>1. Alimentación</strong> y <em>Cuidados</em></h2>`;
      const result = parseBlogContent(html);

      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].label).toBe("1. Alimentación y Cuidados");
      expect(result.sections[0].id).toBe("1-alimentacion-y-cuidados");
      expect(result.contentWithIds).toContain('<strong>1. Alimentación</strong>');
    });

    it("preserves existing classes and appends scroll-mt-20 without duplicating", () => {
      const html = `<h2 class="text-xl font-bold">Título con clase</h2>`;
      const result = parseBlogContent(html);

      expect(result.contentWithIds).toContain('class="text-xl font-bold scroll-mt-20"');
    });
  });
});
