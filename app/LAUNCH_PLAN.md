# 🚀 ChatForm - PLAN COMPLETO DE LAUNCH

**Fecha:** 31 Oct 2025 - 04:30 UTC
**Objetivo:** Launch completo con todas las features
**Timeline:** 4-5 días de trabajo intenso

---

## ✅ ESTADO ACTUAL - LO QUE YA FUNCIONA

### Database ✅ (100%)
- ✅ Supabase project creado
- ✅ DATABASE_URL configurado
- ✅ Schema pusheado exitosamente (`npm run db:push` ejecutado)
- ✅ Todas las tablas creadas:
  - tenants
  - users
  - tenant_users
  - surveys
  - questions
  - survey_sessions
  - responses
  - short_links

### Frontend/UI ✅ (95%)
- ✅ 13 páginas completamente diseñadas y funcionales
- ✅ Auth flows (login/signup)
- ✅ Dashboard con stats reales de DB
- ✅ Survey builder visual
- ✅ Editor de 3 tipos de preguntas
- ✅ Share page con QR codes
- ✅ Results dashboard con charts
- ✅ Analytics global con gráficos interactivos
- ✅ Settings (4 páginas: Profile, Billing, Workspace, API)
- ✅ Componentes reutilizables

### APIs Básicas ✅ (60%)
- ✅ Auth endpoints funcionando
- ✅ Survey CRUD completo
- ✅ WhatsApp webhook handler (código listo)
- ✅ CSV export con API key protection
- ✅ Public survey endpoint

---

## ❌ LO QUE FALTA PARA LAUNCH COMPLETO

### 🔴 PRIORIDAD CRÍTICA - DÍA 1 (6-8 horas)

#### 1. Settings API Endpoints ⚠️
**Status:** 0% | **Tiempo:** 3-4 horas | **Blocker:** Settings no guardan cambios

**Endpoints a crear:**

##### a) `/api/user/profile` PATCH
```typescript
// File: src/app/api/user/profile/route.ts
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, currentPassword, newPassword } = await req.json();

  // 1. Update name/email (simple)
  if (name || email) {
    const updates: any = {};
    if (name) updates.name = name;
    if (email && email !== session.user.email) {
      // Check if email is already taken
      const existing = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existing) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
      updates.email = email;
    }

    await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.email, session.user.email));
  }

  // 2. Change password (if provided)
  if (currentPassword && newPassword) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "No password set" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.email, session.user.email));
  }

  return NextResponse.json({ success: true });
}
```

##### b) `/api/tenant` PATCH
```typescript
// File: src/app/api/tenant/route.ts
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, slug } = await req.json();

  const updates: any = { updatedAt: new Date() };
  if (name) updates.name = name;

  if (slug) {
    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    // Check if slug is taken
    const existing = await db.query.tenants.findFirst({
      where: eq(tenants.slug, slug),
    });
    if (existing && existing.id !== session.user.tenantId) {
      return NextResponse.json({ error: "Slug already taken" }, { status: 400 });
    }
    updates.slug = slug;
  }

  await db.update(tenants)
    .set(updates)
    .where(eq(tenants.id, session.user.tenantId));

  return NextResponse.json({ success: true });
}
```

##### c) `/api/tenant/api-key` POST & DELETE
```typescript
// File: src/app/api/tenant/api-key/route.ts
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { tenants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { hashApiKey, getApiKeyPrefix } from "@/lib/security/api-keys";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Generate new API key
  const rawKey = `sk_${nanoid(32)}`;
  const hash = hashApiKey(rawKey);
  const prefix = getApiKeyPrefix(rawKey);

  await db.update(tenants)
    .set({
      apiKeyHash: hash,
      apiKeyPrefix: prefix,
      updatedAt: new Date()
    })
    .where(eq(tenants.id, session.user.tenantId));

  return NextResponse.json({ apiKey: rawKey });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await db.update(tenants)
    .set({
      apiKeyHash: null,
      apiKeyPrefix: null,
      updatedAt: new Date()
    })
    .where(eq(tenants.id, session.user.tenantId));

  return NextResponse.json({ success: true });
}
```

