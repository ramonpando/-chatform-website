"use client"

import { Button } from "@/components/ui/button"
import { BentoCard, BentoGrid } from "@/components/ui/bento-card"
import { ArrowRight, MessageCircle, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export function HeroV2() {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Two Column Grid: Text Left, App Preview Right */}
        <div className="hero-grid">
          {/* LEFT COLUMN - Text Content */}
          <div className="hero-content">
            {/* Badge */}
            <div className="mb-8 animate-fade-in-up">
              <div className="badge badge-primary">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] pulse-dot" />
                Gratis hasta 100 respuestas
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="hero-title-left animate-fade-in-up delay-100">
              Convierte conversaciones
              <br />
              en <span className="text-accent">insights accionables</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle-left animate-fade-in-up delay-200">
              Encuestas por WhatsApp con análisis automático de IA.
              De feedback a acción en minutos, no días.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 animate-fade-in-up delay-300">
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

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-start gap-6 text-sm text-[var(--text-secondary)] animate-fade-in-up delay-400">
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

          {/* RIGHT COLUMN - App Preview */}
          <div className="hero-app-preview animate-fade-in-up delay-200">
            <div className="app-mockup-container">
              {/* Placeholder for app mockup */}
              <div className="mockup-placeholder">
                <div className="flex flex-col items-center justify-center h-full gap-6">
                  <MessageCircle className="w-24 h-24 text-[var(--color-primary)] opacity-20" />
                  <div className="text-center">
                    <p className="text-sm text-[var(--text-tertiary)] font-medium">
                      App Preview
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      Mockup placeholder
                    </p>
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
