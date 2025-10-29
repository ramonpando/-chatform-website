# ChatForm - Product Requirements Document (PRD)

**Version:** 1.0 MVP
**Fecha:** Octubre 2025
**Owner:** Founder
**Status:** Draft → Approved → In Development

---

## 1. PRODUCT OVERVIEW

### 1.1 Product Vision

ChatForm permite a empresas LATAM crear encuestas conversacionales por WhatsApp con análisis automático de IA, logrando tasas de respuesta 5-10x superiores a encuestas tradicionales.

### 1.2 Success Criteria (MVP)

**Must achieve by Month 6:**
- 100+ paying customers
- $3,000+ MRR
- <10% monthly churn
- NPS >50
- 40%+ users "very disappointed" if product disappeared

### 1.3 Target Users

**Primary:** PyMEs LATAM (50-200 empleados) en ecommerce, retail, servicios
**Secondary:** Startups SaaS, agencias de marketing
**Excluded (MVP):** Enterprises con >500 empleados, mercados fuera LATAM

---

## 2. USER PERSONAS

### Persona 1: María - Owner de Ecommerce

**Demografía:**
- 35 años, dueña de tienda online de ropa
- 200-500 pedidos/mes
- Equipo: 3 personas
- Tech-savvy: Medio

**Pain Points:**
- Envía encuestas post-compra por email → <5% respuesta
- No sabe por qué clientes no vuelven
- Usa Google Forms pero análisis es manual

**Goals:**
- Entender satisfacción de clientes
- Mejorar tasa de respuesta
- Identificar problemas recurrentes

**ChatForm Use Case:**
- Envía encuesta post-compra por WhatsApp
- 70% respuesta vs 5% anterior
- IA detecta "envío lento" como queja #1
- Cambia proveedor logístico

**Success Metric:** Repeat purchase rate sube 15%

---

### Persona 2: Carlos - Product Manager SaaS

**Demografía:**
- 30 años, PM en startup SaaS B2B
- 500 usuarios activos
- Equipo: 15 personas
- Tech-savvy: Alto

**Pain Points:**
- Necesita medir NPS mensualmente
- Usuarios ignoran emails de encuesta
- Quiere insights rápidos sin analista

**Goals:**
- NPS >40 (metric de board)
- Identificar features más solicitados
- Detectar churn risk temprano

**ChatForm Use Case:**
- Envía NPS survey vía WhatsApp post-onboarding
- 60% respuesta en <24 horas
- IA identifica "falta integración Slack" en 20% de feedback
- Prioriza feature en roadmap

**Success Metric:** NPS sube de 32 a 45 en 3 meses

---

### Persona 3: Ana - Directora de Agencia

**Demografía:**
- 38 años, dirige agencia marketing digital
- 10 clientes activos
- Equipo: 8 personas
- Tech-savvy: Alto

**Pain Points:**
- Clientes piden reportes de satisfacción
- Hacer encuestas manual por cada cliente
- Consolidar feedback toma días

**Goals:**
- Automatizar encuestas para todos los clientes
- Reportes automáticos mensuales
- Retener clientes con insights accionables

**ChatForm Use Case:**
- Setup encuesta template para clientes
- Envía automáticamente post-proyecto
- Dashboard por cliente con NPS/CSAT
- Presenta insights en meetings

**Success Metric:** Retención de clientes 95% vs 80% anterior

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 Epic 1: User Authentication & Onboarding

#### User Story 1.1: Registro de Usuario
**As a** new user
**I want to** crear cuenta con email o Google
**So that** puedo acceder a la plataforma

**Acceptance Criteria:**
- [ ] Usuario puede registrarse con email + password
- [ ] Usuario puede registrarse con Google SSO
- [ ] Email de verificación enviado
- [ ] Password requirements: min 8 caracteres, 1 número
- [ ] Error messages claros

**Priority:** P0 (Blocker)
**Estimate:** 2 story points
**Sprint:** 0

---

#### User Story 1.2: Onboarding Wizard
**As a** new user
**I want to** setup guiado inicial
**So that** puedo enviar mi primera encuesta rápidamente

**Acceptance Criteria:**
- [ ] Step 1: Conectar WhatsApp (o skip)
- [ ] Step 2: Crear primer formulario (o usar template)
- [ ] Step 3: Importar contactos (o skip)
- [ ] Progress indicator visible (1/3, 2/3, 3/3)
- [ ] Puede saltar steps y volver después
- [ ] Checklist persiste en dashboard hasta completar

**Priority:** P1 (High)
**Estimate:** 5 story points
**Sprint:** 0-1

---

### 3.2 Epic 2: Form Builder

#### User Story 2.1: Crear Formulario Básico
**As a** user
**I want to** crear formulario con preguntas simples
**So that** puedo hacer encuesta

