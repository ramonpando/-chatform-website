# ChatForm API Specification v1.0
**Última actualización:** 30 Oct 2025
**Status:** Draft → Para implementación inmediata

---

## 🎯 **Filosofía del API**

ChatForm API permite a developers:
1. **Crear y gestionar encuestas programáticamente**
2. **Trigger encuestas desde sus apps** (Shopify, Calendly, CRM, etc)
3. **Recibir respuestas en tiempo real via webhooks**
4. **Obtener analytics y insights**

**Casos de uso principales:**
- E-commerce: Encuesta post-compra automática
- SaaS: NPS después de milestone
- CRM: CSAT después de cerrar deal
- Helpdesk: Feedback post-ticket

---

## 🔐 **Autenticación**

### **API Keys**

Cada tenant tiene API keys en Settings → API:

```
Secret Key (server-side): sk_live_abc123xyz...
Public Key (client-side): pk_live_def456uvw...
```

**Headers requeridos:**
```http
Authorization: Bearer sk_live_abc123xyz...
Content-Type: application/json
```

**Rate Limits:**
- Free: 100 requests/hora
- Starter: 1,000 requests/hora
- Pro: 10,000 requests/hora
- Enterprise: Sin límite

---

## 📡 **Endpoints del API**

### **1. Surveys** (Gestión de Encuestas)

#### `GET /api/v1/surveys`
Listar todas las encuestas del tenant

**Request:**
```http
GET /api/v1/surveys
Authorization: Bearer sk_live_abc123
```

**Query Parameters:**
```
?status=active          # Filter: active, draft, archived
?limit=10              # Pagination
?offset=0              # Pagination
?sort=created_at       # Sort: created_at, updated_at, title
?order=desc            # asc o desc
```

**Response:**
```json
{
  "surveys": [
    {
      "id": "surv_abc123",
      "title": "Post-Purchase Feedback",
      "description": "Customer satisfaction survey",
      "status": "active",
      "shortCode": "x7k2m9",
      "publicUrl": "https://chatform.mx/s/x7k2m9",
      "questionCount": 5,
      "responseCount": 342,
      "createdAt": "2025-10-15T10:30:00Z",
      "updatedAt": "2025-10-20T14:25:00Z"
    }
  ],
  "meta": {
    "total": 15,
    "limit": 10,
    "offset": 0
  }
}
```

---

#### `POST /api/v1/surveys`
Crear nueva encuesta

**Request:**
```json
{
  "title": "NPS Survey Q4",
  "description": "Quarterly NPS measurement",
  "welcomeMessage": "¡Hola! Nos gustaría conocer tu opinión",
  "thankYouMessage": "¡Gracias por tu tiempo!",
  "questions": [
    {
      "type": "rating",
      "text": "¿Qué tan probable es que recomiendes nuestro servicio?",
      "required": true,
      "options": {
        "min": 0,
        "max": 10,
        "minLabel": "Nada probable",
        "maxLabel": "Muy probable"
      }
    },
    {
      "type": "open_text",
      "text": "¿Por qué diste ese score?",
      "required": false
    },
    {
      "type": "multiple_choice",
      "text": "¿Cuál feature te gusta más?",
      "required": true,
      "options": {
        "choices": ["Dashboard", "Reports", "API", "Mobile App"]
      }
    }
  ],
  "settings": {
    "allowMultipleResponses": false,
    "requireEmail": false,
    "autoPublish": true
  }
}
```

**Response:**
```json
{
  "survey": {
    "id": "surv_new123",
    "title": "NPS Survey Q4",
    "status": "active",
    "shortCode": "nps2025",
    "publicUrl": "https://chatform.mx/s/nps2025",
    "waLink": "https://wa.me/5215512345678?text=START_nps2025",
    "qrCodeUrl": "https://chatform.mx/qr/nps2025.png",
    "createdAt": "2025-10-30T15:00:00Z"
  }
}
```

---

#### `GET /api/v1/surveys/:id`
Obtener encuesta específica con detalles completos

