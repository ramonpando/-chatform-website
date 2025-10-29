# ChatForm - Consolidated Decision Framework

## Documento de Decisiones Arquitectónicas y Estratégicas

**Fecha:** Octubre 2025
**Propósito:** Consolidar ChatForm_Developer_Blueprint.md y ChatForm_Technical_Research_2025.md en decisiones ejecutables
**Status:** Living document - actualizar después de cada sprint

---

## DECISIONES ARQUITECTÓNICAS FINALES

### 1. Stack Tecnológico para MVP

**DECISIÓN TOMADA:** Next.js 15 + tRPC + Drizzle + Clerk

**Contexto:**
- Equipo pequeño (1-3 developers)
- Prioridad: velocidad y validación de mercado
- Timeline: 4 meses a MVP funcional
- Presupuesto: <$40k incluyendo desarrollo

**Stack Final:**

```yaml
Frontend & Backend:
  framework: Next.js 15 (App Router)
  api_layer: tRPC (internal) + REST (webhooks)
  ui: Shadcn/ui + Tailwind CSS
  form_builder: FormEngine (MVP) → Custom (V2)

Database:
  engine: PostgreSQL 15+
  orm: Drizzle ORM
  hosting: Neon (serverless) para MVP

Authentication:
  provider: Clerk
  features:
    - Organizations (multi-tenant)
    - RBAC
    - SSO ready (post-MVP)

Integrations:
  whatsapp: Meta Cloud API
  ai: OpenAI GPT-4o-mini (MVP) + GPT-4o (enterprise)
  billing: Stripe
  jobs: Inngest (serverless) → BullMQ (scale)

Infrastructure:
  hosting: Vercel (MVP) → Railway (scale)
  monitoring: Sentry + Vercel Analytics
  logging: Axiom o Logtail
```

**Criterios de Migración (cuando cambiar):**

| Migrar a | Cuando | Señales |
|----------|--------|---------|
| NestJS backend | Enterprise compliance reqs | Auditorías SOC2, clientes piden APIs públicas |
| Prisma ORM | Team crece >5 devs | Drizzle causa fricción, prefieren Prisma Studio |
| BullMQ + Redis | >10k mensajes/día | Inngest costs >$100/mes, necesitas más control |
| Railway/AWS | >$500/mes en Vercel | Bandwidth overages, funciones serverless limitadas |

**Plan de Escape:** Ver sección "Migration Paths" al final del documento

---

## 2. PLANIFICACIÓN FINANCIERA INTEGRADA

### 2.1 Budget MVP (4 meses)

#### Desarrollo
```
Opción A: Founder + AI Assistant (este sistema)
├─ Infraestructura: $500 (dominios, tools)
├─ Servicios SaaS: $800 (4 meses × $200/mes)
├─ Tiempo founder: $0 (sweat equity)
└─ TOTAL: $1,300

Opción B: Founder + 1 Developer + AI Assistant
├─ Developer: $24,000 (4 meses × $6k/mes)
├─ Designer (freelance): $4,000
├─ Infraestructura: $500
├─ Servicios SaaS: $800
└─ TOTAL: $29,300

Opción C: Small team (recomendada)
├─ 1 Full-stack dev: $24,000
├─ 0.5 Designer: $3,000
├─ AI tooling (Claude/GPT): $500
├─ Infraestructura: $500
├─ Servicios SaaS: $800
├─ Legal (ToS, Privacy): $2,000
├─ Marketing (pre-launch): $2,000
└─ TOTAL: $32,800
```

#### Costos Operacionales Mensuales (Post-Launch)

**Escenario 1: 0-100 usuarios activos**
```
Vercel: $20
Neon DB: $0 (free tier)
Clerk: $0 (free tier 10k MAU)
OpenAI: ~$20 (análisis)
WhatsApp: ~$50 (mensajes)
Stripe: $0 + 2.9% transacciones
Monitoring: $20 (Sentry)
─────────────
TOTAL: ~$110/mes
Margen: 95%+ (si 50 usuarios pagan $19)
```