**Acceptance Criteria:**
- [ ] Click "Nuevo Formulario" crea draft
- [ ] Input: nombre del formulario (required)
- [ ] Input: descripción (optional)
- [ ] Agregar pregunta abre modal/panel
- [ ] Tipos disponibles: Texto corto, Texto largo, Opción múltiple, Rating (1-5), NPS (0-10), Sí/No
- [ ] Cada pregunta puede marcarse como requerida u opcional
- [ ] Preview muestra conversación simulada
- [ ] Save guarda en database
- [ ] Auto-save cada 30 segundos

**Priority:** P0
**Estimate:** 13 story points
**Sprint:** 1-2

---

#### User Story 2.2: Question Types Detallados

**Text Short:**
- Placeholder text customizable
- Max length: 200 caracteres
- Validation: opcional

**Text Long:**
- Placeholder text customizable
- Max length: 1000 caracteres
- Multi-line en WhatsApp

**Multiple Choice:**
- Min 2 opciones, max 10
- Single select o multi-select
- Opción "Otro" con text input

**Rating Scale:**
- 1-5 estrellas o 1-10 números
- Labels personalizables (ej: "Muy malo" a "Excelente")

**NPS:**
- Siempre 0-10
- Automáticamente categoriza: Detractor (0-6), Passive (7-8), Promoter (9-10)

**Yes/No:**
- Simple confirmación
- Customizable wording

**Priority:** P0
**Estimate:** Incluido en 2.1
**Sprint:** 1-2

---

#### User Story 2.3: Conditional Logic Simple
**As a** user
**I want to** mostrar preguntas basadas en respuestas anteriores
**So that** la encuesta sea relevante

**Acceptance Criteria:**
- [ ] Cada pregunta tiene opción "Add conditional logic"
- [ ] IF pregunta X respuesta = Y THEN mostrar pregunta Z
- [ ] Ejemplo: IF NPS <= 6 THEN "¿Qué podemos mejorar?"
- [ ] UI visual (flowchart simple o dropdown)
- [ ] Preview muestra branching paths
- [ ] Max 1 nivel de nesting (MVP)

**Priority:** P1
**Estimate:** 8 story points
**Sprint:** 2

---

#### User Story 2.4: Form Templates
**As a** new user
**I want to** usar templates pre-hechos
**So that** no empiezo desde cero

**Templates incluidos:**
1. **NPS Survey**
   - ¿Recomendarías nuestro servicio? (0-10)
   - ¿Por qué diste ese score?
   - ¿Algo más que quieras compartir?

2. **Post-Purchase Feedback**
   - ¿Cómo fue tu experiencia de compra? (1-5)
   - ¿El producto cumplió tus expectativas?
   - ¿Volverías a comprar?

3. **CSAT (Customer Satisfaction)**
   - ¿Qué tan satisfecho estás? (1-5)
   - ¿Resolvimos tu problema?
   - ¿Algo que podamos mejorar?

4. **Product Feedback**
   - ¿Qué feature te gustaría ver?
   - ¿Qué tan seguido usas [producto]?
   - ¿Qué precio sería justo?

**Acceptance Criteria:**
- [ ] "Templates" tab en form builder
- [ ] Click en template crea copy editable
- [ ] User puede modificar completamente
- [ ] Template guarda como form normal

**Priority:** P2 (Nice-to-have MVP)
**Estimate:** 3 story points
**Sprint:** 2 (si hay tiempo) o Post-MVP

---

### 3.3 Epic 3: WhatsApp Integration

#### User Story 3.1: Conectar WhatsApp Number
**As a** user
**I want to** conectar mi número de WhatsApp Business
**So that** puedo enviar encuestas

**Acceptance Criteria:**
- [ ] Settings → WhatsApp Integration page
- [ ] Instrucciones claras con screenshots
- [ ] Input: Meta App ID
- [ ] Input: Phone Number ID
- [ ] Input: Access Token (encrypted storage)
- [ ] Test button: "Send Test Message"
- [ ] Status indicator: Connected / Disconnected
- [ ] Error messages si credentials inválidas

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 3

**Technical Notes:**
- Usar Meta Cloud API (no Twilio MVP)
- Store access token encrypted en DB
- Validar webhook URL setup

---

#### User Story 3.2: Message Templates Setup
**As a** user
**I want to** crear y aprobar message templates
**So that** puedo iniciar conversaciones

**Acceptance Criteria:**
- [ ] Templates page lista todos los templates
- [ ] Click "New Template" abre form
- [ ] Input: Template name (internal)
- [ ] Input: Category (Utility, Marketing, Authentication)
- [ ] Input: Template message con variables {{1}}, {{2}}
- [ ] Preview con valores ejemplo
- [ ] Submit envía a Meta para approval
- [ ] Status: Pending / Approved / Rejected
- [ ] Email notification cuando cambia status

