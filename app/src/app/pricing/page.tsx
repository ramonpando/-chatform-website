import Link from "next/link";
import { PLAN_LIMITS } from "@/lib/constants/pricing";

export default function PricingPage() {
  const plans = [
    {
      key: 'free',
      ...PLAN_LIMITS.free,
      cta: 'Empezar Gratis',
      ctaLink: '/auth/register',
    },
    {
      key: 'starter',
      ...PLAN_LIMITS.starter,
      cta: 'Empezar Prueba',
      ctaLink: '/auth/register?plan=starter',
    },
    {
      key: 'pro',
      ...PLAN_LIMITS.pro,
      cta: 'Empezar Prueba',
      ctaLink: '/auth/register?plan=pro',
    },
    {
      key: 'business',
      ...PLAN_LIMITS.business,
      cta: 'Contactar Ventas',
      ctaLink: '/contact',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-white">
            ChatForm
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/auth/login" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Empezar Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Precios Simples y Transparentes
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          Encuestas por WhatsApp + AI para generar y analizar. Todo en una plataforma.
        </p>

        {/* Annual/Monthly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Mensual</span>
          <button className="relative w-14 h-8 bg-blue-600 rounded-full">
            <span className="absolute right-1 top-1 w-6 h-6 bg-white rounded-full transition-transform" />
          </button>
          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
            Anual <span className="text-green-600">(Ahorra 20%)</span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl border-2 p-8 bg-white dark:bg-zinc-900 ${
                (plan as any).popular
                  ? 'border-blue-600 shadow-xl shadow-blue-600/20'
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {/* Popular Badge */}
              {(plan as any).popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  Más Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-zinc-600 dark:text-zinc-400">/mes</span>
                </div>
                {plan.priceAnnual > 0 && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">
                    o ${plan.priceAnnual}/año
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href={plan.ctaLink}
                className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${
                  (plan as any).popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
          Preguntas Frecuentes
        </h2>

        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              ¿Qué pasa si me paso de mi límite de respuestas?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Puedes comprar respuestas adicionales: $0.25/respuesta (Starter), $0.15/respuesta (Pro),
              o $0.10/respuesta (Business). O puedes actualizar tu plan en cualquier momento.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              ¿Cómo funcionan las encuestas por WhatsApp?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Tus usuarios reciben un link único, al abrirlo inician la encuesta por WhatsApp.
              Cada pregunta se envía de forma conversacional y las respuestas quedan guardadas en tu dashboard.
              Usamos Meta Business API directamente (no Twilio) para los mejores precios.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              ¿Qué incluyen las funciones de AI?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              AI Survey Generator: Crea encuestas completas con solo describir lo que necesitas.
              AI Response Analyzer: Analiza automáticamente respuestas abiertas, genera insights y reportes.
              Solo disponible en planes Pro y Business.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              ¿Puedo cambiar de plan en cualquier momento?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sí, puedes actualizar o bajar tu plan cuando quieras. Los cambios se aplican inmediatamente
              y se prorratea el costo del mes actual.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
              ¿Ofrecen descuentos para ONGs o educación?
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sí, ofrecemos descuentos especiales para organizaciones sin fines de lucro e instituciones
              educativas. Contáctanos para más información.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Empieza gratis hoy. No necesitas tarjeta de crédito.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Crear Cuenta Gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-4">ChatForm</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Encuestas profesionales por WhatsApp con AI integrado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/pricing">Precios</Link></li>
                <li><Link href="/features">Características</Link></li>
                <li><Link href="/docs">Documentación</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/about">Nosotros</Link></li>
                <li><Link href="/contact">Contacto</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li><Link href="/privacy">Privacidad</Link></li>
                <li><Link href="/terms">Términos</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-600 dark:text-zinc-400">
            © 2025 ChatForm. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
