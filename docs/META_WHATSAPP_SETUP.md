# 🔵 Meta WhatsApp Business API - Guía Completa de Setup

**Para:** Technical Founders que quieren implementar WhatsApp directo con Meta
**Tiempo estimado:** 3-5 días
**Nivel:** Avanzado

---

## 🎯 ¿Por qué esta guía?

Si llegaste aquí, probablemente:
- ✅ Envías > 50,000 mensajes/mes
- ✅ Quieres ahorrar ~70% en costos vs Twilio
- ✅ Tienes equipo técnico experimentado
- ✅ Puedes esperar 3-5 días de setup

**Ahorro esperado:**
- 50K msgs/mes: $160/mes ($1,920/año)
- 500K msgs/mes: $1,850/mes ($22,200/año)

---

## 📋 Requisitos Previos

### Legales y de Negocio

```
□ Empresa legalmente registrada
□ RFC activo (México) o Tax ID (otros países)
□ Dominio de email verificado (@tuempresa.com)
□ Dirección física de oficinas
□ Identificación oficial del representante legal
□ Número de teléfono dedicado para WhatsApp
```

### Técnicos

```
□ Servidor con IP pública y SSL
□ Webhook público accesible (HTTPS obligatorio)
□ Conocimientos de REST APIs
□ Experiencia con webhooks y queue systems
□ Capacidad de manejar eventos async
```

---

## 🚀 Fase 1: Facebook Business Manager (Día 1)

### Paso 1.1: Crear Facebook Business Manager

1. **Ir a:** https://business.facebook.com
2. **Click:** "Crear cuenta"
3. **Llenar:**
   - Nombre del negocio
   - Tu nombre
   - Email de trabajo
4. **Verificar email**

**Tiempo:** 10 minutos

---

### Paso 1.2: Verificar tu Negocio

**IMPORTANTE:** Este paso puede tomar 1-3 días.

1. **Ir a:** Business Settings → Security Center
2. **Click:** "Start Verification"
3. **Opciones de verificación:**

#### Opción A: Verificación por Dominio
```bash
# Meta te dará un TXT record
# Agrégalo a tu DNS:

Tipo: TXT
Host: @
Valor: facebook-domain-verification=abcd1234efgh5678

# Espera 24-48 horas
```

#### Opción B: Verificación por Documentos
```
Documentos aceptados:
- Acta constitutiva
- Cédula fiscal (México)
- Business registration (otros países)
- Utility bill con dirección

Formato: PDF o JPG
Tamaño: < 8 MB
```

**Tiempo:** 1-3 días (espera de aprobación)

---

## 🔵 Fase 2: WhatsApp Business Account (Día 2)

### Paso 2.1: Crear WhatsApp Business Account (WABA)

1. **Ir a:** Business Settings → Accounts → WhatsApp Accounts
2. **Click:** "Add"
3. **Elegir:** "Create a WhatsApp Business Account"
4. **Llenar:**
   - Business name
   - Business description
   - Business category
   - Business website

**Tiempo:** 15 minutos

---

### Paso 2.2: Agregar Número de Teléfono

**IMPORTANTE:** El número NO debe estar registrado en WhatsApp previamente.

1. **Opciones:**

#### Opción A: Número Nuevo (Recomendado)
```
Comprar número nuevo de:
- Twilio (irónico, pero funciona)
- Vonage
- MessageBird
- Tu carrier local

Costo: ~$1-5 USD/mes
```

#### Opción B: Portar Número Existente
```
Requiere:
- Authorization letter del carrier
- Proof of ownership
- 5-10 días de proceso
```

2. **Agregar número en Meta:**
   - Business Settings → WhatsApp Accounts → Phone Numbers
   - Click "Add Phone Number"
   - Ingresar número (formato: +5215512345678)
   - Elegir método de verificación: SMS o llamada
   - Ingresar código de 6 dígitos

**Tiempo:** 30 minutos

---

### Paso 2.3: Crear Display Name