**Archivos a crear:**
- `src/app/api/user/profile/route.ts`
- `src/app/api/tenant/route.ts`
- `src/app/api/tenant/api-key/route.ts`

**Testing:**
- Update profile desde `/settings/profile`
- Update workspace desde `/settings/workspace`
- Generate/revoke API key desde `/settings/api`

---

#### 2. WhatsApp Business API Connection ⚠️
**Status:** 30% (código existe, no conectado) | **Tiempo:** 3-4 horas | **Blocker:** Feature principal no funciona

**Opción Recomendada: Twilio** (más rápido para MVP)

**Setup Steps:**

##### Paso 1: Crear cuenta Twilio (30 min)
1. Ir a https://www.twilio.com/console
2. Sign up / Login
3. Verify phone number
4. Ir a WhatsApp Beta: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn

##### Paso 2: Configurar WhatsApp Sandbox (20 min)
1. En Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Enviar mensaje desde tu WhatsApp al número de Twilio con el código
3. Ahora puedes enviar/recibir mensajes en sandbox

##### Paso 3: Configurar Webhook (10 min)
1. En Twilio Console → WhatsApp Sandbox Settings
2. **"When a message comes in":** `https://app.chatform.io/api/webhooks/whatsapp`
3. Method: HTTP POST
4. Save

##### Paso 4: Agregar credentials a env (5 min)
```env
# .env.production
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

##### Paso 5: Testing (30 min)
1. Crear encuesta de prueba
2. Copiar shortCode
3. Enviar por WhatsApp: `START_[shortCode]`
4. Responder preguntas
5. Verificar respuestas en `/surveys/[id]/results`

**Código ya existe en:** `src/app/api/webhooks/whatsapp/route.ts` ✅

**Ajustes necesarios:** Ninguno, código está listo para Twilio

---

### 🔴 PRIORIDAD CRÍTICA - DÍA 2 (8-10 horas)

#### 3. AI Survey Generator 🤖
**Status:** 0% | **Tiempo:** 6-8 horas | **Blocker:** Feature diferenciadora principal

**Implementación:**

##### Paso 1: Setup OpenAI (15 min)
```bash
npm install openai
```

```env
# .env.production
OPENAI_API_KEY=sk-...
```

##### Paso 2: Crear API endpoint (2 horas)
```typescript
// File: src/app/api/ai/generate-survey/route.ts
import { auth } from "@/lib/auth/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { description, numQuestions = 5, language = "es" } = await req.json();

  const prompt = `Eres un experto en crear encuestas de satisfacción para WhatsApp.

Basándote en esta descripción: "${description}"

Genera una encuesta con ${numQuestions} preguntas en español que:
- Sea conversacional y amigable
- Use diferentes tipos de preguntas (opción múltiple, rating, texto abierto)
- Sea específica y clara
- Tome máximo 2-3 minutos responder

Responde en formato JSON con esta estructura exacta:
{
  "title": "Título de la encuesta",
  "description": "Breve descripción",
  "welcomeMessage": "Mensaje de bienvenida personalizado",
  "thankYouMessage": "Mensaje de agradecimiento",
  "questions": [
    {
      "type": "multiple_choice" | "rating" | "open_text",
      "text": "Texto de la pregunta",
      "options": ["Opción 1", "Opción 2"] // solo para multiple_choice
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview", // o "gpt-3.5-turbo" para más barato
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const result = JSON.parse(completion.choices[0].message.content!);

  return NextResponse.json(result);
}
```