**Escenario 2: 100-500 usuarios activos**
```
Vercel: $50
Neon DB: $20
Clerk: $25
OpenAI: ~$100
WhatsApp: ~$200
Stripe: 2.9% de ingresos
Monitoring: $30
Support: $0 (founder)
─────────────
TOTAL: ~$425/mes
Ingresos (250 pagan $19): $4,750
Margen: ~91%
```

**Escenario 3: 1000+ usuarios activos**
```
Railway (migrated): $200
PostgreSQL: incluido
Clerk: $99
OpenAI: ~$500
WhatsApp: ~$1,000
Stripe: 2.9%
Monitoring: $100
Support: $3,000 (1 persona)
─────────────
TOTAL: ~$4,899/mes
Ingresos (500 pagan $49): $24,500
Margen: ~80%
```

### 2.2 Pricing Strategy Validado

**Plans Finales:**

```yaml
Free:
  price: $0
  responses: 100/mes
  forms: 3
  features:
    - Basic analytics
    - WhatsApp integration
    - AI analysis (limited)
  purpose: Lead generation + validación

Starter:
  price: $19/mes ($199/año - 15% descuento)
  responses: 1,000/mes
  forms: ilimitados
  features:
    - Todo de Free +
    - Advanced analytics
    - Conditional logic
    - Export CSV
    - Email support
  target: Freelancers, small businesses

Pro:
  price: $49/mes ($490/año - 17% descuento)
  responses: 5,000/mes
  whatsapp_numbers: 2
  features:
    - Todo de Starter +
    - Automated actions (reviews, win-back)
    - Team collaboration (5 seats)
    - Slack integration
    - Priority support
    - Custom branding
  target: Growing companies, agencies

Enterprise:
  price: Custom (starts $299/mes)
  responses: Unlimited
  features:
    - Todo de Pro +
    - SSO (SAML)
    - Dedicated support
    - SLA 99.9%
    - White label
    - API access
    - Custom integrations
  target: Corporations, high-volume users
```

**Add-ons:**
- Extra 1,000 responses: $10
- Additional WhatsApp number: $20/mes
- Priority onboarding: $499 one-time

**Descuentos:**
- Anual: 15-17% off
- Non-profit: 30% off
- Referral: 1 mes gratis por referido que pague

### 2.3 Unit Economics

```
Customer Acquisition Cost (CAC) target: $50
  - Content marketing: $20
  - Paid ads: $80
  - Blended: $50

Lifetime Value (LTV) projection:
  Free → Starter conversion: 5% (industria: 2-7%)
  Starter → Pro upgrade: 20%
  Average customer lifetime: 24 meses
  Churn rate target: <5% mensual

  LTV (Starter): $19 × 24 meses × (1 - 5% churn) = ~$365
  LTV (Pro): $49 × 24 × 0.95 = ~$1,120
  Blended LTV: ~$500

  LTV:CAC ratio: 10:1 (excelente, target >3:1)
```

---

## 3. GO/NO-GO DECISION FRAMEWORK

### 3.1 Checkpoints Durante Desarrollo

#### Checkpoint 1: End of Sprint 2 (Semana 4)

**Criterios GO:**
- ✅ Form builder funcional (crear, editar, preview)
- ✅ Usuario puede agregar ≥5 tipos de preguntas
- ✅ Forms persisten en database correctamente
- ✅ 0 bugs bloqueantes
- ✅ Performance aceptable (<2s load time)

**Métricas:**
- Time to create simple form: <5 minutos
- Developer velocity: ≥20 story points/sprint

**RED FLAGS (considerar pivot):**
- FormEngine demasiado limitado/buggy
- Database performance issues con queries simples
- Team velocity <10 story points/sprint

**Decision:** GO / PAUSE 2 weeks / PIVOT approach

---

#### Checkpoint 2: End of Sprint 4 (Semana 8)

**Criterios GO:**
- ✅ WhatsApp integration funcional end-to-end
- ✅ Conversación completa fluye sin interrupciones
- ✅ AI analysis básico funciona (sentiment, NPS)
- ✅ 3-5 beta users testeando activamente
- ✅ >70% de beta users logran enviar primera encuesta

