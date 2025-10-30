# ChatForm - AI Features Specification
**Fecha:** 30 Oct 2025
**Status:** Pendiente de implementación

---

## 🤖 **AI Features Overview**

ChatForm tiene **3 componentes de IA principales:**

1. **AI Form Generator** - Genera encuestas desde descripción
2. **AI Response Analysis** - Analiza respuestas y extrae insights
3. **AI Suggestions** - Sugerencias contextuales en Form Builder

---

## 1️⃣ **AI Form Generator** (Fase 1)

### **Objetivo:**
Usuario escribe: *"Quiero medir satisfacción post-compra"*
→ IA genera 5 preguntas automáticamente

### **Ubicación:**
- Botón "Crear con IA" en dashboard y surveys list
- Modal con input de texto
- Output: Populate Form Builder V2

### **Flujo:**
```
1. Usuario click "Crear con IA"
2. Modal abre: "Describe tu encuesta"
3. Usuario escribe: "Encuesta de satisfacción para restaurante"
4. Click "Generar"
5. Loading... (OpenAI API call)
6. IA retorna 5 preguntas + tipos
7. Populate Form Builder V2 automáticamente
8. Usuario puede editar antes de guardar
```

### **Prompt Engineering:**

```typescript
const systemPrompt = `
Eres un experto en diseño de encuestas conversacionales para WhatsApp.

Tu trabajo es generar preguntas efectivas, cortas y naturales que:
- Sean fáciles de responder en WhatsApp
- No excedan 100 caracteres por pregunta
- Sigan un flujo lógico
- Mezclen tipos de preguntas (rating, multiple choice, open text)

Reglas:
- Máximo 7 preguntas
- Mínimo 3 preguntas
- Primera pregunta SIEMPRE es rating (NPS o CSAT)
- Última pregunta SIEMPRE es open text para feedback adicional
- Usa lenguaje casual y amigable
- Preguntas en español latino
`;

const userPrompt = `
Genera una encuesta para: "${userInput}"

Retorna JSON con este formato:
{
  "title": "Título sugerido de la encuesta",
  "welcomeMessage": "Mensaje de bienvenida personalizado",
  "thankYouMessage": "Mensaje de agradecimiento personalizado",
  "questions": [
    {
      "type": "rating",
      "text": "¿Qué tan probable es que nos recomiendes?",
      "required": true
    },
    {
      "type": "multiple_choice",
      "text": "¿Cuál fue el motivo principal de tu compra?",
      "options": ["Precio", "Calidad", "Recomendación", "Publicidad"],
      "required": true
    },
    {
      "type": "open_text",
      "text": "¿Algo más que quieras compartir?",
      "required": false
    }
  ]
}
`;
```

### **Implementación:**

**Archivo:** `/app/src/components/surveys/ai-generator-modal.tsx`

```typescript
"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export function AIGeneratorModal({ onGenerate }: { onGenerate: (survey: any) => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    const response = await fetch("/api/ai/generate-survey", {
      method: "POST",
      body: JSON.stringify({ description: input }),
    });

    const data = await response.json();
    onGenerate(data.survey);
    setLoading(false);
  };

  return (
    <div className="modal">
      <h2>Generar Encuesta con IA</h2>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ej: Encuesta de satisfacción para mi restaurante..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generando..." : "Generar"}
      </button>
    </div>
  );
}
```

**API:** `/app/src/app/api/ai/generate-survey/route.ts`

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { description } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Genera encuesta: ${description}` }
    ],
    response_format: { type: "json_object" }
  });

  const survey = JSON.parse(completion.choices[0].message.content);
  return Response.json({ survey });
}
```

### **Costo:**
- GPT-4: ~$0.03 por generación
- GPT-4-turbo: ~$0.01 por generación
- **Recomendado:** GPT-4-turbo para balance costo/calidad

---

## 2️⃣ **AI Response Analysis** ⭐⭐⭐ (EL MÁS IMPORTANTE)

### **Objetivo:**
Analizar TODAS las respuestas de una encuesta y generar insights automáticos.

### **Qué analiza:**

**A) Sentiment Analysis:**
- Positive / Neutral / Negative
- Score: -1 (muy negativo) a +1 (muy positivo)
- Por respuesta individual
- Agregado por encuesta

