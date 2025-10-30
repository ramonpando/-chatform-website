"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "¿Cómo funciona ChatForm con WhatsApp?",
      answer: "ChatForm se conecta con WhatsApp Business API oficial. Tú creas la encuesta en nuestro builder, y nosotros la enviamos como mensajes conversacionales a tus contactos. Ellos responden naturalmente por WhatsApp, y toda la data se sincroniza automáticamente con tu dashboard."
    },
    {
      question: "¿Necesito una cuenta de WhatsApp Business?",
      answer: "Sí, pero no te preocupes. Si aún no tienes una, te guiamos paso a paso para crearla gratis. Es un proceso simple que toma menos de 10 minutos. También puedes usar tu número existente de WhatsApp Business."
    },
    {
      question: "¿Cuánto cuesta enviar mensajes por WhatsApp?",
      answer: "Meta cobra por conversaciones iniciadas. El costo varía por país, pero típicamente es $0.005-0.015 USD por conversación (no por mensaje). Nosotros NO añadimos markup sobre esto. En el plan Free, incluimos créditos para que pruebes sin costos adicionales."
    },
    {
      question: "¿Qué tipo de análisis hace la IA?",
      answer: "Nuestra IA analiza automáticamente: (1) NPS scores y categorización (Promoter/Passive/Detractor), (2) CSAT y satisfacción general, (3) Sentiment analysis (positivo/negativo/neutral), (4) Topics y temas recurrentes, (5) Keywords más mencionados. Todo esto en <30 segundos después de recibir respuestas."
    },
    {
      question: "¿Puedo usar ChatForm para otros canales además de WhatsApp?",
      answer: "En el MVP nos enfocamos 100% en WhatsApp porque ahí están las tasas de respuesta más altas (50-80% vs 10-15% en email). Telegram y SMS están en nuestro roadmap para Q2 2025. Si necesitas estos canales urgentemente, contáctanos."
    },
    {
      question: "¿Los datos están seguros?",
      answer: "Absolutamente. (1) Usamos WhatsApp Business API oficial que tiene end-to-end encryption, (2) Toda la data está encriptada en reposo, (3) Cumplimos GDPR y CCPA, (4) Nunca compartimos tus datos con terceros, (5) Tienes control total para exportar o eliminar data cuando quieras."
    },
    {
      question: "¿Puedo cancelar en cualquier momento?",
      answer: "Sí. No hay contratos ni penalizaciones. Cancelas cuando quieras desde el dashboard. Si cancelas, mantienes acceso hasta el fin de tu período de facturación actual. También puedes exportar toda tu data antes de irte."
    },
    {
      question: "¿Ofrecen soporte en español?",
      answer: "¡Por supuesto! Todo nuestro soporte es en español (también inglés si prefieres). Plan Free: soporte por email en 24-48hrs. Plan Starter: soporte prioritario en 4-8hrs. Plan Pro: soporte 24/7 con account manager dedicado."
    },
    {
      question: "¿Qué pasa si excedo mi límite de respuestas?",
      answer: "Te avisamos cuando llegues al 80% de tu límite. Si lo excedes, puedes: (1) Hacer upgrade a un plan mayor, (2) Comprar paquetes adicionales de respuestas, o (3) Esperar al próximo ciclo de facturación. Tus encuestas activas nunca se detienen abruptamente."
    },
    {
      question: "¿Tienen API o integraciones?",
      answer: "Sí. Plan Pro incluye API access completo y webhooks. También tenemos integraciones nativas con: Google Sheets, Slack, Zapier, Make, HubSpot, Salesforce. Si necesitas una integración específica que no tenemos, avísanos y la priorizamos."
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Todo lo que necesitas saber sobre ChatForm
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all duration-200 hover:border-primary-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold text-neutral-900 text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-600 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-neutral-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            ¿No encuentras la respuesta que buscas?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Contáctanos directamente
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