**Métricas técnicas:**
- WhatsApp message delivery rate: >98%
- AI analysis success rate: >90%
- Average conversation completion: >60%

**Métricas producto:**
- Beta user activation: >70%
- Time to first survey sent: <20 minutos
- NPS de beta users: >40

**RED FLAGS:**
- WhatsApp rate limits causando problemas mayores
- OpenAI costs >$0.01 por respuesta
- Beta users no entienden el producto
- <50% completion rate en conversaciones

**Decision:** GO / EXTEND BETA 4 weeks / MAJOR PIVOT

---

#### Checkpoint 3: End of Sprint 7 (Semana 14)

**Criterios GO para LAUNCH:**
- ✅ MVP completo (form builder + WhatsApp + AI + dashboard + billing)
- ✅ 10+ beta users activos
- ✅ 5+ beta users dispuestos a pagar (verbalmente comprometidos)
- ✅ 2+ beta users con tarjeta en sistema (aunque sea trial)
- ✅ 0 bugs críticos (P0)
- ✅ <5 bugs high priority (P1)
- ✅ Infrastructure estable (uptime >99% última semana)
- ✅ Customer support process definido

**Métricas de producto:**
- Beta user retention Day 7: >50%
- Beta user retention Day 30: >30%
- Average surveys per user: >2
- Average responses per survey: >20
- Free to Starter conversion intent: >5%

**Métricas técnicas:**
- API p95 response time: <500ms
- WhatsApp webhook processing: <2s
- AI analysis completion: <30s
- Database query p95: <100ms

**Métricas financieras:**
- Costo por respuesta: <$0.015
- Infrastructure costs: <$200/mes
- Runway post-launch: ≥6 meses

**RED FLAGS para NO-GO:**
- <5 beta users activos
- 0 usuarios dispuestos a pagar
- Churn rate >20% en beta
- Bugs críticos sin resolver
- Infrastructure costs >$500/mes en beta

**Decision:** LAUNCH / DELAY 2-4 weeks / BACK TO DRAWING BOARD

---

### 3.2 Post-Launch Checkpoints

#### Month 1 Post-Launch

**Success Criteria:**
- 50+ signups (free plan)
- 5+ paying customers (Starter/Pro)
- MRR: $100+ (validación mínima)
- Product Hunt launch executed
- 0 critical production incidents

**RED FLAGS:**
- <20 signups (problema de marketing)
- 0 paying customers (problema de product-market fit)
- Churn >15% (problema de onboarding/UX)

**Actions if RED:**
- Customer interviews intensivas (10+)
- Pivot pricing or features
- Extended onboarding/hand-holding

---

#### Month 3 Post-Launch

**Success Criteria:**
- 200+ signups
- 20+ paying customers
- MRR: $500+
- MoM growth: >20%
- Churn: <10%
- NPS: >30

**Milestone Decisions:**
- If HIT: Invest in paid marketing ($1k/mes)
- If MISS: Extend runway, optimize conversion
- If WAY OVER: Raise seed round or accelerate hiring

---

#### Month 6 Post-Launch (PMF Validation)

**Product-Market Fit Indicators:**
- 1,000+ signups
- 100+ paying customers
- MRR: $3,000+
- >40% of users "very disappointed" if product disappeared (PMF survey)
- NPS: >50
- Organic growth >30% of new users

**Strategic Fork:**

**Path A: PMF ACHIEVED**
- Scale marketing (5-10x budget)
- Hire: 1 developer, 1 customer success
- Build: Advanced features, integrations
- Timeline: Profitability in 12-18 meses

**Path B: PROMISING but not PMF**
- Continue bootstrapped
- Double down on best customer segment
- Refine positioning
- Timeline: Re-evaluate in 3 meses

**Path C: NOT WORKING**
- Pivot product or pivot market
- Or: Graceful shutdown, lessons learned
- Timeline: Decision in 4 weeks

---

## 4. ALCANCE DEL MVP CONSOLIDADO

### 4.1 Problema de Inconsistencia

