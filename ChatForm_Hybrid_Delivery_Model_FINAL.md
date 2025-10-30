# ChatForm - Modelo Híbrido de Delivery (FINAL)
## Links Gratis Ilimitados + Envíos Automáticos Limitados + Webhooks Premium

**Última actualización:** 29 Oct 2025
**Estado:** DEFINICIÓN FINAL DEL MODELO

---

## 🎯 El Insight Clave

**No es "esto O esto" - es "esto Y esto"**

Los usuarios necesitan **flexibilidad**:
- Links: Gratis, ilimitados, ellos distribuyen como quieran
- Envíos automáticos: Limitados, para casos específicos
- Webhooks: Solo power users, integración avanzada

---

## 📊 Matriz de Features por Plan

### Delivery Methods

| Feature | Free | Starter | Pro | Enterprise |
|---------|------|---------|-----|------------|
| **Link sharing** | ✅ Ilimitado | ✅ Ilimitado | ✅ Ilimitado | ✅ Ilimitado |
| **QR codes** | ✅ Ilimitado | ✅ Ilimitado | ✅ Ilimitado | ✅ Ilimitado |
| **Envíos automáticos** | ❌ 0/mes | ✅ 100/mes | ✅ 500/mes | ✅ 2,000/mes |
| **CSV upload** | ❌ | ✅ | ✅ | ✅ |
| **Webhooks** | ❌ | ❌ | ✅ 3 endpoints | ✅ Ilimitado |
| **API access** | ❌ | ❌ | ✅ | ✅ |

### Response Limits

| | Free | Starter | Pro | Enterprise |
|-|------|---------|-----|------------|
| **Respuestas totales/mes** | 50 | 500 | 2,000 | Ilimitado |
| **Encuestas activas** | 1 | 3 | Ilimitado | Ilimitado |

**Aclaración:** Las respuestas TOTALES cuentan AMBOS métodos:
- Respuestas via links (gratis, ilimitados)
- Respuestas via envíos automáticos (limitados por plan)

**Ejemplo Starter:**
- Cliente puede compartir link ilimitadamente
- Pero solo puede hacer 100 envíos automáticos/mes
- Total de respuestas recolectadas: máximo 500/mes

---

## 🚀 Casos de Uso por Método

### Método 1: Link Sharing (SIEMPRE gratis e ilimitado)

**Cómo funciona:**
```
1. Cliente crea encuesta
2. Obtiene link: chatform.app/s/abc123
3. Cliente distribuye link donde quiera:
   - Instagram bio
   - Email marketing (Mailchimp)
   - SMS manual
   - Facebook post
   - WhatsApp Status
   - Impreso en flyer

4. Usuario hace click → Abre WhatsApp → Conversación
```

**Costos para nosotros:**
- Link generation: $0
- QR generation: $0.001 MXN (una vez)
- Conversación WhatsApp: $0 (user-initiated)
- **TOTAL: $0**

**Por qué ilimitado:**
- No nos cuesta nada
- Genera viralidad
- Cliente hace el trabajo de distribución
- Typeform hace esto (tenemos que igualarlo)

**Casos de uso:**
- Restaurante: QR en mesa
- Instagram: Link en bio
- Email blast: Boton en firma
- Evento: QR en badge
- Web: Botón "Déjanos tu opinión"

---

### Método 2: Envío Automático (Limitado por plan)

**Cómo funciona:**
```
1. Cliente sube CSV con números
2. Cliente programa: "Enviar ahora" o "Enviar el [fecha] a las [hora]"
3. ChatForm valida números (formato, no blacklist)
4. ChatForm manda template aprobado via WhatsApp API
5. Usuario recibe mensaje directo en su WhatsApp
6. Si responde, inicia conversación
```

**Costos para nosotros:**
- Template message: $0.19 MXN por envío
- Conversación: $0 (user-initiated después de template)
- **TOTAL: $0.19 MXN por envío**

**Por qué limitado:**
- SÍ nos cuesta dinero
- Incluimos cantidad razonable en plan
- Cliente puede comprar más si necesita

**Casos de uso:**
- E-commerce: Auto-envío post-compra (100 órdenes/mes)
- Restaurante: VIP list (50 mejores clientes)
- Clínica: Post-cita (200 pacientes/mes)
- Agencia: Campañas NPS para clientes

