# ChatForm Delivery Strategy
## Arquitectura de Distribución de Encuestas

**Última actualización:** 29 Oct 2025
**Estado:** Planeación MVP

---

## 🎯 Decisión Estratégica Clave

### Modelo de Negocio con Viralidad Built-in

```
FREE TIER:
- Branding "Powered by ChatForm" en TODAS las respuestas
- = Cada encuesta es un anuncio viral
- = Growth loop automático

PRO TIER ($49/mes):
- Sin branding
- White-label experience
```

**Por qué funciona:** Cada persona que responde una encuesta free ve "ChatForm". Si responden 100 personas, 100 personas vieron tu marca. **Viralidad exponencial.**

---

## 📋 Resumen de Políticas de Meta (2025)

### ✅ Lo que SÍ podemos hacer (LEGAL y sin opt-in previo):

1. **wa.me Links (Click-to-Chat)**
   - Usuario hace click en link
   - **ELLOS inician conversación** = User-initiated
   - **NO requiere opt-in previo**
   - Tenemos 24 horas para responder libremente
   - Después de 24hrs, necesitamos templates aprobados

2. **Conversaciones iniciadas por usuario**
   - Si usuario manda mensaje primero
   - 24 horas de ventana libre
   - Meta lo considera opt-in implícito

### ❌ Lo que NO podemos hacer (sin opt-in explícito):

1. **Enviar templates proactivamente**
   - Si queremos mandar mensaje nosotros primero
   - Requiere opt-in explícito previo
   - Template debe estar pre-aprobado (1-2 días)
   - Costo: $0.005-0.09 USD por mensaje

2. **Marketing sin permiso**
   - Spam = ban instantáneo
   - Necesita opt-in claro y documentado

---

## 🚀 Estrategia Multi-Canal para ChatForm

### Canal 1: **Click-to-Chat Links (MVP Core)** 🎯

**Concepto:** Como Typeform - damos el link, usuario lo distribuye

```
Cliente crea encuesta → ChatForm genera:
├─ Link corto: chatform.app/s/abc123
├─ Redirect a: wa.me/52CHATFORM_NUM?text=START_abc123
└─ Usuario final hace click → Abre WhatsApp → Inicia conversación
```

**Ventajas:**
✅ **CUMPLE POLÍTICAS** - Usuario inicia conversación (opt-in implícito)
✅ **Zero setup** - Cliente solo comparte link
✅ **No requiere templates aprobados** - Es conversación reactiva
✅ **Gratis para usuario** - No usa su API
✅ **Inmediato** - Funciona desde día 1

**Cómo se distribuye:**
- Cliente comparte link en: Instagram bio, email, SMS, QR code, web embed
- Usuario hace click
- Abre WhatsApp con mensaje pre-llenado "START_abc123"
- ChatForm bot responde con primera pregunta
- Flow conversacional continúa

**Ejemplo real:**
```
Restaurante crea encuesta de satisfacción
↓
ChatForm genera: chatform.app/s/rest_tacos
↓
Restaurante imprime QR en recibo
↓
Cliente escanea QR → Abre WhatsApp → Manda "START_rest_tacos"
↓
Bot: "¡Gracias por visitarnos! 🌮 ¿Cómo calificas tu experiencia?"
```

---

### Canal 2: **Embed Widget (Como Typeform)** 🌐

**Concepto:** Iframe o SDK para incrustar en web

```html
<!-- Cliente agrega a su web -->
<script src="https://chatform.app/embed.js"></script>
<div data-chatform="abc123"></div>

<!-- O iframe directo -->
<iframe src="https://chatform.app/embed/abc123" width="100%" height="600"></iframe>
```

**Cómo funciona:**
1. Usuario responde EN LA WEB (no en WhatsApp todavía)
2. Al final: "¿Quieres recibir seguimiento por WhatsApp?" [Botón wa.me]
3. Click → Abre WhatsApp → Usuario inicia conversación
4. ChatForm asocia respuestas web + WhatsApp

**Ventajas:**
✅ Opción para clientes que quieren hybrid
✅ Captura email/teléfono primero
✅ Luego ofrece WhatsApp como follow-up
✅ No requiere API de WhatsApp para funcionar

**Uso:** E-commerce, landing pages, blogs

---

### Canal 3: **Webhooks para Developers (Power Users)** ⚡

**Concepto:** Trigger encuestas desde otros sistemas