**Response:**
```json
{
  "survey": {
    "id": "surv_abc123",
    "title": "Post-Purchase Feedback",
    "description": "Customer satisfaction survey",
    "status": "active",
    "shortCode": "x7k2m9",
    "publicUrl": "https://chatform.mx/s/x7k2m9",
    "waLink": "https://wa.me/5215512345678?text=START_x7k2m9",
    "qrCodeUrl": "https://chatform.mx/qr/x7k2m9.png",
    "welcomeMessage": "¡Hola! Gracias por tu compra",
    "thankYouMessage": "¡Gracias por tu feedback!",
    "questions": [
      {
        "id": "q_1",
        "type": "rating",
        "text": "¿Cómo calificas tu experiencia?",
        "required": true,
        "order": 0,
        "options": { "min": 1, "max": 5 }
      }
    ],
    "stats": {
      "totalResponses": 342,
      "completionRate": 78.5,
      "avgCompletionTime": 145,
      "lastResponseAt": "2025-10-30T14:30:00Z"
    },
    "createdAt": "2025-10-15T10:30:00Z",
    "updatedAt": "2025-10-20T14:25:00Z"
  }
}
```

---

#### `PUT /api/v1/surveys/:id`
Actualizar encuesta existente

**Request:**
```json
{
  "title": "Updated Title",
  "status": "paused",
  "questions": [...]
}
```

**Response:**
```json
{
  "survey": { ... },
  "message": "Survey updated successfully"
}
```

---

#### `DELETE /api/v1/surveys/:id`
Eliminar encuesta

**Response:**
```json
{
  "success": true,
  "message": "Survey deleted successfully"
}
```

---

### **2. Trigger** (Enviar Encuestas)

#### `POST /api/v1/surveys/:id/trigger`
**⭐ ENDPOINT ESTRELLA - Trigger encuesta desde tu app**

Este es el endpoint que hace ChatForm único. Integra con cualquier plataforma.

**Request:**
```json
{
  "recipient": {
    "phone": "+5215512345678",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "variables": {
    "customer_name": "Juan",
    "order_id": "ORD-12345",
    "product_name": "Laptop Pro",
    "purchase_date": "2025-10-28"
  },
  "deliveryMethod": "automatic",
  "metadata": {
    "source": "shopify",
    "campaign": "post-purchase-q4"
  }
}
```

**Parameters:**
- `recipient.phone` (required): WhatsApp number in E.164 format (+52...)
- `recipient.name` (optional): Para personalizar mensajes
- `recipient.email` (optional): Para follow-ups
- `variables` (optional): Variables para interpolar en preguntas/mensajes
- `deliveryMethod` (optional): `automatic` (usa créditos) o `link` (genera link personalizado)
- `metadata` (optional): Custom data para tracking

**Response si `deliveryMethod: "automatic"`:**
```json
{
  "status": "sent",
  "deliveryMethod": "automatic",
  "messageId": "wamid_abc123xyz",
  "recipient": "+5215512345678",
  "creditsUsed": 1,
  "creditsRemaining": 99,
  "sessionId": "sess_def456",
  "estimatedDeliveryTime": "2025-10-30T15:01:00Z"
}
```

**Response si `deliveryMethod: "link"` o sin créditos:**
```json
{
  "status": "link_generated",
  "deliveryMethod": "link",
  "personalizedLink": "https://chatform.mx/s/x7k2m9?name=Juan&oid=12345",
  "waLink": "https://wa.me/5215512345678?text=Hola%20Juan,%20completa%20tu%20encuesta:%20chatform.mx/s/x7k2m9?name=Juan",
  "qrCodeUrl": "https://chatform.mx/qr/x7k2m9-juan.png",
  "creditsRemaining": 0,
  "message": "No credits available, link generated instead"
}
```

**Errores:**
```json
// 400 Bad Request
{
  "error": "invalid_phone",
  "message": "Phone number must be in E.164 format (+52...)"
}

// 403 Forbidden
{
  "error": "phone_blacklisted",
  "message": "Recipient has opted out of surveys"
}

// 429 Too Many Requests
{
  "error": "rate_limit_exceeded",
  "message": "You can send max 500 surveys/hour. Try again in 15 minutes.",
  "retryAfter": 900
}
```

---

#### `POST /api/v1/surveys/:id/trigger/batch`
Enviar a múltiples destinatarios (alternativa a CSV upload)

**Request:**
```json
{
  "recipients": [
    {
      "phone": "+5215512345678",
      "name": "Juan Pérez",
      "variables": { "order_id": "ORD-001" }
    },
    {
      "phone": "+5215587654321",
      "name": "María López",
      "variables": { "order_id": "ORD-002" }
    }
  ],
  "deliveryMethod": "automatic",
  "metadata": {
    "campaign": "black-friday-2025"
  }
}
```

