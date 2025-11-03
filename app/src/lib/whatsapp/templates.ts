/**
 * WhatsApp Message Templates
 *
 * Default templates with high conversion rates based on best practices
 */

export interface WhatsAppTemplate {
  id: string;
  name: string;
  description: string;
  message: string;
  variables: string[];
  category: "professional" | "friendly" | "direct" | "minimal";
  estimatedResponseRate: string;
}

export const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "professional-detailed",
    name: "Profesional Detallado",
    description: "Incluye contexto completo y tiempo estimado",
    message: `Hola {{name}}, soy {{sender}} de {{company}}.

Nos gustaría conocer tu opinión sobre {{topic}}.

📊 Solo {{question_count}} preguntas
⏱️ Tiempo estimado: {{estimated_time}} min

{{link}}

¡Gracias por tu tiempo!`,
    variables: ["name", "sender", "company", "topic", "question_count", "estimated_time", "link"],
    category: "professional",
    estimatedResponseRate: "~35%"
  },
  {
    id: "friendly-short",
    name: "Amigable Corto",
    description: "Tono casual y directo, ideal para audiencias jóvenes",
    message: `¡Hola {{name}}! 👋

Queremos saber tu opinión sobre {{topic}}. Son solo {{question_count}} preguntas rápidas.

{{link}}

¡Tu feedback nos ayuda mucho! 🙌`,
    variables: ["name", "topic", "question_count", "link"],
    category: "friendly",
    estimatedResponseRate: "~40%"
  },
  {
    id: "direct-minimal",
    name: "Directo Mínimo",
    description: "Sin palabrería, directo al punto",
    message: `{{name}}, tu opinión sobre {{topic}}:

{{link}}

{{question_count}} preguntas | {{estimated_time}} min`,
    variables: ["name", "topic", "link", "question_count", "estimated_time"],
    category: "direct",
    estimatedResponseRate: "~30%"
  },
  {
    id: "incentive-focused",
    name: "Con Incentivo",
    description: "Menciona beneficio o recompensa",
    message: `Hola {{name}},

Tu opinión vale mucho para nosotros. Responde nuestra encuesta sobre {{topic}} y {{incentive}}.

{{link}}

Solo {{estimated_time}} minutos 🎁`,
    variables: ["name", "topic", "incentive", "link", "estimated_time"],
    category: "professional",
    estimatedResponseRate: "~50%"
  },
  {
    id: "personalized-context",
    name: "Personalizado con Contexto",
    description: "Menciona relación previa con el usuario",
    message: `Hola {{name}},

Como {{context}}, nos gustaría conocer tu experiencia con {{topic}}.

Tu feedback es muy valioso:
{{link}}

Son {{question_count}} preguntas breves.

Saludos,
{{sender}}`,
    variables: ["name", "context", "topic", "link", "question_count", "sender"],
    category: "professional",
    estimatedResponseRate: "~45%"
  },
  {
    id: "link-only",
    name: "Solo Link",
    description: "Mínimo, solo el enlace (menor tasa de respuesta)",
    message: "{{link}}",
    variables: ["link"],
    category: "minimal",
    estimatedResponseRate: "~15%"
  }
];

/**
 * Get available variables for survey context
 */
export function getAvailableVariables(survey: {
  title: string;
  questions: any[];
  tenant?: { name?: string };
}) {
  return {
    // From survey
    topic: survey.title,
    question_count: survey.questions.length.toString(),
    estimated_time: Math.max(1, Math.ceil(survey.questions.length * 0.5)).toString(),

    // From tenant (will be filled at send time)
    company: "{{company}}", // Placeholder, filled from tenant
    sender: "{{sender}}", // Placeholder, filled from user

    // From recipient (filled from CSV)
    name: "{{name}}",

    // Generated
    link: "{{link}}", // Generated survey link

    // Custom (user can override)
    context: "{{context}}", // e.g., "cliente nuestro", "usuario de nuestra app"
    incentive: "{{incentive}}" // e.g., "recibirás un 10% de descuento"
  };
}

/**
 * Replace template variables with actual values
 */
export function fillTemplate(
  template: string,
  variables: Record<string, string>
): string {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value || '');
  });

  return result.trim();
}

/**
 * Validate template has all required variables
 */
export function validateTemplate(
  template: string,
  requiredVars: string[]
): { valid: boolean; missing: string[] } {
  const missing = requiredVars.filter(varName => {
    return !template.includes(`{{${varName}}}`);
  });

  return {
    valid: missing.length === 0,
    missing
  };
}