El nombre que aparecerá en WhatsApp.

```
Reglas:
- Máximo 25 caracteres
- No puede contener: emojis, URLs, teléfonos
- Debe representar tu negocio
- Cambios requieren re-aprobación

Ejemplos buenos:
✅ "ChatForm Support"
✅ "Acme Corp"
✅ "Mi Tienda Online"

Ejemplos malos:
❌ "Compra aquí 👉"
❌ "www.example.com"
❌ "Call 555-1234"
```

**Tiempo:** 5 minutos + 1-3 días aprobación

---

## 🔧 Fase 3: Configuración de App (Día 3)

### Paso 3.1: Crear App de Facebook

1. **Ir a:** https://developers.facebook.com/apps
2. **Click:** "Create App"
3. **Elegir:** "Business"
4. **Llenar:**
   - App name: "ChatForm WhatsApp Integration"
   - App contact email
   - Business account: (seleccionar el creado)

**Tiempo:** 10 minutos

---

### Paso 3.2: Agregar WhatsApp Product

1. **En tu app:** Dashboard → Add Product
2. **Buscar:** "WhatsApp"
3. **Click:** "Set Up"
4. **Asociar** con tu WABA creada

**Tiempo:** 5 minutos

---

### Paso 3.3: Obtener Credenciales

**Necesitarás 5 valores importantes:**

```bash
# 1. App ID
META_APP_ID=123456789012345
# Ubicación: App Dashboard → Settings → Basic

# 2. App Secret
META_APP_SECRET=abcdef1234567890abcdef1234567890
# Ubicación: App Dashboard → Settings → Basic → Show

# 3. WhatsApp Business Account ID (WABA ID)
META_WABA_ID=987654321098765
# Ubicación: WhatsApp → Getting Started → Select WABA

# 4. Phone Number ID
META_PHONE_NUMBER_ID=112233445566778
# Ubicación: WhatsApp → Getting Started → Send messages

# 5. Access Token (temporal por 24h)
META_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxx
# Ubicación: WhatsApp → Getting Started → Temporary access token
```

**⚠️ IMPORTANTE:** El token temporal expira en 24 horas. Necesitarás crear uno permanente.

---

### Paso 3.4: Crear Access Token Permanente

**Opción A: System User (Recomendado para producción)**

1. **Business Settings → Users → System Users**
2. **Click:** "Add"
3. **Crear** system user con rol "Admin"
4. **Generar token:**
   - Click en el system user
   - "Assign Assets" → Add app
   - Click "Generate New Token"
   - Seleccionar permisos:
     - `whatsapp_business_management`
     - `whatsapp_business_messaging`
   - **COPIAR TOKEN** (no se vuelve a mostrar)

```bash
# Token permanente (no expira)
META_ACCESS_TOKEN=EAABwzLixnjYBO... (muy largo)
```

**Tiempo:** 20 minutos

---

## 🌐 Fase 4: Webhooks (Día 3-4)

### Paso 4.1: Preparar Endpoint

Tu servidor debe tener un endpoint HTTPS público:

```typescript
// app/api/webhooks/whatsapp-meta/route.ts

import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN!;

// GET: Verificación inicial (Meta lo llama una vez)
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode');
  const token = req.nextUrl.searchParams.get('hub.verify_token');
  const challenge = req.nextUrl.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verificado');
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}

// POST: Eventos de WhatsApp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verificar que viene de Meta
    // (implementar signature verification en producción)

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Mensaje entrante
    if (value?.messages) {
      const message = value.messages[0];
      const from = message.from; // Número del usuario
      const text = message.text?.body; // Texto del mensaje
      const messageId = message.id;

      console.log(`📩 Mensaje de ${from}: ${text}`);

      // Aquí procesas el mensaje
      await handleIncomingMessage(from, text, messageId);
    }

    // Status update (enviado, entregado, leído)
    if (value?.statuses) {
      const status = value.statuses[0];
      const messageId = status.id;
      const statusType = status.status; // sent, delivered, read, failed

      console.log(`📊 Status ${statusType} para mensaje ${messageId}`);

      // Actualiza tu DB
      await updateMessageStatus(messageId, statusType);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Helpers (implementar según tu lógica)
async function handleIncomingMessage(from: string, text: string, messageId: string) {
  // Tu lógica para procesar respuestas de encuestas
}

async function updateMessageStatus(messageId: string, status: string) {
  // Actualizar status en tu DB
}
```