**Pre-loaded templates:**
- "survey_invitation" (Utility)
- "reminder_incomplete" (Utility)
- "thank_you" (Utility)

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 3

---

#### User Story 3.3: Send Single Survey
**As a** user
**I want to** enviar encuesta a un contacto
**So that** puedo probar funcionalidad

**Acceptance Criteria:**
- [ ] Form detail page tiene botón "Send Now"
- [ ] Modal: Input phone number (+52 formato)
- [ ] Select: Message template
- [ ] Preview mensaje inicial
- [ ] Click "Send" envía template
- [ ] Success message con tracking
- [ ] Error handling (invalid number, rate limit, etc)

**Priority:** P0
**Estimate:** 5 story points
**Sprint:** 3

---

#### User Story 3.4: Conversational Flow Engine
**As a** system
**I want to** manejar conversación question-by-question
**So that** usuario completa encuesta

**Acceptance Criteria:**
- [ ] Webhook recibe incoming WhatsApp message
- [ ] Identifica sesión activa por phone number
- [ ] Retrieve pregunta actual (currentQuestionIndex)
- [ ] Valida respuesta contra question type
- [ ] Si válida: guarda y envía siguiente pregunta
- [ ] Si inválida: envía mensaje de clarificación
- [ ] Si última pregunta: mensaje de agradecimiento y close session
- [ ] Maneja keywords especiales: "cancelar", "saltar"
- [ ] Timeout: si no responde en 23 hrs, marca as abandoned

**Priority:** P0
**Estimate:** 13 story points
**Sprint:** 3-4

**Technical Notes:**
- State machine pattern
- Session table: contactId, formId, currentQuestionIndex, status, startedAt, lastMessageAt
- Response table: sessionId, questionId, answer, createdAt

---

#### User Story 3.5: Response Validation
**As a** system
**I want to** validar respuestas según question type
**So that** data es consistente

**Validation Rules:**

| Question Type | Validation |
|---------------|------------|
| Text Short | Length < 200 chars |
| Text Long | Length < 1000 chars |
| Multiple Choice | Answer in allowed options |
| Rating | Number between 1-5 or 1-10 |
| NPS | Number between 0-10 |
| Yes/No | "sí", "si", "yes", "no" (case insensitive) |

**AI-assisted validation:**
- Si respuesta ambigua, usar OpenAI para interpretar
- Ejemplo: "más o menos" → interpreta como rating medio
- Si IA no puede interpretar → pedir clarificación

**Acceptance Criteria:**
- [ ] Cada question type tiene validator
- [ ] Validators retornan {valid: boolean, mappedValue: any, error?: string}
- [ ] Si invalid, envía friendly error message
- [ ] Max 2 intentos, luego skip question
- [ ] Log validation failures para análisis

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 4

---

### 3.4 Epic 4: AI Analysis

#### User Story 4.1: Sentiment Analysis
**As a** user
**I want to** ver sentiment de cada respuesta
**So that** sé si cliente está satisfecho

**Acceptance Criteria:**
- [ ] Cuando respuesta es text (no rating), trigger AI analysis
- [ ] OpenAI analiza sentiment: positive, neutral, negative
- [ ] Sentiment score: -1 (very negative) to +1 (very positive)
- [ ] Emotion tags: happy, frustrated, angry, satisfied, confused, neutral
- [ ] Guarda en responses table
- [ ] Muestra en UI con emoji/color
- [ ] Analysis completa en <30 segundos

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 5

**Technical Notes:**
- Usar GPT-4o-mini (balance costo/calidad)
- Structured output (JSON mode)
- Background job con Inngest
- Retry logic si OpenAI falla

---

#### User Story 4.2: NPS/CSAT Calculation
**As a** user
**I want to** ver NPS/CSAT scores automáticos
**So that** mido performance

**NPS Calculation:**
```
NPS = (% Promoters - % Detractors) × 100
Promoters: 9-10
Passives: 7-8
Detractors: 0-6
```

**CSAT Calculation:**
```
CSAT = (Satisfied customers / Total responses) × 100
Satisfied: 4-5 (on 1-5 scale)
```

**Acceptance Criteria:**
- [ ] Identifica preguntas tipo NPS/CSAT en form
- [ ] Calcula scores por campaign
- [ ] Muestra en dashboard con trend (↑↓)
- [ ] Color-coding: Green >50, Yellow 0-50, Red <0
- [ ] AI estima NPS/CSAT desde text responses si no hay rating

**Priority:** P0
**Estimate:** 5 story points
**Sprint:** 5

---

