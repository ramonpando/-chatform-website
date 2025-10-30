import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Founder @ TiendaOnline",
      company: "Ecommerce",
      image: "MG",
      rating: 5,
      text: "Pasamos de 15% a 68% de tasa de respuesta. Nuestros clientes prefieren WhatsApp mil veces antes que email. ChatForm nos ahorra 10+ horas por semana en análisis manual.",
      metric: "68% tasa de respuesta"
    },
    {
      name: "Carlos Ramírez",
      role: "Product Manager",
      company: "FinTech SaaS",
      image: "CR",
      rating: 5,
      text: "La IA detectó un problema crítico en nuestro onboarding que no habíamos visto. 23% de usuarios mencionaban 'confuso' en preguntas abiertas. Lo arreglamos y mejoramos retención 15%.",
      metric: "+15% retención"
    },
    {
      name: "Ana Martínez",
      role: "CEO",
      company: "Agencia de Marketing",
      image: "AM",
      rating: 5,
      text: "Usamos ChatForm con todos nuestros clientes. El análisis de sentiment nos ayuda a identificar clientes en riesgo antes de que cancelen. ROI brutal.",
      metric: "5-10x ROI"
    }
  ]

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            ⭐ 4.9/5 rating
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg md:text-xl text-neutral-600">
            Empresas que ya están obteniendo mejores insights con ChatForm
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 hover:border-primary-200 hover:shadow-soft transition-all duration-200"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-neutral-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Metric Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
                {testimonial.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-neutral-200">
                <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 mb-4">
            ¿Quieres aparecer aquí? Prueba ChatForm gratis
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Crear cuenta gratis
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
