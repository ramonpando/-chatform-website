import Link from "next/link";
import { MessageCircle, Sparkles, BarChart3, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">ChatForm</span>
          </div>
          <nav className="flex items-center gap-8">
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Precios
            </Link>
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Iniciar Sesión
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Comenzar Gratis
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 w-fit">
                <Sparkles className="h-4 w-4" />
                Encuestas conversacionales con IA
              </div>
              <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900">
                Encuestas por WhatsApp que tus clientes{" "}
                <span className="text-blue-600">realmente responden</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-slate-600">
                Olvídate de los formularios web tradicionales. Con ChatForm, tus clientes responden encuestas
                conversacionales directamente en WhatsApp. Más natural, más respuestas, mejores insights.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
                >
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Ver Planes
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Sin tarjeta de crédito. 1 encuesta gratis para siempre.
              </p>
            </div>

            {/* Hero Image/Demo */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">WhatsApp</div>
                    <div className="text-sm text-slate-500">Encuesta de satisfacción</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 p-4">
                    <p className="text-sm text-slate-700">
                      ¡Hola! 👋 Gracias por tu compra. ¿Qué tal tu experiencia?
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-2">
                      <p className="text-sm text-white">Excelente! 10/10 ⭐</p>
                    </div>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-slate-100 p-4">
                    <p className="text-sm text-slate-700">
                      ¡Genial! ¿Algo que podamos mejorar?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Todo lo que necesitas para encuestas profesionales
            </h2>
            <p className="text-lg text-slate-600">
              Plataforma completa con IA para crear, distribuir y analizar encuestas
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                WhatsApp Conversacional
              </h3>
              <p className="text-slate-600">
                Tus clientes responden por WhatsApp como si estuvieran chateando contigo.
                Sin apps, sin formularios web, 100% conversacional.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Generador con IA
              </h3>
              <p className="text-slate-600">
                Describe lo que quieres preguntar y nuestra IA genera la encuesta completa en segundos.
                Optimizada para WhatsApp.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Análisis Inteligente
              </h3>
              <p className="text-slate-600">
                IA analiza tus respuestas, extrae insights, detecta sentimientos y genera
                recomendaciones accionables.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Rápido y Simple
              </h3>
              <p className="text-slate-600">
                Crea tu primera encuesta en menos de 2 minutos. Sin curva de aprendizaje,
                sin configuraciones complejas.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100">
                <CheckCircle2 className="h-6 w-6 text-cyan-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Templates Listos
              </h3>
              <p className="text-slate-600">
                20+ templates profesionales para satisfacción, NPS, feedback de producto,
                y más. Personalizables con tu marca.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <BarChart3 className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                Analytics en Tiempo Real
              </h3>
              <p className="text-slate-600">
                Dashboard completo con métricas, gráficas, exportación CSV y más.
                Todo lo que necesitas para tomar decisiones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Cómo funciona
            </h2>
            <p className="text-lg text-slate-600">
              En 3 pasos simples, de la idea a insights accionables
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  1
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">Crea tu encuesta</h3>
              <p className="text-slate-600">
                Usa IA para generar preguntas, empieza desde un template, o crea desde cero.
                Todo listo en minutos.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  2
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">Comparte por WhatsApp</h3>
              <p className="text-slate-600">
                Envía el link o QR a tus clientes. Ellos responden conversacionalmente
                en WhatsApp, sin fricciones.
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  3
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">Analiza con IA</h3>
              <p className="text-slate-600">
                Nuestra IA procesa las respuestas, extrae insights, y te da recomendaciones
                accionables automáticamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Comienza a obtener feedback real hoy
          </h2>
          <p className="mb-8 text-lg text-blue-100">
            1 encuesta gratis para siempre. Sin tarjeta de crédito. Configuración en 2 minutos.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50"
            >
              Comenzar Gratis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-8 py-4 text-lg font-semibold text-white hover:bg-white/10"
            >
              Ver Planes y Precios
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-slate-900">ChatForm</span>
              </div>
              <p className="text-sm text-slate-600">
                Encuestas conversacionales por WhatsApp con IA
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Producto</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/pricing" className="hover:text-slate-900">Precios</Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-slate-900">Comenzar Gratis</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <Link href="/docs" className="hover:text-slate-900">Documentación API</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold text-slate-900">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>
                  <a href="#" className="hover:text-slate-900">Términos de Servicio</a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900">Política de Privacidad</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            © {new Date().getFullYear()} ChatForm. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