#### User Story 4.3: Topic Extraction
**As a** user
**I want to** ver qué temas mencionan los clientes
**So that** priorizo mejoras

**Acceptance Criteria:**
- [ ] AI extrae topics de respuestas de texto
- [ ] Topics categorizados: product, service, pricing, shipping, support, other
- [ ] Frecuencia de cada topic
- [ ] Topics list en dashboard
- [ ] Click en topic filtra respuestas relacionadas
- [ ] Word cloud visual (nice-to-have)

**Examples:**
```
Input: "El producto es excelente pero el envío tardó mucho"
Output: topics: ["product_quality", "shipping_speed"]
        topic_sentiments: {product_quality: "positive", shipping_speed: "negative"}
```

**Priority:** P1
**Estimate:** 8 story points
**Sprint:** 5

---

#### User Story 4.4: Session Summary AI
**As a** user
**I want to** ver resumen IA de cada respuesta completa
**So that** entiendo feedback sin leer todo

**Acceptance Criteria:**
- [ ] Cuando sesión completa, trigger full analysis
- [ ] AI genera resumen: 2-3 oraciones
- [ ] Identifica: overall sentiment, key points, action suggested
- [ ] Priority tag: high, medium, low (urgent issues = high)
- [ ] Guarda en session_analyses table
- [ ] Muestra en response detail page

**Example:**
```
Summary: "Cliente muy satisfecho con calidad de producto.
          Única queja: envío tardó 5 días vs 2-3 prometidos.
          Sugiere mejorar logística."

Action: "Contactar para compensar demora, revisar proveedor envío"
Priority: Medium
```

**Priority:** P1
**Estimate:** 5 story points
**Sprint:** 5

---

### 3.5 Epic 5: Dashboard & Analytics

#### User Story 5.1: Dashboard Overview
**As a** user
**I want to** ver métricas clave al login
**So that** monitoreo performance

**Metrics Cards:**
1. Total Responses (this month)
2. Response Rate %
3. Average NPS
4. Average CSAT
5. Top Sentiment (pie chart)

**Acceptance Criteria:**
- [ ] Dashboard es landing page después de login
- [ ] 5 metric cards en grid
- [ ] Data actualiza en page load
- [ ] Loading skeletons mientras carga
- [ ] Error state si API falla
- [ ] Date range selector: Last 7 days, Last 30 days, All time

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 6

---

#### User Story 5.2: Responses List
**As a** user
**I want to** ver lista de todas las respuestas
**So that** reviso feedback individual

**Acceptance Criteria:**
- [ ] Table con columnas: Contact, Form, NPS/CSAT, Sentiment, Date, Status
- [ ] Sortable por cada columna
- [ ] Filtros: Date range, Sentiment, Score range, Form
- [ ] Search bar: busca en respuestas de texto
- [ ] Pagination: 25 per page
- [ ] Click en row abre detail view
- [ ] Export CSV button

**Priority:** P0
**Estimate:** 13 story points
**Sprint:** 6

---

#### User Story 5.3: Response Detail View
**As a** user
**I want to** ver conversación completa
**So that** entiendo contexto

**Acceptance Criteria:**
- [ ] Modal o page con conversación completa
- [ ] Formato tipo chat (pregunta/respuesta alternadas)
- [ ] AI insights panel: sentiment, topics, summary
- [ ] Contact info: name, phone, email (if available)
- [ ] Campaign info: which campaign sent this
- [ ] Timestamp de cada mensaje
- [ ] Download conversation PDF (nice-to-have)

**Priority:** P1
**Estimate:** 8 story points
**Sprint:** 6

---

#### User Story 5.4: Analytics Charts
**As a** user
**I want to** ver gráficos de tendencias
**So that** identifico patrones

**Charts:**
1. **NPS Distribution** (bar chart)
   - X: Scores 0-10
   - Y: Count
   - Color-coded: Red (0-6), Yellow (7-8), Green (9-10)

2. **Sentiment Over Time** (line chart)
   - X: Date
   - Y: % positive, neutral, negative
   - 3 lines

3. **Top Topics** (horizontal bar)
   - X: Frequency
   - Y: Topic name
   - Top 10 topics

4. **Response Rate** (metric + trend)
   - % responses / surveys sent
   - Arrow ↑↓ vs previous period

**Acceptance Criteria:**
- [ ] Charts library: Recharts o Tremor
- [ ] Responsive (mobile-friendly)
- [ ] Hover tooltips
- [ ] Click en chart filters list below
- [ ] Export chart as image (nice-to-have)

**Priority:** P1
**Estimate:** 13 story points
**Sprint:** 6

---

#### User Story 5.5: Export Data
**As a** user
**I want to** exportar responses a CSV
**So that** analizo en Excel

