import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ApiKeyManager } from "./api-key-manager";
import { Code, ExternalLink } from "lucide-react";

export default async function ApiPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, session.user.tenantId),
  });

  if (!tenant) {
    redirect("/login");
  }

  const hasApiKey = !!tenant.apiKeyHash;

  return (
    <div className="max-w-4xl space-y-6">
      {/* API Key Management */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            API Keys
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Gestiona tus claves de API para integraciones
          </p>
        </div>

        <div className="p-6">
          <ApiKeyManager
            tenantId={tenant.id}
            hasKey={hasApiKey}
            keyPrefix={tenant.apiKeyPrefix || undefined}
          />
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Documentación de la API
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Ejemplos y guías para usar la API de ChatForm
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Base URL */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Base URL
            </h3>
            <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-sm">
              <Code className="w-4 h-4 text-slate-500" />
              <code className="text-slate-700">
                https://app.chatform.mx/api/v1
              </code>
            </div>
          </div>

          {/* Authentication */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Autenticación
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Todas las peticiones deben incluir tu API key en el header
              Authorization:
            </p>
            <div className="p-4 bg-slate-900 rounded-lg overflow-x-auto">
              <pre className="text-sm text-slate-100 font-mono">
                <code>
                  {`curl -X GET \\
  https://app.chatform.mx/api/v1/surveys/SURVEY_ID/responses/export \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </code>
              </pre>
            </div>
          </div>

          {/* Available Endpoints */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Endpoints Disponibles
            </h3>

            <div className="space-y-3">
              {/* Export Responses */}
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded mr-2">
                      GET
                    </span>
                    <code className="text-sm font-mono text-slate-700">
                      /surveys/:id/responses/export
                    </code>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Exporta todas las respuestas de una encuesta en formato CSV
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                    Ver ejemplo
                  </summary>
                  <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <pre className="text-xs font-mono overflow-x-auto">
                      <code className="text-slate-700">
                        {`curl https://app.chatform.mx/api/v1/surveys/abc123/responses/export \\
  -H "Authorization: Bearer sk_..."

# Response (CSV):
session_id,question,question_type,answer,answered_at,respondent
sess_1,¿Califica el servicio?,rating,9,2025-10-31T...,+1234567890`}
                      </code>
                    </pre>
                  </div>
                </details>
              </div>

              {/* Trigger Survey */}
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded mr-2">
                      POST
                    </span>
                    <code className="text-sm font-mono text-slate-700">
                      /surveys/:id/trigger
                    </code>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  Envía una encuesta por WhatsApp a un número específico
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                    Ver ejemplo
                  </summary>
                  <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <pre className="text-xs font-mono overflow-x-auto">
                      <code className="text-slate-700">
                        {`curl -X POST https://app.chatform.mx/api/v1/surveys/abc123/trigger \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"phoneNumber": "+1234567890"}'

# Response:
{"success": true, "sessionId": "sess_123"}`}
                      </code>
                    </pre>
                  </div>
                </details>
              </div>
            </div>
          </div>

          {/* Documentation Link */}
          <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Documentación Completa
              </h3>
              <p className="text-sm text-blue-700">
                Encuentra más endpoints, ejemplos y guías en nuestra
                documentación
              </p>
            </div>
            <a
              href="https://docs.chatform.mx/api"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
            >
              Ver Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Rate Limits */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Rate Limits
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Límites de peticiones por plan
          </p>
        </div>

        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 font-semibold text-slate-900">
                  Plan
                </th>
                <th className="text-left py-3 font-semibold text-slate-900">
                  Requests/minuto
                </th>
                <th className="text-left py-3 font-semibold text-slate-900">
                  Requests/día
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-3 text-slate-700">Free</td>
                <td className="py-3 text-slate-600">10</td>
                <td className="py-3 text-slate-600">100</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-3 text-slate-700">Starter</td>
                <td className="py-3 text-slate-600">60</td>
                <td className="py-3 text-slate-600">5,000</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-700">Pro</td>
                <td className="py-3 text-slate-600">300</td>
                <td className="py-3 text-slate-600">50,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