**Variables de entorno:**

```bash
META_WEBHOOK_VERIFY_TOKEN=tu_token_secreto_random_123456
# Generar con: openssl rand -hex 32
```

---

### Paso 4.2: Configurar Webhook en Meta

1. **App Dashboard → WhatsApp → Configuration**
2. **Webhook section:**
   - Callback URL: `https://tuapp.com/api/webhooks/whatsapp-meta`
   - Verify token: `tu_token_secreto_random_123456`
3. **Click:** "Verify and Save"
4. **Subscribir a eventos:**
   - ✅ messages
   - ✅ message_status (message echoes, read receipts, delivery)

**Si falla la verificación:**
```bash
# Probar tu endpoint manualmente:
curl "https://tuapp.com/api/webhooks/whatsapp-meta?hub.mode=subscribe&hub.verify_token=tu_token&hub.challenge=test123"

# Debe retornar: test123
```

**Tiempo:** 1-2 horas

---

## 📤 Fase 5: Envío de Mensajes (Día 4)

### Paso 5.1: Entender Templates

**REGLA #1 de WhatsApp:** Solo puedes enviar mensajes pre-aprobados.

**Estructura de un template:**

```
Nombre: welcome_survey
Categoría: MARKETING
Idioma: es_MX

Contenido:
Hola {{1}}, gracias por tu interés.

Te invitamos a responder nuestra encuesta: {{2}}

Solo tomará {{3}} minutos.

Variables:
{{1}} = nombre del usuario
{{2}} = link de la encuesta
{{3}} = tiempo estimado
```

---

### Paso 5.2: Crear Templates en Meta

1. **WhatsApp Manager → Message Templates**
2. **Click:** "Create Template"
3. **Llenar:**

```yaml
Name: friendly_survey_invite
Category: MARKETING
Language: Spanish (Mexico)

Header: Ninguno

Body:
¡Hola {{1}}! 👋

Queremos saber tu opinión sobre {{2}}.
Son solo {{3}} preguntas rápidas.

{{4}}

¡Tu feedback nos ayuda mucho! 🙌

Footer: (opcional)
Powered by ChatForm

Buttons: (opcional)
- Visit Website: {{4}}

Variables:
1: text - ejemplo: "Juan"
2: text - ejemplo: "nuestro servicio"
3: text - ejemplo: "5"
4: url - ejemplo: "https://app.chatform.mx/s/ABC123"
```

4. **Submit para aprobación**

**Tiempo de aprobación:** 15 minutos - 24 horas

