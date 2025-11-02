# Propuesta: AI Adaptive Surveys & Conversational Survey Builder

## Resumen Ejecutivo

Dos features revolucionarias para ChatForm que nos diferencian de toda la competencia:

1. **Dynamic AI Questions**: Preguntas generadas dinámicamente por AI basadas en respuestas previas ⏸️ **[ROADMAP - Fase 2]**
2. **Conversational Survey Builder**: Chat iterativo para diseñar encuestas (no solo un shot) ✅ **[IMPLEMENTACIÓN PRIORITARIA]**

---

## 🎯 DECISIÓN: Priorizar Conversational Builder

**Razón:** Mayor impacto inmediato en UX de creación de encuestas, más fácil de implementar y validar.

**Dynamic AI Questions** queda en roadmap para Fase 2 después de validar adoption del builder conversacional.

---

## 🧠 FEATURE 1: Dynamic AI Questions (Preguntas Adaptativas con IA)

### Concepto

En lugar de solo usar lógica condicional estática (if response = X, show question Y), usar IA para **generar preguntas personalizadas** basadas en el contexto de respuestas anteriores.

### Problema que Resuelve

**Problema actual:**
- Lógica condicional requiere predefinir TODAS las posibles rutas
- Respuestas abiertas no pueden trigger seguimientos personalizados
- Encuestas genéricas que no profundizan en insights valiosos

**Ejemplo:**
```
❌ ESTÁTICO:
Q1: "¿Por qué cancelaste?"
Usuario: "Muy caro y falta integración con Salesforce"
Q2: "¿Qué precio sería justo?" (pregunta genérica predefinida)

✅ CON AI DINÁMICO:
Q1: "¿Por qué cancelaste?"
Usuario: "Muy caro y falta integración con Salesforce"
Q2 (generada por AI): "Entiendo que mencionaste precio y Salesforce. ¿Cuánto pagarías por un plan que incluya integración con Salesforce?"
```

### User Story

**Como:** Founder de SaaS
**Quiero:** Obtener insights profundos sin crear 50 ramas de lógica condicional
**Para:** Entender el churn de manera cualitativa y cuantitativa

### Casos de Uso Prioritarios

#### 1. **Churn Prevention Survey**
```
Q1: "¿Por qué estás cancelando?" (open text)
Usuario: "La interfaz es confusa y nunca logré importar mis datos"

AI detecta: frustración con UX + problema de onboarding
AI genera: "Lamento eso. ¿Intentaste contactar a soporte para ayuda con la importación?"
Usuario: "No, pensé que sería muy lento"

AI genera: "Entiendo. ¿Te ayudaría un onboarding 1-on-1 gratuito para quedarte?"
```

#### 2. **Product-Market Fit Deep Dive**
```
Q1: "¿Qué tan decepcionado estarías sin nuestro producto?"
Usuario: "Muy decepcionado"

AI genera: "¡Qué bueno! ¿Qué feature específica te haría más decepcionado perder?"
Usuario: "La automatización de reportes"

AI genera: "Perfecto. ¿Recomendarías esta feature a alguien en tu industria? ¿A quién?"
```

#### 3. **Pricing Sensitivity**
```
Q1: "¿Qué te impide hacer upgrade?"
Usuario: "Precio alto para mi uso actual"

AI genera: "Entiendo. ¿Cuántas respuestas WhatsApp recibes al mes aproximadamente?"
Usuario: "Unas 150"

AI genera: "Con 150 respuestas, nuestro plan Starter ($39/mes) te daría 200. ¿Ese precio sería razonable?"
```

### Arquitectura Técnica

```typescript
interface AIQuestion {
  id: string;
  questionText: string; // Generado por AI
  questionType: "open_text" | "multiple_choice" | "yes_no";
  generatedOptions?: string[]; // AI puede sugerir opciones
  triggerCondition: {
    previousQuestionId: string;
    aiAnalysis: string; // Contexto que AI detectó
  };
  isAIGenerated: true;
}

interface SurveySession {
  id: string;
  surveyId: string;
  responses: Response[];
  conversationContext: string; // Historial para AI
  nextQuestionStrategy: "static" | "ai_dynamic";
}
```