##### Paso 3: Modificar UI de `/surveys/new` (3-4 horas)
```typescript
// File: src/app/(dashboard)/surveys/new/page.tsx
"use client";

import { useState } from "react";
import { Sparkles, Wand2, Loader2 } from "lucide-react";
import { SurveyEditor } from "@/components/surveys/survey-editor";

export default function NewSurveyPage() {
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedSurvey, setGeneratedSurvey] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: aiPrompt }),
      });
      const data = await res.json();
      setGeneratedSurvey(data);
    } catch (error) {
      alert("Error al generar encuesta");
    } finally {
      setGenerating(false);
    }
  };

  if (generatedSurvey) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✨ Encuesta generada con IA
          </p>
        </div>
        <SurveyEditor
          mode="create"
          initialTitle={generatedSurvey.title}
          initialDescription={generatedSurvey.description}
          initialQuestions={generatedSurvey.questions.map((q, i) => ({
            id: `ai-${i}`,
            ...q,
            order: i,
          }))}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mode Selector */}
      <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
        <button
          onClick={() => setMode("ai")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            mode === "ai"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-2" />
          Generar con IA
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex-1 py-3 px-4 rounded-md font-semibold transition-all ${
            mode === "manual"
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Crear Manualmente
        </button>
      </div>

      {mode === "ai" ? (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Genera tu encuesta con IA
            </h2>
            <p className="text-slate-600">
              Describe lo que quieres preguntar y la IA creará la encuesta perfecta
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                ¿Qué quieres medir?
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej: Quiero medir la satisfacción de mis clientes después de comprar en mi tienda online. Quiero saber si la entrega fue rápida, si el producto cumplió expectativas y qué podemos mejorar."
                rows={5}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!aiPrompt.trim() || generating}
              className="w-full py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg shadow-lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando encuesta...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar Encuesta
                </>
              )}
            </button>

            <p className="text-xs text-center text-slate-500">
              La IA generará 5 preguntas optimizadas en ~10 segundos
            </p>
          </div>
        </div>
      ) : (
        <SurveyEditor mode="create" />
      )}
    </div>
  );
}
```

**Testing:**
1. Ir a `/surveys/new`
2. Escribir: "Quiero medir satisfacción post-compra de mi e-commerce"
3. Click "Generar con IA"
4. Verificar que genera 5 preguntas coherentes
5. Editar si es necesario
6. Publicar

---

#### 4. AI Insights & Analysis 🧠
**Status:** 0% | **Tiempo:** 8-10 horas | **Blocker:** Feature vendida en plan Pro

**Implementación:**

##### Paso 1: Crear análisis endpoint (4 horas)
```typescript
// File: src/app/api/ai/analyze-responses/route.ts
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { surveys, surveySessions, responses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { surveyId } = await req.json();

  // 1. Get survey with all responses
  const survey = await db.query.surveys.findFirst({
    where: and(
      eq(surveys.id, surveyId),
      eq(surveys.tenantId, session.user.tenantId)
    ),
    with: {
      questions: true,
    },
  });

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const sessions = await db.query.surveySessions.findMany({
    where: and(
      eq(surveySessions.surveyId, surveyId),
      eq(surveySessions.status, "completed")
    ),
    with: {
      responses: {
        with: {
          question: true,
        },
      },
    },
  });

  if (sessions.length < 5) {
    return NextResponse.json(
      { error: "Need at least 5 responses for analysis" },
      { status: 400 }
    );
  }

  // 2. Prepare data for AI
  const responsesText = sessions.map((s, i) => {
    const answers = s.responses.map((r) => {
      const answer = r.answerText || r.answerOption || r.answerRating;
      return `${r.question?.questionText}: ${answer}`;
    }).join("\n");
    return `Respuesta ${i + 1}:\n${answers}`;
  }).join("\n\n");

  // 3. Call OpenAI for insights
  const prompt = `Analiza estas ${sessions.length} respuestas de una encuesta de satisfacción.

Título de la encuesta: "${survey.title}"

Respuestas:
${responsesText}

Proporciona un análisis detallado en formato JSON con:
{
  "summary": "Resumen ejecutivo en 2-3 oraciones",
  "sentiment": {
    "overall": "positive" | "negative" | "neutral",
    "score": 0-100,
    "distribution": {
      "positive": percentage,
      "neutral": percentage,
      "negative": percentage
    }
  },
  "keyInsights": [
    "Insight 1 (máx 100 caracteres)",
    "Insight 2",
    "Insight 3"
  ],
  "themes": [
    { "name": "Tema identificado", "frequency": número, "sentiment": "positive/neutral/negative" }
  ],
  "nps": {
    "score": -100 a 100,
    "promoters": percentage,
    "passives": percentage,
    "detractors": percentage
  },
  "recommendations": [
    "Recomendación accionable 1",
    "Recomendación accionable 2"
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3, // Lower for more consistent analysis
  });

  const analysis = JSON.parse(completion.choices[0].message.content!);

  // 4. Save analysis to database (optional - create new table)
  // For now, return it directly

  return NextResponse.json(analysis);
}
```

##### Paso 2: Component de Insights (4 hours)
```typescript
// File: src/components/surveys/ai-insights.tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Lightbulb, Users, Loader2 } from "lucide-react";