**Blueprint original:** 8 fases de desarrollo
**Research 2025:** 9 sprints (18 semanas)
**Ambos incluyen:** Billing & campaign management

### 4.2 MVP Redefinido (DECISIÓN FINAL)

**Filosofía:** Minimum *Viable* Product - debe generar revenue

**IN SCOPE para MVP v1.0 (Lanzamiento público):**

✅ **Core Features (Must-Have):**
1. Form Builder
   - Crear/editar/eliminar formularios
   - 5 tipos de pregunta: texto, multiple choice, rating, NPS, yes/no
   - Conditional logic SIMPLE (if/then, 1 nivel)
   - Preview

2. WhatsApp Integration
   - Conectar Meta Cloud API
   - Enviar encuestas 1-a-1
   - Recibir respuestas conversacionales
   - Session management
   - Message templates (2-3 pre-aprobados)

3. AI Analysis
   - Sentiment analysis
   - NPS/CSAT calculation
   - Basic topic extraction
   - Individual response insights

4. Dashboard
   - Lista de respuestas
   - Métricas básicas (total, avg NPS, sentiment distribution)
   - 2-3 gráficos simples
   - Export CSV

5. **Billing (SIMPLIFICADO)**
   - Stripe Checkout
   - 3 plans: Free, Starter ($19), Pro ($49)
   - Usage tracking
   - Customer Portal (Stripe-hosted)
   - ⚠️ Sin metered billing complejo

6. **Contacts & Campaigns (SIMPLIFICADO)**
   - Import CSV de contactos
   - Enviar a lista de contactos
   - Track: sent, delivered, responded
   - ⚠️ Sin segmentación avanzada
   - ⚠️ Sin scheduling (manual send only)

**Justificación para incluir Billing & Campaigns:**
- Sin billing: no puedes cobrar = no es viable
- Sin campaigns: solo 1-a-1 testing = no escalable
- Pero versiones SIMPLES son suficientes para MVP

---

✋ **OUT OF SCOPE para MVP v1.0 (Post-Launch):**

❌ **Nice-to-Have (Fase 2):**
- Conditional logic avanzada (nested, multi-branch)
- Interactive messages (buttons, quick replies)
- Scheduled campaigns
- Contact segmentation avanzada
- A/B testing
- Custom branding (logos, colores)
- Multi-idioma
- Team collaboration (comments, assignments)

❌ **Enterprise Features (Fase 3):**
- SSO (SAML, SCIM)
- API pública
- Webhooks custom
- White label
- Multiple WhatsApp numbers
- Advanced analytics/BI
- Zapier integration

❌ **AI Advanced (Fase 3):**
- Predictive churn
- AI-suggested questions
- Automated survey optimization
- Win-back campaigns automáticas

---

### 4.3 Roadmap Consolidado y Realista

#### **FASE -1: Marketing Website (2 semanas) - PRE-MVP**
**Sprint -1 (Parallel track o antes del MVP):**
- Landing page con hero, features, pricing, testimonials
- Design system implementado (Tailwind + Shadcn/ui)
- SEO optimization (meta tags, sitemap, OG images)
- Responsive mobile-first
- Deploy a chatform.mx

**Outcome:** Website público ANTES de lanzar app
**Justificación:** Necesitamos website para Product Hunt launch y marketing

**Alternativa:** Desarrollar en paralelo durante Sprint 8 (Billing)

---

#### **FASE 0: Foundation (2 semanas)**
- Setup técnico completo
- Clerk auth working
- Database + migrations
- Deploy pipeline

**Outcome:** Developer puede hacer `npm run dev` y ver dashboard vacío

---

#### **FASE 1: Form Builder (3 semanas)**
**Sprint 1-2:**
- UI de form builder
- CRUD de formularios
- 5 question types
- Basic preview
- Guardar/cargar JSON schema

**Outcome:** Usuario puede crear formulario y guardarlo

---

#### **FASE 2: WhatsApp Core (3 semanas)**
**Sprint 3-4:**
- Meta Cloud API integration
- Send message function
- Webhook handler
- Session management
- Conversational flow (secuencial)

