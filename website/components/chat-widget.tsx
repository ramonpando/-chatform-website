"use client"

import { useState } from "react"
import { X, Send } from "lucide-react"
import Image from "next/image"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Abrir chat"
      >
        <div className="relative">
          {/* Gradient glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-300 blur-md"></div>

          {/* Button */}
          <div className="relative w-16 h-16 bg-[#0066FF] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <Image
                src="/chatform-icon.svg"
                alt="ChatForm"
                width={40}
                height={25}
                className="w-10 h-auto"
              />
            )}
          </div>
        </div>

        {/* Pulse indicator */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header - WhatsApp style */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4 flex items-center gap-3">
              <Image
                src="/chatform-icon.svg"
                alt="ChatForm"
                width={40}
                height={25}
                className="w-10 h-auto"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm">ChatForm</h3>
                <p className="text-xs text-slate-300">Responde en minutos</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages - WhatsApp background */}
            <div className="h-[400px] overflow-y-auto p-5 bg-[#e5ddd5] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0id2hhdHNhcHAtYmciIHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMCAwTDEwMCAwTDEwMCAxMDBMMCAxMDBaIiBmaWxsPSIjZTVkZGQ1Ii8+PHBhdGggZD0iTTAgMEw1MCA1MEwwIDEwMFoiIGZpbGw9IiNkOWQzY2MiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjxwYXRoIGQ9Ik0xMDAgMEw1MCA1MEwxMDAgMTAwWiIgZmlsbD0iI2Q5ZDNjYyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCN3aGF0c2FwcC1iZykiLz48L3N2Zz4=')]">
              <div className="space-y-4">
                {/* Bot message */}
                <div className="flex gap-2 items-start">
                  <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm max-w-[85%]">
                    <p className="text-sm text-slate-700">
                      ¡Hola! 👋 ¿En qué podemos ayudarte?
                    </p>
                    <p className="text-xs text-slate-400 mt-1">10:30</p>
                  </div>
                </div>

                {/* Quick replies */}
                <div className="space-y-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/signup`}
                    className="block bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-slate-100"
                  >
                    <p className="text-sm font-medium text-slate-900">🚀 Comenzar gratis</p>
                    <p className="text-xs text-slate-500 mt-0.5">Sin tarjeta de crédito</p>
                  </a>

                  <button className="w-full text-left bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                    <p className="text-sm font-medium text-slate-900">📊 Ver demo</p>
                    <p className="text-xs text-slate-500 mt-0.5">Funcionalidades en acción</p>
                  </button>

                  <button className="w-full text-left bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                    <p className="text-sm font-medium text-slate-900">💬 Hablar con ventas</p>
                    <p className="text-xs text-slate-500 mt-0.5">Agenda una llamada</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Input - WhatsApp style */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
