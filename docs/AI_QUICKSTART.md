# 🚀 AI Survey Generator - Quick Start Guide

**Para desarrolladores**: Guía rápida para implementar el AI Generator

---

## ⚡ Setup Rápido (5 minutos)

### 1. Obtener API Key de OpenAI

```bash
# 1. Ir a https://platform.openai.com/api-keys
# 2. Click "Create new secret key"
# 3. Copiar la key (empieza con sk-proj-...)
# 4. Configurar límite de gasto: $10/mes (Settings → Billing)
```

### 2. Instalar Dependencias

```bash
cd /root/chatform/app
npm install openai@^4.73.1
```

### 3. Configurar Variables de Entorno

```bash
# Agregar al Docker service
docker service update \
  --env-add OPENAI_API_KEY="sk-proj-xxxxx" \
  app-chatform-appchayform-pfeamz
```

O agregar a `.env.production`:
```env
OPENAI_API_KEY=sk-proj-xxxxx
```

### 4. Crear Migration de Database

```bash
# Correr la migration incluida
DATABASE_URL='postgresql://...' npm run db:push
```

---

## 📁 Estructura de Archivos a Crear

```
app/src/
├── lib/ai/
│   ├── openai-client.ts      # Cliente de OpenAI configurado
│   ├── prompts.ts             # System y user prompts
│   ├── rate-limiter.ts        # Lógica de rate limiting
│   └── types.ts               # TypeScript types
│
├── app/api/ai/
│   ├── generate-survey/
│   │   └── route.ts           # POST endpoint para generar
│   └── usage/
│       └── route.ts           # GET endpoint para métricas
│
└── components/surveys/
    ├── ai-generator-modal.tsx # Modal principal
    └── ai-preview.tsx         # Preview de resultados
```

---

## 🎯 Implementación Paso a Paso

### Paso 1: Cliente de OpenAI

```typescript
// lib/ai/openai-client.ts
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY no está configurada');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_CONFIG = {
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 1000,
};
```

### Paso 2: Prompts

```typescript
// lib/ai/prompts.ts
export const SYSTEM_PROMPT = `Eres un experto en crear encuestas efectivas para WhatsApp Business.

REGLAS:
1. Preguntas CORTAS (máx 100 chars)
2. Lenguaje conversacional
3. SIEMPRE incluir una pregunta tipo "rating" (1-10)
4. Opciones de multiple choice: 2-4 máximo
5. NO usar emojis en preguntas

TIPOS: multiple_choice, yes_no, rating, open_text, email

RESPONDE EN JSON VÁLIDO.`;

export const createUserPrompt = (description: string, numQuestions: number) => `
Crea una encuesta de ${numQuestions} preguntas sobre: "${description}".

Responde ÚNICAMENTE con este JSON:
{
  "title": "Título corto",
  "welcomeMessage": "Mensaje inicial amigable",
  "questions": [
    {
      "text": "¿Pregunta?",
      "type": "multiple_choice",
      "options": ["Opción 1", "Opción 2"]
    }
  ],
  "thankYouMessage": "Mensaje de cierre"
}`;
```

### Paso 3: API Route

```typescript
// app/api/ai/generate-survey/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { openai, AI_CONFIG } from '@/lib/ai/openai-client';
import { SYSTEM_PROMPT, createUserPrompt } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  try {
    // 1. Auth
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse body
    const { description, numQuestions = 5 } = await req.json();

    // 3. Verificar plan (TODO: implementar check de límites)

    // 4. Llamar a OpenAI
    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.max_tokens,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: createUserPrompt(description, numQuestions) }
      ],
    });

    // 5. Parse response
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const survey = JSON.parse(content);

    // 6. Save to DB (TODO: implementar tracking)

    // 7. Return
    return NextResponse.json({
      success: true,
      data: survey,
      usage: {
        used: 0, // TODO
        limit: 30,
        remaining: 30
      }
    });

  } catch (error) {
    console.error('AI Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate survey' },
      { status: 500 }
    );
  }
}
```

