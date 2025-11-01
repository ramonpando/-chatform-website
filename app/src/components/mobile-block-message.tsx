"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MobileBlockMessageProps {
  variant?: "create" | "edit";
}

export function MobileBlockMessage({ variant = "create" }: MobileBlockMessageProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check both screen width and user agent
      const screenWidth = window.innerWidth < 1024;
      const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(screenWidth || userAgent);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
            <Smartphone className="w-8 h-8 text-slate-400" />
          </div>
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
            <Monitor className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Pantalla muy pequeña
        </h1>

        {/* Description */}
        <p className="text-slate-600 mb-6 leading-relaxed">
          {variant === "create"
            ? "Crear encuestas requiere una pantalla más grande para aprovechar todas las herramientas del editor."
            : "Editar encuestas requiere una pantalla más grande para aprovechar todas las herramientas del editor."}
        </p>

        {/* Features Available on Mobile */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Puedes hacer esto desde tu móvil:
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Ver resultados y analíticas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Compartir encuestas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>Exportar datos a CSV</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
            <Monitor className="w-4 h-4" />
            <span>Abre este link en una computadora</span>
          </div>

          <Link
            href="/surveys"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mis Encuestas
          </Link>
        </div>
      </div>
    </div>
  );
}