**Razones comunes de rechazo:**
- ❌ Contenido promocional agresivo
- ❌ Errores ortográficos
- ❌ URLs sin protocolo (usar https://)
- ❌ Emojis inadecuados
- ❌ Contenido engañoso

---

### Paso 5.3: Templates para ChatForm

Crea estos 6 templates (basados en `/lib/whatsapp/templates.ts`):

#### 1. friendly_short
```
Category: MARKETING
Language: es_MX

Body:
¡Hola {{1}}! 👋

Queremos saber tu opinión sobre {{2}}. Son solo {{3}} preguntas rápidas.

{{4}}

¡Tu feedback nos ayuda mucho! 🙌

Variables:
1 = name
2 = topic
3 = question_count
4 = link (url button recomendado)
```

#### 2. professional_detailed
```
Category: MARKETING
Language: es_MX

Body:
Hola {{1}}, soy {{2}} de {{3}}.

Nos gustaría conocer tu opinión sobre {{4}}.

📊 Solo {{5}} preguntas
⏱️ Tiempo estimado: {{6}} min

{{7}}

¡Gracias por tu tiempo!

Variables:
1 = name
2 = sender
3 = company
4 = topic
5 = question_count
6 = estimated_time
7 = link
```

#### 3. direct_minimal
```
Category: MARKETING
Language: es_MX

Body:
{{1}}, tu opinión sobre {{2}}:

{{3}}

{{4}} preguntas | {{5}} min

Variables:
1 = name
2 = topic
3 = link
4 = question_count
5 = estimated_time
```

#### 4. incentive_focused
```
Category: MARKETING
Language: es_MX

Body:
Hola {{1}},

Tu opinión vale mucho. Responde nuestra encuesta sobre {{2}} y {{3}}.

{{4}}

Solo {{5}} minutos 🎁

Variables:
1 = name
2 = topic
3 = incentive
4 = link
5 = estimated_time
```

#### 5. personalized_context
```
Category: MARKETING
Language: es_MX

Body:
Hola {{1}},

Como {{2}}, nos gustaría conocer tu experiencia con {{3}}.

Tu feedback es muy valioso:
{{4}}

Son {{5}} preguntas breves.

Saludos,
{{6}}

Variables:
1 = name
2 = context
3 = topic
4 = link
5 = question_count
6 = sender
```

#### 6. link_only
```
Category: UTILITY
Language: es_MX

Body:
{{1}}

Variables:
1 = link
```

**Crear todos:** 1-2 horas
**Esperar aprobación:** 24-48 horas

---

### Paso 5.4: Implementar Envío

```typescript
// lib/whatsapp/meta-provider.ts

import axios from 'axios';

interface MetaConfig {
  phoneNumberId: string;
  accessToken: string;
}

interface SendTemplateParams {
  to: string; // '+5215512345678'
  templateName: string; // 'friendly_short'
  languageCode: string; // 'es_MX'
  components: TemplateComponent[];
}

interface TemplateComponent {
  type: 'body' | 'header' | 'button';
  parameters: Parameter[];
}

interface Parameter {
  type: 'text' | 'url';
  text?: string;
  url?: string;
}

export class MetaWhatsAppProvider {
  private config: MetaConfig;
  private baseURL: string;

  constructor(config: MetaConfig) {
    this.config = config;
    this.baseURL = `https://graph.facebook.com/v18.0/${config.phoneNumberId}`;
  }

  async sendTemplate(params: SendTemplateParams) {
    try {
      const response = await axios.post(
        `${this.baseURL}/messages`,
        {
          messaging_product: 'whatsapp',
          to: params.to.replace('+', ''), // Meta no quiere el +
          type: 'template',
          template: {
            name: params.templateName,
            language: {
              code: params.languageCode
            },
            components: params.components
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        messageId: response.data.messages[0].id,
        waId: response.data.contacts[0].wa_id
      };
    } catch (error: any) {
      console.error('❌ Error enviando mensaje:', error.response?.data);

      return {
        success: false,
        error: error.response?.data?.error?.message || 'Unknown error',
        errorCode: error.response?.data?.error?.code
      };
    }
  }

  // Helper para envío simple
  async sendSurveyInvite({
    to,
    name,
    topic,
    questionCount,
    surveyLink
  }: {
    to: string;
    name: string;
    topic: string;
    questionCount: number;
    surveyLink: string;
  }) {
    return this.sendTemplate({
      to,
      templateName: 'friendly_short',
      languageCode: 'es_MX',
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: name },
            { type: 'text', text: topic },
            { type: 'text', text: questionCount.toString() },
            { type: 'text', text: surveyLink }
          ]
        }
      ]
    });
  }
}

// Uso:
const provider = new MetaWhatsAppProvider({
  phoneNumberId: process.env.META_PHONE_NUMBER_ID!,
  accessToken: process.env.META_ACCESS_TOKEN!
});