### API Design

**Endpoint:** `POST /api/surveys/session/:sessionId/next-question`

**Request:**
```json
{
  "sessionId": "sess_123",
  "lastResponse": {
    "questionId": "q1",
    "answerText": "Muy caro y falta integración con Salesforce"
  },
  "conversationHistory": [
    { "q": "¿Por qué cancelaste?", "a": "Muy caro y falta integración con Salesforce" }
  ]
}
```

**Response:**
```json
{
  "nextQuestion": {
    "id": "ai_q2_abc123",
    "questionText": "Entiendo que mencionaste precio y Salesforce. ¿Cuánto pagarías mensualmente por un plan con integración a Salesforce?",
    "questionType": "open_text",
    "isAIGenerated": true,
    "placeholder": "Ej: $50/mes"
  }
}
```

### Prompt Engineering

**System Prompt para AI:**
```
Eres un experto en encuestas SaaS y psicología del consumidor.

Tu tarea: Generar la siguiente pregunta óptima basada en la respuesta del usuario.

Reglas:
1. Profundiza en insights específicos mencionados por el usuario
2. Usa lenguaje natural y empático
3. Haz preguntas accionables (que puedan informar decisiones de negocio)
4. Máximo 25 palabras por pregunta
5. Evita preguntas genéricas
6. Si el usuario menciona un pain point, pregunta por soluciones específicas

Context: Survey type = Churn Prevention
Previous answers:
- Q1: "¿Por qué cancelaste?" → "Muy caro y falta integración con Salesforce"

Generate next question:
```

### Configuración en Form Builder

Agregar toggle en cada pregunta:

```
┌─────────────────────────────────┐
│ Pregunta 3                      │
│ ¿Por qué cancelaste?            │
│                                 │
│ Tipo: Texto abierto             │
│                                 │
│ ☑ Enable AI Follow-up          │
│   └─ Generar preguntas de      │
│      seguimiento con IA         │
│                                 │
│ AI Context:                     │
│ [Profundizar en razones de     │
│  cancelación y posibles         │
│  soluciones]                    │
└─────────────────────────────────┘
```

### Límites y Costos

| Plan | AI Questions/mes | Costo por pregunta |
|------|-----------------|-------------------|
| Free | 0 | - |
| Starter | 0 | - |
| Pro | 100 | $0.005 |
| Business | Unlimited | $0.003 |

**Costo estimado:** ~$0.005 por pregunta generada (GPT-4o-mini)

### Métricas de Éxito

- **Engagement:** % de usuarios que completan encuestas con AI vs estáticas
- **Depth:** Promedio de preguntas contestadas por sesión
- **Quality:** Sentiment de respuestas (positivo = mayor engagement)
- **NPS Improvement:** Correlación entre uso de AI questions y mejora de NPS

---

## 💬 FEATURE 2: Conversational Survey Builder (AI Chat Iterativo)

### Concepto

En lugar de generar la encuesta en un solo shot, tener una **conversación iterativa** con IA para refinar la encuesta hasta que sea perfecta.

### Problema que Resuelve

**Problema actual:**
- AI Generator actual = un solo intento
- Si el resultado no es perfecto, usuario debe regenerar TODO
- No hay refinamiento incremental
- Falta de control granular

**Ejemplo de UX actual:**
```
User: "Genera encuesta de churn"
AI: [Genera 10 preguntas]
User: "Mmm... no me gusta la pregunta 3"
User tiene que: Borrarla manualmente, escribir nueva pregunta, etc.
```

**Ejemplo de UX mejorada:**
```
User: "Genera encuesta de churn"
AI: [Genera 10 preguntas]
User: "Cambia la pregunta 3 para enfocarse en pricing"
AI: [Modifica solo la pregunta 3]
User: "Agrega una pregunta sobre onboarding"
AI: [Agrega pregunta 11 específica de onboarding]
User: "Perfecto, ahora genera el mensaje de bienvenida"
AI: [Genera welcome message personalizado]
```

