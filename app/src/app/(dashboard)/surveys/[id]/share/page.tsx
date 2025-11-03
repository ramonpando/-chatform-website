import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, QrCode, Copy, MessageCircle, Send } from "lucide-react";
import { SharePageClient } from "@/components/surveys/share-page-client";

export default async function ShareSurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Get survey
  const survey = await db.query.surveys.findFirst({
    where: and(
      eq(surveys.id, id),
      eq(surveys.tenantId, session.user.tenantId)
    ),
  });

  if (!survey) {
    notFound();
  }

  // Generate URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicUrl = `${baseUrl}/s/${survey.shortCode}`;

  // WhatsApp direct link
  const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";
  const cleanNumber = whatsappNumber.replace(/whatsapp:/g, "").replace(/\+/g, "");
  const startMessage = `START_${survey.shortCode}`;
  const waDirectLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(startMessage)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/surveys"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Compartir Encuesta</h1>
            <p className="mt-1 text-slate-600">{survey.title}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/surveys/${survey.id}/send`}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 transition-all font-semibold inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Envío Masivo
          </Link>
          <Link
            href={`/surveys/${survey.id}/edit`}
            className="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors font-semibold"
          >
            Editar Encuesta
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Link Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ExternalLink className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Link Público</h2>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Comparte este link en redes sociales, email, o donde quieras.
          </p>

          <div className="space-y-3">
            {/* Public URL */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                URL de la encuesta
              </label>
              <SharePageClient
                url={publicUrl}
                label="Link copiado"
                buttonText="Copiar Link"
              />
            </div>

            {/* WhatsApp Direct */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Link directo a WhatsApp
              </label>
              <SharePageClient
                url={waDirectLink}
                label="Link de WhatsApp copiado"
                buttonText="Copiar Link WhatsApp"
                icon={<MessageCircle className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Preview Button */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
              Ver página pública
            </a>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <QrCode className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Código QR</h2>
          </div>

          <p className="text-sm text-slate-600 mb-4">
            Imprime o comparte este QR para acceso rápido desde móvil.
          </p>

          {/* QR Code Display */}
          <SharePageClient
            url={publicUrl}
            showQR={true}
          />
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          💡 Ideas para compartir tu encuesta
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-slate-900 mb-2">📱 Redes Sociales</h4>
            <p className="text-sm text-slate-600">
              Comparte el link en Instagram Stories, Facebook, o Twitter para llegar a tu audiencia.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-slate-900 mb-2">📧 Email Marketing</h4>
            <p className="text-sm text-slate-600">
              Agrega el link en tu newsletter o email signature para recolectar feedback continuo.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-slate-900 mb-2">🖨️ QR Impreso</h4>
            <p className="text-sm text-slate-600">
              Imprime el QR en flyers, tarjetas de visita, o en tu local físico.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-slate-900 mb-2">💬 WhatsApp Status</h4>
            <p className="text-sm text-slate-600">
              Publica el link o QR en tu WhatsApp Status para que tus contactos respondan.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Preview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{survey.viewCount}</div>
          <div className="text-sm text-slate-600 mt-1">Vistas del link</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">{survey.responseCount}</div>
          <div className="text-sm text-slate-600 mt-1">Respuestas recibidas</div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">
            {survey.viewCount > 0
              ? Math.round((survey.responseCount / survey.viewCount) * 100)
              : 0}%
          </div>
          <div className="text-sm text-slate-600 mt-1">Tasa de conversión</div>
        </div>
      </div>
    </div>
  );
}