```javascript
// Developer configura webhook en su app
POST https://api.chatform.com/v1/surveys/abc123/trigger
Headers: { Authorization: "Bearer sk_..." }
Body: {
  "phone": "+5215512345678",
  "variables": {
    "nombre": "Juan",
    "orden_id": "12345",
    "producto": "Laptop"
  }
}

// ChatForm responde
{
  "status": "queued",
  "chat_url": "wa.me/52CHATFORM?text=START_abc123_juan_12345",
  "delivery_method": "link" // o "template" si tienen API conectada
}
```

**Flujos posibles:**

**A) Sin WhatsApp API del cliente (Default):**
```
Webhook → ChatForm genera link personalizado → Cliente lo envía por email/SMS
```

**B) Con WhatsApp API del cliente conectada (Enterprise):**
```
Webhook → ChatForm envía template directamente desde número del cliente
```

**Casos de uso:**
- Shopify: Después de compra → Encuesta satisfacción
- Calendly: Después de cita → Encuesta servicio
- Stripe: Después de pago → Encuesta NPS
- CRM: Nuevo lead → Encuesta cualificación

**Ventajas:**
✅ Automatización total
✅ Event-driven
✅ Personalización dinámica (variables)
✅ Se integra con workflows existentes

**Pricing especial:**
- Webhook calls incluidas en plan
- Si activan auto-send con template, cobrar por mensaje enviado

---

### Canal 4: **CSV Bulk Upload + Link Generation** 📊

**Concepto:** Usuario sube lista, generamos links únicos

```
Cliente sube CSV:
nombre,telefono,email
Juan,+5215512345678,juan@example.com
María,+5215598765432,maria@example.com

ChatForm genera:
nombre,telefono,link_personal
Juan,+5215512345678,chatform.app/s/abc123-juan
María,+5215598765432,chatform.app/s/abc123-maria

Cliente descarga y envía links por:
- Email marketing (Mailchimp)
- SMS (Twilio)
- WhatsApp manual
```

**Ventajas:**
✅ Personalización (link único por persona)
✅ Tracking individual
✅ Cliente escoge cómo distribuir
✅ No usamos nuestros mensajes

**Uso:** Campañas masivas, seguimiento post-evento

---

### Canal 5: **QR Codes Personalizados** 📱

**Concepto:** QR único que abre WhatsApp directo

```
ChatForm genera QR:
├─ QR físico para imprimir
├─ QR digital para pantallas
└─ Escanear → wa.me link → WhatsApp se abre

Casos:
- Restaurante: QR en mesa
- Evento: QR en badge
- Tienda: QR en recibo
- Webinar: QR en última slide
```

**Ventajas:**
✅ Fricción CERO
✅ Perfecto para físico
✅ Trackeable (cada QR puede tener ID)

---

## 🏗️ Arquitectura Técnica: Shared Number Model

### Decisión Core: ChatForm es el intermediario

```
┌─────────────────────────────────────────────────────────┐
│  CLIENTE (Restaurante)                                  │
│  - Crea encuesta en dashboard                           │
│  - Obtiene: chatform.app/s/rest_tacos                   │
│  - Comparte link en Instagram                           │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  USUARIO FINAL (Consumidor)                             │
│  - Ve link en Instagram                                 │
│  - Click → Redirect a wa.me/52CHATFORM?text=START...    │
│  - WhatsApp se abre con mensaje pre-escrito             │
│  - Manda mensaje → INICIA conversación                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  CHATFORM BACKEND                                       │
│  1. Recibe webhook de Meta WhatsApp API                │
│  2. Parsea mensaje: "START_rest_tacos"                  │
│  3. Identifica: survey_id = rest_tacos                  │
│  4. Busca en DB: tenant_id del restaurante              │
│  5. Carga preguntas de la encuesta                      │
│  6. Inicia state machine conversacional                 │
│  7. Envía primera pregunta con botones                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  CONVERSACIÓN                                           │
│  Bot: "¡Gracias por tu visita! 🌮"                      │
│  Bot: "¿Cómo calificas tu experiencia?"                 │
│       [⭐⭐⭐⭐⭐] [⭐⭐⭐⭐] [⭐⭐⭐] [⭐⭐] [⭐]          │
│  User: *click ⭐⭐⭐⭐⭐*                                │
│  Bot: "¿Qué fue lo que más te gustó?"                   │
│  User: "El servicio estuvo excelente"                   │
│  Bot: "¡Gracias! ✅"                                     │
│       "Powered by ChatForm 💬" ← VIRALIDAD              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  CLIENTE ve en Dashboard:                               │
│  - Respuesta de +5215512345678                          │
│  - ⭐⭐⭐⭐⭐ rating                                      │
│  - "El servicio estuvo excelente"                       │
│  - Analytics en tiempo real                             │
└─────────────────────────────────────────────────────────┘
```