### User Story

**Como:** Usuario creando encuesta
**Quiero:** Iterar con IA hasta llegar al diseño perfecto
**Para:** No perder tiempo regenerando todo desde cero

### UI/UX Design

**Modal de AI Builder Conversacional:**

```
┌─────────────────────────────────────────────────────────┐
│ 💬 AI Survey Assistant                           [X]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  AI: ¡Hola! Voy a ayudarte a crear tu encuesta.       │
│      ¿Qué tipo de feedback quieres recopilar?         │
│                                                         │
│  You: Churn prevention para SaaS B2B                   │
│                                                         │
│  AI: Perfecto. ¿Qué tipo de producto ofreces?         │
│                                                         │
│  You: Gestión de proyectos para equipos de 10-50      │
│                                                         │
│  AI: Entendido. ¿Cuál es tu mayor preocupación?       │
│      a) Churn temprano (< 3 meses)                    │
│      b) Churn después de renovación anual             │
│      c) Ambos                                          │
│                                                         │
│  You: Churn temprano                                   │
│                                                         │
│  AI: Ok, voy a enfocarme en early churn.              │
│      He creado un borrador con 8 preguntas.           │
│                                                         │
│      [Ver borrador] [Refinar] [Aplicar]               │
│                                                         │
│  You: Muéstrame el borrador                            │
│                                                         │
│  AI: Aquí están las preguntas:                         │
│                                                         │
│      1. ¿Por qué decidiste cancelar? (texto abierto)   │
│      2. ¿Cuánto tiempo usaste el producto? (opciones)  │
│      3. ¿Lograste [objetivo]? (sí/no)                  │
│      ...                                               │
│                                                         │
│  You: Agrega pregunta sobre integraciones             │
│                                                         │
│  AI: ¡Listo! Agregué:                                  │
│      9. ¿Qué integraciones necesitabas que no         │
│         teníamos? (texto abierto)                      │
│                                                         │
│      ¿Algo más que quieras ajustar?                   │
│                                                         │
│  You: Cambia la pregunta 2 a texto abierto            │
│                                                         │
│  AI: Hecho. Pregunta 2 ahora es:                       │
│      "¿Cuántos meses usaste el producto?"             │
│                                                         │
│  You: Perfecto, aplícalo                               │
│                                                         │
│  AI: ✅ Encuesta creada con 9 preguntas.              │
│      Puedes seguir editándola en el builder.          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Type your message...]                     [Send →]    │
└─────────────────────────────────────────────────────────┘
```

### Comandos Naturales Soportados

| User Intent | Example Command | AI Action |
|-------------|----------------|-----------|
| Add question | "Agrega pregunta sobre pricing" | Inserta nueva pregunta al final |
| Modify question | "Cambia pregunta 3 a multiple choice" | Modifica tipo de pregunta |
| Delete question | "Elimina la pregunta 5" | Borra pregunta |
| Reorder | "Mueve pregunta 2 después de pregunta 5" | Reordena |
| Change tone | "Haz el welcome message más friendly" | Regenera texto |
| Add logic | "Si responden 'precio' en Q1, pregunta cuánto pagarían" | Agrega conditional logic |
| Generate from template | "Usa template de Product-Market Fit como base" | Carga template + permite edits |

### Arquitectura Técnica

```typescript
interface ConversationMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
  action?: {
    type: "add_question" | "modify_question" | "delete_question" | "apply_survey";
    data: any;
  };
}

interface SurveyBuilderSession {
  id: string;
  userId: string;
  conversationHistory: ConversationMessage[];
  currentDraft: {
    title: string;
    welcomeMessage: string;
    questions: Question[];
    thankYouMessage: string;
  };
  context: {
    industry?: string;
    surveyType?: string;
    targetAudience?: string;
  };
}
```

### API Design

**Endpoint:** `POST /api/ai/survey-chat`

**Request:**
```json
{
  "sessionId": "builder_sess_123",
  "message": "Agrega pregunta sobre integraciones",
  "conversationHistory": [
    { "role": "ai", "content": "¿Qué tipo de feedback quieres?" },
    { "role": "user", "content": "Churn prevention" }
  ],
  "currentDraft": {
    "questions": [...]
  }
}
```

