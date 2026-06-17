/**
 * GET /api/admin/docs/[slug]/pdf
 * Descripción: Genera y retorna un PDF del documento técnico solicitado.
 *              Parsea el HTML procesado por remark y lo convierte a PDF
 *              server-side usando jsPDF + jspdf-autotable.
 * Requiere:    Sesión activa con rol ADMIN.
 * Implementa:  Exportación de documentación en /admin/dev/docs/[slug].
 *
 * NOTA TÉCNICA: jspdf.html() requiere DOM (browser) y no funciona en Node.js.
 *               Se usa parsing manual de HTML → secciones → jsPDF text/autoTable.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { UserRole } from "@prisma/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getDocBySlug } from "@/lib/services/docs.service";

// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------

type DocSection =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "pre"; text: string }
  | { type: "li"; text: string }
  | { type: "table"; head: string[][]; body: string[][] }
  | { type: "hr" };

// ---------------------------------------------------------------------------
// Parser HTML → secciones
// ---------------------------------------------------------------------------

/**
 * Extrae texto plano de un fragmento HTML eliminando todas las etiquetas.
 */
function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|li|td|th|tr)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Parsea una tabla HTML y retorna head y body como arrays de strings.
 */
function parseTable(tableHtml: string): { head: string[][]; body: string[][] } {
  const theadMatch = tableHtml.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
  const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);

  const parseRows = (rowsHtml: string, cellTag: "th" | "td"): string[][] => {
    const rows: string[][] = [];
    const rowMatches = rowsHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) ?? [];
    for (const row of rowMatches) {
      const cellRegex = new RegExp(
        `<${cellTag}[^>]*>([\\s\\S]*?)<\\/${cellTag}>`,
        "gi",
      );
      const cells: string[] = [];
      let cellMatch: RegExpExecArray | null;
      while ((cellMatch = cellRegex.exec(row)) !== null) {
        cells.push(stripTags(cellMatch[1]));
      }
      if (cells.length > 0) rows.push(cells);
    }
    return rows;
  };

  return {
    head: theadMatch ? parseRows(theadMatch[1], "th") : [],
    body: tbodyMatch ? parseRows(tbodyMatch[1], "td") : [],
  };
}

/**
 * Convierte el HTML completo de un documento a una lista ordenada de secciones.
 */
