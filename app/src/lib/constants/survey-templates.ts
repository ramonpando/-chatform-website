/**
 * Survey Templates - Pre-configured SaaS surveys
 * Based on SAAS_TEMPLATES_FINAL.md
 */

export type TemplateCategory =
  | "growth-acquisition"
  | "retention-engagement"
  | "product-development"
  | "customer-success";

export type TemplatePriority = "must-have" | "should-have" | "nice-to-have";

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  priority: TemplatePriority;
  icon: string;
  estimatedTime: string;
  questions: TemplateQuestion[];
  usageCount?: number;
  recommended?: boolean;
}

export interface TemplateQuestion {
  questionText: string;
  questionType: "multiple_choice" | "rating" | "open_text";
  isRequired: boolean;
  options?: string[];
  ratingScale?: number;
  placeholder?: string;
}

/**
 * All 20 SaaS Survey Templates
 */
export const SURVEY_TEMPLATES: SurveyTemplate[] = [
  // ============================================
  // GROWTH & ACQUISITION (5 templates)
  // ============================================
  {
    id: "abandono-registro",
    name: "Abandono de Registro/Trial",
    description: "Recupera usuarios que no completaron el registro o trial",
    category: "growth-acquisition",
    priority: "must-have",
    icon: "🚪",
    estimatedTime: "1 min",
    recommended: true,
    questions: [
      {
        questionText: "¿Por qué no completaste tu registro?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "No entendí cómo funciona",
          "Precio muy alto",
          "No tengo tiempo ahora",
          "Encontré una mejor alternativa",
          "Problemas técnicos",
          "Otro"
        ]
      },
      {
        questionText: "¿Qué necesitarías para completar tu registro?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Ejemplo: Un tutorial, descuento, más tiempo..."
      },
      {
        questionText: "¿Te gustaría que te contactemos para ayudarte?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, por favor", "No, gracias"]
      }
    ]
  },
  {
    id: "product-market-fit",
    name: "Product-Market Fit Survey",
    description: "Mide PMF con el método Sean Ellis",
    category: "growth-acquisition",
    priority: "must-have",
    icon: "🎯",
    estimatedTime: "2 min",
    recommended: true,
    questions: [
      {
        questionText: "¿Qué tan decepcionado estarías si no pudieras usar [Producto] mañana?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Muy decepcionado",
          "Algo decepcionado",
          "No muy decepcionado",
          "N/A - Ya no uso el producto"
        ]
      },
      {
        questionText: "¿Qué beneficio principal obtienes de [Producto]?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "¿Qué problema te resuelve?"
      },
      {
        questionText: "¿Qué tipo de persona crees que más se beneficiaría de [Producto]?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Describe el perfil ideal"
      },
      {
        questionText: "¿Qué podríamos mejorar para hacer [Producto] más valioso para ti?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Tu sugerencia principal"
      }
    ]
  },
  {
    id: "onboarding-feedback",
    name: "Onboarding / Primera Experiencia",
    description: "Feedback de nuevos usuarios después del onboarding",
    category: "growth-acquisition",
    priority: "should-have",
    icon: "👋",
    estimatedTime: "1.5 min",
    questions: [
      {
        questionText: "¿Qué tan fácil fue empezar a usar [Producto]?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Completaste el tutorial/onboarding?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, completo", "Parcialmente", "No lo hice"]
      },
      {
        questionText: "¿Qué fue lo más confuso durante tu primera experiencia?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Algo te resultó difícil de entender?"
      },
      {
        questionText: "¿Lograste [objetivo principal]?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí", "Todavía no", "No sé cómo"]
      }
    ]
  },
  {
    id: "pricing-sensitivity",
    name: "Pricing Sensitivity / Willingness to Pay",
    description: "Test de sensibilidad de precio (Van Westendorp)",
    category: "growth-acquisition",
    priority: "should-have",
    icon: "💰",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿A qué precio considerarías que [Producto] es demasiado caro?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "$XX/mes"
      },
      {
        questionText: "¿A qué precio considerarías que [Producto] es caro pero aún considerarías comprarlo?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "$XX/mes"
      },
      {
        questionText: "¿A qué precio considerarías que [Producto] es una ganga?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "$XX/mes"
      },
      {
        questionText: "¿A qué precio considerarías que [Producto] es tan barato que dudarías de su calidad?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "$XX/mes"
      },
      {
        questionText: "¿Qué feature justificaría pagar más?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Qué funcionalidad valorarías más?"
      }
    ]
  },
  {
    id: "competitor-comparison",
    name: "Competitor Comparison (Win/Loss)",
    description: "Análisis de competencia y decisión de compra",
    category: "growth-acquisition",
    priority: "should-have",
    icon: "⚔️",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿Qué otras herramientas evaluaste antes de elegir [Producto]?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Menciona las alternativas que consideraste"
      },
      {
        questionText: "¿Qué te hizo elegir [Producto] sobre las demás?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "¿Qué fue el factor decisivo?"
      },
      {
        questionText: "¿Qué hace mejor la competencia que nosotros?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Sé honesto, queremos mejorar"
      },
      {
        questionText: "¿Recomendarías [Producto] a un colega?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Definitivamente sí", "Probablemente sí", "Probablemente no", "Definitivamente no"]
      }
    ]
  },

  // ============================================
  // RETENTION & ENGAGEMENT (6 templates)
  // ============================================
  {
    id: "churn-prevention",
    name: "Churn Prevention / Exit Survey",
    description: "Entiende por qué los usuarios cancelan",
    category: "retention-engagement",
    priority: "must-have",
    icon: "🚨",
    estimatedTime: "2 min",
    recommended: true,
    questions: [
      {
        questionText: "¿Cuál es la razón principal por la que cancelas?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Muy caro",
          "No lo uso lo suficiente",
          "Encontré una mejor alternativa",
          "Problemas técnicos/bugs",
          "Falta de features que necesito",
          "Servicio al cliente deficiente",
          "Cambio en mi negocio/necesidades",
          "Otro"
        ]
      },
      {
        questionText: "¿Qué podríamos haber hecho para que te quedaras?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Tu feedback es muy valioso para nosotros"
      },
      {
        questionText: "¿Cuál fue el mayor obstáculo que enfrentaste?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Qué te frustró más?"
      },
      {
        questionText: "¿Considerarías volver en el futuro?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Definitivamente sí", "Tal vez", "Probablemente no", "Definitivamente no"]
      }
    ]
  },
  {
    id: "nps-saas",
    name: "NPS para SaaS",
    description: "Net Promoter Score trimestral para medir lealtad",
    category: "retention-engagement",
    priority: "must-have",
    icon: "⭐",
    estimatedTime: "1 min",
    recommended: true,
    questions: [
      {
        questionText: "¿Qué tan probable es que recomiendes [Producto] a un amigo o colega?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 10
      },
      {
        questionText: "¿Qué es lo principal que te hizo dar esa calificación?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Cuéntanos más..."
      },
      {
        questionText: "¿Qué podemos mejorar?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Tu sugerencia principal"
      }
    ]
  },
  {
    id: "post-upgrade",
    name: "Post-Upgrade Satisfaction",
    description: "Feedback después de upgrade a plan superior",
    category: "retention-engagement",
    priority: "should-have",
    icon: "📈",
    estimatedTime: "1.5 min",
    questions: [
      {
        questionText: "¿Estás satisfecho con tu upgrade al plan [Plan Name]?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Qué feature del nuevo plan valoras más?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "¿Qué te motivó a hacer upgrade?"
      },
      {
        questionText: "¿El proceso de upgrade fue sencillo?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Muy fácil", "Fácil", "Confuso", "Muy difícil"]
      },
      {
        questionText: "¿Hay algo que esperabas en el nuevo plan y no encontraste?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Faltó algo?"
      }
    ]
  },
  {
    id: "downgrade-prevention",
    name: "Downgrade Prevention",
    description: "Retención antes de downgrade a plan inferior",
    category: "retention-engagement",
    priority: "should-have",
    icon: "📉",
    estimatedTime: "1.5 min",
    questions: [
      {
        questionText: "¿Por qué estás considerando cambiar a un plan inferior?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Muy caro para mi uso actual",
          "No uso todas las features",
          "Presupuesto reducido",
          "Probando si el plan básico es suficiente",
          "Otro"
        ]
      },
      {
        questionText: "¿Qué feature del plan actual usas más?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "¿Qué no querrías perder?"
      },
      {
        questionText: "¿Un descuento temporal te ayudaría a mantener tu plan actual?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, definitivamente", "Tal vez", "No, quiero cambiar de todas formas"]
      },
      {
        questionText: "¿Hay algo que podamos ajustar en tu plan para que se adapte mejor?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Sugerencias de personalización"
      }
    ]
  },
  {
    id: "referral-program",
    name: "Referral Program Feedback",
    description: "Optimiza tu programa de referidos",
    category: "retention-engagement",
    priority: "nice-to-have",
    icon: "🎁",
    estimatedTime: "1 min",
    questions: [
      {
        questionText: "¿Has recomendado [Producto] a alguien?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, varias veces", "Sí, una vez", "No, pero lo haría", "No, no lo haría"]
      },
      {
        questionText: "¿Qué incentivo te motivaría más a referir amigos?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Descuento en mi plan",
          "Créditos gratuitos",
          "Mes gratis",
          "Acceso a features premium",
          "Dinero en efectivo",
          "Otro"
        ]
      },
      {
        questionText: "¿Qué tan fácil fue compartir tu link de referido?",
        questionType: "rating",
        isRequired: false,
        ratingScale: 5
      }
    ]
  },
  {
    id: "seasonal-review",
    name: "Seasonal / End of Year Review",
    description: "Revisión anual de satisfacción y uso",
    category: "retention-engagement",
    priority: "nice-to-have",
    icon: "📅",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿Cómo calificarías tu experiencia con [Producto] este año?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 10
      },
      {
        questionText: "¿Qué logro alcanzaste este año gracias a [Producto]?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Cuéntanos tu mayor éxito"
      },
      {
        questionText: "¿Qué feature nueva te gustaría ver el próximo año?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Tu wishlist"
      },
      {
        questionText: "¿Planeas renovar tu suscripción?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Definitivamente sí", "Probablemente sí", "No estoy seguro", "Probablemente no"]
      }
    ]
  },

  // ============================================
  // PRODUCT DEVELOPMENT (5 templates)
  // ============================================
  {
    id: "feature-request",
    name: "Feature Request / Roadmap Voting",
    description: "Prioriza features según demanda real",
    category: "product-development",
    priority: "should-have",
    icon: "💡",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿Qué feature te gustaría ver en [Producto]?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Describe la funcionalidad que necesitas"
      },
      {
        questionText: "¿Qué problema resolvería esta feature para ti?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "¿Por qué es importante?"
      },
      {
        questionText: "¿Qué tan urgente es esta necesidad?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Crítico - Lo necesito ahora",
          "Importante - Lo necesito pronto",
          "Nice to have - Sería útil",
          "No urgente - Sería un plus"
        ]
      },
      {
        questionText: "¿Pagarías más por esta feature?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí", "Depende del precio", "No"]
      }
    ]
  },
  {
    id: "beta-tester",
    name: "Beta Tester Feedback",
    description: "Feedback de early adopters de nuevas features",
    category: "product-development",
    priority: "nice-to-have",
    icon: "🧪",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿Qué tan útil encuentras la nueva feature [Feature Name]?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Encontraste algún bug o problema?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Describe cualquier error que hayas visto"
      },
      {
        questionText: "¿Qué mejorarías de esta feature?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Tu feedback es crucial para el lanzamiento"
      },
      {
        questionText: "¿Usarías esta feature regularmente?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, muy seguido", "Sí, ocasionalmente", "Tal vez", "Probablemente no"]
      }
    ]
  },
  {
    id: "integration-request",
    name: "Integration Request / Ecosystem",
    description: "Descubre qué integraciones necesitan tus usuarios",
    category: "product-development",
    priority: "nice-to-have",
    icon: "🔌",
    estimatedTime: "1 min",
    questions: [
      {
        questionText: "¿Qué herramienta te gustaría integrar con [Producto]?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Ejemplo: Slack, Zapier, Google Sheets..."
      },
      {
        questionText: "¿Qué harías con esta integración?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Describe tu caso de uso"
      },
      {
        questionText: "¿Qué tan importante es esta integración para ti?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Crítica - No puedo usar el producto sin ella",
          "Muy importante - Mejoraría mucho mi workflow",
          "Nice to have - Sería conveniente",
          "No tan importante"
        ]
      }
    ]
  },
  {
    id: "api-developer-experience",
    name: "API / Developer Experience",
    description: "Feedback de desarrolladores usando tu API",
    category: "product-development",
    priority: "nice-to-have",
    icon: "👨‍💻",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿Qué tan clara es nuestra documentación de API?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Qué endpoint o funcionalidad te falta?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Qué podrías hacer con una nueva API?"
      },
      {
        questionText: "¿Encontraste algún error en la API?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Describe bugs, rate limits, errores..."
      },
      {
        questionText: "¿Qué lenguaje de programación usas principalmente?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["JavaScript/TypeScript", "Python", "PHP", "Ruby", "Go", "Java", "Otro"]
      },
      {
        questionText: "¿Te gustaría tener un SDK oficial?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, definitivamente", "Sería útil", "No es necesario"]
      }
    ]
  },
  {
    id: "mobile-app-feedback",
    name: "Mobile App Feedback",
    description: "Experiencia en app móvil vs web",
    category: "product-development",
    priority: "nice-to-have",
    icon: "📱",
    estimatedTime: "1.5 min",
    questions: [
      {
        questionText: "¿Qué tan satisfecho estás con la app móvil?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Qué feature falta en móvil que sí existe en web?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Qué no puedes hacer desde tu celular?"
      },
      {
        questionText: "¿La app es rápida?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Muy rápida", "Rápida", "Lenta", "Muy lenta"]
      },
      {
        questionText: "¿Qué dispositivo usas?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["iPhone", "Android", "Tablet", "Uso solo la web"]
      }
    ]
  },

  // ============================================
  // CUSTOMER SUCCESS (4 templates)
  // ============================================
  {
    id: "freemium-to-paid",
    name: "Freemium to Paid Conversion",
    description: "Convierte usuarios gratuitos a planes de pago",
    category: "customer-success",
    priority: "must-have",
    icon: "💳",
    estimatedTime: "1.5 min",
    recommended: true,
    questions: [
      {
        questionText: "¿Qué te impide hacer upgrade a un plan de pago?",
        questionType: "multiple_choice",
        isRequired: true,
        options: [
          "Precio muy alto",
          "No estoy seguro si lo necesito",
          "Aún estoy probando",
          "No veo suficiente valor",
          "Presupuesto limitado",
          "Falta de features que necesito",
          "Otro"
        ]
      },
      {
        questionText: "¿Qué feature te haría considerar pagar?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "¿Qué necesitas que no tienes en el plan gratuito?"
      },
      {
        questionText: "¿Cuál sería un precio justo para ti?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "$XX/mes"
      },
      {
        questionText: "¿Te ayudaría un trial extendido del plan Pro?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, definitivamente", "Tal vez", "No, no me interesa"]
      }
    ]
  },
  {
    id: "support-satisfaction",
    name: "Support Satisfaction",
    description: "Calidad de atención al cliente",
    category: "customer-success",
    priority: "should-have",
    icon: "🎧",
    estimatedTime: "1 min",
    questions: [
      {
        questionText: "¿Cómo calificarías la atención recibida?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Tu problema fue resuelto completamente?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, completamente", "Parcialmente", "No fue resuelto"]
      },
      {
        questionText: "¿Qué tan rápida fue la respuesta?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Muy rápida (< 1hr)", "Rápida (1-4hrs)", "Adecuada (4-24hrs)", "Lenta (> 24hrs)"]
      },
      {
        questionText: "Comentarios adicionales sobre el soporte",
        questionType: "open_text",
        isRequired: false,
        placeholder: "¿Algo que podamos mejorar?"
      }
    ]
  },
  {
    id: "multi-user-feedback",
    name: "Multi-User / Team Feedback",
    description: "Colaboración y uso en equipo",
    category: "customer-success",
    priority: "nice-to-have",
    icon: "👥",
    estimatedTime: "1.5 min",
    questions: [
      {
        questionText: "¿Cuántas personas de tu equipo usan [Producto]?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Solo yo", "2-5 personas", "6-10 personas", "11-25 personas", "25+ personas"]
      },
      {
        questionText: "¿Qué tan fácil es colaborar con tu equipo en [Producto]?",
        questionType: "rating",
        isRequired: true,
        ratingScale: 5
      },
      {
        questionText: "¿Qué feature de colaboración te falta?",
        questionType: "open_text",
        isRequired: false,
        placeholder: "Ejemplo: comentarios, roles, permisos..."
      },
      {
        questionText: "¿Necesitas más seats/usuarios en tu plan?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Sí, urgentemente", "Sí, eventualmente", "No por ahora"]
      }
    ]
  },
  {
    id: "enterprise-inquiry",
    name: "Enterprise / Custom Plan Inquiry",
    description: "Calificación de leads empresariales",
    category: "customer-success",
    priority: "nice-to-have",
    icon: "🏢",
    estimatedTime: "2 min",
    questions: [
      {
        questionText: "¿Cuántos usuarios necesitarías en tu organización?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["25-50", "50-100", "100-500", "500+"]
      },
      {
        questionText: "¿Qué features adicionales necesitas?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Ejemplo: SSO, On-premise, SLA personalizado..."
      },
      {
        questionText: "¿Cuál es tu presupuesto anual aproximado?",
        questionType: "multiple_choice",
        isRequired: false,
        options: ["$5K-$10K", "$10K-$50K", "$50K-$100K", "$100K+"]
      },
      {
        questionText: "¿Cuándo planeas implementar?",
        questionType: "multiple_choice",
        isRequired: true,
        options: ["Este mes", "Este trimestre", "Este año", "Solo estoy explorando"]
      },
      {
        questionText: "¿Qué industria describe mejor tu negocio?",
        questionType: "open_text",
        isRequired: true,
        placeholder: "Ejemplo: E-commerce, SaaS, Healthcare..."
      }
    ]
  }
];

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: TemplateCategory): SurveyTemplate[] {
  return SURVEY_TEMPLATES.filter(t => t.category === category);
}

/**
 * Get templates by priority
 */
export function getTemplatesByPriority(priority: TemplatePriority): SurveyTemplate[] {
  return SURVEY_TEMPLATES.filter(t => t.priority === priority);
}

/**
 * Get recommended templates
 */
export function getRecommendedTemplates(): SurveyTemplate[] {
  return SURVEY_TEMPLATES.filter(t => t.recommended);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): SurveyTemplate | undefined {
  return SURVEY_TEMPLATES.find(t => t.id === id);
}

/**
 * Category metadata
 */
export const CATEGORY_METADATA = {
  "growth-acquisition": {
    name: "Growth & Acquisition",
    icon: "📈",
    description: "Atrae y convierte nuevos usuarios"
  },
  "retention-engagement": {
    name: "Retention & Engagement",
    icon: "🔄",
    description: "Mantén a tus usuarios felices y activos"
  },
  "product-development": {
    name: "Product Development",
    icon: "🛠️",
    description: "Mejora tu producto con feedback real"
  },
  "customer-success": {
    name: "Customer Success",
    icon: "🎯",
    description: "Ayuda a tus clientes a tener éxito"
  }
} as const;
