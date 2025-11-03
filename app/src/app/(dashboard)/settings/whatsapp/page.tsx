import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { WhatsAppSettingsClient } from "@/components/settings/whatsapp-settings-client";

export default async function WhatsAppSettingsPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración de WhatsApp</h2>
        <p className="mt-1 text-slate-600">
          Configura cómo se envían los mensajes de WhatsApp a tus encuestados
        </p>
      </div>

      {/* Client Component */}
      <WhatsAppSettingsClient />
    </div>
  );
}
