import {
  MessageCircle,
  Sparkles,
  BarChart3,
  Zap,
  Globe,
  Shield,
  ArrowRight
} from "lucide-react"

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              entender a tus clientes
            </span>
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Desde crear la encuesta hasta actuar sobre insights. Todo en un solo lugar.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 - Encuestas Conversacionales - Large Featured */}
            <div className="lg:col-span-2 lg:row-span-2 group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-10 border border-blue-100 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-6">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  Encuestas conversacionales
                </h3>
                <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                  Crea surveys que se sienten como una conversación natural por WhatsApp.
                  Tus clientes responden desde donde ya están.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Builder visual sin código</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Lógica condicional avanzada</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Múltiples tipos de pregunta</span>
                  </li>
                </ul>
                {/* Mock chat preview */}
                <div className="bg-white rounded-2xl p-4 shadow-lg">
                  <div className="space-y-3">
                    <div className="bg-slate-100 rounded-xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-slate-700">¿Cómo calificarías nuestro servicio?</p>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-600 rounded-xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                        <p className="text-sm text-white">⭐⭐⭐⭐⭐</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - IA Analysis */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                IA que analiza todo
              </h3>
              <p className="text-slate-700 mb-6">
                Análisis automático en segundos. NPS, CSAT, sentiment y temas.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Sentiment</span>
                    <span className="text-xs font-semibold text-green-600">Positivo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">NPS</span>
                    <span className="text-xs font-semibold text-slate-900">+72</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600">Tiempo</span>
                    <span className="text-xs font-semibold text-slate-900">&lt;30s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Dashboard */}
            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Dashboard con insights
              </h3>
              <p className="text-slate-700 mb-6">
                Métricas en tiempo real, filtros avanzados y exportación.
              </p>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex gap-1 h-16 items-end">
                  <div className="w-full bg-green-200 rounded-sm" style={{height: '50%'}}></div>
                  <div className="w-full bg-green-300 rounded-sm" style={{height: '70%'}}></div>
                  <div className="w-full bg-green-400 rounded-sm" style={{height: '60%'}}></div>
                  <div className="w-full bg-green-500 rounded-sm" style={{height: '90%'}}></div>
                  <div className="w-full bg-green-600 rounded-sm" style={{height: '100%'}}></div>
                </div>
              </div>
            </div>

            {/* Card 4 - Setup Rápido */}
            <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border border-orange-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Setup en minutos
              </h3>
              <p className="text-slate-700 mb-4">
                Sin developers. Templates listos. Soporte en español.
              </p>
              <div className="text-4xl font-bold text-orange-600">5 min</div>
            </div>

            {/* Card 5 - Multi-idioma */}
            <div className="group relative bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 border border-cyan-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Multi-idioma
              </h3>
              <p className="text-slate-700 mb-4">
                Análisis en 10+ idiomas con IA cross-language.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-0.5 bg-white rounded-full text-[10px] font-normal text-slate-500 shadow-sm">🇪🇸 ES</span>
                <span className="px-2.5 py-0.5 bg-white rounded-full text-[10px] font-normal text-slate-500 shadow-sm">🇺🇸 EN</span>
                <span className="px-2.5 py-0.5 bg-white rounded-full text-[10px] font-normal text-slate-500 shadow-sm">🇧🇷 PT</span>
                <span className="px-2.5 py-0.5 bg-white rounded-full text-[10px] font-normal text-slate-500 shadow-sm">🇫🇷 FR</span>
              </div>
            </div>

            {/* Card 6 - Seguridad */}
            <div className="group relative bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Seguro y confiable
              </h3>
              <p className="text-slate-700 mb-4">
                GDPR, CCPA, encriptación E2E y 99.9% uptime.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <Shield className="w-4 h-4" />
                <span>WhatsApp Business API Oficial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold text-lg hover:text-blue-700 transition-colors group"
          >
            Ver demo interactivo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
