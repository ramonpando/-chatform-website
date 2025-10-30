import { Layout, MessageCircle, Brain, TrendingUp } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      icon: Layout,
      title: "Crea tu encuesta",
      description: "Drag & drop questions. Typeform-style builder, pero más simple.",
      highlight: "No código. No complicaciones.",
    },
    {
      number: "2",
      icon: MessageCircle,
      title: "Envías por WhatsApp",
      description: "Tus clientes responden desde donde ya están.",
      highlight: "5-10x más respuestas que email.",
    },
    {
      number: "3",
      icon: Brain,
      title: "IA analiza todo",
      description: "NPS, CSAT, sentiment, topics extraídos automáticamente.",
      highlight: "Cero Excel. Cero análisis manual.",
    },
    {
      number: "4",
      icon: TrendingUp,
      title: "Actúas con insights",
      description: "Dashboard claro con qué hacer next.",
      highlight: "De feedback a acción en minutos.",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Tan fácil como <span className="text-primary-500">1, 2, 3</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            De crear tu encuesta a obtener insights en minutos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-neutral-200 -z-10" />
              )}

              <div className="bg-white rounded-2xl p-8 border border-neutral-200 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
                {/* Number badge */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {step.description}
                </p>
                <p className="text-sm font-semibold text-primary-600">
                  {step.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
