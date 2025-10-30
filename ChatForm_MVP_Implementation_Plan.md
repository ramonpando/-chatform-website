# ChatForm MVP - Plan de Implementación
## Del concepto al código - Roadmap técnico

**Fecha:** 30 Oct 2025
**Objetivo:** MVP funcional en 3-4 semanas
**Scope:** Core features para validar modelo de negocio

---

## 🎯 Definición de MVP

### Lo que SÍ incluye el MVP:

✅ **Auth & Tenants**
- Signup/Login (email + password)
- Multi-tenant (cada cliente = tenant aislado)
- Planes: Free, Starter, Pro (sin Enterprise todavía)

✅ **Survey Builder**
- Crear encuesta con nombre y descripción
- 3 tipos de preguntas:
  - Multiple choice (opciones)
  - Rating (1-5 estrellas)
  - Open text (texto libre)
- Preview de encuesta

✅ **Link Distribution (Método 1)**
- Generar link corto: chatform.app/s/abc123
- Generar QR code (PNG)
- wa.me redirect automático
- Copy to clipboard

✅ **WhatsApp Conversation**
- User-initiated (links)
- State machine conversacional
- Guardar respuestas en DB
- Branding según plan

✅ **Dashboard Básico**
- Ver encuestas creadas
- Ver respuestas en tiempo real
- Filtros básicos (fecha, completadas/incompletas)
- Stats: total respuestas, completion rate

✅ **Export CSV**
- Descargar respuestas como CSV
- Solo planes Starter+

### Lo que NO incluye MVP (Fase 2):

❌ Envío automático (CSV upload)
❌ Webhooks
❌ AI insights
❌ Logic jumps
❌ Multi-user teams
❌ Analytics avanzado
❌ Integraciones (Zapier, etc.)
❌ Templates custom
❌ BYOA

**Razón:** Validar primero el core flow antes de agregar automatización.

---

## 🛠️ Tech Stack

### Frontend

**Framework:** Next.js 15 (App Router)
- Por qué: Server components, file-based routing, optimización built-in
- TypeScript strict mode
- Tailwind CSS (misma config que landing)

**UI Library:** shadcn/ui + Radix UI
- Por qué: Componentes accesibles, customizables, copy-paste
- Ya usamos en landing (consistencia)

**State Management:**
- Server state: React Query / TanStack Query
- Client state: Zustand (solo si necesario)
- Form state: React Hook Form + Zod validation

**Charts:** Recharts
- Por qué: React-friendly, responsive, suficiente para MVP

### Backend

**Framework:** Next.js API Routes + tRPC
- Por qué: Type-safe API, mismo repo, menos complejidad
- tRPC da type safety end-to-end

**Database:** PostgreSQL (Supabase)
- Por qué: Relacional (encuestas tienen estructura), hosted, free tier generoso
- Supabase incluye: Auth, DB, Storage, Realtime

**ORM:** Drizzle ORM
- Por qué: Type-safe, mejor DX que Prisma, migrations simples
- Alternativa: Prisma (más maduro pero más pesado)

**Auth:** NextAuth.js v5 (Auth.js)
- Por qué: Flexible, soporta multi-tenant, muchos providers
- Email/password + Google OAuth

### WhatsApp Integration

**Provider:** Meta WhatsApp Business API (directo)
- Aplicar a WhatsApp Business Platform
- Webhook endpoint: /api/webhooks/whatsapp
- Envío via Cloud API

**Alternative (si Meta tarda):** Twilio WhatsApp API
- Más rápido setup (24hrs)
- Más caro ($0.005/msg vs gratis user-initiated)
- Solo para desarrollo inicial

### Infrastructure

**Hosting:** Vercel
- Por qué: Next.js native, deploy en 30 segs, free tier OK para MVP
- Edge functions para API routes

**Database:** Supabase (PostgreSQL)
- Free tier: 500MB DB, 1GB storage
- Suficiente para 100-500 usuarios MVP