### Números de WhatsApp de ChatForm

**Opción A (MVP): 1 número compartido**
```
+52 55 CHATFORM
- Maneja TODAS las encuestas de TODOS los clientes
- Routing por survey_id en mensaje
- Más barato
- Single point of failure
```

**Opción B (Escalable): Pool de números**
```
+52 55 1234 0001 → Clientes 1-1000
+52 55 1234 0002 → Clientes 1001-2000
+52 55 1234 0003 → Clientes 2001-3000

Load balancing:
- Asignar cliente a número con menor carga
- Sticky (cliente siempre usa mismo número)
- Permite escalabilidad horizontal
```

**Recomendación MVP:** Opción A (1 número)
**Plan escala (10K+ clientes):** Opción B (pool)

---

## 💰 Modelo de Pricing Actualizado

### Free (Viralidad Engine) 🆓
```
✅ 1 encuesta activa
✅ 50 respuestas/mes
✅ Número compartido de ChatForm
✅ Branding "Powered by ChatForm" en TODAS las respuestas
✅ Link sharing (wa.me)
✅ QR code generation
✅ Dashboard básico
❌ Sin export
❌ Sin webhooks
❌ Sin analytics avanzado
```
**ROI para nosotros:** Cada respuesta = 1 impresión de marca

### Starter ($19/mes) 🚀
```
✅ 3 encuestas activas
✅ 500 respuestas/mes
✅ Número compartido de ChatForm
✅ Branding "Powered by ChatForm" (removido en Pro)
✅ CSV export
✅ Embed widget
✅ Custom fields
✅ Email notifications
✅ 7 días de soporte
```

### Pro ($49/mes) 💎
```
✅ Encuestas ilimitadas
✅ 2,000 respuestas/mes
✅ Número compartido de ChatForm
✅ SIN BRANDING (white-label)
✅ Webhooks (5 endpoints)
✅ API access
✅ Analytics avanzado
✅ Logic jumps
✅ Integraciones (Zapier, Make)
✅ 24hrs soporte prioritario
```

### Enterprise ($299/mes) 🏢
```
✅ TODO de Pro
✅ BYOA (Bring Your Own Account) - Usa TU número de WhatsApp
✅ Respuestas ilimitadas
✅ Webhooks ilimitados
✅ White-label completo
✅ Custom domain (surveys.tuempresa.com)
✅ SSO/SAML
✅ SLA 99.9%
✅ Dedicated account manager
✅ Custom onboarding
```

**Add-ons para todos:**
- +500 respuestas: $5
- +5,000 respuestas: $40
- Template message sending (si queremos implementar): $0.01/mensaje

---

## 🛠️ Stack Técnico para Delivery

### WhatsApp Integration
```typescript
// Provider: Meta WhatsApp Business API
// Alternativas evaluadas:
- Twilio WhatsApp API ❌ (más caro, $0.005-0.05/msg)
- MessageBird ❌ (menos features)
- Meta directo ✅ (oficial, más barato, más control)

// Setup:
1. Aplicar a Meta Business account
2. Verificar número de teléfono (México)
3. Configurar webhook endpoint
4. Aprobar templates básicos
```

### Backend Architecture
```typescript
// webhook-handler.ts
import { WhatsAppWebhook } from '@/lib/whatsapp';
import { SurveyStateMachine } from '@/lib/survey-engine';

export async function POST(req: Request) {
  const webhook = await req.json();

  // Verificar webhook signature (seguridad Meta)
  if (!verifySignature(webhook)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { from, body } = webhook.messages[0];

  // Detectar survey_id del mensaje
  const surveyId = extractSurveyId(body); // "START_abc123" → "abc123"

  if (!surveyId) {
    // No es inicio de encuesta, ignorar
    return new Response('OK');
  }

  // Buscar encuesta y tenant
  const survey = await db.surveys.findUnique({
    where: { shortCode: surveyId },
    include: { tenant: true }
  });

  if (!survey) {
    await whatsapp.sendMessage({
      to: from,
      body: "❌ Encuesta no encontrada. Verifica el link."
    });
    return new Response('OK');
  }

  // Crear sesión de respuesta
  const session = await db.surveySessions.create({
    data: {
      surveyId: survey.id,
      tenantId: survey.tenantId,
      phoneNumber: from,
      status: 'active',
      currentQuestionIndex: 0
    }
  });

  // Iniciar state machine
  const stateMachine = new SurveyStateMachine(session, survey);
  await stateMachine.sendQuestion(0); // Primera pregunta

  return new Response('OK');
}
```

