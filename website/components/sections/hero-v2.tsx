"use client"

import { ArrowRight, MessageCircle, Sparkles, BarChart3, CheckCircle, TrendingUp } from "lucide-react"
import Image from "next/image"

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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100/50 text-blue-600 text-xs font-normal">
                <Sparkles className="w-3 h-3" />
                AI genera tu encuesta en segundos
              </div>

              {/* Hero Title */}
              <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Crea encuestas con{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  IA
                </span>
                {" "}y envíalas por WhatsApp
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                Describe tu encuesta, la <span className="font-semibold text-slate-900">IA la crea por ti</span>.
                Envía por WhatsApp y obtén{" "}
                <span className="font-semibold text-slate-900">análisis automático</span>.
                10x más respuestas que email.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md opacity-75 group-hover:opacity-100 transition duration-300 blur-sm group-hover:blur"></div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                    className="relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-md font-semibold text-lg hover:bg-slate-800 transition-all"
                  >
                    Crear encuesta en 2 minutos
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-md font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all"
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
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-900">4.9</span>
                  <span className="text-xs text-slate-500">• 127 reviews</span>
                </div>
                <div className="h-4 w-px bg-slate-300" />
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Gratis 25 respuestas/mes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span>Sin tarjeta</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - App Preview with floating cards */}
            <div className="relative lg:h-[700px] flex items-center justify-center">
              {/* Main App Mockup */}
              <div className="relative z-0 w-full max-w-md">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60">
                  {/* Phone frame header */}
                  <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/chatform-icon.svg"
                        alt="ChatForm"
                        width={40}
                        height={25}
                        className="w-10 h-auto"
                      />
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
              <div className="hidden lg:block absolute top-8 -right-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-52 animate-float z-20">
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
              <div className="hidden lg:block absolute bottom-12 -left-8 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-56 animate-float-delayed z-20">
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
              <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-12 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 w-44 animate-float z-20">
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

          {/* Logo Carousel - Trust Badges */}
          <div className="mt-24">
            <p className="text-center text-xs text-slate-400 uppercase tracking-wide mb-8">
              Empresas que confían en ChatForm
            </p>
            <div className="relative overflow-hidden">
              <div className="flex gap-12 items-center justify-center flex-wrap md:flex-nowrap">
                {/* Placeholder logos - replace with actual logos */}
                <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div className="h-8 w-32 bg-slate-200 rounded flex items-center justify-center text-xs font-semibold text-slate-600">
                    Company 1
                  </div>
                </div>
                <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div className="h-8 w-32 bg-slate-200 rounded flex items-center justify-center text-xs font-semibold text-slate-600">
                    Company 2
                  </div>
                </div>
                <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div className="h-8 w-32 bg-slate-200 rounded flex items-center justify-center text-xs font-semibold text-slate-600">
                    Company 3
                  </div>
                </div>
                <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                  <div className="h-8 w-32 bg-slate-200 rounded flex items-center justify-center text-xs font-semibold text-slate-600">
                    Company 4
                  </div>
                </div>
                <div className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hidden md:block">
                  <div className="h-8 w-32 bg-slate-200 rounded flex items-center justify-center text-xs font-semibold text-slate-600">
                    Company 5
                  </div>
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
