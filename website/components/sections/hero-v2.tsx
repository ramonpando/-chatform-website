"use client"

import { ArrowRight, MessageCircle, Sparkles, BarChart3, CheckCircle, TrendingUp } from "lucide-react"

export function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-white">
      {/* Very subtle gradient orbs - barely visible */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-slate-50/40 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Grid: Text Left, App Preview Right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT COLUMN - Text Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 text-blue-600 text-xs font-normal">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                </span>
                Gratis hasta 100 respuestas
              </div>

              {/* Hero Title */}
              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                El Typeform de{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  WhatsApp
                </span>
                <br />
                con IA
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                Crea encuestas conversacionales, envíalas por WhatsApp y obtén{" "}
                <span className="font-semibold text-slate-900">análisis automático con IA</span>.
                De feedback a insights en minutos.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-75 group-hover:opacity-100 transition duration-300 blur-sm group-hover:blur"></div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                    className="relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all"
                  >
                    Comenzar gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Ver demo
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>No requiere tarjeta</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Setup en 5 minutos</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Soporte en español</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - App Preview with floating cards */}
            <div className="relative lg:h-[700px] flex items-center justify-center">
              {/* Main App Mockup */}
              <div className="relative z-10 w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60">
                  {/* Phone frame header */}
                  <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">ChatForm</div>
                        <div className="text-xs text-slate-500">Encuesta activa</div>
                      </div>
                    </div>
                  </div>

                  {/* Chat interface */}
                  <div className="p-6 space-y-4 bg-slate-50 h-[400px]">
                    {/* Bot message */}
                    <div className="flex gap-2">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                        <p className="text-sm text-slate-700">¿Qué tan satisfecho estás con nuestro servicio? 🤔</p>
                      </div>
                    </div>

                    {/* User response */}
                    <div className="flex gap-2 justify-end">
                      <div className="bg-blue-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm max-w-[80%]">
                        <p className="text-sm text-white">¡Muy satisfecho! 😊</p>
                      </div>
                    </div>

                    {/* Bot message */}
                    <div className="flex gap-2">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[80%]">
                        <p className="text-sm text-slate-700">¿Qué es lo que más te gusta?</p>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex gap-2">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card - Top Right */}
              <div className="hidden lg:block absolute top-8 -right-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-52 animate-float">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-[10px] font-normal text-slate-400 uppercase tracking-wide">Tasa respuesta</div>
                </div>
                <div className="text-3xl font-bold text-slate-900">73%</div>
                <div className="text-[10px] text-green-600 mt-1 font-normal">↑ 5x más que email</div>
              </div>

              {/* Floating AI Card - Bottom Left */}
              <div className="hidden lg:block absolute bottom-12 -left-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-56 animate-float-delayed">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-[10px] font-normal text-slate-400 uppercase tracking-wide">Análisis IA</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-normal">Sentiment</span>
                    <span className="font-medium text-green-600">Positivo</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-normal">NPS Score</span>
                    <span className="font-medium text-slate-900">+65</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-normal">Tiempo</span>
                    <span className="font-medium text-slate-900">&lt;30s</span>
                  </div>
                </div>
              </div>

              {/* Floating Dashboard Card - Middle Right */}
              <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-44 animate-float">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  <div className="text-[10px] font-normal text-slate-400 uppercase tracking-wide">Esta semana</div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">1,234</div>
                <div className="text-[10px] text-slate-500 font-normal">respuestas recibidas</div>
                <div className="mt-3 flex gap-1 h-10 items-end">
                  <div className="w-full bg-blue-100 rounded-sm" style={{height: '40%'}}></div>
                  <div className="w-full bg-blue-200 rounded-sm" style={{height: '60%'}}></div>
                  <div className="w-full bg-blue-300 rounded-sm" style={{height: '50%'}}></div>
                  <div className="w-full bg-blue-400 rounded-sm" style={{height: '80%'}}></div>
                  <div className="w-full bg-blue-500 rounded-sm" style={{height: '100%'}}></div>
                  <div className="w-full bg-blue-600 rounded-sm" style={{height: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  )
}