**Response:**
```json
{
  "batchId": "batch_xyz789",
  "status": "processing",
  "totalRecipients": 2,
  "estimatedCompletionTime": "2025-10-30T15:05:00Z",
  "creditsUsed": 2,
  "creditsRemaining": 98
}
```

---

### **3. Responses** (Obtener Respuestas)

#### `GET /api/v1/surveys/:id/responses`
Obtener respuestas de una encuesta

**Query Parameters:**
```
?status=completed       # completed, abandoned, in_progress
?startDate=2025-10-01  # Filter by date range
?endDate=2025-10-31
?limit=50
?offset=0
?includeMetadata=true  # Include AI insights
```

**Response:**
```json
{
  "responses": [
    {
      "id": "resp_abc123",
      "sessionId": "sess_def456",
      "surveyId": "surv_abc123",
      "recipient": {
        "phone": "+5215512345678",
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      "status": "completed",
      "answers": [
        {
          "questionId": "q_1",
          "questionText": "¿Cómo calificas tu experiencia?",
          "questionType": "rating",
          "answer": 9,
          "answeredAt": "2025-10-30T15:02:30Z"
        },
        {
          "questionId": "q_2",
          "questionText": "¿Por qué diste ese score?",
          "questionType": "open_text",
          "answer": "Excelente servicio y producto de calidad",
          "answeredAt": "2025-10-30T15:03:15Z"
        }
      ],
      "metadata": {
        "source": "shopify",
        "campaign": "post-purchase-q4",
        "order_id": "ORD-12345"
      },
      "aiInsights": {
        "sentiment": "positive",
        "sentimentScore": 0.85,
        "npsCategory": "promoter",
        "topics": ["product_quality", "customer_service"],
        "summary": "Cliente muy satisfecho con producto y atención"
      },
      "startedAt": "2025-10-30T15:02:00Z",
      "completedAt": "2025-10-30T15:03:30Z",
      "completionTime": 90,
      "createdAt": "2025-10-30T15:02:00Z"
    }
  ],
  "meta": {
    "total": 342,
    "completed": 268,
    "abandoned": 74,
    "limit": 50,
    "offset": 0
  }
}
```

---

#### `GET /api/v1/responses/:id`
Obtener respuesta individual completa

**Response:**
```json
{
  "response": {
    "id": "resp_abc123",
    // ... same as above
    "conversationHistory": [
      {
        "from": "bot",
        "message": "¡Hola Juan! Gracias por tu compra",
        "timestamp": "2025-10-30T15:02:00Z"
      },
      {
        "from": "user",
        "message": "Hola",
        "timestamp": "2025-10-30T15:02:10Z"
      },
      {
        "from": "bot",
        "message": "¿Cómo calificas tu experiencia? (1-10)",
        "timestamp": "2025-10-30T15:02:15Z"
      },
      {
        "from": "user",
        "message": "9",
        "timestamp": "2025-10-30T15:02:30Z"
      }
    ]
  }
}
```

---

### **4. Analytics** (Métricas y Estadísticas)

#### `GET /api/v1/surveys/:id/analytics`
Obtener analytics detalladas

**Query Parameters:**
```
?startDate=2025-10-01
?endDate=2025-10-31
?groupBy=day          # day, week, month
```

**Response:**
```json
{
  "surveyId": "surv_abc123",
  "period": {
    "start": "2025-10-01T00:00:00Z",
    "end": "2025-10-31T23:59:59Z"
  },
  "overview": {
    "totalSent": 500,
    "totalResponses": 342,
    "completedResponses": 268,
    "abandonedResponses": 74,
    "responseRate": 68.4,
    "completionRate": 78.3,
    "avgCompletionTime": 145
  },
  "nps": {
    "score": 45,
    "promoters": 180,
    "passives": 88,
    "detractors": 0,
    "distribution": {
      "0": 0, "1": 0, "2": 0, "3": 0, "4": 0,
      "5": 0, "6": 0, "7": 30, "8": 58,
      "9": 95, "10": 85
    }
  },
  "sentiment": {
    "positive": 245,
    "neutral": 65,
    "negative": 32,
    "avgScore": 0.72
  },
  "topTopics": [
    { "topic": "product_quality", "count": 156, "sentiment": 0.85 },
    { "topic": "customer_service", "count": 98, "sentiment": 0.78 },
    { "topic": "shipping_speed", "count": 67, "sentiment": 0.45 }
  ],
  "timeSeriesData": [
    {
      "date": "2025-10-01",
      "sent": 15,
      "responses": 12,
      "completed": 10,
      "avgNps": 8.2
    }
  ]
}
```

