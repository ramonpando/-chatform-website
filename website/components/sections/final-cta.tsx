import { ArrowRight, CheckCircle, Sparkles } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      {/* Subtle gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-50/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 md:p-16 text-center border border-slate-200 shadow-2xl">
            {/* Content */}
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 text-blue-600 text-xs font-normal mb-8">
                <Sparkles className="w-3 h-3" />
                Lanzamiento especial
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                Comienza a recibir más{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  respuestas hoy
                </span>
              </h2>

              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Únete a las empresas que ya están obteniendo 5-10x más respuestas
                con encuestas por WhatsApp.
              </p>

              {/* Benefits */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Gratis hasta 100 respuestas</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Setup en 5 minutos</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur-sm group-hover:blur"></div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                    className="relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold text-lg hover:bg-slate-800 transition-all"
                  >
                    Crear cuenta gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Hablar con ventas
                </a>
              </div>

              {/* Trust indicator */}
              <p className="text-slate-500 text-xs mt-10">
                Ya confían en nosotros: Ecommerce, SaaS, Agencias, y más
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                100+
              </div>
              <div className="text-slate-600 text-sm">
                Encuestas creadas
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                10K+
              </div>
              <div className="text-slate-600 text-sm">
                Respuestas procesadas
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                4.9/5
              </div>
              <div className="text-slate-600 text-sm">
                Rating promedio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
