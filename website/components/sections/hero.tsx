"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient - WhatsApp inspired */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-light)] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary-light)] text-whatsapp text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-whatsapp animate-pulse" />
            Gratis hasta 100 respuestas
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] tracking-tight mb-6 animate-slide-up">
            El Typeform de{" "}
            <span className="text-whatsapp">WhatsApp</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Crea encuestas conversacionales, envíalas por WhatsApp
            y obtén <span className="font-semibold text-[var(--text-primary)]">análisis automático con IA</span>.
            Todo sin código.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" asChild className="w-full sm:w-auto min-w-[200px] group">
              <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}>
                Comenzar gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="secondary" size="lg" asChild className="w-full sm:w-auto min-w-[200px]">
              <Link href="#demo">
                <Play className="w-5 h-5" />
                Ver demo
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-secondary)] animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-whatsapp" />
              <span>No requiere tarjeta</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-whatsapp" />
              <span>Setup en 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-whatsapp" />
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>

        {/* Product Screenshot / Demo */}
        <div className="max-w-6xl mx-auto mt-20 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-[var(--color-gray-200)]">
            {/* Placeholder for screenshot - you'll replace with actual image */}
            <div className="aspect-[16/10] bg-gradient-to-br from-[var(--color-gray-100)] to-[var(--color-gray-50)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-whatsapp" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] font-medium">
                  Product Screenshot Coming Soon
                </p>
                <p className="text-sm text-[var(--text-tertiary)] mt-2">
                  Form Builder + WhatsApp Conversation
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
