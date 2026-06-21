import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * POST /api/ai/refine
 * Descripción: Refina y optimiza textos o descripciones usando Gemini IA, variando el prompt según el tipo especificado.
 * Requiere: Clave de API de Gemini en variables de entorno (GEMINI_API_KEY).
 * Implementa: ISSUE-147
 */

export async function POST(request: Request) {
  const { description, type = "pet" } = await request.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  let promptContext = "";

  if (type === "product") {
    promptContext = `
    Actúa como un experto copywriter de e-commerce especializado en productos para mascotas. Tu objetivo es transformar la descripción proporcionada en un texto persuasivo, claro y orientado a la venta.

    Sigue estas directrices:
    1. Tono: Profesional, confiable y entusiasta (sin exagerar).
    2. Estructura:
       - Inicio: Destaca el beneficio principal o la solución que ofrece el producto.
       - Cuerpo: Describe las características clave y cómo mejoran la vida de la mascota o el dueño.
       - Cierre: Una frase que refuerce la calidad o utilidad.
    3. Optimización: Usa palabras clave relevantes de forma natural.
    4. Claridad: Formato fácil de escanear, usa párrafos cortos.
    `;
  } else if (type === "moderation") {
    promptContext = `
    Actúa como un experto en moderación de usuarios, aprobador de perfiles y administrador técnico de sistemas. Tu tarea consiste en redactar entradas profesionales para un registro de auditoría basadas en la información que se te proporcione.

    Para cada entrada, debes seguir estrictamente la siguiente estructura:
    "El usuario ha sido [acción] debido a [razón]."

    Las acciones de auditoría permitidas son exclusivamente:
        - Aprobación
        - Rechazo
        - Bloqueo
        - Desbloqueo
        - Cambio de rol

    Requisitos adicionales:
        1. Coherencia: La razón debe ser lógica y consecuente con la acción tomada.
        2. Tono: Mantén un lenguaje técnico, formal y preciso.
        3. Formato: Genera únicamente la entrada del registro según la estructura solicitada.
    `;
    promptContext = "";
  } else {
    // Por defecto, el tipo es 'pet'
    promptContext = `
    Actúa como un experto redactor de perfiles de adopción de mascotas y Copywriter emocional. Tu objetivo es transformar la descripción proporcionada en un texto conmovedor, claro y atractivo que maximice las posibilidades de adopción de esta mascota.

    Sigue estas directrices:
    1. Tono: Cálido, empático, esperanzador y profesional.
    2. Estructura: 
       - Inicio: Un gancho emocional o una frase que resalte su personalidad única.
       - Cuerpo: Detalles sobre su comportamiento, nivel de energía, convivencia con otros animales/niños y aspectos de salud si se mencionan.
       - Cierre: Una llamada a la acción invitando a conocerlo/a.
    3. Corrección: Mejora la gramática, ortografía y fluidez.
    4. Honestidad: No inventes características no mencionadas, pero resalta las positivas de forma atractiva.
    5. Formato: Párrafos cortos y fáciles de leer.
    `;
  }

  const prompt = `
  ${promptContext}

  Descripción original:
  "${description}"
  Nota importante: La descripción NO debe superar los 500 caracteres.
  
  Responde únicamente con el texto refinado, sin introducciones ni explicaciones adicionales.
  `;

  const result = await model.generateContent(prompt);
  return Response.json({ refinedText: result.response.text() });
}

/*
 * ---------------------------------------------------------------------------
 * NOTAS DE IMPLEMENTACIÓN
 * ---------------------------------------------------------------------------
 *
 * Descripción General:
 * Endpoint de API para interactuar con la API de Google Generative AI (Gemini).
 * Permite refinar textos dependiendo del tipo especificado (mascotas, productos, o moderación).
 *
 * Lógica Clave:
 * - Selección de contexto según el parámetro 'type'.
 * - El tipo 'moderation' se deja preparado estructuralmente sin un prompt específico.
 *
 * Dependencias Externas:
 * - @google/generative-ai: SDK de Google Generative AI.
 *
 */