---

### **5. Webhooks** (Recibir Eventos)

#### `POST /api/v1/webhooks`
Configurar webhook endpoint

**Request:**
```json
{
  "url": "https://yourapp.com/chatform-webhook",
  "events": [
    "response.completed",
    "response.abandoned",
    "survey.published",
    "credits.low"
  ],
  "secret": "whsec_abc123xyz"
}
```

**Response:**
```json
{
  "webhook": {
    "id": "wh_abc123",
    "url": "https://yourapp.com/chatform-webhook",
    "events": ["response.completed", "response.abandoned"],
    "status": "active",
    "createdAt": "2025-10-30T15:00:00Z"
  }
}
```

---

#### Webhook Events Sent to Your Endpoint

**Event: `response.completed`**
```json
{
  "event": "response.completed",
  "eventId": "evt_abc123",
  "timestamp": "2025-10-30T15:03:30Z",
  "data": {
    "surveyId": "surv_abc123",
    "responseId": "resp_def456",
    "recipient": {
      "phone": "+5215512345678",
      "name": "Juan Pérez"
    },
    "answers": [...],
    "aiInsights": {
      "sentiment": "positive",
      "npsCategory": "promoter"
    },
    "metadata": {
      "order_id": "ORD-12345"
    }
  }
}
```

**Event: `credits.low`**
```json
{
  "event": "credits.low",
  "eventId": "evt_xyz789",
  "timestamp": "2025-10-30T15:00:00Z",
  "data": {
    "creditsRemaining": 10,
    "creditsLimit": 100,
    "threshold": 10,
    "message": "You have only 10 send credits remaining"
  }
}
```

**Webhook Signature Verification:**
```javascript
// Your server validates webhook
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return `sha256=${hash}` === signature;
}

// In your webhook handler:
app.post('/chatform-webhook', (req, res) => {
  const signature = req.headers['x-chatform-signature'];
  const isValid = verifyWebhook(req.body, signature, 'whsec_abc123xyz');

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process event
  const { event, data } = req.body;

  if (event === 'response.completed') {
    // Update your database
    // Send notification
    // etc.
  }

  res.status(200).send('OK');
});
```

---

## 💡 **Ejemplos de Integración**

### **Shopify: Encuesta Post-Compra**

```javascript
// Shopify webhook: Order paid
app.post('/shopify/order-paid', async (req, res) => {
  const order = req.body;

  // Trigger ChatForm survey
  await fetch('https://api.chatform.mx/v1/surveys/surv_postpurchase/trigger', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk_live_abc123',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: {
        phone: order.customer.phone,
        name: order.customer.name,
        email: order.customer.email
      },
      variables: {
        customer_name: order.customer.first_name,
        order_id: order.id,
        total: order.total_price,
        product: order.line_items[0].name
      },
      deliveryMethod: 'automatic',
      metadata: {
        source: 'shopify',
        order_id: order.id
      }
    })
  });

  res.status(200).send('OK');
});
```

---

### **Calendly: Encuesta Post-Evento**

```javascript
// Calendly webhook: Event completed
app.post('/calendly/event-completed', async (req, res) => {
  const event = req.body.payload;

  const response = await fetch('https://api.chatform.mx/v1/surveys/surv_postcall/trigger', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sk_live_abc123',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipient: {
        phone: event.invitee.phone,
        name: event.invitee.name,
        email: event.invitee.email
      },
      variables: {
        attendee_name: event.invitee.first_name,
        meeting_date: event.start_time,
        meeting_type: event.event_type.name
      },
      deliveryMethod: 'automatic',
      metadata: {
        source: 'calendly',
        event_id: event.uri
      }
    })
  });

  const result = await response.json();
  console.log('Survey sent:', result.messageId);

  res.status(200).send('OK');
});
```

---

### **Stripe: NPS Post-Suscripción**