**File Storage:** Cloudflare R2
- Por qué: S3-compatible, más barato, generoso free tier
- Para: QR codes, CSV exports

**Caching:** Vercel KV (Redis)
- Rate limiting
- Session storage
- Cache de queries pesadas

**Background Jobs:** Inngest
- Por qué: Serverless, type-safe, free tier OK
- Para: CSV generation, email sending, cleanup

### Payments

**Provider:** Stripe
- Checkout Sessions (hosted)
- Customer Portal (self-service)
- Webhooks para activar/desactivar features

### Monitoring

**Error Tracking:** Sentry
- Free tier: 5K errors/mes
- Source maps support

**Analytics:** Plausible (self-hosted) o PostHog
- Privacy-friendly
- Free tier OK

---

## 📊 Database Schema (MVP)

### Core Tables

```sql
-- Tenants (clientes de ChatForm)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- para subdomain futuro

  -- Billing
  plan VARCHAR(50) NOT NULL DEFAULT 'free', -- free, starter, pro
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(50), -- active, canceled, past_due

  -- Limits
  responses_limit INTEGER NOT NULL DEFAULT 50, -- según plan
  responses_used_this_month INTEGER NOT NULL DEFAULT 0,
  surveys_limit INTEGER NOT NULL DEFAULT 1,

  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Users (pueden pertenecer a múltiples tenants en futuro)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- nullable si usa OAuth
  name VARCHAR(255),

  -- OAuth
  google_id VARCHAR(255),

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User-Tenant relationship
CREATE TABLE tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'owner', -- owner, admin, member

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  UNIQUE(tenant_id, user_id)
);

-- Surveys
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Content
  title VARCHAR(255) NOT NULL,
  description TEXT,
  welcome_message TEXT,
  thank_you_message TEXT,

  -- Settings
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, paused, archived
  short_code VARCHAR(20) UNIQUE NOT NULL, -- para links

  -- Metadata
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  -- Content
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL, -- multiple_choice, rating, open_text
  options JSONB, -- array de opciones para multiple_choice

  -- Order
  order_index INTEGER NOT NULL,

  -- Settings
  required BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Survey Sessions (una conversación)
CREATE TABLE survey_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- User info
  phone_number VARCHAR(20) NOT NULL,
  whatsapp_name VARCHAR(255), -- nombre de WhatsApp del usuario

  -- Progress
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, completed, abandoned
  current_question_index INTEGER NOT NULL DEFAULT 0,

  -- Delivery
  delivery_method VARCHAR(50) NOT NULL DEFAULT 'link', -- link, automatic, webhook

  -- Timestamps
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  last_interaction_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Responses
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES survey_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,

  -- Answer
  answer_text TEXT, -- para open_text
  answer_option VARCHAR(255), -- para multiple_choice
  answer_rating INTEGER, -- para rating (1-5)

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Short Links (para tracking)
CREATE TABLE short_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  short_code VARCHAR(20) UNIQUE NOT NULL,
  destination_url TEXT NOT NULL,

  -- Stats
  clicks INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_surveys_tenant ON surveys(tenant_id);
CREATE INDEX idx_surveys_short_code ON surveys(short_code);
CREATE INDEX idx_questions_survey ON questions(survey_id);
CREATE INDEX idx_sessions_survey ON survey_sessions(survey_id);
CREATE INDEX idx_sessions_phone ON survey_sessions(phone_number);
CREATE INDEX idx_responses_session ON responses(session_id);
CREATE INDEX idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user ON tenant_users(user_id);
```

---

## 🚀 Implementación por Semanas

### Semana 1: Fundación

**Día 1-2: Setup inicial**
```bash
# Crear proyecto
npx create-next-app@latest chatform-app --typescript --tailwind --app
cd chatform-app

# Instalar dependencias core
npm install @tanstack/react-query
npm install drizzle-orm postgres
npm install next-auth@beta
npm install zod react-hook-form @hookform/resolvers
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install lucide-react

# Dev dependencies
npm install -D drizzle-kit
npm install -D @types/node
```

