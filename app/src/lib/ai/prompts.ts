export const SYSTEM_PROMPT = `Eres un experto en crear encuestas efectivas para WhatsApp Business.

REGLAS IMPORTANTES:
1. Las preguntas deben ser CORTAS (máximo 100 caracteres)
2. Usa lenguaje conversacional y amigable
3. SIEMPRE incluye una pregunta de rating (1-10) para NPS
4. Las opciones de multiple choice deben ser 2-4 opciones máximo
5. Usa emojis solo en mensajes de bienvenida/despedida, NO en preguntas
6. Para restaurantes/servicios: incluir satisfacción + recomendación
7. Para productos: incluir satisfacción + feedback + email opcional

TIPOS DE PREGUNTA DISPONIBLES:
- multiple_choice: 2-4 opciones (ej: ["Excelente", "Bueno", "Regular", "Malo"])
- yes_no: Solo dos opciones: ["Sí", "No"]
- rating: Escala numérica 1-10 (no requiere options)
- open_text: Respuesta libre corta (no requiere options)
- email: Captura de email (no requiere options)

RESPONDE SIEMPRE EN JSON VÁLIDO, sin markdown ni código.`;

export interface GenerateInput {
  description: string;
  numQuestions?: number;
  tone?: 'formal' | 'casual';
  language?: string;
}

export function createUserPrompt(input: GenerateInput): string {
  const {
    description,
    numQuestions = 5,
    tone = 'casual',
    language = 'es'
  } = input;

  return `Crea una encuesta de ${numQuestions} preguntas sobre: "${description}".

Tono: ${tone === 'formal' ? 'profesional y cortés' : 'amigable y conversacional'}
Idioma: ${language}

Requisitos:
- Título atractivo y corto (máx 50 caracteres)
- Mensaje de bienvenida personal (máx 150 caracteres)
- ${numQuestions} preguntas variadas y relevantes
- AL MENOS una pregunta tipo "rating" (1-10)
- Mensaje de agradecimiento cálido (máx 100 caracteres)

Responde ÚNICAMENTE con este JSON (sin markdown, sin \`\`\`json):
{
  "title": "Título de la encuesta",
  "welcomeMessage": "Mensaje inicial",
  "questions": [
    {
      "text": "¿Pregunta?",
      "type": "multiple_choice",
      "options": ["Opción 1", "Opción 2"]
    }
  ],
  "thankYouMessage": "Mensaje de cierre"
}`;
}

export interface GeneratedSurvey {
  title: string;
  welcomeMessage: string;
  questions: Array<{
    text: string;
    type: 'multiple_choice' | 'yes_no' | 'rating' | 'open_text' | 'email';
    options?: string[];
  }>;
  thankYouMessage: string;
}