**Restricciones importantes:**
- Requiere opt-in previo del usuario
- Template debe estar aprobado por Meta
- Rate limit: Max 500 envíos/hora (evitar spam flags)
- Blacklist automática si usuario reporta

---

### Método 3: Webhooks (Solo Pro y Enterprise)

**Cómo funciona:**
```
1. Cliente configura webhook endpoint en su app
2. Evento sucede en sistema del cliente:
   - Shopify: Orden completada
   - Calendly: Cita terminada
   - Stripe: Pago recibido

3. Sistema manda webhook a ChatForm:
   POST https://api.chatform.com/v1/surveys/abc123/trigger
   {
     "phone": "+5215512345678",
     "variables": {
       "name": "Juan",
       "order_id": "12345"
     }
   }

4. ChatForm decide cómo enviar:
   - Si cliente tiene créditos de envío → Template automático
   - Si no tiene créditos → Genera link personalizado y lo retorna
     (cliente lo manda por su canal)
```

**Respuesta de API:**
```json
// Si tiene créditos:
{
  "status": "sent",
  "delivery_method": "template",
  "message_id": "wamid.abc123",
  "credits_remaining": 99
}

// Si no tiene créditos:
{
  "status": "pending",
  "delivery_method": "link",
  "personalized_link": "chatform.app/s/abc123-juan-12345",
  "credits_remaining": 0
}
```

**Costos para nosotros:**
- API call processing: $0.0001 USD
- Envío (si tiene créditos): $0.19 MXN
- Link generation (si no tiene): $0

**Por qué solo Pro+:**
- Feature avanzado, power users
- Requiere knowledge técnico
- Justifica upgrade a Pro ($59)
- Menor volumen de usuarios = menos soporte

**Casos de uso:**
- SaaS: Trigger survey after user reaches milestone
- E-commerce: NPS 7 días post-delivery
- CRM: Survey after deal closes
- Helpdesk: CSAT after ticket resolved

---

## 💰 Pricing y Limits Detallados

### Free: $0/mes

**Respuestas:**
- 50 respuestas totales/mes
- 1 encuesta activa

**Delivery:**
- ✅ Links ilimitados + QR codes
- ❌ 0 envíos automáticos
- ❌ 0 webhooks
- ❌ CSV upload

**Analytics:**
- Dashboard básico
- Exportar: ❌

**Branding:**
- "Powered by ChatForm" en todas las respuestas

**COGS:** $0.003/mes
**Margin:** Marketing investment (viralidad)

---

### Starter: $29 USD/mes ($580 MXN)

**Respuestas:**
- 500 respuestas totales/mes
- 3 encuestas activas

**Delivery:**
- ✅ Links ilimitados + QR codes
- ✅ **100 envíos automáticos/mes**
- ✅ CSV upload (batch send)
- ❌ 0 webhooks

**Analytics:**
- Dashboard avanzado
- Exportar CSV: ✅
- AI insights: ❌

**Branding:**
- Sin branding ✅

**Add-ons:**
- +100 envíos: $10 USD
- +500 envíos: $40 USD

**COGS:**
```
Stripe: $29 MXN
Hosting: $0.60 MXN
WhatsApp: 100 × $0.19 = $19 MXN
AI: $0
---
TOTAL: $48.60 MXN
```

**Margin:** $531.40 MXN (91.6%)
**Profit USD:** $26.57/mes

---

### Pro: $59 USD/mes ($1,180 MXN)

**Respuestas:**
- 2,000 respuestas totales/mes
- Encuestas ilimitadas

**Delivery:**
- ✅ Links ilimitados + QR codes
- ✅ **500 envíos automáticos/mes**
- ✅ CSV upload (batch send)
- ✅ **3 webhooks configurables**
- ✅ API access (REST)

**Analytics:**
- Dashboard avanzado
- Exportar CSV: ✅
- **AI insights ilimitados** ✅
- Sentiment analysis
- Auto-tagging

**Automation:**
- Logic jumps (saltos condicionales)
- Follow-up automático
- Scheduled sends

**Branding:**
- Sin branding ✅

**Add-ons:**
- +100 envíos: $10 USD
- +500 envíos: $40 USD
- +1,000 envíos: $70 USD

