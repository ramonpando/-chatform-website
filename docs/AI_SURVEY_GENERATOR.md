# 🤖 AI Survey Generator - Plan de Implementación

**Fecha**: 2025-11-01
**Status**: Aprobado - Pendiente implementación
**Owner**: ChatForm Team

---

## 📋 Resumen Ejecutivo

Implementación de generación automática de encuestas usando GPT-4o-mini de OpenAI como feature premium en planes Starter y Pro.

### Objetivos:
- ✅ Reducir tiempo de creación de encuestas de 10min → 30seg
- ✅ Aumentar conversión de trials a Starter/Pro
- ✅ Costo operativo < 0.05% del revenue
- ✅ Diferenciador competitivo clave

---

## 💰 Análisis Financiero

### Modelo de IA Seleccionado
**GPT-4o-mini** (OpenAI)
- Input: $0.15 por 1M tokens
- Output: $0.60 por 1M tokens
- Latencia: ~1-2 segundos
- Reliability: 99.9% uptime

### Costos por Generación

```
┌─────────────────────────────────────────┐
│ CÁLCULO DE TOKENS                       │
├─────────────────────────────────────────┤
│ System Prompt:        150 tokens        │
│ User Description:      75 tokens        │
│ AI Response (5Q):     500 tokens        │
├─────────────────────────────────────────┤
│ Total Input:          225 tokens        │
│ Total Output:         500 tokens        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ COSTO POR GENERACIÓN                    │
├─────────────────────────────────────────┤
│ Input:  $0.000034                       │
│ Output: $0.000300                       │
├─────────────────────────────────────────┤
│ TOTAL:  $0.000334 ≈ $0.0003 USD        │
└─────────────────────────────────────────┘
```

### Estructura de Precios por Plan

| Plan | Precio/mes | Generaciones/mes | Costo AI/mes | Margen AI |
|------|------------|------------------|--------------|-----------|
| **Free** | $0 | 0 | $0.00 | N/A |
| **Starter** | $29 | 30 | $0.01 | 99.97% |
| **Pro** | $79 | 100 | $0.03 | 99.96% |

### Proyección Anual (100 clientes)

```
Revenue Anual:
  - 60 clientes Starter: 60 × $29 × 12 = $20,880
  - 40 clientes Pro:     40 × $79 × 12 = $37,920
  ────────────────────────────────────────────
  TOTAL REVENUE:                      $58,800

Costo AI Anual:
  - Starter: 60 × 30 × $0.0003 × 12 = $6.48
  - Pro:     40 × 100 × $0.0003 × 12 = $14.40
  ────────────────────────────────────────────
  TOTAL COSTO AI:                     $20.88

Costo AI como % Revenue: 0.036% ✅
```

### Análisis de Riesgo

**Escenario de Abuso:**
- Usuario excede 3x límite (90 gen en Starter)
- Costo: 90 × $0.0003 = $0.027
- **Pérdida máxima: $0.03 USD**

**Mitigación:**
- Rate limiting: 5 generaciones/hora
- Hard limit mensual por plan
- Monitoring de uso anómalo

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

```typescript
// Dependencies
{
  "openai": "^4.73.1",  // OpenAI SDK
  "zod": "^4.1.12",     // Validación de schemas (ya instalado)
  "nanoid": "^5.1.6"    // IDs únicos (ya instalado)
}
```

### Database Schema

```sql
-- Nueva tabla para tracking de uso AI
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Tipo de generación
  generation_type VARCHAR(50) NOT NULL CHECK (generation_type IN ('survey_generator', 'ai_analysis')),

  -- Data de la generación
  prompt TEXT NOT NULL,
  response JSONB NOT NULL,

  -- Métricas
  tokens_used_input INTEGER NOT NULL,
  tokens_used_output INTEGER NOT NULL,
  cost_usd DECIMAL(10, 6) NOT NULL,
  latency_ms INTEGER,

  -- Metadata
  model VARCHAR(50) NOT NULL DEFAULT 'gpt-4o-mini',
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Indexes
  CONSTRAINT valid_tokens CHECK (tokens_used_input > 0 AND tokens_used_output >= 0)
);

-- Índices para queries comunes
CREATE INDEX idx_ai_gen_tenant_date ON ai_generations(tenant_id, created_at DESC);
CREATE INDEX idx_ai_gen_tenant_type ON ai_generations(tenant_id, generation_type);
CREATE INDEX idx_ai_gen_created ON ai_generations(created_at);

-- Función helper para contar generaciones del mes
CREATE OR REPLACE FUNCTION get_monthly_ai_usage(
  p_tenant_id UUID,
  p_generation_type VARCHAR(50)
) RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM ai_generations
    WHERE tenant_id = p_tenant_id
      AND generation_type = p_generation_type
      AND created_at >= DATE_TRUNC('month', NOW())
      AND success = true
  );
END;
$$ LANGUAGE plpgsql;
```

