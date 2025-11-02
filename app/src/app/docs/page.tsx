import Link from "next/link";
import { Code, Book, Zap, Shield, ArrowRight } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-xl font-bold text-slate-900">ChatForm</div>
            <span className="text-sm text-slate-500">/</span>
            <span className="text-sm font-medium text-slate-600">API Docs</span>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ir al Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            Documentación del API
          </h1>
          <p className="text-lg text-slate-600">
            API REST completa para integrar ChatForm en tu aplicación. Crea encuestas, obtén respuestas,
            y dispara encuestas automáticas programáticamente.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <a
            href="#authentication"
            className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <Shield className="mb-3 h-8 w-8 text-blue-600" />
            <h3 className="mb-2 font-semibold text-slate-900">Autenticación</h3>
            <p className="text-sm text-slate-600">
              Cómo autenticar tus requests con API Keys
            </p>
          </a>

          <a
            href="#endpoints"
            className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <Code className="mb-3 h-8 w-8 text-purple-600" />
            <h3 className="mb-2 font-semibold text-slate-900">Endpoints</h3>
            <p className="text-sm text-slate-600">
              Referencia completa de todos los endpoints disponibles
            </p>
          </a>

          <a
            href="#examples"
            className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
          >
            <Zap className="mb-3 h-8 w-8 text-orange-600" />
            <h3 className="mb-2 font-semibold text-slate-900">Ejemplos</h3>
            <p className="text-sm text-slate-600">
              Código de ejemplo en múltiples lenguajes
            </p>
          </a>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="p-8">
            {/* Base URL */}
            <section className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">Base URL</h2>
              <div className="rounded-lg bg-slate-900 p-4">
                <code className="text-sm text-green-400">
                  https://chatform.mx/api/v1
                </code>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-12">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">Autenticación</h2>
              <p className="mb-4 text-slate-600">
                Todas las requests al API requieren autenticación mediante API Key en el header.
              </p>

              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Obtener tu API Key</h3>
                <ol className="list-decimal space-y-2 pl-6 text-slate-600">
                  <li>Ve a Settings → API Keys en tu dashboard</li>
                  <li>Haz clic en "Generar Nueva API Key"</li>
                  <li>Copia y guarda tu key de forma segura (solo se muestra una vez)</li>
                </ol>
              </div>

              <div className="mb-4">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Usando tu API Key</h3>
                <p className="mb-3 text-slate-600">
                  Incluye tu API key en el header <code className="rounded bg-slate-100 px-2 py-1 text-sm">Authorization</code>:
                </p>
                <div className="rounded-lg bg-slate-900 p-4">
                  <pre className="text-sm text-slate-300">
{`curl https://chatform.mx/api/v1/surveys/abc123/responses \\
  -H "Authorization: Bearer tu_api_key_aqui"`}
                  </pre>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-medium text-amber-900">
                  <Shield className="inline h-4 w-4 mr-2" />
                  Nunca compartas tu API key públicamente ni la incluyas en código client-side.
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints" className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Endpoints</h2>

              {/* Get Responses */}
              <div className="mb-8 rounded-lg border border-slate-200 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    GET
                  </span>
                  <code className="text-lg font-mono text-slate-900">
                    /surveys/:surveyId/responses
                  </code>
                </div>

                <p className="mb-4 text-slate-600">
                  Obtiene todas las respuestas de una encuesta.
                </p>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Parámetros URL</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">surveyId</code>
                      <span className="text-sm text-slate-600">- ID de la encuesta (UUID)</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Query Parameters (opcionales)</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">status</code>
                      <span className="text-sm text-slate-600">- Filtrar por estado: completed, active, abandoned</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">limit</code>
                      <span className="text-sm text-slate-600">- Número máximo de resultados (default: 100)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">offset</code>
                      <span className="text-sm text-slate-600">- Offset para paginación (default: 0)</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Ejemplo de Request</h4>
                  <div className="rounded-lg bg-slate-900 p-4">
                    <pre className="text-sm text-slate-300">
{`curl https://chatform.mx/api/v1/surveys/abc123/responses?status=completed&limit=50 \\
  -H "Authorization: Bearer tu_api_key"`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">Ejemplo de Response</h4>
                  <div className="rounded-lg bg-slate-900 p-4">
                    <pre className="overflow-x-auto text-xs text-slate-300">
{`{
  "success": true,
  "data": {
    "responses": [
      {
        "sessionId": "session_123",
        "phoneNumber": "+521234567890",
        "whatsappName": "Juan Pérez",
        "status": "completed",
        "startedAt": "2025-11-02T10:30:00Z",
        "completedAt": "2025-11-02T10:32:15Z",
        "answers": [
          {
            "questionId": "q1",
            "questionText": "¿Cómo calificarías tu experiencia?",
            "questionType": "rating",
            "answer": 9
          },
          {
            "questionId": "q2",
            "questionText": "¿Qué podemos mejorar?",
            "questionType": "open_text",
            "answer": "El tiempo de entrega fue excelente"
          }
        ]
      }
    ],
    "total": 145,
    "limit": 50,
    "offset": 0
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Trigger Survey */}
              <div className="mb-8 rounded-lg border border-slate-200 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    POST
                  </span>
                  <code className="text-lg font-mono text-slate-900">
                    /surveys/:surveyId/trigger
                  </code>
                </div>

                <p className="mb-4 text-slate-600">
                  Dispara automáticamente una encuesta a un número de WhatsApp.
                </p>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Parámetros URL</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">surveyId</code>
                      <span className="text-sm text-slate-600">- ID de la encuesta (UUID)</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Body Parameters</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">phoneNumber</code>
                      <span className="text-sm text-slate-600">- Número de WhatsApp con código de país (requerido)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">name</code>
                      <span className="text-sm text-slate-600">- Nombre del destinatario (opcional)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="rounded bg-slate-100 px-2 py-1 text-sm text-slate-900">metadata</code>
                      <span className="text-sm text-slate-600">- Datos adicionales en formato JSON (opcional)</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-slate-900">Ejemplo de Request</h4>
                  <div className="rounded-lg bg-slate-900 p-4">
                    <pre className="text-sm text-slate-300">
{`curl -X POST https://chatform.mx/api/v1/surveys/abc123/trigger \\
  -H "Authorization: Bearer tu_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phoneNumber": "+521234567890",
    "name": "María González",
    "metadata": {
      "orderId": "ORD-12345",
      "source": "ecommerce"
    }
  }'`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-semibold text-slate-900">Ejemplo de Response</h4>
                  <div className="rounded-lg bg-slate-900 p-4">
                    <pre className="text-xs text-slate-300">
{`{
  "success": true,
  "data": {
    "sessionId": "session_456",
    "phoneNumber": "+521234567890",
    "status": "sent",
    "message": "Encuesta enviada exitosamente"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Ejemplos de Código</h2>

              {/* JavaScript/Node.js */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">JavaScript / Node.js</h3>
                <div className="rounded-lg bg-slate-900 p-4">
                  <pre className="overflow-x-auto text-sm text-slate-300">
{`// Obtener respuestas
const response = await fetch(
  'https://chatform.mx/api/v1/surveys/abc123/responses',
  {
    headers: {
      'Authorization': 'Bearer tu_api_key'
    }
  }
);
const data = await response.json();
console.log(data.data.responses);

// Disparar encuesta
const triggerResponse = await fetch(
  'https://chatform.mx/api/v1/surveys/abc123/trigger',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer tu_api_key',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phoneNumber: '+521234567890',
      name: 'María González'
    })
  }
);
const result = await triggerResponse.json();
console.log(result);`}
                  </pre>
                </div>
              </div>

              {/* Python */}
              <div className="mb-6">
                <h3 className="mb-3 text-lg font-semibold text-slate-900">Python</h3>
                <div className="rounded-lg bg-slate-900 p-4">
                  <pre className="overflow-x-auto text-sm text-slate-300">
{`import requests