function parseHtmlToSections(html: string): DocSection[] {
  const sections: DocSection[] = [];

  // Tokenizar el HTML en bloques de alto nivel
  const blockPattern =
    /(<h[1-3][^>]*>[\s\S]*?<\/h[1-3]>|<table[\s\S]*?<\/table>|<pre[\s\S]*?<\/pre>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>|<p[^>]*>[\s\S]*?<\/p>|<hr\s*\/?>)/gi;

  let match: RegExpExecArray | null;
  while ((match = blockPattern.exec(html)) !== null) {
    const block = match[1].trim();

    const h1 = block.match(/^<h1[^>]*>([\s\S]*?)<\/h1>$/i);
    const h2 = block.match(/^<h2[^>]*>([\s\S]*?)<\/h2>$/i);
    const h3 = block.match(/^<h3[^>]*>([\s\S]*?)<\/h3>$/i);
    const pre = block.match(/^<pre[^>]*>([\s\S]*?)<\/pre>$/i);
    const table = block.match(/^<table[\s\S]*?<\/table>$/i);
    const list = block.match(/^<[uo]l[^>]*>([\s\S]*?)<\/[uo]l>$/i);
    const hr = block.match(/^<hr\s*\/?>$/i);
    const p = block.match(/^<p[^>]*>([\s\S]*?)<\/p>$/i);

    if (h1) {
      sections.push({ type: "h1", text: stripTags(h1[1]) });
    } else if (h2) {
      sections.push({ type: "h2", text: stripTags(h2[1]) });
    } else if (h3) {
      sections.push({ type: "h3", text: stripTags(h3[1]) });
    } else if (pre) {
      sections.push({
        type: "pre",
        text: stripTags(pre[1]).replace(/\s+/g, " "),
      });
    } else if (table) {
      sections.push({ type: "table", ...parseTable(block) });
    } else if (list) {
      const liMatches = list[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) ?? [];
      for (const li of liMatches) {
        const liText = li.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
        if (liText)
          sections.push({ type: "li", text: "• " + stripTags(liText[1]) });
      }
    } else if (hr) {
      sections.push({ type: "hr" });
    } else if (p) {
      const text = stripTags(p[1]);
      if (text) sections.push({ type: "p", text });
    }
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Generador de PDF
// ---------------------------------------------------------------------------

const PAGE_H = 297;
const PAGE_W = 210;
const MARGIN_L = 15;
const MARGIN_R = 15;
const MARGIN_B = 15;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

/**
 * Genera un PDF a partir del título y las secciones parseadas del documento.
 * Retorna el resultado como Buffer para enviarlo en la respuesta HTTP.
 */
function generateDocPdf(title: string, sections: DocSection[]): Buffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = 20;

  const checkPageBreak = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN_B) {
      doc.addPage();
      y = 20;
    }
  };

  const addText = (
    text: string,
    fontSize: number,
    style: "normal" | "bold" = "normal",
    color: [number, number, number] = [30, 30, 30],
    lineSpacing = 1.4,
  ) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_W) as string[];
    const lineH = (fontSize * lineSpacing) / (72 / 25.4); // pt → mm
    checkPageBreak(lines.length * lineH);
    doc.text(lines, MARGIN_L, y);
    y += lines.length * lineH;
  };

  // Portada — título del documento
  addText(title, 22, "bold", [79, 70, 229]);
  y += 4;

  // Línea separadora bajo el título
  doc.setDrawColor(200, 200, 200);
  doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
  y += 6;

  for (const section of sections) {
    switch (section.type) {
      case "h1":
        y += 4;
        checkPageBreak(12);
        addText(section.text, 16, "bold", [30, 30, 30]);
        y += 2;
        doc.setDrawColor(200, 200, 200);
        doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
        y += 4;
        break;

      case "h2":
        y += 3;
        checkPageBreak(10);
        addText(section.text, 13, "bold", [50, 50, 50]);
        y += 2;
        break;

      case "h3":
        y += 2;
        checkPageBreak(8);
        addText(section.text, 11, "bold", [70, 70, 70]);
        y += 1;
        break;

      case "p":
        checkPageBreak(6);
        addText(section.text, 10, "normal", [60, 60, 60]);
        y += 2;
        break;

      case "li":
        checkPageBreak(5);
        addText(section.text, 10, "normal", [60, 60, 60]);
        y += 1;
        break;

      case "pre":
        checkPageBreak(8);
        doc.setFillColor(245, 245, 250);
        const preLines = doc.splitTextToSize(
          section.text,
          CONTENT_W - 8,
        ) as string[];
        const preH = preLines.length * 5 + 6;
        checkPageBreak(preH);
        doc.roundedRect(MARGIN_L, y - 3, CONTENT_W, preH, 2, 2, "F");
        doc.setFontSize(8.5);
        doc.setFont("courier", "normal");
        doc.setTextColor(80, 80, 80);
        doc.text(preLines, MARGIN_L + 4, y + 2);
        y += preH + 2;
        break;

      case "hr":
        y += 2;
        doc.setDrawColor(220, 220, 220);
        doc.line(MARGIN_L, y, PAGE_W - MARGIN_R, y);
        y += 4;
        break;

      case "table":
        if (section.head.length === 0 && section.body.length === 0) break;
        checkPageBreak(20);
        autoTable(doc, {
          head: section.head.length > 0 ? section.head : undefined,
          body: section.body,
          startY: y,
          margin: { left: MARGIN_L, right: MARGIN_R },
          theme: "striped",
          headStyles: {
            fillColor: [79, 70, 229],
            fontSize: 9,
            fontStyle: "bold",
          },
          bodyStyles: { fontSize: 8.5, textColor: [50, 50, 50] },
          alternateRowStyles: { fillColor: [248, 248, 252] },
          didDrawPage: (data) => {
            y = data.cursor?.y ?? y;
          },
        });
        y =
          (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
            .finalY + 4;
        break;
    }
  }

  return Buffer.from(doc.output("arraybuffer"));
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  // Autenticación y autorización
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { slug } = await params;

  let doc: Awaited<ReturnType<typeof getDocBySlug>>;
  try {
    doc = await getDocBySlug(slug);
  } catch {
    return NextResponse.json(
      { error: `Documento no encontrado: "${slug}".` },
      { status: 404 },
    );
  }

  const sections = parseHtmlToSections(doc.htmlContent);
  const pdfBuffer = generateDocPdf(doc.title, sections);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
      "Content-Length": String(pdfBuffer.byteLength),
    },
  });
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * API route que genera un PDF server-side del documento técnico solicitado.
 * Usa un pipeline de tres etapas: HTML → secciones → jsPDF.
 *
 * Lógica Clave:
 * - Por qué no jspdf.html(): Esa función internamente usa html2canvas que
 *   requiere window/document (DOM del navegador). En Node.js lanza un error.
 *   Se usa parsing manual con regex en su lugar.
 * - parseHtmlToSections: Tokeniza el HTML mediante un regex de bloques de
 *   alto nivel (h1-h3, p, table, pre, ul/ol, hr) y convierte cada uno en un
 *   objeto tipado (DocSection). El orden de los bloques se preserva.
 * - generateDocPdf: Recorre las secciones y usa jsPDF para texto con
 *   splitTextToSize (manejo automático de saltos de línea) y autoTable para
 *   tablas. Se gestiona manualmente la posición Y y los saltos de página.
 * - checkPageBreak: Verifica antes de cada bloque si el contenido cabe en la
 *   página actual; si no, agrega una nueva y reinicia Y.
 * - lastAutoTable.finalY: jspdf-autotable expone la Y final de la última
 *   tabla en doc.lastAutoTable.finalY para continuar el layout.
 * - params como Promise: Compatibilidad con Next.js 15 (params asíncronos).
 *
 * Seguridad:
 * - El slug se resuelve contra AVAILABLE_DOCS en getDocBySlug (whitelist).
 *   Nunca se construye una ruta de archivo directamente desde el slug de la URL.
 * - La autorización falla rápido con 401 antes de cualquier I/O de archivos.
 *
 * Dependencias Externas:
 * - jspdf (^4.2.1): Generación del documento PDF.
 * - jspdf-autotable (^5.0.7): Renderizado de tablas en el PDF.
 * - getDocBySlug: Servicio de acceso a documentos (lib/services/docs.service.ts).
 *
 */