export function AiInsights({ surveyId }: { surveyId: string }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const res = await fetch("/api/ai/analyze-responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ surveyId }),
        });
        const data = await res.json();
        setInsights(data);
      } catch (error) {
        console.error("Error loading insights:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, [surveyId]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-slate-600">Analizando respuestas con IA...</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
        <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">
          Necesitas al menos 5 respuestas para análisis con IA
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Resumen Ejecutivo (IA)
            </h3>
            <p className="text-slate-700">{insights.summary}</p>
          </div>
        </div>
      </div>

      {/* Sentiment */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Análisis de Sentimiento
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Sentimiento General
            </span>
            <span
              className={`text-2xl font-bold ${
                insights.sentiment.overall === "positive"
                  ? "text-green-600"
                  : insights.sentiment.overall === "negative"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {insights.sentiment.score}/100
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {insights.sentiment.distribution.positive}%
              </p>
              <p className="text-xs text-green-700">Positivas</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {insights.sentiment.distribution.neutral}%
              </p>
              <p className="text-xs text-yellow-700">Neutrales</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {insights.sentiment.distribution.negative}%
              </p>
              <p className="text-xs text-red-700">Negativas</p>
            </div>
          </div>
        </div>
      </div>

      {/* NPS */}
      {insights.nps && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Net Promoter Score (NPS)
          </h3>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold text-blue-600 mb-2">
              {insights.nps.score}
            </p>
            <p className="text-sm text-slate-600">
              {insights.nps.score > 50
                ? "Excelente"
                : insights.nps.score > 0
                ? "Bueno"
                : "Necesita mejora"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-bold text-green-600">
                {insights.nps.promoters}%
              </p>
              <p className="text-slate-600">Promotores</p>
            </div>
            <div>
              <p className="font-bold text-yellow-600">
                {insights.nps.passives}%
              </p>
              <p className="text-slate-600">Pasivos</p>
            </div>
            <div>
              <p className="font-bold text-red-600">
                {insights.nps.detractors}%
              </p>
              <p className="text-slate-600">Detractores</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Insights Clave
        </h3>
        <ul className="space-y-3">
          {insights.keyInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-slate-700">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Recomendaciones
        </h3>
        <ul className="space-y-3">
          {insights.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-purple-600">→</span>
              <p className="text-slate-700">{rec}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

##### Paso 3: Integrar en Results Page
```typescript
// Modify: src/app/(dashboard)/surveys/[id]/results/page.tsx
import { AiInsights } from "@/components/surveys/ai-insights";

// Add after QuestionResults section:
<div className="mt-8">
  <AiInsights surveyId={survey.id} />
</div>
```

---

### 🟡 PRIORIDAD ALTA - DÍA 3 (6-8 horas)

#### 5. Interactive Survey Demo/Preview 📱
**Status:** 20% (preview estático existe) | **Tiempo:** 4-6 horas | **Nice to have**

**Implementación:**

```typescript
// File: src/components/surveys/whatsapp-simulator.tsx
"use client";

import { useState } from "react";
import { Send, RotateCcw } from "lucide-react";

interface Message {
  type: "bot" | "user";
  text: string;
  timestamp: Date;
}

export function WhatsAppSimulator({ survey }) {
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", text: survey.welcomeMessage, timestamp: new Date() },
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = survey.questions[currentQuestionIndex];

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg: Message = { type: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    // Validate response
    const isValid = validateAnswer(currentQuestion, input);

    if (!isValid) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: getValidationMessage(currentQuestion),
            timestamp: new Date(),
          },
        ]);
      }, 500);
      setInput("");
      return;
    }

    // Move to next question
    setTimeout(() => {
      if (currentQuestionIndex < survey.questions.length - 1) {
        const nextQuestion = survey.questions[currentQuestionIndex + 1];
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: formatQuestion(nextQuestion, currentQuestionIndex + 2),
            timestamp: new Date(),
          },
        ]);
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: survey.thankYouMessage || "¡Gracias por completar la encuesta!",
            timestamp: new Date(),
          },
        ]);
        setIsComplete(true);
      }
    }, 800);

    setInput("");
  };

  const reset = () => {
    setMessages([{ type: "bot", text: survey.welcomeMessage, timestamp: new Date() }]);
    setCurrentQuestionIndex(0);
    setIsComplete(false);
    setInput("");
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-xl max-w-md mx-auto overflow-hidden">
      {/* WhatsApp Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-xl">💬</span>
          </div>
          <div>
            <p className="font-semibold">{survey.title}</p>
            <p className="text-xs text-green-200">Online</p>
          </div>
        </div>
        <button
          onClick={reset}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="h-96 overflow-y-auto p-4 bg-[#e5ddd5] bg-[url('/whatsapp-bg.png')]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg p-3 ${
                msg.type === "user"
                  ? "bg-[#dcf8c6]"
                  : "bg-white shadow-sm"
              }`}
            >
              <p className="text-sm text-slate-900 whitespace-pre-wrap">
                {msg.text}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 text-right">
                {msg.timestamp.toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      {!isComplete && (
        <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
          {currentQuestion?.type === "multiple_choice" && (
            <div className="flex-1 flex flex-wrap gap-2">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(String(i + 1));
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="px-3 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium"
                >
                  {i + 1}. {opt}
                </button>
              ))}
            </div>
          )}

          {currentQuestion?.type === "rating" && (
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setInput(String(num));
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="flex-1 py-2 bg-white border border-slate-300 rounded hover:bg-blue-50 text-sm font-bold"
                >
                  {num}
                </button>
              ))}
            </div>
          )}

          {currentQuestion?.type === "open_text" && (
            <>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu respuesta..."
                className="flex-1 px-4 py-2 rounded-full border border-slate-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSend}
                className="p-3 bg-[#075e54] text-white rounded-full hover:bg-[#064e45] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}

      {isComplete && (
        <div className="bg-green-50 border-t-2 border-green-200 p-4 text-center">
          <p className="text-green-800 font-semibold mb-2">
            ✅ Encuesta completada
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Probar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}

function validateAnswer(question, answer) {
  if (question.type === "rating") {
    const num = parseInt(answer);
    return !isNaN(num) && num >= 1 && num <= 10;
  }
  if (question.type === "multiple_choice") {
    const num = parseInt(answer);
    return !isNaN(num) && num >= 1 && num <= question.options.length;
  }
  return answer.trim().length > 0;
}

function getValidationMessage(question) {
  if (question.type === "rating") {
    return "Por favor responde con un número del 1 al 10";
  }
  if (question.type === "multiple_choice") {
    return `Por favor responde con un número del 1 al ${question.options.length}`;
  }
  return "Por favor escribe tu respuesta";
}

function formatQuestion(question, index) {
  let text = `*Pregunta ${index}*\n\n${question.text}`;

  if (question.type === "multiple_choice") {
    text += "\n\n*Opciones:*";
    question.options.forEach((opt, i) => {
      text += `\n${i + 1}. ${opt}`;
    });
    text += "\n\n_Responde con el número de tu opción_";
  } else if (question.type === "rating") {
    text += "\n\n_Responde con un número del 1 al 10_";
  }

  return text;
}
```

**Integration:**
- Add to survey editor preview
- Add to share page as "Test Survey"

---

#### 6. Google OAuth Credentials ⚙️
**Status:** 50% (código existe) | **Tiempo:** 1-2 horas | **Nice to have**

**Setup:**
1. Google Cloud Console → Create Project
2. Enable Google+ API
3. Create OAuth 2.0 Credentials
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://app.chatform.io/api/auth/callback/google`
5. Copy Client ID y Secret
6. Add to `.env.production`:
```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

---

## 📅 TIMELINE COMPLETO

### **DÍA 1 - Miércoles 1 Nov** (6-8h)
**Objetivo:** Settings funcionales + WhatsApp conectado
- [x] Database verificada ✅ (ya hecho)
- [ ] Settings API endpoints (3-4h)
  - Profile update
  - Workspace update
  - API key generation
- [ ] WhatsApp Twilio setup (3-4h)
  - Crear cuenta
  - Configurar sandbox
  - Testing real

**Deliverable:** App funcional sin AI

---

### **DÍA 2 - Jueves 2 Nov** (8-10h)
**Objetivo:** AI Generator completo
- [ ] OpenAI setup (15 min)
- [ ] AI Generate Survey endpoint (2h)
- [ ] UI de generación con IA (3-4h)
- [ ] Testing y refinamiento (2h)
- [ ] Empezar AI Insights (2-3h si sobra tiempo)

**Deliverable:** Crear encuestas con IA funciona

---

### **DÍA 3 - Viernes 3 Nov** (8-10h)
**Objetivo:** AI Insights completo
- [ ] AI Analysis endpoint (4h)
- [ ] UI de Insights (4h)
- [ ] Integration en Results (1h)
- [ ] Testing completo (1-2h)

**Deliverable:** Análisis con IA funciona

---

### **DÍA 4 - Sábado 4 Nov** (6-8h)
**Objetivo:** Polish y testing
- [ ] WhatsApp Simulator (4-6h)
- [ ] Google OAuth config (1-2h)
- [ ] Testing end-to-end (2h)
- [ ] Bug fixes

**Deliverable:** Todo funciona smooth

---

### **DÍA 5 - Domingo 5 Nov** (4-6h)
**Objetivo:** Production deploy y launch prep
- [ ] Environment variables production
- [ ] Deploy a Dokploy
- [ ] Testing en producción
- [ ] Documentation final
- [ ] Launch checklist

**Deliverable:** 🚀 LIVE

---

## ✅ CHECKLIST DE LAUNCH

### Pre-Launch (Técnico)
- [ ] Database schema pusheado ✅ (ya hecho)
- [ ] Todas las APIs funcionando
- [ ] WhatsApp conectado y testeado
- [ ] AI Generator testeado
- [ ] AI Insights testeado
- [ ] Settings guardan cambios
- [ ] OAuth funciona
- [ ] Build pasa sin errores
- [ ] Deploy exitoso
- [ ] SSL configurado
- [ ] Domain configurado

### Pre-Launch (Business)
- [ ] Pricing definido (ya está en billing page)
- [ ] Stripe test mode configurado (opcional para v1)
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Support email configurado
- [ ] Analytics (Google Analytics/Plausible)

### Launch Day
- [ ] Deploy a producción
- [ ] Smoke testing
- [ ] Crear primera encuesta real
- [ ] Compartir en redes sociales
- [ ] Product Hunt launch (opcional)
- [ ] Email a early access list

---

## 🎯 MÉTRICAS DE ÉXITO

**Week 1:**
- [ ] 10 signups
- [ ] 5 encuestas creadas
- [ ] 50 respuestas recibidas
- [ ] 0 critical bugs

**Month 1:**
- [ ] 100 signups
- [ ] 30 encuestas activas
- [ ] 1000 respuestas
- [ ] 5 paying customers

---

## 🔥 MOTIVACIÓN

**Estás a 4-5 días de launch.**

Ya tienes:
✅ 95% del UI
✅ Database funcionando
✅ Auth completo
✅ CRUD de encuestas
✅ Analytics
✅ Settings UI

Solo faltan:
❌ APIs de Settings (1 día)
❌ WhatsApp real (1 día)
❌ AI Features (2 días)
❌ Polish (1 día)

**TODO es completamente alcanzable.**

**VAMOS A ROMPERLA CON ESTE PRODUCTO** 🚀🔥

---

## 📞 SIGUIENTES PASOS MAÑANA

### Sesión Mañana (6-8 horas):

**9:00 - 12:00:** Settings APIs (3h)
- Profile endpoint
- Tenant endpoint
- API key endpoint

**12:00 - 13:00:** Break

**13:00 - 17:00:** WhatsApp Setup (4h)
- Twilio account
- Sandbox config
- Testing real
- First survey sent! 🎉

**End of day:** App funcional sin AI

---

**DOCUMENTACIÓN COMPLETA LISTA.**
**PLAN DE ACCIÓN CLARO.**
**TIMELINE REALISTA.**

**¿Empezamos mañana a las 9:00?** 💪