### API Endpoints

#### 1. `POST /api/ai/generate-survey`

**Request:**
```typescript
{
  description: string;          // "Encuesta de satisfacción para restaurante"
  numQuestions?: number;        // 3-10, default: 5
  tone?: "formal" | "casual";   // default: "casual"
  language?: string;            // default: "es"
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    title: string;
    welcomeMessage: string;
    questions: Array<{
      text: string;
      type: "multiple_choice" | "yes_no" | "rating" | "open_text" | "email";
      options?: string[];
    }>;
    thankYouMessage: string;
  },
  usage: {
    used: number;        // Generaciones usadas este mes
    limit: number;       // Límite del plan
    remaining: number;   // Restantes
  }
}
```

**Error Responses:**
```typescript
// 403 - Plan no permite AI
{
  error: "AI_NOT_AVAILABLE",
  message: "Actualiza a Starter para usar AI Generator",
  upgradeUrl: "/settings/billing"
}

// 429 - Límite excedido
{
  error: "LIMIT_EXCEEDED",
  message: "Has alcanzado el límite de 30 generaciones este mes",
  resetDate: "2025-12-01T00:00:00Z",
  upgradeUrl: "/settings/billing"
}

// 429 - Rate limit
{
  error: "RATE_LIMIT",
  message: "Máximo 5 generaciones por hora. Intenta en 45 minutos.",
  retryAfter: 2700
}
```

#### 2. `GET /api/ai/usage`

**Response:**
```typescript
{
  success: true,
  data: {
    plan: "starter",
    limits: {
      surveyGenerator: {
        used: 12,
        limit: 30,
        remaining: 18,
        resetDate: "2025-12-01T00:00:00Z"
      },
      aiAnalysis: {
        used: 0,
        limit: 0,
        available: false  // Solo en Pro
      }
    },
    rateLimit: {
      current: 2,
      max: 5,
      windowMinutes: 60,
      resetAt: "2025-11-01T15:00:00Z"
    }
  }
}
```

---

## 🎨 UI/UX Design

### Ubicación del Feature

**Página: `/surveys/new` (Form Builder)**