```javascript
// Stripe webhook: Customer subscribed
const stripe = require('stripe')(process.env.STRIPE_SECRET);

app.post('/stripe/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'customer.subscription.created') {
    const subscription = event.data.object;
    const customer = await stripe.customers.retrieve(subscription.customer);

    // Wait 7 days, then trigger NPS survey
    setTimeout(async () => {
      await fetch('https://api.chatform.mx/v1/surveys/surv_nps/trigger', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk_live_abc123',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: {
            phone: customer.phone,
            name: customer.name,
            email: customer.email
          },
          variables: {
            customer_name: customer.name,
            plan: subscription.items.data[0].price.product.name,
            days_active: 7
          },
          deliveryMethod: 'automatic'
        })
      });
    }, 7 * 24 * 60 * 60 * 1000); // 7 días
  }

  res.status(200).send('OK');
});
```

---

## 🔒 **Seguridad y Best Practices**

### **1. Rate Limiting**
```
Free: 100 req/hora
Starter: 1,000 req/hora
Pro: 10,000 req/hora
Enterprise: Ilimitado
```

**Response headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1699027200
```

### **2. Idempotency**
Para operaciones críticas (trigger survey), usa `Idempotency-Key`:

```http
POST /api/v1/surveys/surv_abc/trigger
Idempotency-Key: unique-key-123
```

Si envías el mismo key 2 veces, solo se procesa una vez.

### **3. Webhook Retry Logic**
Si tu webhook falla:
- Retry 1: Inmediato
- Retry 2: +1 min
- Retry 3: +5 min
- Retry 4: +15 min
- Retry 5: +1 hora

Después de 5 retries, marcamos como `failed`.

### **4. API Versioning**
```
/api/v1/...  ← Current
/api/v2/...  ← Future (backward compatible por 12 meses)
```

---

## 📊 **Monetización del API**

| Plan | API Access | Rate Limit | Webhooks |
|------|-----------|-----------|----------|
| Free | ❌ | - | ❌ |
| Starter | ❌ | - | ❌ |
| Pro | ✅ | 10K/hora | ✅ 3 endpoints |
| Enterprise | ✅ | Ilimitado | ✅ Ilimitado |

**Add-ons:**
- API access para Starter: +$15/mes
- Extra webhook endpoints: +$5/endpoint/mes

---

## 🚀 **Próximos Pasos de Implementación**

### **Fase 1: Core API (Esta semana)**
1. ✅ Documentación completa
2. ⏳ `POST /api/v1/surveys/:id/trigger` (endpoint estrella)
3. ⏳ `GET /api/v1/surveys/:id/responses`
4. ⏳ API key generation en Settings
5. ⏳ Rate limiting middleware

### **Fase 2: Webhooks (Próxima semana)**
6. ⏳ Webhook configuration UI
7. ⏳ Webhook delivery system
8. ⏳ Signature verification
9. ⏳ Retry logic

### **Fase 3: Advanced (Después)**
10. ⏳ Batch trigger endpoint
11. ⏳ Analytics API
12. ⏳ GraphQL support (Enterprise)

---

## 📖 **Developer Experience**

### **SDK Libraries (Futuro)**
```bash
npm install @chatform/node
pip install chatform
gem install chatform
```

**Ejemplo con SDK:**
```javascript
const ChatForm = require('@chatform/node');
const chatform = new ChatForm('sk_live_abc123');

// Trigger survey
const result = await chatform.surveys.trigger('surv_abc123', {
  recipient: {
    phone: '+5215512345678',
    name: 'Juan Pérez'
  },
  variables: {
    order_id: 'ORD-12345'
  }
});

console.log('Survey sent:', result.messageId);
```

---

## ✅ **RESUMEN EJECUTIVO**

**El API de ChatForm permite:**

1. ✅ **Automatizar encuestas** desde cualquier plataforma
2. ✅ **Recibir respuestas en tiempo real** via webhooks
3. ✅ **Integrar con Shopify, Calendly, Stripe, CRM**
4. ✅ **Obtener analytics programáticamente**
5. ✅ **Trigger individual o batch**

**El endpoint killer:**
```
POST /api/v1/surveys/:id/trigger
```

Este endpoint convierte ChatForm de "herramienta de encuestas" a **"plataforma de feedback automation"**.

**Pitch:**
> "¿Cliente compró en Shopify? → Auto-envía encuesta.
> ¿Call de Calendly terminó? → Auto-envía NPS.
> ¿Usuario alcanzó milestone? → Auto-pide feedback.
> Todo automático, por WhatsApp, con IA."

---

**Estado:** ✅ LISTO PARA IMPLEMENTAR
**Prioridad:** 🔥 CRÍTICO (diferenciador clave)
