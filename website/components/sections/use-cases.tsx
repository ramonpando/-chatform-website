"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Store, ShoppingBag, Utensils, Stethoscope, Briefcase, Dumbbell } from "lucide-react"
import Link from "next/link"

export function UseCases() {
  const useCases = [
    {
      icon: Utensils,
      industry: "Restaurantes",
      title: "Feedback post-visita automático",
      description: "QR en mesa para clientes walk-in. Envío automático para reservaciones VIP.",
      method: "Híbrido",
      stats: "78% completion rate",
      example: "Sube tu lista de reservaciones. ChatForm envía encuesta 2hrs después de la cita.",
      color: "text-orange-600 bg-orange-50"
    },
    {
      icon: ShoppingBag,
      industry: "E-commerce",
      title: "NPS post-compra automatizado",
      description: "Webhook desde Shopify/WooCommerce. Envío 7 días post-entrega.",
      method: "Webhook automático",
      stats: "3x más respuestas que email",
      example: "Conecta tu tienda. Cada compra trigger encuesta automática en el momento perfecto.",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: Stethoscope,
      industry: "Clínicas y Doctores",
      title: "CSAT post-consulta",
      description: "Envío automático a pacientes 24hrs después de cita médica.",
      method: "CSV upload diario",
      stats: "65% completion vs 12% email",
      example: "Exporta citas del día desde tu sistema. Sube CSV y chatform envía al día siguiente.",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: Dumbbell,
      industry: "Gimnasios",
      title: "Feedback de clases y entrenadores",
      description: "QR en recepción. Envío automático mensual para miembros activos.",
      method: "Híbrido",
      stats: "4.8/5 rating promedio",
      example: "QR en taquilla para feedback rápido. Envío automático mensual para encuesta NPS.",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: Briefcase,
      industry: "Agencias",
      title: "Encuestas para múltiples clientes",
      description: "Una cuenta. Encuestas separadas por cliente. Webhooks para automatización.",
      method: "Webhooks + API",
      stats: "10 clientes, 1 plataforma",
      example: "Configura encuestas por cliente. API/webhooks permiten integración en tus procesos.",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      icon: Store,
      industry: "Retail",
      title: "In-store + online feedback",
      description: "QR en tienda física. Envío automático para compras online.",
      method: "Híbrido completo",
      stats: "2.3K respuestas/mes",
      example: "QR en punto de venta para feedback inmediato. Webhook desde POS para envío post-compra.",
      color: "text-pink-600 bg-pink-50"
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6">
            Use Cases
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Tu industria. Tu forma de trabajar.
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            El modelo híbrido de ChatForm se adapta a cualquier caso de uso.
            Desde QR codes hasta automatización completa con webhooks.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <div
                key={index}
                className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:border-primary-200 hover:shadow-soft transition-all duration-200"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${useCase.color} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Industry */}
                <div className="text-sm font-semibold text-primary-600 mb-2">
                  {useCase.industry}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 mb-3">
                  {useCase.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-600 text-sm mb-4">
                  {useCase.description}
                </p>

                {/* Method Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs font-medium text-neutral-700 mb-4">
                  {useCase.method}
                </div>

                {/* Stats */}
                <div className="text-sm font-semibold text-primary-600 mb-3">
                  {useCase.stats}
                </div>

                {/* Example */}
                <p className="text-neutral-500 text-xs leading-relaxed">
                  {useCase.example}
                </p>
              </div>
            )
          })}
        </div>

        {/* Delivery Methods Explanation */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12 border border-primary-100">
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6 text-center">
              Tres formas de distribuir. Tú decides.
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Method 1 */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h4 className="font-bold text-neutral-900 mb-2">
                  Links y QR
                </h4>
                <p className="text-neutral-600 text-sm mb-3">
                  Gratis e ilimitados. Comparte donde quieras: Instagram, email, impreso.
                </p>
                <div className="text-xs font-semibold text-primary-600">
                  ✓ Todos los planes
                </div>
              </div>

              {/* Method 2 */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h4 className="font-bold text-neutral-900 mb-2">
                  Envío Automático
                </h4>
                <p className="text-neutral-600 text-sm mb-3">
                  Sube CSV. Nosotros enviamos directo a WhatsApp. Sin distribuir manualmente.
                </p>
                <div className="text-xs font-semibold text-secondary-600">
                  ✓ Starter, Pro, Enterprise
                </div>
              </div>

              {/* Method 3 */}
              <div className="bg-white rounded-xl p-6 border border-neutral-200">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h4 className="font-bold text-neutral-900 mb-2">
                  Webhooks + API
                </h4>
                <p className="text-neutral-600 text-sm mb-3">
                  Integración automática. Trigger desde Shopify, Calendly, tu CRM.
                </p>
                <div className="text-xs font-semibold text-indigo-600">
                  ✓ Pro, Enterprise
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-8">
              <Button size="lg" variant="primary" asChild>
                <Link href="/signup">
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <p className="text-neutral-600 text-sm mt-3">
                Sin tarjeta de crédito. Setup en 2 minutos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