**Configuración:**
- Supabase project setup
- Drizzle config + migrations
- NextAuth config
- Env variables

**Día 3-4: Auth system**
- Login/Signup pages
- NextAuth providers (email/password + Google)
- Protected routes middleware
- Tenant creation on signup

**Día 5-7: Dashboard shell**
- Layout con sidebar
- Navigation
- Empty states
- Loading states

**Deliverable:** Usuario puede signup, login, ver dashboard vacío

---

### Semana 2: Survey Builder

**Día 1-2: Survey CRUD**
- Crear encuesta (nombre, descripción)
- Listar encuestas
- Editar/Borrar encuesta
- Estados: draft, active

**Día 3-5: Question Builder**
- Agregar pregunta (3 tipos)
- Reordenar preguntas (drag & drop)
- Editar/Borrar pregunta
- Validación de opciones

**Día 6-7: Preview & Publish**
- Preview mode (simula WhatsApp)
- Botón "Publicar"
- Generar short_code único
- Status change: draft → active

**Deliverable:** Usuario puede crear encuesta completa con 5 preguntas

---

### Semana 3: WhatsApp Integration

**Día 1-2: Meta WhatsApp API setup**
- Aplicar a WhatsApp Business API
- Configurar webhook endpoint
- Verificación de webhook
- Test envío de mensajes

**Día 3-4: Conversational Flow**
- State machine implementation
- Recibir mensaje user-initiated
- Enviar primera pregunta
- Procesar respuesta → siguiente pregunta
- Loop hasta completar

**Día 5-6: Response Storage**
- Guardar respuestas en DB
- Asociar con session
- Marcar session como completed
- Branding según plan

**Día 7: Link Generation**
- Generar wa.me link
- Short link service
- QR code generation
- Copy to clipboard UI

**Deliverable:** Flow completo: Usuario crea encuesta → genera link → persona responde por WhatsApp → respuestas guardadas

---

### Semana 4: Dashboard & Polish

**Día 1-3: Responses Dashboard**
- Listar respuestas por encuesta
- Filtros (fecha, completadas)
- Stats cards (total, completion rate)
- Individual response view
- Recharts para visualización

**Día 4-5: CSV Export**
- Generar CSV desde respuestas
- Inngest background job
- Download link
- Solo para Starter+

**Día 6-7: Polish & Testing**
- Error handling
- Loading states
- Toast notifications
- Mobile responsive
- E2E test del happy path

**Deliverable:** MVP funcional end-to-end

---

## 🗂️ Estructura de Carpetas