const result = await provider.sendSurveyInvite({
  to: '+5215512345678',
  name: 'Juan',
  topic: 'nuestro producto',
  questionCount: 5,
  surveyLink: 'https://app.chatform.mx/s/ABC123'
});

console.log(result);
// { success: true, messageId: 'wamid.ABC...', waId: '5215512345678' }
```

---

### Paso 5.5: Integrar con ChatForm

Actualizar el API de bulk send para soportar Meta:

```typescript
// app/api/surveys/[id]/send-bulk/route.ts

import { MetaWhatsAppProvider } from '@/lib/whatsapp/meta-provider';
import { TwilioWhatsAppProvider } from '@/lib/whatsapp/twilio-provider';

// Factory pattern
function getWhatsAppProvider() {
  const providerType = process.env.WHATSAPP_PROVIDER; // 'twilio' | 'meta'

  if (providerType === 'meta') {
    return new MetaWhatsAppProvider({
      phoneNumberId: process.env.META_PHONE_NUMBER_ID!,
      accessToken: process.env.META_ACCESS_TOKEN!
    });
  }

  // Default: Twilio
  return new TwilioWhatsAppProvider({
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER!
  });
}

export async function POST(req: Request) {
  const { contacts, surveyId, templateId } = await req.json();

  const provider = getWhatsAppProvider();
  const results = [];

  for (const contact of contacts) {
    const result = await provider.sendSurveyInvite({
      to: contact.phone,
      name: contact.name,
      topic: survey.title,
      questionCount: survey.questions.length,
      surveyLink: `https://app.chatform.mx/s/${survey.shortCode}`
    });

    results.push(result);

    // Rate limiting: Meta permite 80 msg/sec, pero mejor ir despacio
    await new Promise(resolve => setTimeout(resolve, 1100)); // ~54/min
  }

  return NextResponse.json({ results });
}
```

**Variables de entorno finales:**

```bash
# .env.production

# Elegir provider
WHATSAPP_PROVIDER=meta # o 'twilio'

# Meta credentials
META_APP_ID=123456789012345
META_APP_SECRET=abcdef1234567890abcdef1234567890
META_WABA_ID=987654321098765
META_PHONE_NUMBER_ID=112233445566778
META_ACCESS_TOKEN=EAABwzLixnjYBO... (muy largo)
META_WEBHOOK_VERIFY_TOKEN=tu_token_secreto_random_123456

# Twilio credentials (fallback)
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=xxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 🧪 Fase 6: Testing (Día 5)

### Paso 6.1: Probar Envío de Template

```bash
# Test con cURL
curl -X POST "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5215512345678",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": {
        "code": "en_US"
      }
    }
  }'

# Respuesta esperada:
{
  "messaging_product": "whatsapp",
  "contacts": [{
    "input": "5215512345678",
    "wa_id": "5215512345678"
  }],
  "messages": [{
    "id": "wamid.HBgLNTIxNTUxMjM0NTY3OBUCABIYFjNFQjBDMD..."
  }]
}
```

### Paso 6.2: Verificar Webhook

```bash
# Envía un mensaje de prueba desde tu WhatsApp al número de negocio
# Revisa los logs de tu servidor:

# Deberías ver:
📩 Mensaje de 5215512345678: Hola!
```

### Paso 6.3: Probar Bulk Send desde UI

1. Crear encuesta en ChatForm
2. Ir a "Envío Masivo"
3. Subir CSV con 2-3 contactos de prueba
4. Seleccionar template "Amigable Corto"
5. Enviar
6. Verificar:
   - ✅ Mensajes llegan en WhatsApp
   - ✅ Links funcionan
   - ✅ Respuestas se registran
   - ✅ Status updates en webhook

---

## 📊 Fase 7: Monitoreo (Día 5+)

### Paso 7.1: Implementar Logging