```
┌──────────────────────────────────────────────────┐
│ Nueva Encuesta               [✨ Generar con AI] │
├──────────────────────────────────────────────────┤
│                                                   │
│  Título: ________________                         │
│                                                   │
│  Mensaje de bienvenida: ___________              │
│                                                   │
│  [ + Agregar Pregunta ]                          │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Modal de AI Generator

```
┌─────────────────────────────────────────────────────┐
│  ✨ Generar Encuesta con IA                    [X] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Describe tu encuesta en una frase:                │
│  ┌───────────────────────────────────────────────┐ │
│  │ Ej: Satisfacción de clientes en restaurante  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Número de preguntas: [5 ▼]  Tono: [Casual ▼]    │
│                                                     │
│  💡 Ejemplos:                                      │
│  • Feedback de curso online                        │
│  • NPS para app móvil                             │
│  • Evaluación de evento                           │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ 🎯 Te quedan 18 de 30 generaciones este mes │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│         [Cancelar]  [✨ Generar Encuesta]         │
└─────────────────────────────────────────────────────┘
```

### Loading State

```
┌─────────────────────────────────────────────────────┐
│  ✨ Generando tu encuesta...                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│              [Loading spinner animation]            │
│                                                     │
│       La IA está creando preguntas perfectas       │
│              para tu caso de uso...                │
│                                                     │
│                   ⏱️ ~5 segundos                    │
└─────────────────────────────────────────────────────┘
```

### Preview de Resultados

```
┌─────────────────────────────────────────────────────┐
│  ✨ Encuesta Generada                          [X] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 Satisfacción - Restaurante [Editar]           │
│                                                     │
│  💬 "¡Hola! Nos encantaría conocer tu opinión..." │
│                                                     │
│  Preguntas (5):                                    │
│  ┌───────────────────────────────────────────────┐ │
│  │ 1. ¿Qué te pareció la comida?    [⋮]         │ │
│  │    • Excelente • Buena • Regular • Mala      │ │
│  ├───────────────────────────────────────────────┤ │
│  │ 2. ¿Recomendarías nuestro...     [⋮]         │ │
│  │    • Sí • No                                  │ │
│  ├───────────────────────────────────────────────┤ │
│  │ 3. Califica el servicio (1-10)   [⋮]         │ │
│  ├───────────────────────────────────────────────┤ │
│  │ 4. ¿Qué podemos mejorar?         [⋮]         │ │
│  │    [Texto abierto]                            │ │
│  ├───────────────────────────────────────────────┤ │
│  │ 5. Tu email para seguimiento     [⋮]         │ │
│  │    [Email]                                    │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  💬 "¡Gracias por tu tiempo!"                     │
│                                                     │
│      [🔄 Regenerar]  [✅ Usar Esta Encuesta]      │
└─────────────────────────────────────────────────────┘
```

### Upgrade Prompts

**Para usuarios Free:**
```
┌─────────────────────────────────────────┐
│  ✨ AI Survey Generator                │
├─────────────────────────────────────────┤
│                                         │
│  🚀 Feature Premium                    │
│                                         │
│  Crea encuestas perfectas en segundos  │
│  con inteligencia artificial.          │
│                                         │
│  Incluido en:                          │
│  • Starter: 30 generaciones/mes        │
│  • Pro: 100 generaciones/mes           │
│                                         │
│      [Ver Planes] [Cerrar]             │
└─────────────────────────────────────────┘
```

---

## 🤖 Prompt Engineering

### System Prompt

```typescript
const SYSTEM_PROMPT = `Eres un experto en crear encuestas efectivas para WhatsApp Business.

REGLAS IMPORTANTES:
1. Las preguntas deben ser CORTAS (máximo 100 caracteres)
2. Usa lenguaje conversacional y amigable
3. SIEMPRE incluye una pregunta de rating (1-10) para NPS
4. Las opciones de multiple choice deben ser 2-4 opciones máximo
5. Usa emojis solo en mensajes de bienvenida/despedida, NO en preguntas
6. Para restaurantes/servicios: incluir satisfacción + recomendación
7. Para productos: incluir satisfacción + feedback + email opcional

TIPOS DE PREGUNTA DISPONIBLES:
- multiple_choice: 2-4 opciones
- yes_no: Solo Sí/No
- rating: Escala 1-10
- open_text: Respuesta libre corta
- email: Captura de email

RESPONDE SIEMPRE EN JSON VÁLIDO.`;
```

### User Prompt Template

```typescript
const generateUserPrompt = (input: GenerateInput) => `
Crea una encuesta de ${input.numQuestions} preguntas sobre: "${input.description}".

Tono: ${input.tone === 'formal' ? 'profesional y cortés' : 'amigable y conversacional'}
Idioma: ${input.language}

Requisitos:
- Título atractivo y corto (máx 50 caracteres)
- Mensaje de bienvenida personal (máx 150 caracteres)
- ${input.numQuestions} preguntas variadas y relevantes
- AL MENOS una pregunta tipo "rating" (1-10)
- Mensaje de agradecimiento cálido (máx 100 caracteres)

Responde ÚNICAMENTE con este JSON (sin markdown):
{
  "title": "Título de la encuesta",
  "welcomeMessage": "Mensaje inicial",
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

### Ejemplos de Output Esperado

**Ejemplo 1: Restaurante**
```json
{
  "title": "Satisfacción - La Taquería",
  "welcomeMessage": "¡Hola! 👋 Nos ayudas con 2 minutos de tu tiempo?",
  "questions": [
    {
      "text": "¿Qué te pareció la comida?",
      "type": "multiple_choice",
      "options": ["Excelente", "Buena", "Regular", "Mala"]
    },
    {
      "text": "¿Recomendarías nuestro restaurante?",
      "type": "yes_no",
      "options": ["Sí", "No"]
    },
    {
      "text": "Califica el servicio del 1 al 10",
      "type": "rating"
    },
    {
      "text": "¿Qué podemos mejorar?",
      "type": "open_text"
    },
    {
      "text": "Tu email para enviarte un descuento",
      "type": "email"
    }
  ],
  "thankYouMessage": "¡Gracias por tu opinión! 🙏 Te esperamos pronto."
}
```

**Ejemplo 2: Curso Online**
```json
{
  "title": "Feedback - Curso de Marketing",
  "welcomeMessage": "Hola! Queremos saber cómo fue tu experiencia",
  "questions": [
    {
      "text": "¿El contenido cumplió tus expectativas?",
      "type": "yes_no",
      "options": ["Sí", "No"]
    },
    {
      "text": "¿Qué tan probable es que recomiendes el curso? (1-10)",
      "type": "rating"
    },
    {
      "text": "¿Qué fue lo que más te gustó?",
      "type": "open_text"
    },
    {
      "text": "Tu email para futuros cursos",
      "type": "email"
    }
  ],
  "thankYouMessage": "¡Gracias! Tu feedback nos ayuda a mejorar 🚀"
}
```

---

## ⚙️ Rate Limiting Strategy

### Niveles de Control

```typescript
// 1. Rate Limit por Hora (Anti-spam)
const RATE_LIMITS = {
  generations_per_hour: 5,
  window_minutes: 60
};

