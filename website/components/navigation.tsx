"use client"

import Link from "next/link"
import Image from "next/image"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo-black.svg"
              alt="ChatForm"
              width={140}
              height={28}
              priority
              className="h-7 w-auto transition-opacity group-hover:opacity-70"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#use-cases"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Casos de uso
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              FAQ
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/login`}
              className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2"
            >
              Iniciar sesión
            </a>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                className="relative inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-all"
              >
                Comenzar gratis
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