```typescript
// lib/logger/whatsapp-logger.ts

export async function logWhatsAppEvent(event: {
  type: 'message_sent' | 'message_delivered' | 'message_read' | 'message_failed' | 'message_received';
  messageId: string;
  recipientPhone: string;
  surveyId?: string;
  error?: string;
  timestamp: Date;
}) {
  // Guardar en DB para analytics
  await db.whatsappLog.create({
    data: event
  });

  // Log en consola
  console.log(`[WhatsApp ${event.type}] ${event.messageId} → ${event.recipientPhone}`);
}
```

### Paso 7.2: Dashboard de Métricas

Crear página de analytics:

```typescript
// app/(dashboard)/analytics/whatsapp/page.tsx

export default async function WhatsAppAnalytics() {
  const stats = await db.whatsappLog.groupBy({
    by: ['type'],
    _count: true
  });

  return (
    <div>
      <h1>WhatsApp Analytics</h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Enviados"
          value={stats.message_sent}
          icon="📤"
        />
        <StatCard
          title="Entregados"
          value={stats.message_delivered}
          rate={`${(stats.message_delivered / stats.message_sent * 100).toFixed(1)}%`}
          icon="✅"
        />
        <StatCard
          title="Leídos"
          value={stats.message_read}
          rate={`${(stats.message_read / stats.message_sent * 100).toFixed(1)}%`}
          icon="👀"
        />
        <StatCard
          title="Fallidos"
          value={stats.message_failed}
          icon="❌"
        />
      </div>

      {/* Gráfica de envíos por día, etc. */}
    </div>
  );
}
```

---

## ⚠️ Errores Comunes y Soluciones

### Error 1: (#100) The parameter recipient_type is required

**Causa:** Enviando a número sin código de país
**Solución:**
```typescript
// ❌ Mal
to: "5512345678"

// ✅ Bien
to: "5215512345678" // Sin el +
```

---

### Error 2: (#131009) Parameter value is not valid

**Causa:** Template no existe o nombre incorrecto
**Solución:**
```typescript
// Verificar nombre exacto en WhatsApp Manager
// Es case-sensitive: 'Friendly_Short' !== 'friendly_short'
templateName: 'friendly_short' // Debe coincidir exactamente
```

---

### Error 3: (#133000) Webhook Verification Failed

**Causa:** Verify token incorrecto o endpoint no responde
**Solución:**
```typescript
// Verificar que tu GET endpoint retorna el challenge:
export async function GET(req: NextRequest) {
  const challenge = req.nextUrl.searchParams.get('hub.challenge');
  return new NextResponse(challenge, { status: 200 }); // Debe ser 200, no 204
}
```

---

### Error 4: (#131026) Message Undeliverable

**Causa:** Número no tiene WhatsApp o bloqueó el número de negocio
**Solución:**
```typescript
// Implementar retry logic y marcar número como inválido
if (error.code === 131026) {
  await db.contact.update({
    where: { phone },
    data: { whatsappValid: false }
  });
}
```

---

### Error 5: Rate Limit Exceeded

**Causa:** Enviando demasiado rápido
**Solución:**
```typescript
// Implementar queue con rate limiting
import { Queue } from 'bullmq';

const whatsappQueue = new Queue('whatsapp-messages', {
  limiter: {
    max: 54, // mensajes
    duration: 60000 // por minuto
  }
});
```

---

## 🔒 Seguridad y Mejores Prácticas

### 1. Validar Signature de Webhook

Meta firma cada request del webhook:

```typescript
import crypto from 'crypto';

function validateWebhookSignature(req: Request): boolean {
  const signature = req.headers.get('x-hub-signature-256');
  const body = await req.text();

  const expectedSignature = crypto
    .createHmac('sha256', process.env.META_APP_SECRET!)
    .update(body)
    .digest('hex');

  return signature === `sha256=${expectedSignature}`;
}

export async function POST(req: Request) {
  if (!validateWebhookSignature(req)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Procesar webhook...
}
```

---

### 2. Rotar Access Tokens

Los tokens permanentes pueden expirar si no se usan:

```typescript
// Guardar fecha de creación del token
// Renovar cada 60 días

if (daysSinceTokenCreation > 60) {
  // Crear nuevo system user token
  // Actualizar en variables de entorno
  // Notificar a admin
}
```

---

### 3. Rate Limiting Inteligente

```typescript
// lib/queue/whatsapp-queue.ts

interface QueueConfig {
  messagesPerMinute: number;
  maxRetries: number;
  retryDelay: number;
}

export class WhatsAppQueue {
  private config: QueueConfig;

  constructor(config: QueueConfig) {
    this.config = config;
  }

  async enqueue(message: WhatsAppMessage) {
    // Agregar a Redis queue
    await redis.lpush('whatsapp:queue', JSON.stringify(message));
  }

  async process() {
    while (true) {
      const message = await redis.rpop('whatsapp:queue');

      if (!message) {
        await sleep(1000);
        continue;
      }

      const result = await this.send(JSON.parse(message));

      if (!result.success && result.shouldRetry) {
        await this.retry(message);
      }

      // Rate limiting
      await sleep(60000 / this.config.messagesPerMinute);
    }
  }
}
```

---

### 4. Opt-out Management

**LEGAL REQUIREMENT:** Debes permitir que usuarios se den de baja.

```typescript
// Webhook handler
async function handleIncomingMessage(from: string, text: string) {
  const lowerText = text.toLowerCase().trim();

  // Keywords de opt-out
  if (['stop', 'baja', 'cancelar', 'no mas', 'no más'].includes(lowerText)) {
    await db.contact.update({
      where: { phone: from },
      data: {
        optedOut: true,
        optedOutAt: new Date()
      }
    });

    // Enviar confirmación
    await provider.sendTemplate({
      to: from,
      templateName: 'opt_out_confirmation',
      languageCode: 'es_MX',
      components: []
    });

    return;
  }

  // Procesar respuesta de encuesta...
}
```

Template de confirmación de baja:

```
Name: opt_out_confirmation
Category: UTILITY
Language: es_MX

Body:
Has sido dado de baja exitosamente.

Ya no recibirás mensajes de nuestra parte.

Para volver a suscribirte, responde START.
```

---

## 📈 Optimizaciones para Producción

### 1. Connection Pooling

```typescript
// lib/whatsapp/connection-pool.ts

import axios, { AxiosInstance } from 'axios';

class MetaAPIPool {
  private instances: AxiosInstance[] = [];
  private currentIndex = 0;

  constructor(poolSize: number = 5) {
    for (let i = 0; i < poolSize; i++) {
      this.instances.push(axios.create({
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }));
    }
  }

  getInstance(): AxiosInstance {
    const instance = this.instances[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.instances.length;
    return instance;
  }
}

export const metaPool = new MetaAPIPool(5);
```

---

### 2. Caching de Templates

```typescript
// lib/cache/template-cache.ts

import { redis } from '@/lib/redis';

export async function getTemplate(name: string) {
  const cached = await redis.get(`template:${name}`);

  if (cached) {
    return JSON.parse(cached);
  }

  const template = await fetchTemplateFromMeta(name);

  await redis.setex(
    `template:${name}`,
    3600, // 1 hora
    JSON.stringify(template)
  );

  return template;
}
```

---

### 3. Batch Processing