// 2. Límite Mensual por Plan
const MONTHLY_LIMITS = {
  free: 0,
  starter: 30,
  pro: 100
};

// 3. Cooldown entre requests
const COOLDOWN_SECONDS = 3;  // Mínimo 3 segundos entre generaciones
```

### Implementación en Redis (Opcional, para escalar)

```typescript
// Key pattern: ai:ratelimit:{tenantId}:{hour}
// Value: count
// TTL: 1 hour

// Key pattern: ai:cooldown:{tenantId}
// Value: timestamp
// TTL: 3 seconds
```

### Implementación en DB (Actual)

```typescript
// Query para verificar rate limit
const checkRateLimit = async (tenantId: string) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const count = await db
    .select({ count: sql`COUNT(*)` })
    .from(aiGenerations)
    .where(
      and(
        eq(aiGenerations.tenantId, tenantId),
        gte(aiGenerations.createdAt, oneHourAgo),
        eq(aiGenerations.success, true)
      )
    );

  return count[0].count < 5;
};
```

---

## 📊 Monitoring & Analytics

### Métricas Clave

```typescript
// Dashboard de AI Usage
interface AIMetrics {
  // Por tenant
  totalGenerations: number;
  successRate: number;
  avgLatency: number;
  avgCost: number;

  // Agregado
  totalCostUSD: number;
  generationsPerDay: number;
  topUsers: Array<{
    tenantId: string;
    generations: number;
    plan: string;
  }>;

  // Alertas
  highUsageTenantsCount: number;  // >80% del límite
  failureRate: number;             // >5% = alerta
}
```

### Queries de Monitoring

```sql
-- Costo total del mes
SELECT
  SUM(cost_usd) as total_cost,
  COUNT(*) as total_generations,
  AVG(latency_ms) as avg_latency
FROM ai_generations
WHERE created_at >= DATE_TRUNC('month', NOW());

-- Top usuarios del mes
SELECT
  t.name,
  t.plan,
  COUNT(*) as generations,
  SUM(ag.cost_usd) as cost
FROM ai_generations ag
JOIN tenants t ON ag.tenant_id = t.id
WHERE ag.created_at >= DATE_TRUNC('month', NOW())
GROUP BY t.id, t.name, t.plan
ORDER BY generations DESC
LIMIT 10;

-- Tasa de error
SELECT
  COUNT(CASE WHEN success = false THEN 1 END) * 100.0 / COUNT(*) as error_rate
