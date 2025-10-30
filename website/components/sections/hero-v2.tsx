"use client"

import { Button } from "@/components/ui/button"
import { BentoCard, BentoGrid } from "@/components/ui/bento-card"
import { ArrowRight, MessageCircle, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export function HeroV2() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden">
      {/* Chatbase-style gradient background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Two Column Grid: Text Left, App Preview Right */}
        <div className="hero-grid">
          {/* LEFT COLUMN - Text Content */}
          <div className="hero-content">
            {/* Badge */}
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-[var(--text-primary)] text-sm font-semibold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] pulse-dot" />
                Gratis hasta 100 respuestas
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="hero-title-left text-white animate-fade-in-up delay-100">
              Convierte conversaciones
              <br />
              en <span className="text-white drop-shadow-lg">insights accionables</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle-left text-white/90 animate-fade-in-up delay-200">
              Encuestas por WhatsApp con análisis automático de IA.
              De feedback a acción en minutos, no días.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 animate-fade-in-up delay-300">
              <button className="btn-gradient">
                <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`} className="flex items-center gap-2 relative z-10">
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5" />
                </a>
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all border border-white/30">
                <Link href="#demo" className="flex items-center gap-2">
                  Ver demo en vivo
                </Link>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-start gap-6 text-sm text-white/80 animate-fade-in-up delay-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white" />
                <span>Setup en 5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                <span>No requiere tarjeta</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Soporte en español</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - App Preview */}
          <div className="hero-app-preview animate-fade-in-up delay-200">
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white/20 backdrop-blur-sm">
                {/* Placeholder for app mockup */}
                <div className="aspect-[4/5] bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-12">
                  <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                      <MessageCircle className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-[var(--text-primary)] font-semibold mb-2">
                        App Preview
                      </p>
                      <p className="text-sm text-[var(--text-tertiary)]">
                        Mockup placeholder
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