**B) Topic Extraction:**
- Identifica temas recurrentes
- Ej: "product_quality", "customer_service", "shipping_speed", "pricing"
- Frecuencia de cada tema
- Sentiment por tema

**C) NPS Calculation:**
```
NPS = (% Promotores - % Detractores) × 100

Promotores: 9-10
Passives: 7-8
Detractores: 0-6
```

**D) CSAT Calculation:**
```
CSAT = (Respuestas satisfechas / Total) × 100
Satisfecho: 4-5 (escala 1-5) o 8-10 (escala 1-10)
```

**E) Key Insights:**
- Top 3 temas positivos
- Top 3 temas negativos
- Sugerencias accionables
- Alerts (ej: "15% menciona envío lento")

**F) AI Summary:**
- Resumen ejecutivo de 2-3 oraciones
- Highlights principales
- Recomendaciones

---

### **Cuándo se ejecuta:**

**Opción 1: Real-time (después de cada respuesta)**
```
User completa encuesta
  ↓
Webhook handler guarda respuesta
  ↓
Trigger background job
  ↓
OpenAI analiza respuesta individual
  ↓
Guarda sentiment + topics en DB
```

**Opción 2: Batch (cada hora o on-demand)**
```
Cron job cada hora
  ↓
Obtiene respuestas nuevas sin analizar
  ↓
OpenAI analiza en batch
  ↓
Actualiza DB con insights
```

**Recomendación:** Opción 2 (batch) para reducir costos

---

### **Database Schema Adicional:**

**Nueva tabla: `response_analysis`**
```sql
CREATE TABLE response_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES responses(id) ON DELETE CASCADE,

  -- Sentiment
  sentiment VARCHAR(20) NOT NULL, -- positive, neutral, negative
  sentiment_score DECIMAL(3, 2), -- -1.00 to +1.00

  -- Topics
  topics JSONB, -- ["product_quality", "customer_service"]
  topics_sentiment JSONB, -- {"product_quality": 0.85, "customer_service": 0.45}

  -- Metadata
  analyzed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  model_version VARCHAR(50), -- "gpt-4-turbo"

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_response_analysis_response ON response_analysis(response_id);
CREATE INDEX idx_response_analysis_sentiment ON response_analysis(sentiment);
```

**Nueva tabla: `survey_insights`** (agregado)
```sql
CREATE TABLE survey_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  -- NPS/CSAT
  nps_score INTEGER, -- -100 to 100
  nps_promoters INTEGER,
  nps_passives INTEGER,
  nps_detractors INTEGER,
  csat_score DECIMAL(5, 2), -- 0.00 to 100.00

  -- Sentiment aggregate
  positive_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  avg_sentiment_score DECIMAL(3, 2),

  -- Topics
  top_topics JSONB, -- [{"topic": "product_quality", "count": 45, "sentiment": 0.85}]

  -- AI Summary
  summary TEXT,
  key_insights JSONB, -- ["Los usuarios aman el producto", "Envío lento es queja #1"]
  action_items JSONB, -- ["Mejorar logística", "Mantener calidad"]

  -- Metadata
  total_responses INTEGER,
  analyzed_at TIMESTAMP NOT NULL DEFAULT NOW(),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_survey_insights_survey ON survey_insights(survey_id);
CREATE UNIQUE INDEX idx_survey_insights_unique ON survey_insights(survey_id);
```

---

### **Implementación:**

**API:** `/app/src/app/api/ai/analyze-responses/route.ts`

```typescript
import OpenAI from "openai";
import { db } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { surveyId } = await req.json();

  // Get all responses for survey
  const sessions = await db.query.surveySessions.findMany({
    where: eq(surveySessions.surveyId, surveyId),
    with: { responses: { with: { question: true } } }
  });

  // Prepare text for analysis
  const allResponses = sessions.flatMap(s =>
    s.responses
      .filter(r => r.answerText) // Only text responses
      .map(r => ({
        id: r.id,
        question: r.question.questionText,
        answer: r.answerText
      }))
  );

  if (allResponses.length === 0) {
    return Response.json({ message: "No text responses to analyze" });
  }

  // Analyze with OpenAI
  const analysisPrompt = `