**Response:**
```json
{
  "message": "¡Listo! Agregué: '¿Qué integraciones necesitabas que no teníamos?'",
  "action": {
    "type": "add_question",
    "question": {
      "id": "q9_new",
      "text": "¿Qué integraciones necesitabas que no teníamos?",
      "type": "open_text"
    }
  },
  "updatedDraft": {
    "questions": [...] // 9 questions ahora
  }
}
```

### Prompt Engineering

**System Prompt:**
```
Eres un AI assistant experto en diseño de encuestas SaaS.

Modo: Conversational Survey Builder

Capacidades:
- Hacer preguntas clarificadoras para entender mejor el objetivo
- Sugerir mejores prácticas de encuestas
- Agregar, modificar, eliminar preguntas según instrucciones
- Generar borradores completos
- Refinar incrementalmente

Current draft:
{currentDraft}

User said: "{userMessage}"

Analiza la intención del usuario:
1. Si pide agregar → genera nueva pregunta
2. Si pide modificar → ajusta pregunta existente
3. Si pide ver draft → muestra resumen
4. Si pide aplicar → confirma y cierra

Responde de forma concisa (max 50 palabras) y ejecuta la acción.
```

### Integración con Form Builder

Agregar botón "Chat with AI" en el builder:

```
┌─────────────────────────────────┐
│ Header: "Nueva Encuesta"        │
│                                 │
│ [💬 Chat with AI]               │  ← NUEVO
│ [✨ Generar con IA]  (old)      │
│ [📋 Usar Plantilla]             │
└─────────────────────────────────┘
```

Al hacer clic, abre sidebar conversacional:

```
┌─────────────────────┬─────────────────┐
│ Survey Builder      │ 💬 AI Chat      │
│                     │                 │
│ Title: [...]        │ AI: Hola...     │
│                     │                 │
│ Questions:          │ You: ...        │
│ 1. [...]            │                 │
│ 2. [...]            │ AI: ...         │
│                     │                 │
│                     │ [Type...]       │
└─────────────────────┴─────────────────┘
```

### Límites y Costos

| Plan | Chat Messages/mes | Costo |
|------|------------------|-------|
| Free | 0 | - |
| Starter | 0 | - |
| Pro | 100 | Incluido |
| Business | Unlimited | Incluido |

**Costo estimado:** ~$0.01 por mensaje completo (prompt + respuesta)

---

## 🎯 Priorización de Implementación

### Phase 1: MVP (2-3 semanas)
1. **Dynamic AI Questions** - Versión básica
   - ✅ Solo para open_text responses
   - ✅ Solo 1 follow-up AI question por respuesta
   - ✅ Solo en Pro/Business plans
   - ✅ Prompt simple sin deep context

2. **Conversational Builder** - Versión básica
   - ✅ Chat interface básico
   - ✅ Comandos: add, modify, delete, apply
   - ✅ Sin historial persistente entre sesiones
   - ✅ Solo generación inicial + 3 iteraciones

### Phase 2: Full Feature (4-6 semanas)
1. **Dynamic AI Questions** - Completo
   - ✅ Multi-level AI questions (AI puede generar 2-3 follow-ups)
   - ✅ AI context awareness (recuerda toda la conversación)
   - ✅ Configurable AI behavior por pregunta
   - ✅ Dashboard de insights de AI responses

2. **Conversational Builder** - Completo
   - ✅ Historial persistente
   - ✅ Sugerencias proactivas de AI
   - ✅ Templates como starting point
   - ✅ Voice commands (opcional)
   - ✅ Collaborative chat (team members pueden ver)

### Phase 3: Advanced (2-3 meses)
- ✅ Multi-language AI support
- ✅ AI-powered analytics de respuestas
- ✅ Predictive insights (AI predice qué preguntas tendrán mejor engagement)
- ✅ A/B testing automático de AI questions

---

## 💰 Modelo de Negocio

### Pricing Diferenciado

