"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, CreditCard, Building2, Key } from "lucide-react";

const tabs = [
  {
    name: "Perfil",
    href: "/settings/profile",
    icon: User,
  },
  {
    name: "Facturación",
    href: "/settings/billing",
    icon: CreditCard,
  },
  {
    name: "Workspace",
    href: "/settings/workspace",
    icon: Building2,
  },
  {
    name: "API",
    href: "/settings/api",
    icon: Key,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="mt-2 text-slate-600">
          Administra tu cuenta, workspace y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
