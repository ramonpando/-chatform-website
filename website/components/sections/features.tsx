import {
  MessageCircle,
  Sparkles,
  BarChart3,
  Zap,
  Globe,
  Shield
} from "lucide-react"

export function Features() {
  const features = [
    {
      icon: MessageCircle,
      title: "Encuestas conversacionales",
      description: "Crea surveys que se sienten como una conversación natural por WhatsApp. Tus clientes responden desde donde ya están.",
      benefits: [
        "Builder visual sin código",
        "Lógica condicional avanzada",
        "Múltiples tipos de pregunta"
      ]
    },
    {
      icon: Sparkles,
      title: "IA que analiza todo",
      description: "Nuestra IA procesa cada respuesta automáticamente. NPS, CSAT, sentiment analysis y temas extraídos en segundos.",
      benefits: [
        "Análisis automático en <30s",
        "Detección de temas recurrentes",
        "Sentiment scoring por respuesta"
      ]
    },
    {
      icon: BarChart3,
      title: "Dashboard con insights",
      description: "Visualiza tus datos en tiempo real. Ve tendencias, compara períodos y descubre qué acciones tomar next.",
      benefits: [
        "Métricas en tiempo real",
        "Filtros avanzados",
        "Exporta a CSV/Excel"
      ]
    },
    {
      icon: Zap,
      title: "Setup en minutos",
      description: "Conecta tu cuenta de WhatsApp Business, crea tu primera encuesta y comienza a recibir respuestas hoy mismo.",
      benefits: [
        "No requiere developers",
        "Templates pre-hechos",
        "Soporte en español"
      ]
    },
    {
      icon: Globe,
      title: "Multi-idioma",
      description: "Crea encuestas en cualquier idioma. La IA entiende y analiza respuestas en español, inglés, portugués y más.",
      benefits: [
        "Soporte para 10+ idiomas",
        "Análisis cross-language",
        "Traducciones automáticas"
      ]
    },
    {
      icon: Shield,
      title: "Seguro y confiable",
      description: "Cumplimos con GDPR y CCPA. Tus datos están encriptados y protegidos. WhatsApp Business API oficial.",
      benefits: [
        "End-to-end encryption",
        "Certificaciones de seguridad",
        "99.9% uptime SLA"
      ]
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Todo lo que necesitas para{" "}
            <span className="text-primary-500">entender a tus clientes</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Desde crear la encuesta hasta actuar sobre insights. Todo en un solo lugar.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-neutral-200 hover:border-primary-200 hover:shadow-soft transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600 mb-6">
                {feature.description}
              </p>

              {/* Benefits list */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                    <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            ¿Quieres ver cómo funciona en acción?
          </p>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Ver demo interactivo
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