```
chatform-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Overview
│   │   ├── surveys/
│   │   │   ├── page.tsx          # List
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # Create
│   │   │   └── [id]/
│   │   │       ├── edit/
│   │   │       │   └── page.tsx  # Edit
│   │   │       ├── responses/
│   │   │       │   └── page.tsx  # View responses
│   │   │       └── share/
│   │   │           └── page.tsx  # Get links/QR
│   │   ├── settings/
│   │   │   ├── account/
│   │   │   │   └── page.tsx
│   │   │   └── billing/
│   │   │       └── page.tsx
│   │   └── layout.tsx            # Dashboard layout
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── trpc/
│   │   │   └── [trpc]/
│   │   │       └── route.ts
│   │   ├── webhooks/
│   │   │   ├── whatsapp/
│   │   │   │   └── route.ts      # WhatsApp webhook
│   │   │   └── stripe/
│   │   │       └── route.ts      # Stripe webhook
│   │   └── surveys/
│   │       └── [shortCode]/
│   │           └── route.ts      # Redirect handler
│   ├── s/
│   │   └── [shortCode]/
│   │       └── page.tsx          # Short link redirect
│   ├── layout.tsx
│   └── page.tsx                  # Landing (redirect to /dashboard or /login)
├── components/
│   ├── ui/                       # shadcn components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── survey/
│   │   ├── question-builder.tsx
│   │   ├── survey-preview.tsx
│   │   └── question-types/
│   │       ├── multiple-choice.tsx
│   │       ├── rating.tsx
│   │       └── open-text.tsx
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── stats-card.tsx
│   │   └── response-list.tsx
│   └── shared/
│       ├── copy-button.tsx
│       ├── qr-code.tsx
│       └── empty-state.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema
│   │   ├── migrations/
│   │   └── index.ts
│   ├── auth/
│   │   └── config.ts             # NextAuth config
│   ├── whatsapp/
│   │   ├── client.ts             # WhatsApp API wrapper
│   │   ├── state-machine.ts      # Conversation logic
│   │   └── templates.ts
│   ├── utils/
│   │   ├── short-code.ts         # Generate unique codes
│   │   ├── qr.ts                 # QR generation
│   │   └── csv.ts                # CSV export
│   └── trpc/
│       ├── root.ts
│       ├── context.ts
│       └── routers/
│           ├── survey.ts
│           ├── response.ts
│           └── tenant.ts
├── types/
│   ├── survey.ts
│   ├── response.ts
│   └── tenant.ts
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🔐 Seguridad & Permisos

### Row Level Security (RLS)

Aunque usamos Supabase, el acceso va vía backend (tRPC), no directo desde cliente.

**Verificaciones en cada query:**

```typescript
// En cada tRPC procedure
export const getSurveys = protectedProcedure
  .query(async ({ ctx }) => {
    const tenantId = ctx.session.user.tenantId;

    // Solo retorna surveys del tenant del usuario
    return await db.query.surveys.findMany({
      where: eq(surveys.tenantId, tenantId)
    });
  });