**Outcome:** Encuesta completa fluye en WhatsApp

**🚦 CHECKPOINT 1:** Evaluar si continuar (ver sección 3.1)

---

#### **FASE 3: AI Analysis (2 semanas)**
**Sprint 5:**
- OpenAI integration
- Sentiment + NPS + topics
- Save insights to DB
- Background job con Inngest

**Outcome:** Respuestas analizadas automáticamente

---

#### **FASE 4: Dashboard (2 semanas)**
**Sprint 6:**
- Response list
- Metrics cards
- 2 gráficos (NPS distribution, sentiment pie)
- Individual response view
- Export CSV

**Outcome:** Usuario ve analytics de sus encuestas

**🚦 CHECKPOINT 2:** Evaluar PMF signals con beta users

---

#### **FASE 5: Contacts & Campaigns SIMPLE (2 semanas)**
**Sprint 7:**
- Import CSV
- Contact list
- Create campaign (select form + contacts)
- Send campaign (sin scheduling)
- Campaign stats page

**Outcome:** Usuario puede enviar a 100+ contactos

---

#### **FASE 6: Billing SIMPLE (1.5 semanas)**
**Sprint 8:**
- Stripe products setup
- Checkout integration
- Webhook: subscription.created
- Usage limits enforcement
- Link to Customer Portal

**Outcome:** Usuario puede pagar y upgradear

---

#### **FASE 7: Polish & Testing (1.5 semanas)**
**Sprint 9:**
- E2E tests críticos
- Bug fixes
- Loading states
- Error handling
- Mobile responsive
- Onboarding checklist

**Outcome:** 0 bugs críticos, ready to launch

**🚦 CHECKPOINT 3:** GO/NO-GO para launch público

---

### **TIMELINE FINAL (Actualizado con Website):**

```
Semana -2 a 0: Marketing Website (parallel o pre-MVP)
Semana 1-2:   Foundation
Semana 3-5:   Form Builder
Semana 6-8:   WhatsApp Core         ← Checkpoint 1 (Semana 8)
Semana 9-10:  AI Analysis
Semana 11-12: Dashboard              ← Checkpoint 2 (Semana 12)
Semana 13-14: Contacts & Campaigns
Semana 15:    Billing
Semana 16-17: Polish & Testing       ← Checkpoint 3 (Semana 17)
Semana 18:    Soft Launch (beta graduation)
Semana 19-20: Marketing prep + Product Hunt
Semana 21:    PUBLIC LAUNCH 🚀
```

**Opciones de Timeline:**

**Opción A: Website Pre-MVP (Recomendada)**
- Semanas -2 a 0: Desarrollar website (2 semanas antes de Sprint 0)
- Total: 19 semanas desde inicio website hasta launch
- Ventaja: Website listo para marketing desde día 1 de beta

**Opción B: Website Paralelo**
- Durante Sprint 8 (Billing): Designer/dev adicional hace website
- Total: 17 semanas app + 2 semanas website (paralelas)
- Ventaja: No añade tiempo total

**Opción C: Website Post-MVP**
- Desarrollar después de Sprint 9
- Total: 19 semanas
- Desventaja: No tienes website para beta/launch

**Recomendación:** Opción A o B según recursos disponibles

**Total MVP con website:** 19 semanas = ~4.75 meses
**Soft launch:** 4.75 meses
**Public launch:** 5.25 meses

**Buffer:** 3 semanas para imprevistos = **5.5-6 meses total realista**

---

## 5. RESTRICCIONES WHATSAPP (del Research → Blueprint)

### 5.1 Limitaciones Críticas que Afectan Diseño

**1. Ventana de 24 Horas**

**Impacto en producto:**
- Encuestas deben completarse en <24hrs idealmente
- Si usuario abandona, necesitas template aprobado
- No puedes "reanudar conversación" libremente después de 24hrs

**Mitigación en diseño:**
- Formularios cortos (5-10 preguntas max recomendado)
- Reminder template pre-aprobado: "¡Hola {name}! Veo que comenzaste nuestra encuesta. ¿Te gustaría completarla? Solo te tomará 2 minutos 😊"
- Analytics: track abandonment rate y en qué pregunta