### State Machine para Conversación
```typescript
// survey-state-machine.ts
export class SurveyStateMachine {
  constructor(
    private session: SurveySession,
    private survey: Survey
  ) {}

  async sendQuestion(index: number) {
    const question = this.survey.questions[index];

    // Construir mensaje según tipo de pregunta
    let message = question.text;
    let buttons = [];

    switch (question.type) {
      case 'multiple_choice':
        buttons = question.options.map((opt, i) => ({
          id: `${this.session.id}_${index}_${i}`,
          title: opt
        }));
        break;

      case 'rating':
        buttons = [1,2,3,4,5].map(num => ({
          id: `${this.session.id}_${index}_${num}`,
          title: '⭐'.repeat(num)
        }));
        break;

      case 'open_text':
        // Sin botones, esperar texto libre
        break;
    }

    // Enviar via WhatsApp API
    await whatsapp.sendInteractiveMessage({
      to: this.session.phoneNumber,
      type: 'button',
      body: { text: message },
      action: { buttons }
    });

    // Actualizar sesión
    await db.surveySessions.update({
      where: { id: this.session.id },
      data: { currentQuestionIndex: index }
    });
  }

  async handleResponse(answer: string) {
    const currentIndex = this.session.currentQuestionIndex;

    // Guardar respuesta
    await db.surveyResponses.create({
      data: {
        sessionId: this.session.id,
        questionId: this.survey.questions[currentIndex].id,
        answer: answer,
        timestamp: new Date()
      }
    });

    // Logic jumps (si hay)
    const nextIndex = this.calculateNextQuestion(currentIndex, answer);

    if (nextIndex >= this.survey.questions.length) {
      // Encuesta terminada
      await this.finishSurvey();
    } else {
      // Siguiente pregunta
      await this.sendQuestion(nextIndex);
    }
  }

  async finishSurvey() {
    const tenant = await db.tenants.findUnique({
      where: { id: this.survey.tenantId }
    });

    let finalMessage = "✅ ¡Gracias por tus respuestas!";

    // Branding según plan
    if (tenant.plan === 'free' || tenant.plan === 'starter') {
      finalMessage += "\n\n💬 Powered by ChatForm\n👉 chatform.app";
    }

    await whatsapp.sendMessage({
      to: this.session.phoneNumber,
      body: finalMessage
    });

    // Actualizar sesión
    await db.surveySessions.update({
      where: { id: this.session.id },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    // Trigger webhook si configurado
    if (tenant.webhookUrl) {
      await fetch(tenant.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'survey.completed',
          survey_id: this.survey.id,
          session_id: this.session.id,
          phone: this.session.phoneNumber,
          responses: await this.getResponses()
        })
      });
    }
  }
}
```