```

### Rate Limiting

**API Routes:**
- Webhook WhatsApp: Sin limit (es Meta)
- tRPC: 100 req/min por usuario
- Public short links: 1000 req/min global

**Usar:** Vercel KV (Redis) para rate limit storage

---

## 💳 Stripe Integration

### Setup

```typescript
// lib/stripe/config.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export const PLANS = {
  free: {
    price: 0,
    priceId: null,
    limits: {
      responses: 50,
      surveys: 1,
    }
  },
  starter: {
    price: 29,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    limits: {
      responses: 500,
      surveys: 3,
    }
  },
  pro: {
    price: 59,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    limits: {
      responses: 2000,
      surveys: 999999, // "ilimitado"
    }
  }
};
```

### Checkout Flow

```typescript
// app/api/stripe/create-checkout-session/route.ts
export async function POST(req: Request) {
  const { planId } = await req.json();
  const session = await getServerSession();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: PLANS[planId].priceId,
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing`,
    metadata: {
      tenantId: session.user.tenantId,
      plan: planId,
    }
  });

  return Response.json({ url: checkoutSession.url });
}
```

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await activateSubscription(session);
      break;

    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
```

---

## 🎨 UI/UX Priorities

### Design System (reusar del landing)

- Colores: Primary blue, Secondary green
- Typography: Inter Variable
- Tailwind config idéntico
- shadcn/ui components

### Key Screens

**Priority 1 (MVP):**
1. Survey builder (drag & drop questions)
2. Responses dashboard (table + stats)
3. Share survey (links + QR)
4. Login/Signup

**Priority 2 (Post-MVP):**
5. Settings (account, billing)
6. Analytics dashboard
7. Templates gallery

### Mobile Responsive

- Dashboard: Sidebar → Hamburger menu en mobile
- Survey builder: Single column en mobile
- Responses: Cards en mobile, table en desktop

---

## 📝 Testing Strategy

### MVP Testing (manual)

**Happy Path E2E:**
1. Signup → Create tenant
2. Create survey → Add 3 questions
3. Publish survey → Get link
4. Open link → Responde por WhatsApp
5. Ver respuesta en dashboard
6. Export CSV

**Edge Cases:**
- Survey con 0 preguntas (validation)
- Response abandonment (timeout)
- Plan limits (bloquear al llegar a límite)
- Duplicate short codes (retry generation)

### Post-MVP (automated)

- Playwright E2E tests
- Vitest unit tests para utils
- tRPC integration tests

---

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Env variables (en Vercel dashboard)
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
WHATSAPP_API_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

### Supabase

- Ya está hosted
- Connection string → DATABASE_URL
- Migrations via Drizzle

### WhatsApp Webhook

- URL: https://chatform.app/api/webhooks/whatsapp
- Verificar en Meta Dashboard

---

## 📦 MVP Deliverables Checklist

### Funcional
- [ ] Usuario puede signup/login
- [ ] Usuario puede crear encuesta con 5 preguntas
- [ ] Usuario puede generar link y QR
- [ ] Usuario final puede responder por WhatsApp
- [ ] Respuestas se guardan en DB
- [ ] Usuario ve respuestas en dashboard
- [ ] Usuario puede exportar CSV (Starter+)
- [ ] Branding según plan

### Técnico
- [ ] DB schema deployed
- [ ] Auth funcionando (email + Google)
- [ ] WhatsApp webhook funcionando
- [ ] Stripe checkout funcionando
- [ ] Rate limiting implementado
- [ ] Error tracking (Sentry)
- [ ] Deploy en Vercel

### UX/UI
- [ ] Responsive (desktop + mobile)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Toast notifications
- [ ] Onboarding flow

---

## 🤔 Decisiones Pendientes

### 1. ORM: Drizzle vs Prisma
**Drizzle:**
- ✅ Type-safe SQL-like
- ✅ Más ligero
- ✅ Mejor DX
- ❌ Menos maduro

**Prisma:**
- ✅ Muy maduro
- ✅ Great docs
- ❌ Más pesado
- ❌ Schema language propietario

**Recomendación:** Drizzle para MVP

### 2. tRPC vs REST
**tRPC:**
- ✅ Type safety end-to-end
- ✅ No need para OpenAPI
- ✅ Faster dev
- ❌ Lock-in a TypeScript

**REST:**
- ✅ Standard
- ✅ Más fácil documentar
- ❌ No type safety
- ❌ Más boilerplate

**Recomendación:** tRPC para MVP (podemos agregar REST API después para webhooks externos)

### 3. Real-time: Polling vs WebSockets
**Polling (React Query):**
- ✅ Más simple
- ✅ Funciona con serverless
- ❌ Más requests

**WebSockets (Supabase Realtime):**
- ✅ True real-time
- ❌ Más complejo
- ❌ Requiere persistent connection

**Recomendación:** Polling cada 5 segs para MVP, real-time en v2

---

## 🎯 Success Metrics (MVP)

### Technical
- [ ] 100% uptime first week
- [ ] <2s page load time
- [ ] <500ms API response (p95)
- [ ] 0 critical bugs in production

### Product
- [ ] 10 beta users completan onboarding
- [ ] 5 encuestas publicadas
- [ ] 50 respuestas recolectadas
- [ ] 1 usuario paga (Starter)

### Next Steps if successful
- Agregar CSV upload (envíos automáticos)
- Agregar webhooks (Pro feature)
- Agregar AI insights
- Mejorar analytics dashboard

---

## 🚀 Ready to Start?

**Orden de trabajo recomendado:**

1. ✅ Setup proyecto Next.js + Supabase
2. ✅ DB schema + migrations
3. ✅ Auth (NextAuth)
4. ✅ Dashboard shell
5. ✅ Survey CRUD
6. ✅ Question builder
7. ✅ WhatsApp integration
8. ✅ Responses dashboard
9. ✅ CSV export
10. ✅ Stripe billing

**¿Por dónde empezamos?**