**CSV Columns:**
- Contact Name
- Contact Phone
- Form Name
- Campaign Name
- Question 1, Answer 1
- Question 2, Answer 2
- ... (dynamic based on form)
- NPS Score
- CSAT Score
- Sentiment
- Topics
- AI Summary
- Date Completed

**Acceptance Criteria:**
- [ ] Export button en Responses List
- [ ] Applies current filters
- [ ] Generates CSV file
- [ ] Downloads immediately
- [ ] Filename: "chatform-responses-YYYY-MM-DD.csv"
- [ ] UTF-8 encoding (supports Spanish characters)

**Priority:** P1
**Estimate:** 5 story points
**Sprint:** 6

---

### 3.6 Epic 6: Contacts & Campaigns

#### User Story 6.1: Import Contacts CSV
**As a** user
**I want to** importar contactos desde CSV
**So that** no los agrego manualmente

**CSV Format:**
```csv
name,phone,email,tags
Juan Pérez,+5215512345678,juan@example.com,cliente-vip
María López,+5215587654321,maria@example.com,nuevo
```

**Acceptance Criteria:**
- [ ] Contacts page con "Import CSV" button
- [ ] Upload CSV file
- [ ] Preview first 5 rows
- [ ] Map columns: name → name, phone → phone, etc
- [ ] Validation: phone format +52XXXXXXXXXX
- [ ] Duplicate detection (by phone)
- [ ] Import progress bar
- [ ] Success: "X contacts imported, Y duplicates skipped"
- [ ] Error report: "Row 10: invalid phone format"

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 7

---

#### User Story 6.2: Contacts List & Management
**As a** user
**I want to** ver y gestionar mis contactos
**So that** mantengo lista limpia

**Acceptance Criteria:**
- [ ] Contacts table: Name, Phone, Email, Tags, Added Date
- [ ] Search by name/phone/email
- [ ] Filter by tags
- [ ] Bulk actions: Delete, Add tag, Remove tag
- [ ] Individual actions: Edit, Delete
- [ ] Add contact manually form
- [ ] Opt-out status visible (if contact opted out)

**Priority:** P1
**Estimate:** 8 story points
**Sprint:** 7

---

#### User Story 6.3: Create Campaign
**As a** user
**I want to** crear campaña para enviar a múltiples contactos
**So that** escalo encuestas

**Acceptance Criteria:**
- [ ] Campaigns page con "New Campaign" button
- [ ] Step 1: Name campaign
- [ ] Step 2: Select form (dropdown)
- [ ] Step 3: Select contacts (checkbox list o import CSV)
- [ ] Step 4: Select message template
- [ ] Step 5: Review & confirm
- [ ] Estimate: X messages, Cost: $Y (if applicable)
- [ ] "Send Now" button (no scheduling MVP)
- [ ] Campaign created with status: "sending"

**Priority:** P0
**Estimate:** 13 story points
**Sprint:** 7

---

#### User Story 6.4: Campaign Execution
**As a** system
**I want to** enviar mensajes respetando rate limits
**So that** no bloqueamos WhatsApp

**Acceptance Criteria:**
- [ ] Background job procesa campaign
- [ ] Respeta rate limits: 80 msg/sec, 1 msg/6sec por usuario
- [ ] Batch processing: 100 contacts at a time
- [ ] Update campaign stats: sent, delivered, read, responded
- [ ] Retry failed sends (max 3 attempts)
- [ ] Complete campaign updates status: "completed"
- [ ] Email notification cuando completa

**Priority:** P0
**Estimate:** 13 story points
**Sprint:** 7

**Technical Notes:**
- Usar Inngest para queue
- Track message status via WhatsApp webhooks
- Handle errors: invalid number, opted out, rate limit

---

#### User Story 6.5: Campaign Dashboard
**As a** user
**I want to** ver progreso de campaña
**So that** monitoreo envíos

**Campaign Detail Page:**
- Status: Draft, Sending, Completed, Failed
- Progress: 450 / 1000 sent (45%)
- Progress bar visual
- Stats: Sent, Delivered, Read, Responded
- Response rate: X%
- Analytics: NPS, CSAT, Sentiment (same as main dashboard pero filtrado)

**Acceptance Criteria:**
- [ ] Campaign list page
- [ ] Click en campaign abre detail
- [ ] Real-time updates (poll every 10 sec mientras sending)
- [ ] Actions: Pause (nice-to-have), Cancel (nice-to-have)
- [ ] View responses link (filters responses by campaign)

**Priority:** P1
**Estimate:** 8 story points
**Sprint:** 7

---

### 3.7 Epic 7: Billing & Subscriptions

#### User Story 7.1: Pricing Page
**As a** visitor/user
**I want to** ver planes y precios
**So that** decido cual comprar

