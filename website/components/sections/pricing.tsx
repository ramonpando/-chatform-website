"use client"

import { Check, Sparkles, ArrowRight } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "siempre",
      description: "Perfecto para probar ChatForm",
      features: [
        "25 respuestas/mes",
        "1 encuesta activa",
        "AI Form Generator ✨",
        "5 AI suggestions/mes",
        "Links y QR ilimitados",
        "WhatsApp preview",
        "Analytics básico"
      ],
      limitations: [
        "Sin exportación CSV",
        "Sin validación de email",
        "Branding ChatForm"
      ],
      cta: "Comenzar gratis",
      highlighted: false
    },
    {
      name: "Starter",
      price: "$29",
      period: "/mes",
      description: "Para pequeñas empresas",
      features: [
        "500 respuestas/mes",
        "5 encuestas activas",
        "AI Form Generator ilimitado ✨",
        "50 AI suggestions/mes",
        "Links y QR ilimitados",
        "Exportar a CSV",
        "Validación de email",
        "Sin branding ChatForm",
        "Analytics avanzado"
      ],
      limitations: [
        "Sin envíos automáticos",
        "Sin webhooks"
      ],
      cta: "Comenzar ahora",
      highlighted: true,
      badge: "Más popular"
    },
    {
      name: "Pro",
      price: "$79",
      period: "/mes",
      description: "Para empresas en crecimiento",
      features: [
        "2,500 respuestas/mes",
        "Encuestas ilimitadas",
        "AI Generator ilimitado ✨",
        "AI Suggestions ilimitadas",
        "AI Response Analysis (próximamente)",
        "100 envíos automáticos/mes",
        "Webhooks ilimitados",
        "Conditional logic",
        "Multi-usuario (3 miembros)",
        "Soporte prioritario"
      ],
      limitations: [],
      cta: "Comenzar ahora",
      highlighted: false
    }
  ]

  return (
    <section id="pricing" className="py-24 md:py-32 bg-slate-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Pricing simple y{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              transparente
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Comienza gratis. Crece cuando estés listo. Sin sorpresas.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-3xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-2 border-blue-500 shadow-2xl scale-105 md:scale-110"
                  : "border border-slate-200 hover:border-slate-300 hover:shadow-xl"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-normal shadow-lg uppercase tracking-wide">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-slate-900">
                    {plan.price}
                  </span>
                  <span className="text-slate-600 text-lg">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              {plan.highlighted ? (
                <div className="relative group mb-8">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                    className="relative w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-all"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ) : (
                <a
                  href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 rounded-md font-semibold hover:bg-slate-200 transition-all mb-8"
                >
                  {plan.cta}
                </a>
              )}

              {/* Features */}
              <div className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-slate-700 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-slate-200 space-y-3">
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-slate-500 text-sm">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-white rounded-3xl p-10 border border-slate-200 max-w-2xl shadow-lg">
            <h3 className="text-3xl font-bold text-slate-900 mb-3">
              Enterprise
            </h3>
            <div className="flex items-baseline gap-1 justify-center mb-4">
              <span className="text-5xl font-bold text-slate-900">Custom</span>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Para empresas con alto volumen. Incluye respuestas ilimitadas, AI custom models,
              envíos automáticos ilimitados, white-label completo, SSO & SAML, SLA 99.9% y account manager dedicado.
            </p>
            <a
              href="mailto:sales@chatform.mx"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-100 text-slate-900 rounded-md font-semibold hover:bg-slate-200 transition-all"
            >
              Hablar con ventas
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Add-ons Info */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <p className="text-slate-600 text-base">
            <span className="font-semibold text-slate-900">Add-ons disponibles:</span> +100 envíos automáticos por $10 • Usuarios extra por $15/usuario • Respuestas adicionales disponibles
          </p>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-2">
            ¿Tienes preguntas sobre el pricing?
          </p>
          <a
            href="#faq"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
          >
            Ver FAQ
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