Analiza las siguientes respuestas de una encuesta y extrae:

1. Sentiment de cada respuesta (positive/neutral/negative, score -1 to +1)
2. Topics mencionados (max 10 topics)
3. Frecuencia y sentiment de cada topic
4. Summary ejecutivo (2-3 oraciones)
5. Key insights (top 3-5 bullets)
6. Action items (recomendaciones accionables)

Respuestas:
${JSON.stringify(allResponses, null, 2)}

Retorna JSON con este formato:
{
  "individual_analysis": [
    {
      "response_id": "uuid",
      "sentiment": "positive",
      "sentiment_score": 0.85,
      "topics": ["product_quality", "customer_service"],
      "topics_sentiment": {
        "product_quality": 0.9,
        "customer_service": 0.8
      }
    }
  ],
  "aggregate": {
    "positive_count": 45,
    "neutral_count": 12,
    "negative_count": 8,
    "avg_sentiment_score": 0.72,
    "top_topics": [
      {
        "topic": "product_quality",
        "count": 32,
        "avg_sentiment": 0.85
      }
    ],
    "summary": "Los usuarios están muy satisfechos con la calidad del producto...",
    "key_insights": [
      "85% de los usuarios mencionan la calidad del producto como excelente",
      "El servicio al cliente recibe elogios consistentes",
      "15% menciona que el envío tardó más de lo esperado"
    ],
    "action_items": [
      "Mantener y comunicar los estándares de calidad actuales",
      "Revisar y optimizar tiempos de envío con proveedor logístico",
      "Considerar agregar tracking en tiempo real"
    ]
  }
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "Eres un experto en análisis de feedback de clientes." },
      { role: "user", content: analysisPrompt }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3 // Lower temp for more consistent analysis
  });

  const analysis = JSON.parse(completion.choices[0].message.content);

  // Save individual analysis to DB
  for (const item of analysis.individual_analysis) {
    await db.insert(responseAnalysis).values({
      responseId: item.response_id,
      sentiment: item.sentiment,
      sentimentScore: item.sentiment_score,
      topics: item.topics,
      topicsSentiment: item.topics_sentiment,
      modelVersion: "gpt-4-turbo"
    });
  }

  // Save aggregate insights
  await db.insert(surveyInsights).values({
    surveyId,
    positiveCount: analysis.aggregate.positive_count,
    neutralCount: analysis.aggregate.neutral_count,
    negativeCount: analysis.aggregate.negative_count,
    avgSentimentScore: analysis.aggregate.avg_sentiment_score,
    topTopics: analysis.aggregate.top_topics,
    summary: analysis.aggregate.summary,
    keyInsights: analysis.aggregate.key_insights,
    actionItems: analysis.aggregate.action_items,
    totalResponses: allResponses.length,
    analyzedAt: new Date()
  }).onConflictDoUpdate({
    target: surveyInsights.surveyId,
    set: { /* update fields */ }
  });

  return Response.json({
    success: true,
    analyzed: allResponses.length,
    insights: analysis.aggregate
  });
}
```

---

### **UI para mostrar insights:**

**Archivo:** `/app/src/app/(dashboard)/surveys/[id]/insights/page.tsx`

```tsx
import { db } from "@/lib/db";