**Plans:**
- Free: $0 - 100 responses/mes
- Starter: $19/mes - 1,000 responses
- Pro: $49/mes - 5,000 responses

**Acceptance Criteria:**
- [ ] Public pricing page (no login required)
- [ ] 3 columns con features comparison
- [ ] Highlight "Most Popular" (Pro)
- [ ] CTA buttons: "Start Free" o "Upgrade"
- [ ] FAQ section
- [ ] Link to "Contact Sales" para Enterprise

**Priority:** P0
**Estimate:** 5 story points
**Sprint:** 8

---

#### User Story 7.2: Stripe Checkout Integration
**As a** user
**I want to** pagar con tarjeta
**So that** activo plan pagado

**Acceptance Criteria:**
- [ ] Click "Upgrade to Starter" en dashboard
- [ ] Redirect a Stripe Checkout
- [ ] Pre-fill email
- [ ] Payment success → redirect back con success message
- [ ] Webhook: checkout.session.completed
- [ ] Update organization.plan = 'starter' en DB
- [ ] Update organization.stripe_customer_id
- [ ] Dashboard muestra nuevo plan inmediatamente

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 8

**Technical Notes:**
- Stripe test mode MVP
- Webhook signature validation
- Idempotency handling

---

#### User Story 7.3: Usage Tracking & Limits
**As a** system
**I want to** trackear uso y enforcar límites
**So that** usuarios respetan planes

**Tracking:**
- Responses count per organization per month
- Reset counter 1st of month

**Limits Enforcement:**
```
Free: 100 responses/mes
  → If reached: Block sending campaigns
  → Show: "Upgrade to send more surveys"

Starter: 1,000 responses/mes
  → If reached: Block sending
  → Show: "Upgrade to Pro or buy add-on responses"

Pro: 5,000 responses/mes
  → If reached: Same
```

**Acceptance Criteria:**
- [ ] Usage meter en dashboard: "450 / 1,000 responses used this month"
- [ ] Progress bar visual
- [ ] Warning at 80%: "You're approaching your limit"
- [ ] Block at 100%: Cannot send campaign
- [ ] Middleware checks limit before campaign send

**Priority:** P0
**Estimate:** 8 story points
**Sprint:** 8

---

#### User Story 7.4: Billing Settings & Customer Portal
**As a** user
**I want to** gestionar mi subscripción
**So that** actualizo tarjeta o cancelo

**Acceptance Criteria:**
- [ ] Settings → Billing page
- [ ] Shows: Current plan, Next billing date, Amount
- [ ] Link to Stripe Customer Portal (Stripe-hosted)
- [ ] Customer Portal allows:
  - Update payment method
  - View invoices
  - Cancel subscription
- [ ] Webhook: customer.subscription.updated
- [ ] Webhook: customer.subscription.deleted (cancel)
- [ ] On cancel: Downgrade to Free immediately (o al final del período)

**Priority:** P0
**Estimate:** 5 story points
**Sprint:** 8

---

### 3.8 Epic 8: Polish & Testing

#### User Story 8.1: Error Handling
**As a** user
**I want to** ver errores claros cuando algo falla
**So that** sé qué hacer

**Acceptance Criteria:**
- [ ] Error boundary component catch React errors
- [ ] API errors show toast notification
- [ ] Specific error messages (no "Something went wrong")
- [ ] Examples:
  - "WhatsApp rate limit reached. Try again in 5 minutes."
  - "Invalid phone number format. Use +52XXXXXXXXXX"
  - "Form must have at least 1 question"
- [ ] Retry button where applicable
- [ ] Contact support link en error críticos

**Priority:** P1
**Estimate:** 5 story points
**Sprint:** 9

---

#### User Story 8.2: Loading States
**As a** user
**I want to** ver feedback mientras carga
**So that** sé que app está trabajando

**Acceptance Criteria:**
- [ ] Skeleton loaders en tables/lists
- [ ] Spinner en buttons después de click
- [ ] Progress bars en uploads/imports
- [ ] Shimmer effect en cards
- [ ] Optimistic UI donde posible (form saves)

**Priority:** P1
**Estimate:** 3 story points
**Sprint:** 9

---

#### User Story 8.3: Mobile Responsive
**As a** mobile user
**I want to** usar app en mi celular
**So that** monitoreo sobre la marcha

**Acceptance Criteria:**
- [ ] Dashboard cards stack vertical en mobile
- [ ] Tables horizontally scrollable
- [ ] Hamburger menu en navigation
- [ ] Forms usable en mobile (no drag-drop, usar list)
- [ ] Charts responsive
- [ ] Touch-friendly buttons (min 44px)