### Paso 4: Componente Modal (Simplificado)

```typescript
// components/surveys/ai-generator-modal.tsx
'use client';

import { useState } from 'react';

interface Props {
  onGenerate: (survey: any) => void;
  onClose: () => void;
}

export function AIGeneratorModal({ onGenerate, onClose }: Props) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, numQuestions: 5 })
      });

      const data = await res.json();
      if (data.success) {
        onGenerate(data.data);
        onClose();
      }
    } catch (error) {
      alert('Error al generar encuesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">✨ Generar con IA</h2>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Satisfacción de clientes en restaurante"
          className="w-full border rounded-lg p-3 mb-4"
          rows={3}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Generando...' : '✨ Generar'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing

### Test Manual con curl

```bash
# 1. Login y obtener cookie de sesión
# 2. Llamar al endpoint

curl -X POST http://localhost:3000/api/ai/generate-survey \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=..." \
  -d '{
    "description": "Satisfacción de clientes en cafetería",
    "numQuestions": 5
  }'
```

### Respuesta Esperada

```json
{
  "success": true,
  "data": {
    "title": "Satisfacción - Cafetería",
    "welcomeMessage": "¡Hola! Nos encantaría tu opinión",
    "questions": [
      {
        "text": "¿Qué te pareció el café?",
        "type": "multiple_choice",
        "options": ["Excelente", "Bueno", "Regular", "Malo"]
      },
      {
        "text": "¿Recomendarías nuestra cafetería?",
        "type": "yes_no",
        "options": ["Sí", "No"]
      },
      {
        "text": "Califica nuestro servicio (1-10)",
        "type": "rating"
      }
    ],
    "thankYouMessage": "¡Gracias por tu tiempo!"
  },
  "usage": {
    "used": 1,
    "limit": 30,
    "remaining": 29
  }
}
```

---

## 💰 Monitoreo de Costos

### Dashboard de OpenAI

```
1. Ir a https://platform.openai.com/usage
2. Ver costos en tiempo real
3. Configurar alertas en Settings → Billing
4. Límite recomendado: $10-20/mes inicialmente
```

### Query SQL para Costos Internos

```sql
-- Costo total del mes actual
SELECT
  SUM(cost_usd) as total_cost,
  COUNT(*) as total_generations
FROM ai_generations
WHERE created_at >= DATE_TRUNC('month', NOW());

-- Por día
SELECT
  DATE(created_at) as date,
  COUNT(*) as generations,
  SUM(cost_usd) as cost
FROM ai_generations
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY is not defined"

```bash
# Verificar que la variable esté en el service
docker service inspect app-chatform-appchayform-pfeamz \
  --format '{{range .Spec.TaskTemplate.ContainerSpec.Env}}{{println .}}{{end}}' \
  | grep OPENAI
```

### Error: "Rate limit exceeded"

- OpenAI tiene límites por tier (Free tier: 3 RPM)
- Solución: Upgrade a Tier 1 ($5 de prepago)
- Ver: https://platform.openai.com/account/limits

### Error: "Invalid JSON response"

- El modelo a veces incluye markdown (```json)
- Solución: Limpiar response antes de parsear:

```typescript
let content = completion.choices[0]?.message?.content || '';
content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
const survey = JSON.parse(content);
```

---

## 📚 Recursos Adicionales

- **OpenAI Docs**: https://platform.openai.com/docs
- **Pricing Calculator**: https://openai.com/pricing
- **Best Practices**: https://platform.openai.com/docs/guides/production-best-practices
- **Rate Limits**: https://platform.openai.com/docs/guides/rate-limits

---

## ✅ Checklist de Deployment

- [ ] API Key configurada en production
- [ ] Migration ejecutada
- [ ] Límites de billing configurados ($10/mes)
- [ ] Testing con múltiples descripciones
- [ ] Monitoring configurado
- [ ] Error handling probado
- [ ] UI integrada en FormBuilder
- [ ] Documentación actualizada

---

**¿Listo para empezar?** El primer paso es obtener la API Key de OpenAI.