export default async function SurveyInsightsPage({ params }) {
  const { id } = await params;

  // Get insights
  const insights = await db.query.surveyInsights.findFirst({
    where: eq(surveyInsights.surveyId, id)
  });

  if (!insights) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-6">
      {/* AI Summary Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-slate-900">Resumen AI</h2>
        </div>
        <p className="text-slate-900 text-lg leading-relaxed">
          {insights.summary}
        </p>
      </div>

      {/* Sentiment Distribution */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold mb-4">Distribución de Sentiment</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {insights.positiveCount}
            </div>
            <div className="text-sm text-slate-600 mt-1">Positivos</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-3xl font-bold text-slate-600">
              {insights.neutralCount}
            </div>
            <div className="text-sm text-slate-600 mt-1">Neutrales</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">
              {insights.negativeCount}
            </div>
            <div className="text-sm text-slate-600 mt-1">Negativos</div>
          </div>
        </div>
      </div>

      {/* Top Topics */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold mb-4">Temas Principales</h3>
        <div className="space-y-3">
          {insights.topTopics.map((topic, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{topic.topic}</span>
                  <span className="text-sm text-slate-500">
                    {topic.count} menciones
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      topic.avg_sentiment > 0.5
                        ? "bg-green-500"
                        : topic.avg_sentiment > 0
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(topic.avg_sentiment + 1) * 50}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold mb-4">Insights Clave</h3>
        <ul className="space-y-3">
          {insights.keyInsights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-blue-600">{i + 1}</span>
              </div>
              <p className="text-slate-700">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Items */}
      <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="text-lg font-bold mb-4 text-slate-900">Acciones Recomendadas</h3>
        <ul className="space-y-2">
          {insights.actionItems.map((action, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-slate-700">{action}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

---

## 3️⃣ **AI Suggestions** (Fase 3)

### **Objetivo:**
Sugerencias contextuales mientras construyes la encuesta.

### **Ejemplos:**

**1. Longitud de pregunta:**
```
Usuario escribe: "¿Podrías por favor decirnos qué tan satisfecho estás con nuestro servicio de atención al cliente que recibiste?"

AI sugiere: "✨ Esta pregunta es muy larga. Simplifica a: '¿Qué tan satisfecho estás con nuestro servicio?'"
```

**2. Orden de preguntas:**
```
Usuario pone pregunta abierta primero.

AI sugiere: "✨ Considera empezar con una pregunta de rating. Los usuarios responden más cuando empiezas con algo fácil."
```

**3. Opciones de múltiple opción:**
```
Usuario crea: ["Muy bueno", "Bueno", "Regular", "Malo"]

AI sugiere: "✨ Agrega una opción 'Excelente' para capturar respuestas muy positivas"
```

**4. Pregunta de seguimiento:**
```
Usuario crea pregunta NPS.

AI sugiere: "✨ Agrega una pregunta de seguimiento: '¿Por qué diste ese score?' para obtener más contexto"
```

---

## 📊 **Costos Estimados**

### **AI Form Generator:**
- Modelo: GPT-4-turbo
- Costo: ~$0.01 por generación
- Uso esperado: 100 generaciones/día = $1/día = $30/mes

### **AI Response Analysis:**
- Modelo: GPT-4-turbo
- Costo: ~$0.05 por análisis de 50 respuestas
- Uso esperado: 1,000 respuestas/día = $1/día = $30/mes

### **AI Suggestions:**
- Modelo: GPT-4-turbo (streaming)
- Costo: ~$0.001 por sugerencia
- Uso esperado: 500 sugerencias/día = $0.50/día = $15/mes

**Total:** ~$75/mes en costos de OpenAI

**Con 100 clientes pagando:** $2,900/mes revenue - $75 costs = **$2,825 profit** (97% margin)

---

## ✅ **Implementación Priorizada**

### **Fase 1 (Esta semana):**
1. ✅ AI Form Generator (4 horas)
   - Modal de input
   - OpenAI API call
   - Populate Form Builder V2

### **Fase 2 (Próxima semana):**
2. ✅ AI Response Analysis - Individual (2 horas)
   - Analizar cada respuesta después de completar
   - Guardar sentiment + topics en DB

3. ✅ AI Response Analysis - Aggregate (3 horas)
   - Cron job para analizar batch
   - Generar insights de encuesta completa
   - UI de insights page

### **Fase 3 (Después):**
4. ✅ AI Suggestions (2 horas)
   - Sugerencias en Form Builder
   - Mejoras de UX

---

## 🎯 **KPIs de AI Features**

**Engagement:**
- % de usuarios que usan AI Generator: Target >50%
- % de encuestas creadas con IA: Target >30%
- Tiempo de creación: Target <3 min con IA vs 10 min manual

**Value:**
- % de usuarios que ven insights: Target >80%
- Acciones tomadas basadas en insights: Track via survey
- NPS de usuarios que usan AI: Target >60

**Technical:**
- OpenAI API latency: Target <3s
- Success rate: Target >95%
- Cost per user/month: Target <$1

---

**SIGUIENTE PASO:** Implementar AI Form Generator
**TIEMPO ESTIMADO:** 4 horas
**IMPACTO:** Alto (diferenciador clave del producto)