**Implementación:**
```typescript
// Background job verifica sesiones abandonadas
async function checkAbandonedSessions() {
  const abandoned = await db.sessions.findMany({
    where: {
      status: 'in_progress',
      lastMessageAt: { lt: Date.now() - 23 * 60 * 60 * 1000 } // 23 hrs
    }
  })

  for (const session of abandoned) {
    // Agendar reminder template
    await scheduleTemplate(session.contact, 'reminder_template')
  }
}
```

---

**2. Message Templates Pre-Aprobación**

**Impacto en onboarding:**
- Usuario NO puede enviar encuesta inmediatamente después de setup
- Debe crear template → submit a Meta → esperar 1-48hrs → aprobado

**Mitigación en UX:**
```
Onboarding flow:
1. Usuario conecta WhatsApp ✅
2. Usuario crea formulario ✅
3. Sistema genera template automáticamente 📝
   "Hola {{1}}, somos {{2}}. Nos gustaría conocer tu opinión..."
4. Usuario revisa template 👀
5. Sistema submite a Meta 📤
6. Pantalla: "Tu template está en revisión (24-48hrs). Te notificaremos cuando esté listo."
7. Email cuando aprobado ✉️
8. Ahora sí puede enviar campaña 🚀
```

**Templates pre-hechos (incluir en MVP):**
```
1. "survey_invitation" (Utility)
   Hola {{1}}, somos {{2}}. Nos gustaría conocer tu opinión sobre {{3}}.
   Responde a este mensaje para comenzar (solo 2 minutos).

2. "reminder_incomplete" (Utility)
   Hola {{1}}, veo que comenzaste nuestra encuesta.
   ¿Te gustaría completarla? Es muy rápido.

3. "thank_you_nps" (Utility)
   ¡Gracias {{1}} por tu feedback! Tu opinión nos ayuda a mejorar.
```

---

**3. Rate Limits Por Tier**

**Implicación en product positioning:**

| Tier | Límite | Tiempo para subir |
|------|--------|-------------------|
| Unverified | 50 usuarios/24hrs | Verificar business |
| Tier 1 | 1,000 usuarios/24hrs | 7 días buen quality rating |
| Tier 2 | 10,000 usuarios/24hrs | 7+ días más |
| Tier 3 | 100,000 usuarios/24hrs | Consistency |

**Estrategia en pricing:**
- Free plan: 100 responses/mes (OK para Tier 1)
- Starter: 1,000 responses (requiere Tier 1 mínimo)
- Pro: 5,000 responses (requiere Tier 2)
- Enterprise: Unlimited (requiere Tier 3+)

**Onboarding advisory:**
```typescript
// Warn usuario sobre tier limits
if (campaign.contactCount > currentWhatsAppTier.limit) {
  showWarning({
    title: "Campaign exceeds WhatsApp tier limit",
    message: `Your WhatsApp number is Tier ${tier.level} (${tier.limit} contacts/day).
              This campaign has ${campaign.contactCount} contacts.

              Options:
              1. Split into multiple days
              2. Improve quality rating to unlock higher tier
              3. Use multiple WhatsApp numbers (Pro plan)`,
    actions: ['Split Campaign', 'Learn More', 'Upgrade Plan']
  })
}
```

---

**4. Prohibición de Chatbots Generales (Nuevo 2025)**

**Buenas noticias:** ChatForm NO es afectado

**Por qué estamos OK:**
- Usamos IA para análisis (backend), no para conversar con usuarios
- Conversaciones son estructuradas (formularios predefinidos)
- No es "general-purpose" chatbot (no responde preguntas abiertas)

**Documentar en ToS:**
```
ChatForm no es un chatbot conversacional general.
Enviamos encuestas estructuradas predefinidas por ti.
La IA analiza las respuestas, no interactúa directamente con tus contactos.
```

---

### 5.2 Principios UX para Conversaciones (del Research)