```typescript
// Enviar múltiples mensajes en paralelo (respetando rate limits)

async function sendBatch(contacts: Contact[], batchSize: number = 10) {
  const batches = chunk(contacts, batchSize);

  for (const batch of batches) {
    await Promise.all(
      batch.map(contact =>
        provider.sendSurveyInvite({
          to: contact.phone,
          name: contact.name,
          // ...
        })
      )
    );

    // Esperar entre batches
    await sleep(60000 / (80 / batchSize)); // Meta permite 80/sec
  }
}
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial

- **Meta WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp
- **Cloud API Reference:** https://developers.facebook.com/docs/whatsapp/cloud-api
- **Webhooks:** https://developers.facebook.com/docs/whatsapp/webhooks
- **Message Templates:** https://developers.facebook.com/docs/whatsapp/message-templates

### Tools

- **WhatsApp Business Manager:** https://business.facebook.com/wa/manage
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer
- **Webhook Tester:** https://webhook.site

### Community

- **Stack Overflow:** Tag `whatsapp-business-api`
- **Reddit:** r/whatsappbusiness
- **Discord:** WhatsApp Business Developers (unofficial)

---

## ✅ Checklist Final

```
□ Business Manager creado
□ Negocio verificado (1-3 días)
□ WABA creada
□ Número agregado y verificado
□ Display name aprobado
□ App de Facebook creada
□ WhatsApp Product agregado
□ Access token permanente generado
□ Webhook configurado y funcionando
□ Templates creados (6 mínimo)
□ Templates aprobados (esperar 24-48h)
□ Código de envío implementado
□ Código de webhook implementado
□ Rate limiting implementado
□ Error handling implementado
□ Logging implementado
□ Opt-out management implementado
□ Pruebas end-to-end exitosas
□ Monitoreo configurado
□ Documentación del equipo
```

---

## 🆘 Troubleshooting

### Si los mensajes no llegan:

1. **Verificar en Meta Dashboard:**
   - WhatsApp Manager → Analytics → Message Logs
   - Ver status: Sent, Delivered, Failed

2. **Check común issues:**
   - ❌ Template no aprobado aún
   - ❌ Número incorrecto (falta código país)
   - ❌ Token expirado
   - ❌ Rate limit excedido
   - ❌ Saldo insuficiente (si aplica)

3. **Revisar logs:**
```bash
# Ver últimos 100 mensajes
curl "https://graph.facebook.com/v18.0/${WABA_ID}/message_templates" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

---

### Si webhook no funciona:

1. **Verificar HTTPS:**
```bash
curl -I https://tuapp.com/api/webhooks/whatsapp-meta
# Debe retornar 200 o 405, no error de SSL
```

2. **Verificar verify token:**
```bash
curl "https://tuapp.com/api/webhooks/whatsapp-meta?hub.mode=subscribe&hub.verify_token=TU_TOKEN&hub.challenge=test"
# Debe retornar: test
```

3. **Ver logs de Meta:**
   - App Dashboard → Webhooks → Recent Deliveries
   - Ver qué requests están fallando

---

## 🚀 Próximos Pasos

Una vez funcionando:

1. **Migrar de Twilio (si aplicable):**
   - Ver [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

2. **Optimizar costos:**
   - Analizar cuáles campañas van por Meta
   - Cuáles necesitan la confiabilidad de Twilio

3. **Escalar:**
   - Implementar auto-scaling del queue processor
   - Agregar más templates basados en analytics
   - A/B testing de templates

4. **Compliance:**
   - Implementar audit logs
   - GDPR/LFPDPPP compliance
   - Data retention policies

---

## 💡 Tips de un Technical Founder

1. **No subestimes el tiempo de setup:** 3-5 días es real, no te frustres
2. **Aprobación de templates:** Envía varios a la vez, algunos pueden rechazarse
3. **Testing:** Prueba con 2-3 números reales antes de mandar 10,000
4. **Rate limits:** Meta es estricto, implementa queue desde día 1
5. **Webhooks:** Usa ngrok local primero, luego deploy a prod
6. **Docs de Meta:** Pueden estar desactualizadas, prueba y valida
7. **Monitoring:** Los primeros días revisa logs cada hora
8. **Opt-outs:** Hazlo fácil, es legal requirement y buena práctica

---

**Creado por:** ChatForm Team
**Última actualización:** 2025-11-03
**Versión:** 1.0

**Questions?**
- Email: dev@chatform.mx
- GitHub: [chatform/chatform/issues](https://github.com/chatform/chatform/issues)

---

**Happy WhatsApp integration! 🚀📱**
