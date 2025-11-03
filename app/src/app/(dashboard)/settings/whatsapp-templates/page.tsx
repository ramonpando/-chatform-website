import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WhatsAppTemplatesClient } from "@/components/settings/whatsapp-templates-client";

export default async function WhatsAppTemplatesPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Plantillas de WhatsApp</h1>
            <p className="mt-1 text-slate-600">
              Crea y administra mensajes personalizados para envíos masivos
            </p>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <WhatsAppTemplatesClient />
    </div>
  );
}