**COGS:**
```
Stripe: $59 MXN
Hosting: $0.27 MXN
WhatsApp: 500 × $0.19 = $95 MXN
AI: $2.50 MXN
---
TOTAL: $156.77 MXN
```

**Margin:** $1,023.23 MXN (86.7%)
**Profit USD:** $51.16/mes

---

### Enterprise: $299 USD/mes ($5,980 MXN)

**Respuestas:**
- Ilimitadas
- Encuestas ilimitadas

**Delivery:**
- ✅ Links ilimitados + QR codes
- ✅ **2,000 envíos automáticos/mes**
- ✅ CSV upload (batch send)
- ✅ **Webhooks ilimitados**
- ✅ API access (REST + GraphQL)
- ✅ **BYOA option** (Bring Your Own WhatsApp Account)

**Analytics:**
- Todo de Pro
- Custom dashboards
- White-label
- Exportar a Google Sheets, Notion, etc.

**Enterprise Features:**
- SSO / SAML
- Custom domain (surveys.tuempresa.com)
- SLA 99.9%
- Dedicated account manager
- Priority support (chat + calls)
- Custom onboarding

**Branding:**
- White-label completo ✅

**Add-ons:**
- +5,000 envíos: $150 USD
- +10,000 envíos: $250 USD

**COGS:**
```
Stripe: $299 MXN
Hosting dedicated: $120 MXN
WhatsApp: 2,000 × $0.19 = $380 MXN
AI: $50 MXN
Support dedicado: $200 MXN
---
TOTAL: $1,049 MXN
```

**Margin:** $4,931 MXN (82.5%)
**Profit USD:** $246.55/mes

---

## 🎛️ Flujo de Decisión para Delivery

### Cuando cliente crea encuesta:

```
┌─────────────────────────────────────┐
│ Cliente crea encuesta en dashboard  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ ChatForm genera:                    │
│ 1. Link corto: chatform.app/s/abc  │
│ 2. QR code (PNG + SVG)              │
│ 3. wa.me link directo               │
│ 4. Embed code (iframe)              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Cliente elige método de distribución│
└──────────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────┐    ┌─────────────┐
│ MANUAL   │    │ AUTOMÁTICO  │
└────┬─────┘    └──────┬──────┘
     │                 │
     ▼                 ▼
Share link      ┌──────────────┐
anywhere        │ CSV upload   │
(GRATIS)        │ o Webhook    │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Verificar    │
                │ créditos     │
                └──────┬───────┘
                       │
              ┌────────┴────────┐
              │                 │
         Tiene créditos    Sin créditos
              │                 │
              ▼                 ▼
      Envía template     Genera link
      (-1 crédito)       personalizado
      $0.19 MXN          (cliente lo
                         manda manual)
```

---

## 🔧 Implementación Técnica

### 1. Sistema de Créditos

```typescript
// database schema
table survey_credits {
  tenant_id: uuid
  plan: enum('free', 'starter', 'pro', 'enterprise')

  credits_included: integer // por plan
  credits_used: integer // este mes
  credits_addon: integer // comprados extra
  credits_available: integer // computed: included + addon - used

  reset_at: timestamp // primer día del mes
  created_at: timestamp
  updated_at: timestamp
}

// Lógica de envío
async function sendSurvey(params: {
  surveyId: string;
  phoneNumber: string;
  method: 'automatic' | 'link';
}) {
  const tenant = await getTenant(params.surveyId);
  const credits = await getCredits(tenant.id);

  if (params.method === 'automatic') {
    if (credits.credits_available <= 0) {
      throw new Error('No credits available');
    }

    // Enviar template
    await whatsapp.sendTemplate({
      to: params.phoneNumber,
      template: tenant.approvedTemplate,
      variables: { survey_url: params.surveyId }
    });

    // Decrementar crédito
    await decrementCredit(tenant.id);

    return {
      status: 'sent',
      method: 'automatic',
      credits_remaining: credits.credits_available - 1
    };
  } else {
    // Generar link personalizado (gratis)
    const link = await generatePersonalizedLink(params);

    return {
      status: 'link_generated',
      method: 'link',
      link: link,
      credits_remaining: credits.credits_available
    };
  }
}
```

### 2. CSV Upload Flow

