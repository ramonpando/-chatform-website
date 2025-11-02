import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { SupportForm } from "./support-form";
import { MessageCircle, Mail, BookOpen } from "lucide-react";

export default async function SupportPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Centro de Soporte</h1>
        <p className="mt-2 text-slate-600">
          ¿Necesitas ayuda? Estamos aquí para ti
        </p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <a
          href="/docs"
          target="_blank"
          className="block rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Documentación API</h3>
          <p className="text-sm text-slate-600">
            Guías completas para integrar ChatForm
          </p>
        </a>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Chat en Vivo</h3>
          <p className="text-sm text-slate-600 mb-3">
            Respuesta en minutos (Lun-Vie 9am-6pm)
          </p>
          <span className="inline-flex items-center text-xs font-medium text-slate-500">
            Próximamente
          </span>
        </div>

        <a
          href="mailto:support@chatform.mx"
          className="block rounded-xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
            <Mail className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
          <p className="text-sm text-slate-600">
            support@chatform.mx
          </p>
        </a>
      </div>

      {/* Support Ticket Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Crear Ticket de Soporte
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Describe tu problema y te responderemos lo antes posible
          </p>
        </div>

        <div className="p-6">
          <SupportForm
            userEmail={session.user.email || ""}
            userName={session.user.name || ""}
            tenantId={session.user.tenantId || ""}
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="divide-y divide-slate-200">
          <details className="group p-6">
            <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between">
              ¿Cómo configuro WhatsApp?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              1. Ve a Settings → API<br />
              2. Copia tu API key<br />
              3. Configura el webhook de Twilio a: <code className="bg-slate-100 px-2 py-1 rounded">https://tu-dominio.com/api/webhooks/whatsapp</code><br />
              4. ¡Listo! Tus encuestas ya funcionan por WhatsApp
            </p>
          </details>

          <details className="group p-6">
            <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between">
              ¿Cuánto cuesta cada respuesta adicional?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Si superas tu límite mensual:<br />
              - Starter: $0.25 por respuesta adicional<br />
              - Pro: $0.15 por respuesta adicional<br />
              - Business: $0.10 por respuesta adicional
            </p>
          </details>

          <details className="group p-6">
            <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between">
              ¿Puedo cancelar en cualquier momento?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Sí, puedes cancelar en cualquier momento desde Settings → Billing.<br />
              Tu plan se mantendrá activo hasta el final del período de facturación.<br />
              No hay penalizaciones ni cargos por cancelación.
            </p>
          </details>

          <details className="group p-6">
            <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between">
              ¿Los datos de mis encuestas son privados?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              Absolutamente. Tus encuestas y respuestas son 100% privadas.<br />
              - Nunca compartimos tus datos con terceros<br />
              - Encriptación en tránsito y en reposo<br />
              - Cumplimos con GDPR y regulaciones de privacidad<br />
              - Puedes exportar o eliminar tus datos en cualquier momento
            </p>
          </details>

          <details className="group p-6">
            <summary className="cursor-pointer font-semibold text-slate-900 list-none flex items-center justify-between">
              ¿Cómo uso el AI Survey Generator?
              <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-sm text-slate-600">
              1. Upgrade a plan Pro o Business<br />
              2. Ve a Surveys → Crear Nueva<br />
              3. Elige "Generar con IA"<br />
              4. Describe qué quieres preguntar<br />
              5. La IA genera la encuesta completa automáticamente<br />
              <br />
              También puedes usar el AI Conversational Builder para crear encuestas chateando con la IA.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
