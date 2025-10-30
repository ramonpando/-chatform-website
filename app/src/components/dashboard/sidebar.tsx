"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, BarChart3, Settings, LogOut, Sparkles } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Encuestas", href: "/surveys", icon: FileText },
  { name: "Analíticas", href: "/analytics", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  const planColors = {
    free: "bg-slate-100 text-slate-700",
    starter: "bg-blue-100 text-blue-700",
    pro: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white",
  };

  const userPlan = (session?.user?.tenantPlan || "free").toLowerCase();

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo-black.svg"
            alt="ChatForm"
            width={150}
            height={25}
            className="h-6 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade CTA (if free plan) */}
      {userPlan === "free" && (
        <div className="mx-3 mb-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 p-4">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Upgrade to Starter</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Desbloquea AI ilimitado y más features
                </p>
              </div>
            </div>
            <Link
              href="/settings/billing"
              className="block w-full text-center px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors mt-3"
            >
              Ver planes
            </Link>
          </div>
        </div>
      )}

      {/* User info */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-slate-900">{session?.user?.name || "Usuario"}</p>
          <p className="text-xs text-slate-600">{session?.user?.email}</p>
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${
                planColors[userPlan as keyof typeof planColors] || planColors.free
              }`}
            >
              {userPlan === "pro" && <Sparkles className="w-2.5 h-2.5" />}
              {userPlan}
            </span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