| Feature | Free | Starter | Pro | Business |
|---------|------|---------|-----|----------|
| AI Generator (one-shot) | ❌ | ❌ | ✅ 10/mes | ✅ Unlimited |
| Conversational Builder | ❌ | ❌ | ✅ 100 msgs | ✅ Unlimited |
| Dynamic AI Questions | ❌ | ❌ | ✅ 100/mes | ✅ Unlimited |
| AI Insights Dashboard | ❌ | ❌ | ❌ | ✅ |

### Upgrade Path

**Free → Pro:** "Unlock AI-powered surveys that adapt to your users"
**Pro → Business:** "Get unlimited AI conversations + advanced insights"

---

## 📊 Métricas de Éxito (KPIs)

### Product Metrics
- **Adoption Rate:** % de usuarios Pro/Business que usan AI features
- **Engagement:** Promedio de mensajes por conversación (target: 5+)
- **Completion Rate:** % de encuestas AI que se completan vs se abandonan
- **AI Question Depth:** Promedio de AI follow-ups por encuesta

### Business Metrics
- **Conversion:** % Free → Pro por AI features
- **Retention:** Churn rate de usuarios con AI vs sin AI
- **NRR:** Net Revenue Retention de planes con AI

### Technical Metrics
- **Latency:** < 2s para generar AI question
- **Accuracy:** % de AI questions que son relevantes (user feedback)
- **Cost per AI Action:** Target < $0.01

---

## 🚀 Ventaja Competitiva

### Por qué esto nos diferencia:

**Typeform, Google Forms, SurveyMonkey:**
- ❌ Sin AI adaptativo
- ❌ Sin conversational builder
- ❌ Lógica condicional manual

**ChatForm con AI Adaptive:**
- ✅ Encuestas que piensan
- ✅ Build surveys conversando
- ✅ Insights profundos automáticos
- ✅ WhatsApp + AI = combo único

---

## 🛠️ Stack Técnico Recomendado

- **AI Model:** OpenAI GPT-4o-mini (costo/performance óptimo)
- **Streaming:** Server-Sent Events para chat en tiempo real
- **Storage:** Redis para session state + PostgreSQL para persistencia
- **Rate Limiting:** Upstash Rate Limit
- **Monitoring:** Posthog para AI analytics

---

## 🗺️ ROADMAP DE IMPLEMENTACIÓN

### ✅ FASE 1: Conversational Survey Builder (AHORA - 2-3 semanas)

**Objetivo:** Chat iterativo para diseñar encuestas con IA

**Alcance MVP:**
- ✅ Chat interface básico en modal
- ✅ Comandos: add, modify, delete, apply
- ✅ Integración con form builder
- ✅ Sin historial persistente (solo durante sesión activa)
- ✅ Límite: 20 mensajes por conversación
- ✅ Solo Pro/Business plans

**Entregables:**
1. Componente `AIConversationalBuilder.tsx`
2. API endpoint `/api/ai/survey-chat`
3. Integración con FormBuilderV2
4. Documentación de uso
5. Tests básicos

**Métricas de éxito:**
- 30% de usuarios Pro/Business lo prueban
- 5+ mensajes promedio por conversación
- 70% de conversaciones resultan en survey publicada

---

### ⏸️ FASE 2: Dynamic AI Questions (ROADMAP - Q2 2025)

**Objetivo:** Preguntas adaptativas generadas por IA durante respuestas

**Por qué después:**
- Más complejo técnicamente
- Requiere infrastructure de streaming
- Depende de validar adoption de AI primero
- Costo de OpenAI más alto

**Prerequisitos antes de implementar:**
- ✅ Validar que Conversational Builder tiene adoption
- ✅ Confirmar budget de AI costs
- ✅ Tener > 100 usuarios Pro/Business activos
- ✅ Implementar rate limiting robusto

**Alcance cuando se implemente:**
- Solo 1 follow-up AI question por respuesta open_text
- Solo en 3 templates: Churn, PMF, Support
- Prompt simple sin deep context
- Configurable on/off por pregunta

---