**Priority:** P1
**Estimate:** 8 story points
**Sprint:** 9

---

#### User Story 8.4: E2E Testing Critical Paths
**As a** developer
**I want to** automated tests
**So that** no rompo core flows

**Critical Paths:**
1. Sign up → Create form → Send to 1 contact → Receive response → See in dashboard
2. Import contacts → Create campaign → Send to 10 contacts → View stats
3. Upgrade to Starter → Check usage limits

**Acceptance Criteria:**
- [ ] Playwright tests para 3 paths
- [ ] Run en CI/CD pipeline
- [ ] Tests pass before deploy
- [ ] Mock WhatsApp webhooks en tests
- [ ] Mock Stripe webhooks en tests

**Priority:** P2 (nice-to-have MVP)
**Estimate:** 13 story points
**Sprint:** 9 o Post-MVP

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance

- API response time p95: <500ms
- Dashboard initial load: <2s
- Form builder interactivity: <100ms
- WhatsApp webhook processing: <2s
- AI analysis completion: <30s per session
- Campaign send throughput: 50+ messages/sec

### 4.2 Scalability

- Support 10,000 registered users
- Handle 100,000 responses/month
- 1,000 concurrent campaigns
- Database: PostgreSQL with proper indexes
- Caching: Redis for hot data (future)

### 4.3 Reliability

- Uptime target: 99.9% (43 min downtime/month acceptable)
- Automated backups: Daily
- Disaster recovery: <4 hour RPO, <1 hour RTO
- Zero data loss on user-generated content (forms, responses)

### 4.4 Security

- Data encryption at rest (Postgres native)
- Data encryption in transit (HTTPS/TLS)
- WhatsApp access tokens encrypted in DB
- Stripe keys via environment variables
- Rate limiting: 100 req/min per user
- CSRF protection
- SQL injection prevention (ORM parameterized queries)
- XSS prevention (React escaping)

### 4.5 Compliance

- GDPR: User can request data deletion
- CCPA: User can download their data
- WhatsApp Business Policy compliance
- Terms of Service & Privacy Policy published
- Cookie consent banner (if analytics)

### 4.6 Monitoring & Observability

- Error tracking: Sentry
- Analytics: Vercel Analytics o Plausible
- Logging: Structured logs (JSON)
- Alerts: Sentry + email for P0 errors
- Uptime monitoring: UptimeRobot (external)
- Cost tracking: Stripe Dashboard, Vercel Dashboard, OpenAI Dashboard

---

## 5. USER FLOW DIAGRAMS

### 5.1 Happy Path: First Survey

```
1. User signs up (email)
   ↓
2. Email verification
   ↓
3. Onboarding wizard
   ├─ Connect WhatsApp (or skip)
   ├─ Create form (or use template)
   └─ Import contacts (or skip)
   ↓
4. Dashboard overview
   ↓
5. Click "New Form"
   ↓
6. Form Builder
   ├─ Add 3 questions
   ├─ Preview
   └─ Save
   ↓
7. Click "Send Now"
   ↓
8. Enter phone number
   ↓
9. Select template
   ↓
10. Send message
   ↓
11. WhatsApp delivers
   ↓
12. Contact responds
   ↓
13. Conversation completes
   ↓
14. AI analyzes
   ↓
15. User sees response in Dashboard
   ↓
16. 🎉 Success!
```

### 5.2 Campaign Flow

```
1. User at Dashboard
   ↓
2. Contacts → Import CSV
   ↓
3. Upload file with 100 contacts
   ↓
4. Preview and confirm
   ↓
5. Campaigns → New Campaign
   ↓
6. Select Form
   ↓
7. Select Contacts (all 100)
   ↓
8. Select Template
   ↓
9. Review: "Send to 100 contacts"
   ↓
10. Click "Send Now"
   ↓
11. Campaign status: "Sending"
   ↓
12. Background job processes
    ├─ Respects rate limits
    ├─ Updates progress
    └─ Tracks status
   ↓
13. After 2 minutes: "Completed"
   ↓
14. Stats: 100 sent, 95 delivered, 60 responded
   ↓
15. User views responses
   ↓
16. Analyzes insights
   ↓
17. Takes action based on feedback
```

### 5.3 Billing Flow

```
1. Free user hits 100 responses limit
   ↓
2. Dashboard shows: "You've reached your limit"
   ↓
3. "Upgrade" button
   ↓
4. Pricing page
   ↓
5. Click "Upgrade to Starter ($19/mes)"
   ↓
6. Redirect to Stripe Checkout
   ↓
7. Enter card details
   ↓
8. Submit payment
   ↓
9. Stripe processes
   ↓
10. Webhook: checkout.session.completed
   ↓
11. Backend updates DB: plan = 'starter'
   ↓
12. Redirect back to Dashboard
   ↓
13. Success message: "You're now on Starter!"
   ↓
14. Usage meter resets: "0 / 1,000 responses"
   ↓
15. User can send campaigns again
```

