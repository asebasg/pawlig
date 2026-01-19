import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
    const { description, type = 'pet' } = await request.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let promptContext = "";

    if (type === 'product') {
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
    `

    const result = await model.generateContent(prompt);
    return Response.json({ refinedText: result.response.text() });
}