"use client"

import { Button } from "@/components/ui/button"
import { BentoCard, BentoGrid } from "@/components/ui/bento-card"
import { ArrowRight, MessageCircle, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export function HeroV2() {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="badge badge-primary">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] pulse-dot" />
            Gratis hasta 100 respuestas
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="hero-title animate-fade-in-up delay-100">
          Convierte conversaciones
          <br />
          en <span className="gradient-text">insights accionables</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle animate-fade-in-up delay-200">
          Encuestas por WhatsApp con análisis automático de IA.
          <br />
          De feedback a acción en minutos, no días.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <button className="btn-accent text-white">
            <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`} className="flex items-center gap-2">
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </a>
          </button>
          <button className="btn-outline">
            <Link href="#demo" className="flex items-center gap-2">
              Ver demo en vivo
            </Link>
          </button>
        </div>

        {/* Bento Grid with Feature Cards */}
        <div className="max-w-6xl mx-auto animate-fade-in-up delay-400">
          <BentoGrid columns={2}>
            {/* Card 1: Conversational */}
            <BentoCard background="lavender">
              <div className="flex flex-col h-full">
                <div className="mockup-container mb-6 bg-white/50 rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
                  <MessageCircle className="w-20 h-20 text-[var(--color-primary)] opacity-40" />
                </div>
                <div className="mt-auto">
                  <h3 className="card-title">Conversational</h3>
                  <p className="card-description">
                    Natural como hablar con un amigo. Tus clientes responden desde WhatsApp.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Card 2: AI Analytics */}
            <BentoCard background="mint">
              <div className="flex flex-col h-full">
                <div className="mockup-container mb-6 bg-white/50 rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
                  <Sparkles className="w-20 h-20 text-[var(--color-success)] opacity-40" />
                </div>
                <div className="mt-auto">
                  <h3 className="card-title">AI Analytics</h3>
                  <p className="card-description">
                    NPS, CSAT, Sentiment analysis en menos de 30 segundos. Automático.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Card 3: High Response */}
            <BentoCard background="peach">
              <div className="flex flex-col h-full">
                <div className="metric-card mb-6">
                  <div className="metric-value gradient-text">78%</div>
                  <div className="metric-label">Tasa de respuesta</div>
                </div>
                <div className="mt-auto">
                  <h3 className="card-title">5-10x más respuestas</h3>
                  <p className="card-description">
                    Que email. Porque tus clientes ya están en WhatsApp.
                  </p>
                </div>
              </div>
            </BentoCard>

            {/* Card 4: Real-time Insights */}
            <BentoCard background="sky">
              <div className="flex flex-col h-full">
                <div className="mockup-container mb-6 bg-white/50 rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
                  <TrendingUp className="w-20 h-20 text-[var(--color-primary)] opacity-40" />
                </div>
                <div className="mt-auto">
                  <h3 className="card-title">Insights en tiempo real</h3>
                  <p className="card-description">
                    Dashboard actualizado al instante. Ve qué piensan tus clientes ahora.
                  </p>
                </div>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-[var(--text-secondary)] animate-fade-in-up delay-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Setup en 5 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <span>No requiere tarjeta</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[var(--color-primary)]" />
            <span>Soporte en español</span>
          </div>
        </div>
      </div>
    </section>
  )
}