**1. Cognitive Load Mínimo**
```
❌ MAL:
"Pregunta 1 de 10: En una escala del 1 al 10, donde 1 es muy insatisfecho y 10 es muy satisfecho, ¿cómo calificarías tu experiencia general considerando todos los aspectos del servicio?"

✅ BIEN:
"¿Qué tan satisfecho estás con nuestro servicio? (1-10)"
```

**Implementación:**
- Form builder muestra "character budget" por pregunta
- Warning si pregunta >100 caracteres
- Tips: "Las preguntas cortas tienen 2x más completion rate"

---

**2. Una Pregunta a la Vez**
```
✅ Conversación natural:
Bot: "¿Recomendarías nuestro servicio a un amigo?"
User: "Sí"
Bot: "¡Genial! ¿Por qué sí?"
User: "Excelente atención al cliente"
Bot: "Gracias 😊 Última pregunta..."

❌ Formulario tradicional:
Pregunta 1: ¿Recomendarías? [  ]
Pregunta 2: ¿Por qué? [  ]
Pregunta 3: ¿Algo más? [  ]
[Enviar]
```

**Ya está en diseño:** Conversational flow engine

---

**3. Progress Indicators**
```typescript
// Mostrar progreso en conversación
const progressMessage = (current: number, total: number) => {
  const emoji = "▓".repeat(current) + "░".repeat(total - current)
  return `\n\n${emoji} ${current}/${total}`
}

// Ejemplo:
"¿Cómo fue tu experiencia de compra?\n\n▓▓▓░░ 3/5"
```

---

**4. Validación Amigable**
```typescript
// En lugar de "Error: input inválido"
function friendlyValidation(question: Question, input: string) {
  if (question.type === 'rating' && !isNumber(input)) {
    return `Necesito un número del ${question.min} al ${question.max} 😊`
  }

  if (question.type === 'multiple_choice' && !isValidOption(input)) {
    return `Por favor elige una de estas opciones:\n${formatOptions(question.options)}`
  }

  // Con IA para ser más flexible
  const aiInterpretation = await interpretWithAI(input, question)
  if (aiInterpretation.valid) {
    return aiInterpretation.mappedValue
  }

  return question.validationMessage || "No entendí bien, ¿puedes intentar de nuevo?"
}
```

---

**5. Escape Hatch**
```
Usuario en cualquier momento puede escribir:
- "saltar" → skip pregunta
- "cancelar" → termina encuesta
- "después" → guarda progreso, resume más tarde
```

**Implementación:**
```typescript
// Keywords especiales
const SYSTEM_COMMANDS = {
  skip: ['saltar', 'skip', 'siguiente', 'next'],
  cancel: ['cancelar', 'cancel', 'stop', 'terminar'],
  pause: ['después', 'later', 'pause', 'luego']
}

async function handleMessage(message: string, session: Session) {
  // Check system commands primero
  if (matchesCommand(message, SYSTEM_COMMANDS.cancel)) {
    await sendMessage(session.contact,
      "Entendido, cancelo la encuesta. ¡Gracias de todos modos! 👋"
    )
    await updateSession(session.id, { status: 'cancelled' })
    return
  }

  // ... resto del flow
}
```

---

## 6. MIGRATION PATHS (Plan de Escape)

### 6.1 Si Necesitas Migrar a NestJS

**Triggers:**
- Cliente enterprise requiere SOC2 compliance
- Necesitas APIs públicas robustas (>50 integraciones)
- Team >5 developers, necesitan estructura

**Migration Strategy:**

```
Fase 1: API Gateway Pattern
├─ Next.js frontend sigue igual
├─ Creas NestJS backend en paralelo
├─ Next.js hace proxy a NestJS para nuevas features
└─ Mantienes tRPC para features legacy

Fase 2: Gradual Migration
├─ Mueves endpoints uno por uno
├─ Shared database (Drizzle → Prisma gradual)
└─ Feature flag para rollout

Fase 3: Complete Separation
├─ Next.js = Frontend puro
├─ NestJS = Backend completo
└─ GraphQL o REST entre ellos
```

