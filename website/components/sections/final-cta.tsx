import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6TTI2IDM0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek00NiAzNGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAtMTBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

            {/* Content */}
            <div className="relative">
              <div className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                🎉 Lanzamiento especial
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Comienza a recibir más respuestas hoy
              </h2>

              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Únete a las empresas que ya están obteniendo 5-10x más respuestas
                con encuestas por WhatsApp.
              </p>

              {/* Benefits */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Gratis hasta 100 respuestas</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Setup en 5 minutos</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto min-w-[220px] bg-white text-primary-600 hover:bg-neutral-50 h-14 text-lg shadow-large group"
                >
                  <Link href="/signup">
                    Crear cuenta gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="w-full sm:w-auto min-w-[220px] text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 h-14 text-lg"
                >
                  <Link href="/contact">
                    Hablar con ventas
                  </Link>
                </Button>
              </div>

              {/* Trust indicator */}
              <p className="text-white/80 text-sm mt-8">
                Ya confían en nosotros: Ecommerce, SaaS, Agencias, y más
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                100+
              </div>
              <div className="text-neutral-600 text-sm">
                Encuestas creadas
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                10K+
              </div>
              <div className="text-neutral-600 text-sm">
                Respuestas procesadas
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                4.9/5
              </div>
              <div className="text-neutral-600 text-sm">
                Rating promedio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