### Link Generation Service
```typescript
// lib/link-generator.ts
export async function generateSurveyLink(surveyId: string, options?: {
  personalized?: boolean;
  userId?: string;
  variables?: Record<string, string>;
}) {
  const survey = await db.surveys.findUnique({
    where: { id: surveyId }
  });

  // Short code único
  let shortCode = survey.shortCode;

  // Si es personalizado, agregar user_id
  if (options?.personalized && options.userId) {
    shortCode = `${shortCode}-${options.userId}`;
  }

  // Mensaje inicial con variables
  let initialMessage = `START_${shortCode}`;
  if (options?.variables) {
    initialMessage += ` ${JSON.stringify(options.variables)}`;
  }

  // wa.me link
  const waLink = `https://wa.me/${CHATFORM_WHATSAPP_NUMBER}?text=${encodeURIComponent(initialMessage)}`;

  // Short link
  const shortLink = await createShortLink({
    destination: waLink,
    slug: shortCode,
    domain: 'chatform.app'
  });

  return {
    shortLink: `https://chatform.app/s/${shortCode}`,
    whatsappLink: waLink,
    qrCode: await generateQR(shortLink)
  };
}
```

---

## 📊 Comparación con Typeform

| Feature | Typeform | ChatForm |
|---------|----------|----------|
| **Canal primario** | Web form | WhatsApp chat |
| **Distribución** | Link/Embed | Link/QR → WhatsApp |
| **Completion rate** | 40-50% | 70-80% (WhatsApp) |
| **Mobile UX** | OK | Nativo (WhatsApp) |
| **Notifications** | Email | WhatsApp (en tiempo real) |
| **Setup técnico** | Zero | Zero |
| **Delivery automatizado** | Embed/Webhook | wa.me link/Webhook |
| **Conversacional** | Simulado | Real (chat) |
| **Viralidad built-in** | ❌ | ✅ (branding en free) |

**Nuestra ventaja:** La conversación está en la app que la gente YA usa 10hrs/día (WhatsApp).

---

## ✅ Validación del Modelo

### ¿Cumple políticas de Meta? ✅
- Sí. Usuario inicia conversación via wa.me link
- Opt-in implícito al hacer click
- No mandamos mensajes proactivos sin permiso

### ¿Es técnicamente viable? ✅
- Sí. WhatsApp Business API soporta webhooks
- Routing por mensaje inicial es estándar
- Similar a lo que hacen Landbot, ManyChat

### ¿Escala? ✅
- MVP: 1 número puede manejar miles de conversaciones concurrentes
- Escala: Pool de números + load balancing
- Enterprise: BYOA para clientes grandes

### ¿Monetizable? ✅
- Free con branding = growth loop
- Upgrade para remover branding
- Add-ons por volumen
- Enterprise para grandes

---

## 🎯 Roadmap de Implementación

### Fase 1: MVP (2-3 semanas)
```
Week 1:
✅ Aplicar a WhatsApp Business API (Meta)
✅ Setup webhook endpoint
✅ Implementar state machine básico
✅ Link generator service
✅ QR code generator

Week 2:
✅ Dashboard: crear encuesta
✅ Survey builder (preguntas básicas)
✅ Live responses dashboard
✅ CSV export

Week 3:
✅ Testing end-to-end
✅ Template approval para mensajes estándar
✅ Branding en free tier
✅ Onboarding flow
```

**Deliverables:**
- Usuario puede crear encuesta
- Obtiene link chatform.app/s/abc123
- Comparte link → Gente responde por WhatsApp
- Ve respuestas en tiempo real
- Exporta CSV

### Fase 2: Growth (1-2 meses después)
```
✅ Webhook API para developers
✅ Embed widget para web
✅ CSV bulk upload + links personalizados
✅ Logic jumps (saltos condicionales)
✅ Custom branding (Pro)
✅ Analytics avanzado
✅ Integraciones: Zapier, Make
```

### Fase 3: Scale (3-6 meses después)
```
✅ Pool de números (load balancing)
✅ BYOA para Enterprise
✅ Template message sending (proactivo)
✅ Multi-language
✅ AI-powered insights
✅ WhatsApp Flows (nueva API de Meta)
```

---

## 🤔 Preguntas Abiertas para Decidir

### 1. ¿Usamos 1 número o pool desde MVP?
**Opción A:** 1 número (más simple)
**Opción B:** 3-5 números (más robusto)
**Recomendación:** Empezar con 1, agregar pool cuando tengamos 1000+ clientes activos

### 2. ¿Aplicamos a WhatsApp API ahora o usamos proveedor?
**Opción A:** Directo con Meta (más control, más barato, toma 1-2 semanas)
**Opción B:** Via Twilio/MessageBird (más rápido, más caro)
**Recomendación:** Directo con Meta para tener control de costos a largo plazo

### 3. ¿MVP incluye embed widget o solo links?
**Opción A:** Solo wa.me links (más simple)
**Opción B:** Links + Embed (más completo)
**Recomendación:** Solo links en MVP, embed en Fase 2

### 4. ¿Cómo manejamos spam/abuse en free tier?
**Soluciones:**
- Rate limit: Max 10 respuestas/hora por número
- CAPTCHA en web si detectamos bot
- Blacklist de números reportados
- Review manual de cuentas con alto volumen

---

## 🎬 Próximos Pasos Inmediatos

1. **Aplicar a WhatsApp Business API** (2-3 días de setup, 1-2 semanas aprobación)
2. **Diseñar database schema** para surveys, sessions, responses
3. **Implementar webhook handler** básico
4. **Crear state machine** para flow conversacional
5. **Dashboard MVP** para crear encuestas
6. **Link generator** con QR codes

**¿Estás listo para empezar con la arquitectura técnica o quieres refinar algo más del modelo de delivery?**