---

## 6. OUT OF SCOPE (Post-MVP)

### Explicitly NOT in MVP v1.0:

❌ **Team Collaboration**
- Comments on responses
- Assign responses to team members
- Team permissions (only owner has access MVP)

❌ **Advanced Features**
- Scheduled campaigns
- A/B testing
- Multi-language forms
- Custom branding (logos, colors)
- White label
- API pública

❌ **Integrations**
- Slack notifications
- Zapier
- Webhook URLs custom
- Google Sheets sync

❌ **Advanced Analytics**
- Custom reports builder
- Funnel analysis
- Cohort analysis
- Predictive churn

❌ **AI Advanced**
- AI-suggested questions
- Automatic survey optimization
- Win-back campaigns automáticas

❌ **Enterprise**
- SSO (SAML, SCIM)
- Multiple WhatsApp numbers (solo 1 en MVP)
- SLA guarantees
- Dedicated support

---

## 7. SUCCESS METRICS (KPIs)

### Product Metrics

**Activation:**
- % users who connect WhatsApp: Target >70%
- % users who send first survey: Target >50%
- Time to first survey sent: Target <20 minutes

**Engagement:**
- DAU/MAU ratio: Target >30%
- Surveys created per user/month: Target >2
- Campaigns sent per user/month: Target >1

**Retention:**
- Day 7 retention: Target >40%
- Month 2+ retention: Target >60%

**Revenue:**
- Free to Paid conversion: Target >5%
- MRR: Month 6 target $3,000
- Churn rate: Target <10% monthly

### Technical Metrics

- API p95 latency: <500ms
- Uptime: >99.5%
- WhatsApp delivery rate: >98%
- AI analysis success rate: >95%

### Customer Satisfaction

- NPS (de usuarios de ChatForm): Target >50
- CSAT: Target >4.5/5
- Support ticket resolution: <24 hours

---

## 8. RELEASE PLAN

### Phase 1: Private Beta (Week 18-20)
- Invite 20-30 beta users
- Intensive feedback gathering
- Bug fixes
- Feature iteration based on feedback

### Phase 2: Soft Launch (Week 21-22)
- Graduate beta users
- Open signups (limited marketing)
- Monitor stability
- Prepare marketing materials

### Phase 3: Public Launch (Week 23)
- Product Hunt launch
- Social media campaign
- Press release
- Paid ads start

### Phase 4: Post-Launch (Week 24+)
- Weekly analytics review
- Monthly Go/No-Go checkpoint
- Feature prioritization based on usage
- Scale infrastructure as needed

---

## 9. DEPENDENCIES & RISKS

### External Dependencies

**Critical (Blockers):**
- Meta WhatsApp Cloud API access
- Stripe account approval
- Clerk authentication service
- Neon database service
- Vercel deployment platform
- OpenAI API access

**Important:**
- Inngest background jobs
- Sentry error tracking
- Domain registration (chatform.mx)

### Key Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WhatsApp API changes policy | Medium | High | Monitor announcements, flexible architecture |
| OpenAI costs exceed budget | Medium | Medium | Implement caching, use GPT-4o-mini |
| Low user adoption | Medium | High | Beta testing, customer interviews |
| Competitor launches similar | Medium | High | Move fast, focus LATAM niche |
| Template approval delays | High | Low | Pre-approve generic templates early |
| Rate limit issues at scale | Low | Medium | Queue system, contact batching |

---

## 10. OPEN QUESTIONS

1. ¿Permitir usuarios crear múltiples organizations (workspace)?
   - **Decision:** Post-MVP, solo 1 org por user MVP

2. ¿Soportar múltiples números de WhatsApp desde inicio?
   - **Decision:** No, solo 1 número en MVP

3. ¿Incluir SMS como fallback si WhatsApp falla?
   - **Decision:** No MVP, WhatsApp-only

4. ¿Ofrecer plan anual con descuento desde MVP?
   - **Decision:** Sí, 15% descuento anual

5. ¿Límite de preguntas por formulario?
   - **Decision:** Soft limit 15 preguntas (warning), hard limit 30

---

## APPROVAL & SIGN-OFF

**Product Owner:** ___________________ Date: ___________
**Tech Lead:** ______________________ Date: ___________
**Stakeholders:** ___________________ Date: ___________

---

**Next Steps:**
1. Approve PRD → ✅
2. Create detailed sprint backlogs → Next document
3. Setup development environment → Sprint 0
4. Begin implementation → Sprint 1

**PRD Status:** READY FOR APPROVAL ✅