```typescript
// Frontend: CSV upload component
<CSVUploader
  onUpload={async (rows) => {
    // Validar formato
    const validated = validatePhoneNumbers(rows);

    // Mostrar preview
    setPreview({
      valid: validated.valid,
      invalid: validated.invalid,
      total: rows.length
    });

    // Verificar créditos
    const credits = await checkCredits();

    if (credits.available < validated.valid.length) {
      showWarning(`Solo tienes ${credits.available} créditos.
                   ${validated.valid.length - credits.available} envíos no se procesarán.`);
    }

    // Confirmar envío
    if (confirm) {
      await batchSendSurveys(validated.valid);
    }
  }}
/>

// Backend: Batch processing
async function batchSendSurveys(
  surveyId: string,
  phoneNumbers: string[]
) {
  const tenant = await getTenant(surveyId);
  const credits = await getCredits(tenant.id);

  // Rate limiting: max 500/hora para evitar ban de Meta
  const rateLimiter = new RateLimiter({
    maxRequests: 500,
    perHours: 1
  });

  const results = [];

  for (const phone of phoneNumbers) {
    // Verificar créditos
    if (credits.credits_available <= 0) {
      results.push({
        phone,
        status: 'skipped',
        reason: 'no_credits'
      });
      continue;
    }

    // Rate limit
    await rateLimiter.wait();

    try {
      await sendSurvey({
        surveyId,
        phoneNumber: phone,
        method: 'automatic'
      });

      results.push({
        phone,
        status: 'sent'
      });

      credits.credits_available--;
    } catch (error) {
      results.push({
        phone,
        status: 'failed',
        error: error.message
      });
    }
  }

  return results;
}
```

### 3. Webhook Implementation

```typescript
// API endpoint para configurar webhook
POST /api/v1/webhooks
{
  "survey_id": "abc123",
  "url": "https://customer-app.com/chatform-webhook",
  "secret": "webhook_secret_xyz",
  "events": ["survey.completed", "survey.response"]
}

// API endpoint para trigger desde webhook externo
POST /api/v1/surveys/:surveyId/trigger
Headers: { Authorization: "Bearer sk_live_..." }
Body: {
  "phone": "+5215512345678",
  "variables": {
    "customer_name": "Juan",
    "order_id": "12345",
    "product": "Laptop"
  },
  "delivery_preference": "automatic" // o "link"
}

Response:
{
  "status": "sent" | "link_generated",
  "delivery_method": "automatic" | "link",
  "message_id": "wamid.abc123" | null,
  "personalized_link": null | "chatform.app/s/abc123-juan",
  "credits_remaining": 99
}

// Validación de webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hash)
  );
}
```

---

## 📊 Comparación de Métodos

| | Link Manual | Envío Automático | Webhook |
|---|-------------|------------------|---------|
| **Costo** | $0 | $0.19 MXN/envío | $0.19 MXN/envío |
| **Setup** | Inmediato | CSV upload | Requiere dev |
| **Distribución** | Cliente | ChatForm | Automatizado |
| **Open rate** | Variable | 60-70% | 60-70% |
| **Completion rate** | 40-50% | 50-60% | 50-60% |
| **Use case** | Viral, público | Targeted, VIP | Integration |
| **Disponible en** | Todos | Starter+ | Pro+ |

---

## 🎯 Estrategia de Upsell

### De Free → Starter ($29/mes)

**Trigger:** Usuario alcanza límite de 50 respuestas

**Pitch:**
```
"🎉 ¡Felicidades! Llegaste a 50 respuestas.

Upgradeando a Starter obtienes:
✅ 500 respuestas/mes (10x más)
✅ 100 envíos automáticos (sube CSV, nosotros enviamos)
✅ 3 encuestas activas
✅ Sin branding ChatForm
✅ Exportar a CSV

Solo $29/mes. Upgrade ahora →"
```

### De Starter → Pro ($59/mes)

**Triggers:**
1. Usuario alcanza 500 respuestas
2. Usuario usa 100 envíos automáticos
3. Usuario pregunta por webhooks/API

**Pitch:**
```
"📈 Tu negocio está creciendo!

Con Pro obtienes:
✅ 2,000 respuestas/mes (4x más)
✅ 500 envíos automáticos (5x más)
✅ AI Insights - Análisis automático de sentimiento
✅ Webhooks - Integra con Shopify, Calendly, etc.
✅ API access
✅ Logic jumps

Solo $30 más/mes. Upgrade →"
```

