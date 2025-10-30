"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-black.svg"
              alt="ChatForm"
              width={160}
              height={28}
              priority
              className="h-7 w-auto transition-opacity group-hover:opacity-80"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/templates"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Templates
            </Link>
            <Link
              href="/use-cases"
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Casos de uso
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/login`}>
                Iniciar sesión
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}>
                Comenzar gratis
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