FROM ai_generations
WHERE created_at >= NOW() - INTERVAL '24 hours';
```

---

## 🚀 Plan de Implementación

### Fase 1: Setup (Día 1) ✅
- [ ] Crear cuenta OpenAI y obtener API key
- [ ] Agregar variable `OPENAI_API_KEY` al .env
- [ ] Instalar dependencia `npm install openai`
- [ ] Crear migration para tabla `ai_generations`
- [ ] Ejecutar migration en DB

### Fase 2: Backend (Día 2-3)
- [ ] Crear `/lib/ai/openai-client.ts` - Cliente de OpenAI
- [ ] Crear `/lib/ai/prompts.ts` - System/User prompts
- [ ] Crear `/lib/ai/rate-limiter.ts` - Rate limiting logic
- [ ] Crear `/api/ai/generate-survey/route.ts` - Endpoint principal
- [ ] Crear `/api/ai/usage/route.ts` - Endpoint de métricas
- [ ] Testing con Postman/curl

### Fase 3: Frontend (Día 4-5)
- [ ] Crear componente `AIGeneratorModal.tsx`
- [ ] Crear componente `AIGeneratedPreview.tsx`
- [ ] Integrar modal en `FormBuilderV2`
- [ ] Agregar botón "✨ Generar con AI"
- [ ] Manejar estados: loading, success, error
- [ ] Agregar upgrade prompts para Free plan

### Fase 4: Testing (Día 6)
- [ ] Test con diferentes descripciones
- [ ] Verificar límites por plan
- [ ] Test de rate limiting
- [ ] Test de error handling
- [ ] Test de costs tracking

### Fase 5: Deploy (Día 7)
- [ ] Agregar `OPENAI_API_KEY` a Docker service
- [ ] Build y deploy
- [ ] Monitorear primeras generaciones
- [ ] Ajustar prompts según feedback

---

## 🔒 Seguridad

### Variables de Entorno

```bash
# .env.production
OPENAI_API_KEY=sk-proj-xxxxx  # NUNCA commitear
OPENAI_ORG_ID=org-xxxxx        # Opcional
```

### Best Practices

1. **API Key**: Usar en servidor únicamente (nunca en cliente)
2. **Rate Limiting**: Implementar en múltiples capas
3. **Validación**: Sanitizar input del usuario
4. **Logging**: NO loguear API keys ni responses completas
5. **Error Handling**: No exponer detalles de OpenAI al usuario

### Input Sanitization

```typescript
// Máximos permitidos
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_QUESTIONS = 10;
const MIN_QUESTIONS = 3;

// Validación con Zod
const generateSurveySchema = z.object({
  description: z.string()
    .min(10, "Descripción muy corta")
    .max(MAX_DESCRIPTION_LENGTH, "Descripción muy larga")
    .regex(/^[a-zA-Z0-9\s\-.,áéíóúÁÉÍÓÚñÑ]+$/, "Caracteres no permitidos"),
  numQuestions: z.number().int().min(MIN_QUESTIONS).max(MAX_QUESTIONS).default(5),
  tone: z.enum(["formal", "casual"]).default("casual"),
  language: z.string().length(2).default("es")
});
```

---

## 📈 KPIs y Success Metrics

### Métricas de Negocio

| Métrica | Target | Cómo medir |
|---------|--------|------------|
| Conversión Free → Starter | +15% | Analytics de upgrades |
| Uso de AI Generator | >60% de Starter/Pro | % usuarios que lo usan |
| Tiempo de creación | -80% (10min → 2min) | Analytics de sesión |
| NPS de feature | >8/10 | Encuesta in-app |

### Métricas Técnicas

| Métrica | Target | Alerta |
|---------|--------|--------|
| Latencia p95 | <3s | >5s |
| Success rate | >98% | <95% |
| Costo mensual | <$100 | >$150 |
| Error rate | <2% | >5% |

---

## 💡 Future Enhancements (V2)

### Corto Plazo (3 meses)
- [ ] Regenerar pregunta individual
- [ ] Templates por industria (10+ templates)
- [ ] Sugerencias de mejora en preguntas existentes
- [ ] A/B testing de variantes

### Mediano Plazo (6 meses)
- [ ] AI Analysis & Insights (Plan Pro)
- [ ] Análisis de sentiment en respuestas abiertas
- [ ] Recomendaciones automáticas de optimización
- [ ] Multi-idioma automático

### Largo Plazo (12 meses)
- [ ] Fine-tuning de modelo específico para surveys
- [ ] Integración con datos históricos del tenant
- [ ] Predicción de tasa de respuesta
- [ ] Auto-optimización basada en resultados

---

## 📞 Contacto y Soporte

**Documentación OpenAI**: https://platform.openai.com/docs
**Pricing OpenAI**: https://openai.com/pricing
**Status OpenAI**: https://status.openai.com

**Equipo interno**:
- Tech Lead: [Pendiente]
- Product Manager: [Pendiente]

---

## ✅ Checklist de Aprobación

- [x] Análisis financiero completado
- [x] Costos validados (<0.05% revenue)
- [x] Arquitectura definida
- [x] UI/UX diseñado
- [x] Plan de implementación creado
- [ ] API Key de OpenAI obtenida
- [ ] Presupuesto mensual aprobado ($100)
- [ ] Equipo asignado
- [ ] Fecha de inicio definida

---

**Última actualización**: 2025-11-01
**Versión**: 1.0
**Status**: ✅ APROBADO - Ready for Implementation