### De Pro → Enterprise ($299/mes)

**Triggers:**
1. Usuario >1,500 respuestas/mes consistentemente
2. Usuario pregunta por white-label
3. Usuario necesita >500 envíos/mes

**Pitch:**
```
"🚀 Tiempo de Enterprise

Tu volumen justifica plan dedicado:
✅ Respuestas ilimitadas
✅ 2,000 envíos automáticos
✅ White-label completo (tu marca)
✅ Custom domain
✅ Account manager dedicado
✅ SLA 99.9%
✅ Opción BYOA (usa tu WhatsApp Business API)

Hablemos. Agenda llamada →"
```

---

## 🔐 Compliance y Políticas

### Opt-in Requirements

**Para envíos automáticos:**

Cliente debe certificar que:
1. ✅ Tiene relación comercial con los destinatarios
2. ✅ Destinatarios han dado opt-in para recibir mensajes
3. ✅ Incluirá opción de opt-out clara

**Template debe incluir:**
```
"{{business_name}} te invita a compartir tu opinión sobre tu experiencia.

[Responder encuesta]

Responde STOP para no recibir más mensajes."
```

**Disclaimer en dashboard:**
```
⚠️ Solo envía encuestas a clientes que:
• Compraron / usaron tu servicio
• Te dieron su número voluntariamente
• Aceptaron recibir mensajes tuyos

Violar políticas de spam puede resultar en suspensión de cuenta.
```

### Blacklist automática

```typescript
// Si usuario responde "STOP"
async function handleStopMessage(phone: string) {
  // Agregar a blacklist global
  await db.blacklist.create({
    phone_number: phone,
    reason: 'user_requested',
    created_at: new Date()
  });

  // Confirmar
  await whatsapp.sendMessage({
    to: phone,
    body: "✅ No recibirás más mensajes de ChatForm. Gracias."
  });

  // Notificar a todos los tenants que tienen este número
  const tenants = await db.survey_responses.findMany({
    where: { phone_number: phone },
    select: { tenant_id: true }
  });

  for (const tenant of tenants) {
    await notifyTenant(tenant.tenant_id, {
      type: 'phone_blacklisted',
      phone: phone
    });
  }
}

// Verificar blacklist antes de enviar
async function canSendToPhone(phone: string): Promise<boolean> {
  const blacklisted = await db.blacklist.findFirst({
    where: { phone_number: phone }
  });

  return !blacklisted;
}
```

---

## ✅ Resumen Final

### Modelo Híbrido Definitivo:

| Plan | Precio | Links | Envíos Auto | Webhooks | Margin |
|------|--------|-------|-------------|----------|--------|
| **Free** | $0 | ✅ ∞ | ❌ 0 | ❌ | Marketing |
| **Starter** | $29/mes | ✅ ∞ | ✅ 100 | ❌ | **91.6%** |
| **Pro** | $59/mes | ✅ ∞ | ✅ 500 | ✅ 3 | **86.7%** |
| **Enterprise** | $299/mes | ✅ ∞ | ✅ 2K | ✅ ∞ | **82.5%** |

### Ventajas del Modelo:

1. ✅ **Flexibilidad total** - Cliente elige método según caso
2. ✅ **Links gratis** - Compite con Typeform en igual de condiciones
3. ✅ **Envíos automáticos** - Diferenciador clave
4. ✅ **Webhooks Pro+** - Monetiza power users
5. ✅ **Margins excelentes** - 82-92% en todos los planes
6. ✅ **Upsell claro** - Path natural Free → Starter → Pro → Enterprise

### Pitch Final:

> **"Crea encuestas que tus clientes realmente completan.**
>
> Comparte links gratis donde quieras.
> O sube tu lista y nosotros enviamos directo a WhatsApp.
> Tu eliges cómo distribuir. Nosotros nos encargamos del resto."

---

## 🚀 Próximos Pasos

1. ✅ Definición del modelo → **COMPLETO**
2. ⏭️ Aplicar a WhatsApp Business API
3. ⏭️ Diseñar templates aprobables
4. ⏭️ Implementar sistema de créditos
5. ⏭️ CSV upload + batch sending
6. ⏭️ Webhook infrastructure
7. ⏭️ Dashboard de analytics
8. ⏭️ Onboarding flow

**Modelo validado y listo para implementar** 🎯