**Costo estimado:** 2-3 meses developer time
**Beneficio:** Backend reutilizable, APIs públicas, mejor observability

---

### 6.2 Si Drizzle No Funciona → Prisma

**Triggers:**
- Team prefiere Prisma Studio
- Necesitas features que Drizzle no tiene
- Documentación de Drizzle causa fricción

**Migration:**
```bash
# 1. Install Prisma
npm install prisma @prisma/client

# 2. Introspect existing DB
npx prisma db pull

# 3. Genera Prisma schema automáticamente desde DB
# (Drizzle ya creó las tablas)

# 4. Reemplaza imports
# ❌ import { db } from '@/db/drizzle'
# ✅ import { prisma } from '@/db/prisma'

# 5. Actualiza queries (mayormente 1-to-1)
# Drizzle: await db.select().from(users).where(eq(users.id, id))
# Prisma:  await prisma.user.findUnique({ where: { id } })
```

**Costo:** 1-2 semanas
**Downtime:** 0 (schemas son compatibles)

---

## 7. SUCCESS METRICS TRACKING

### 7.1 Key Metrics Dashboard (Internal)

**Development Velocity:**
```
- Story points per sprint (target: 20-25)
- Bugs introduced per sprint (target: <10)
- Test coverage (target: >70% critical paths)
- Deploy frequency (target: diario en MVP phase)
```

**Product Metrics:**
```
- Signups/week
- Free→Paid conversion rate
- MRR & MRR growth
- Churn rate
- NPS (de usuarios de ChatForm)
- Feature adoption rates
```

**Technical Metrics:**
```
- API latency p95
- WhatsApp delivery rate
- AI analysis success rate
- Uptime %
- Error rate
- Cost per response
```

### 7.2 Monthly Review Template

```markdown
## ChatForm Monthly Review - [Month]

### Product
- New signups: [X] (target: [Y])
- Paying customers: [X] (target: [Y])
- MRR: $[X] (target: $[Y])
- Churn: [X]% (target: <5%)
- Top feature requests: [list]

### Technical
- Uptime: [X]% (target: >99%)
- Incidents: [X] (P0: [X], P1: [X])
- Infrastructure cost: $[X]
- WhatsApp API success rate: [X]%
- AI analysis average time: [X]s

### Go/No-Go Assessment
☑️ Green: On track
⚠️ Yellow: Needs attention
🚨 Red: Critical issue

[Narrative and decisions]

### Next Month Priorities
1. [Priority 1]
2. [Priority 2]
3. [Priority 3]
```

---

## 8. RECURSOS Y REFERENCIAS

### 8.1 Documentos Relacionados

- [ChatForm_Concepto_General.md](ChatForm_Concepto_General.md) - Visión de negocio
- [ChatForm_Developer_Blueprint.md](ChatForm_Developer_Blueprint.md) - Arquitectura técnica detallada
- [ChatForm_Technical_Research_2025.md](ChatForm_Technical_Research_2025.md) - Research profundo de tecnologías

### 8.2 External Resources

**WhatsApp:**
- Meta Cloud API Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
- Business Policy: https://business.whatsapp.com/policy
- Rate Limits: https://developers.facebook.com/docs/whatsapp/messaging-limits

**Tech Stack:**
- Next.js 15: https://nextjs.org/docs
- tRPC: https://trpc.io/docs
- Drizzle: https://orm.drizzle.team/docs
- Clerk: https://clerk.com/docs
- Stripe: https://stripe.com/docs/billing

**Benchmarks:**
- SaaS Metrics: https://www.saastr.com
- Pricing: https://www.priceintelligently.com
- PMF: https://pmfsurvey.com

---

## 9. CHANGELOG

| Fecha | Cambio | Razón |
|-------|--------|-------|
| 2025-10-29 | Documento inicial | Consolidar Blueprint + Research |
| TBD | [Future changes] | [Razones] |

---

**Este documento es SSOT (Single Source of Truth) para decisiones arquitectónicas y estratégicas de ChatForm.**

Actualizar después de cada checkpoint o decisión mayor.
