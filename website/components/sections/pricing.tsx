"use client"

import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "siempre",
      description: "Perfecto para probar ChatForm",
      features: [
        "50 respuestas/mes",
        "1 encuesta activa",
        "Links y QR ilimitados",
        "Dashboard básico",
        "Soporte por email"
      ],
      limitations: [
        "0 envíos automáticos",
        "Sin exportación CSV",
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
        "3 encuestas activas",
        "Links y QR ilimitados",
        "100 envíos automáticos/mes",
        "CSV upload para envíos",
        "Dashboard avanzado",
        "Exportar a CSV"
      ],
      limitations: [
        "Branding ChatForm"
      ],
      cta: "Probar 14 días gratis",
      highlighted: true,
      badge: "Más popular"
    },
    {
      name: "Pro",
      price: "$59",
      period: "/mes",
      description: "Para agencias y e-commerce",
      features: [
        "2,000 respuestas/mes",
        "Encuestas ilimitadas",
        "Links y QR ilimitados",
        "500 envíos automáticos/mes",
        "Sin branding ChatForm ✨",
        "3 webhooks configurables",
        "API access completo",
        "AI insights ilimitados",
        "Logic jumps",
        "Soporte prioritario 24/7"
      ],
      limitations: [],
      cta: "Probar 14 días gratis",
      highlighted: false
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Pricing simple y transparente
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Comienza gratis. Crece cuando estés listo. Sin sorpresas.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-200 ${
                plan.highlighted
                  ? "border-primary-500 shadow-large scale-105"
                  : "border-neutral-200 hover:border-primary-200 hover:shadow-soft"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-semibold">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-600 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-neutral-900">
                    {plan.price}
                  </span>
                  <span className="text-neutral-600">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                variant={plan.highlighted ? "primary" : "secondary"}
                asChild
                className="w-full mb-8"
              >
                <Link href="/signup">
                  {plan.cta}
                </Link>
              </Button>

              {/* Features */}
              <div className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Limitations (only for Free plan) */}
                {plan.limitations.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-neutral-200 space-y-3">
                    {plan.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-neutral-500 text-sm">
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
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl p-8 border border-neutral-200 max-w-2xl">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Enterprise
            </h3>
            <div className="flex items-baseline gap-1 justify-center mb-4">
              <span className="text-4xl font-bold text-neutral-900">$299</span>
              <span className="text-neutral-600">/mes</span>
            </div>
            <p className="text-neutral-600 mb-4">
              Para empresas con alto volumen. Incluye respuestas ilimitadas, 2,000 envíos automáticos/mes,
              webhooks ilimitados, white-label completo, BYOA (tu propio WhatsApp), SLA 99.9% y account manager dedicado.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">
                Hablar con ventas
              </Link>
            </Button>
          </div>
        </div>

        {/* Add-ons Info */}
        <div className="mt-12 text-center max-w-3xl mx-auto">
          <p className="text-neutral-600 text-sm mb-3">
            <span className="font-semibold text-neutral-900">¿Necesitas más envíos automáticos?</span> Todos los planes pueden comprar créditos adicionales: +100 envíos por $10, +500 por $40, +1,000 por $70
          </p>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-neutral-600 text-sm mb-2">
            ¿Tienes preguntas sobre el pricing?
          </p>
          <a
            href="#faq"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors text-sm"
          >
            Ver FAQ
          </a>
        </div>
      </div>
    </section>
  )
}