# Obtener respuestas
response = requests.get(
    'https://chatform.mx/api/v1/surveys/abc123/responses',
    headers={'Authorization': 'Bearer tu_api_key'}
)
data = response.json()
print(data['data']['responses'])

# Disparar encuesta
trigger_response = requests.post(
    'https://chatform.mx/api/v1/surveys/abc123/trigger',
    headers={
        'Authorization': 'Bearer tu_api_key',
        'Content-Type': 'application/json'
    },
    json={
        'phoneNumber': '+521234567890',
        'name': 'María González'
    }
)
result = trigger_response.json()
print(result)`}
                  </pre>
                </div>
              </div>

              {/* PHP */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">PHP</h3>
                <div className="rounded-lg bg-slate-900 p-4">
                  <pre className="overflow-x-auto text-sm text-slate-300">
{`<?php
// Obtener respuestas
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://chatform.mx/api/v1/surveys/abc123/responses');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer tu_api_key'
]);
$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data['data']['responses']);

// Disparar encuesta
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://chatform.mx/api/v1/surveys/abc123/trigger');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'phoneNumber' => '+521234567890',
    'name' => 'María González'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer tu_api_key',
    'Content-Type: application/json'
]);
$result = curl_exec($ch);
print_r(json_decode($result, true));
?>`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Error Handling */}
            <section id="errors" className="mb-12">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Manejo de Errores</h2>
              <p className="mb-4 text-slate-600">
                El API usa códigos de estado HTTP estándar para indicar éxito o error.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-green-600">200</span>
                    <span className="text-slate-900">OK - Request exitoso</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-red-600">401</span>
                    <span className="text-slate-900">Unauthorized - API key inválida</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-red-600">403</span>
                    <span className="text-slate-900">Forbidden - No tienes acceso a este recurso</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-red-600">404</span>
                    <span className="text-slate-900">Not Found - Recurso no encontrado</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-red-600">429</span>
                    <span className="text-slate-900">Too Many Requests - Límite de rate excedido</span>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-lg font-semibold text-red-600">500</span>
                    <span className="text-slate-900">Internal Server Error - Error del servidor</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-semibold text-slate-900">Ejemplo de Error Response</h4>
                <div className="rounded-lg bg-slate-900 p-4">
                  <pre className="text-sm text-slate-300">
{`{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API key inválida"
  }
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="mb-6 text-2xl font-bold text-slate-900">Rate Limits</h2>
              <p className="mb-4 text-slate-600">
                Límites de requests por plan:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="pb-3 font-semibold text-slate-900">Plan</th>
                      <th className="pb-3 font-semibold text-slate-900">Requests / minuto</th>
                      <th className="pb-3 font-semibold text-slate-900">Requests / hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="py-3 text-slate-700">Free</td>
                      <td className="py-3 text-slate-700">10</td>
                      <td className="py-3 text-slate-700">100</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-700">Starter</td>
                      <td className="py-3 text-slate-700">30</td>
                      <td className="py-3 text-slate-700">500</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-700">Pro</td>
                      <td className="py-3 text-slate-700">60</td>
                      <td className="py-3 text-slate-700">2000</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-slate-700">Business</td>
                      <td className="py-3 text-slate-700">120</td>
                      <td className="py-3 text-slate-700">5000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-900">
                  Si necesitas límites más altos, contáctanos desde tu dashboard.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            ¿Listo para integrar ChatForm?
          </h2>
          <p className="mb-6 text-lg text-blue-100">
            Genera tu API key y comienza a automatizar tus encuestas hoy
          </p>
          <Link
            href="/settings/api"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 hover:bg-blue-50"
          >
            Generar API Key
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