### 🔮 FASE 3: Advanced AI Features (ROADMAP - H2 2025)

**Posibles expansiones futuras:**

1. **Multi-level AI Questions**
   - AI puede generar 2-3 follow-ups en cadena
   - Context awareness completo

2. **AI Insights Dashboard**
   - Análisis automático de respuestas con AI
   - Sentiment analysis
   - Keyword extraction
   - Trend detection

3. **Predictive Surveys**
   - AI predice qué preguntas tendrán mejor engagement
   - A/B testing automático
   - Optimization suggestions

4. **Voice-to-Survey**
   - Crear encuestas dictando por voz
   - Integración con Whisper API

5. **Collaborative AI**
   - Team members pueden ver y comentar en chat de AI
   - AI recuerda preferencias del equipo

---

## 🎬 Próximos Pasos Inmediatos

### Para empezar Conversational Builder:

1. ✅ **Aprobación de diseño** - ¿Ok con el enfoque propuesto?
2. ✅ **Confirmar pricing/gating** - ¿Solo Pro/Business o incluir Starter?
3. ✅ **Validar límites** - ¿20 mensajes/conversación es razonable?
4. 🚀 **Comenzar implementación** - Crear branch `feature/conversational-ai-builder`

### Orden de implementación:

**Semana 1:**
- [ ] Backend: API `/api/ai/survey-chat`
- [ ] Prompt engineering básico
- [ ] Tests de OpenAI integration

**Semana 2:**
- [ ] Frontend: AIConversationalBuilder component
- [ ] Chat UI con streaming
- [ ] Integración con FormBuilderV2

**Semana 3:**
- [ ] Commands parsing (add, modify, delete)
- [ ] Apply survey logic
- [ ] Polish & testing
- [ ] Deploy a producción

**Validación (Semana 4):**
- [ ] Monitor adoption metrics
- [ ] Collect user feedback
- [ ] Iterate based on learnings
- [ ] Decide si Phase 2 (Dynamic AI Questions)

---

## 📚 DOCUMENTACIÓN VERIFICADA

### ✅ Documentos existentes:
1. `/root/chatform/CHANGELOG.md` - Actualizado con templates
2. `/root/chatform/SAAS_TEMPLATES_FINAL.md` - 20 templates completos
3. `/root/chatform/AI_ADAPTIVE_SURVEYS_PROPOSAL.md` - Este documento
4. `/root/chatform/app/src/lib/constants/pricing.ts` - Pricing actualizado
5. `/root/chatform/app/src/lib/auth/rbac.ts` - RBAC implementado

### ✅ Features implementadas y documentadas:
- ✅ 20 SaaS Survey Templates
- ✅ Template Selector con búsqueda y filtros
- ✅ RBAC system (owner/admin/member)
- ✅ Real trend analytics (no hardcoded)
- ✅ Pricing actualizado ($39 Starter, $99 Pro, $299 Business)

### ✅ Código implementado:
- ✅ `/app/src/lib/constants/survey-templates.ts` - 20 templates
- ✅ `/app/src/components/surveys/template-selector.tsx` - UI selector
- ✅ `/app/src/components/surveys/form-builder-v2.tsx` - Integración

### 📋 TODO antes de empezar Conversational Builder:
- [ ] Confirmar que OpenAI API key funciona
- [ ] Setup rate limiting en API
- [ ] Crear tests para AI responses
- [ ] Documentar costos esperados

---

## 💰 Budget Planning

### Costos estimados Conversational Builder:

**Por conversación completa (20 mensajes):**
- Input tokens: ~500 tokens promedio × 20 = 10,000 tokens
- Output tokens: ~200 tokens promedio × 20 = 4,000 tokens
- **Costo total por conversación:** ~$0.15 (GPT-4o-mini)

**Con 1000 conversaciones/mes:**
- Costo mensual: $150
- Revenue si 100 usuarios Pro ($99): $9,900
- **Margen:** 98.5% 💰

**Conclusión:** Económicamente viable incluso con high usage.

---

**¿Listo para empezar la implementación de Conversational Builder?** 🚀
