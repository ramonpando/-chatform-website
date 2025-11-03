# 🏗️ WhatsApp Provider Abstraction Layer

**Objetivo:** Arquitectura que permite cambiar entre Twilio y Meta sin tocar el código de negocio

---

## 🎯 ¿Por qué necesitas esto?

**Problema:**
```typescript
// ❌ Código acoplado a Twilio
const twilioClient = require('twilio')(sid, token);
await twilioClient.messages.create({ ... });

// Si quieres migrar a Meta, debes reescribir TODO
```

**Solución:**
```typescript
// ✅ Código agnóstico al proveedor
const provider = getWhatsAppProvider();
await provider.sendSurveyInvite({ ... });

// Cambias proveedor con una variable de entorno
```

---

## 🏛️ Arquitectura

```
┌─────────────────────────────────────┐
│   Business Logic (API Routes)      │
│   - /api/surveys/[id]/send-bulk     │
│   - Survey creation & management    │
└─────────────┬───────────────────────┘
              │
              │ Uses interface
              ▼
┌─────────────────────────────────────┐
│   WhatsAppProvider Interface        │
│   - sendTemplate()                  │
│   - sendSurveyInvite()              │
│   - getMessageStatus()              │
└─────────────┬───────────────────────┘
              │
      ┌───────┴────────┐
      │                │
      ▼                ▼
┌──────────┐    ┌──────────┐
│  Twilio  │    │   Meta   │
│ Provider │    │ Provider │
└──────────┘    └──────────┘
```

---

## 📝 Paso 1: Definir Interface

```typescript
// lib/whatsapp/types.ts

export interface WhatsAppMessage {
  to: string;
  templateId: string;
  variables: Record<string, string>;
}

export interface WhatsAppSurveyInvite {
  to: string;
  name: string;
  topic: string;
  questionCount: number;
  surveyLink: string;
  estimatedTime?: number;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: string;
  shouldRetry?: boolean;
}

export interface MessageStatus {
  id: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  error?: string;
}

export interface WhatsAppProvider {
  // Método básico: enviar template con variables
  sendTemplate(params: {
    to: string;
    templateName: string;
    languageCode: string;
    variables: Record<string, string>;
  }): Promise<SendResult>;

  // Método helper: enviar invitación de encuesta
  sendSurveyInvite(params: WhatsAppSurveyInvite): Promise<SendResult>;

  // Obtener status de un mensaje
  getMessageStatus(messageId: string): Promise<MessageStatus>;

  // Nombre del proveedor (para logging)
  getName(): string;
}
```

---

## 🔧 Paso 2: Implementar Twilio Provider

```typescript
// lib/whatsapp/twilio-provider.ts

import twilio from 'twilio';
import { WhatsAppProvider, SendResult, MessageStatus, WhatsAppSurveyInvite } from './types';

export class TwilioWhatsAppProvider implements WhatsAppProvider {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor(config: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  }) {
    this.client = twilio(config.accountSid, config.authToken);
    this.fromNumber = config.fromNumber;
  }

  getName(): string {
    return 'Twilio';
  }

  async sendTemplate(params: {
    to: string;
    templateName: string;
    languageCode: string;
    variables: Record<string, string>;
  }): Promise<SendResult> {
    try {
      // Twilio usa ContentSid para templates
      const contentSid = this.getContentSid(params.templateName);

      const message = await this.client.messages.create({
        from: this.fromNumber,
        to: `whatsapp:${params.to}`,
        contentSid,
        contentVariables: JSON.stringify(params.variables)
      });

      return {
        success: true,
        messageId: message.sid
      };
    } catch (error: any) {
      console.error('[Twilio] Error sending message:', error);

      return {
        success: false,
        error: error.message,
        errorCode: error.code?.toString(),
        shouldRetry: this.isRetryableError(error.code)
      };
    }
  }

  async sendSurveyInvite(params: WhatsAppSurveyInvite): Promise<SendResult> {
    // Mapear a template "friendly_short"
    return this.sendTemplate({
      to: params.to,
      templateName: 'friendly_short',
      languageCode: 'es_MX',
      variables: {
        '1': params.name,
        '2': params.topic,
        '3': params.questionCount.toString(),
        '4': params.surveyLink
      }
    });
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    const message = await this.client.messages(messageId).fetch();

    return {
      id: messageId,
      status: this.mapTwilioStatus(message.status),
      timestamp: message.dateCreated,
      error: message.errorMessage || undefined
    };
  }

  // Helpers privados
  private getContentSid(templateName: string): string {
    // Mapear nombres de plantillas a ContentSids de Twilio
    const mapping: Record<string, string> = {
      'friendly_short': process.env.TWILIO_TEMPLATE_FRIENDLY_SHORT_SID!,
      'professional_detailed': process.env.TWILIO_TEMPLATE_PROFESSIONAL_SID!,
      'direct_minimal': process.env.TWILIO_TEMPLATE_DIRECT_SID!,
      'incentive_focused': process.env.TWILIO_TEMPLATE_INCENTIVE_SID!,
      'personalized_context': process.env.TWILIO_TEMPLATE_PERSONALIZED_SID!,
      'link_only': process.env.TWILIO_TEMPLATE_LINK_ONLY_SID!
    };

    return mapping[templateName] || mapping['friendly_short'];
  }

  private mapTwilioStatus(status: string): MessageStatus['status'] {
    const mapping: Record<string, MessageStatus['status']> = {
      'queued': 'queued',
      'sent': 'sent',
      'delivered': 'delivered',
      'read': 'read',
      'failed': 'failed',
      'undelivered': 'failed'
    };

    return mapping[status] || 'queued';
  }

  private isRetryableError(code?: number): boolean {
    // Twilio error codes que son retryables
    const retryableCodes = [
      21610, // Message throttled
      30006, // Upstream timeout
      30007, // Message filtered
      63007  // Carrier violation
    ];

    return code ? retryableCodes.includes(code) : false;
  }
}
```

---

## 🔵 Paso 3: Implementar Meta Provider

```typescript
// lib/whatsapp/meta-provider.ts

import axios, { AxiosInstance } from 'axios';
import { WhatsAppProvider, SendResult, MessageStatus, WhatsAppSurveyInvite } from './types';

export class MetaWhatsAppProvider implements WhatsAppProvider {
  private client: AxiosInstance;
  private phoneNumberId: string;

  constructor(config: {
    phoneNumberId: string;
    accessToken: string;
  }) {
    this.phoneNumberId = config.phoneNumberId;
    this.client = axios.create({
      baseURL: `https://graph.facebook.com/v18.0/${config.phoneNumberId}`,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  getName(): string {
    return 'Meta';
  }

  async sendTemplate(params: {
    to: string;
    templateName: string;
    languageCode: string;
    variables: Record<string, string>;
  }): Promise<SendResult> {
    try {
      // Construir componentes del template
      const components = this.buildTemplateComponents(params.templateName, params.variables);

      const response = await this.client.post('/messages', {
        messaging_product: 'whatsapp',
        to: params.to.replace('+', ''), // Meta no quiere el +
        type: 'template',
        template: {
          name: params.templateName,
          language: {
            code: params.languageCode
          },
          components
        }
      });

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error: any) {
      console.error('[Meta] Error sending message:', error.response?.data);

      const errorData = error.response?.data?.error;

      return {
        success: false,
        error: errorData?.message || error.message,
        errorCode: errorData?.code?.toString(),
        shouldRetry: this.isRetryableError(errorData?.code)
      };
    }
  }

  async sendSurveyInvite(params: WhatsAppSurveyInvite): Promise<SendResult> {
    return this.sendTemplate({
      to: params.to,
      templateName: 'friendly_short',
      languageCode: 'es_MX',
      variables: {
        '1': params.name,
        '2': params.topic,
        '3': params.questionCount.toString(),
        '4': params.surveyLink
      }
    });
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    // Meta no tiene API directo para status
    // Status viene via webhooks, debe guardarse en DB
    throw new Error('Meta status debe obtenerse desde DB (vía webhooks)');
  }

  // Helpers privados
  private buildTemplateComponents(templateName: string, variables: Record<string, string>) {
    // Meta espera parámetros en orden
    const orderedValues = Object.keys(variables)
      .sort() // '1', '2', '3', '4'
      .map(key => ({
        type: 'text',
        text: variables[key]
      }));

    return [
      {
        type: 'body',
        parameters: orderedValues
      }
    ];
  }

  private isRetryableError(code?: number): boolean {
    // Meta error codes retryables
    const retryableCodes = [
      4,     // API rate limit
      80007, // Message throttled
      131047 // Temporarily unavailable
    ];

    return code ? retryableCodes.includes(code) : false;
  }
}
```

---

## 🏭 Paso 4: Factory Pattern

```typescript
// lib/whatsapp/factory.ts

import { WhatsAppProvider } from './types';
import { TwilioWhatsAppProvider } from './twilio-provider';
import { MetaWhatsAppProvider } from './meta-provider';

export function createWhatsAppProvider(): WhatsAppProvider {
  const providerType = process.env.WHATSAPP_PROVIDER || 'twilio';

  switch (providerType) {
    case 'meta':
      return new MetaWhatsAppProvider({
        phoneNumberId: process.env.META_PHONE_NUMBER_ID!,
        accessToken: process.env.META_ACCESS_TOKEN!
      });

    case 'twilio':
    default:
      return new TwilioWhatsAppProvider({
        accountSid: process.env.TWILIO_ACCOUNT_SID!,
        authToken: process.env.TWILIO_AUTH_TOKEN!,
        fromNumber: process.env.TWILIO_WHATSAPP_NUMBER!
      });
  }
}

// Helper para obtener provider singleton
let cachedProvider: WhatsAppProvider | null = null;

export function getWhatsAppProvider(): WhatsAppProvider {
  if (!cachedProvider) {
    cachedProvider = createWhatsAppProvider();
  }

  return cachedProvider;
}
```

---

## 📦 Paso 5: Usar en API Routes

```typescript
// app/api/surveys/[id]/send-bulk/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getWhatsAppProvider } from '@/lib/whatsapp/factory';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { contacts } = await req.json();

    // Obtener survey
    const survey = await db.survey.findUnique({
      where: { id: params.id },
      include: { questions: true }
    });

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    // ✅ Obtener provider (agnóstico)
    const provider = getWhatsAppProvider();

    console.log(`📤 Enviando con proveedor: ${provider.getName()}`);

    const results = [];

    for (const contact of contacts) {
      // ✅ Usar interface unificada
      const result = await provider.sendSurveyInvite({
        to: contact.phone,
        name: contact.name,
        topic: survey.title,
        questionCount: survey.questions.length,
        surveyLink: `${process.env.NEXT_PUBLIC_APP_URL}/s/${survey.shortCode}`
      });

      // Guardar en DB
      await db.whatsappMessage.create({
        data: {
          surveyId: survey.id,
          recipientPhone: contact.phone,
          recipientName: contact.name,
          messageId: result.messageId,
          status: result.success ? 'sent' : 'failed',
          provider: provider.getName(),
          error: result.error
        }
      });

      results.push(result);

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1100));
    }

    return NextResponse.json({
      success: true,
      results,
      provider: provider.getName()
    });
  } catch (error) {
    console.error('❌ Error en bulk send:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Paso 6: Testing

```typescript
// lib/whatsapp/__tests__/providers.test.ts

import { TwilioWhatsAppProvider } from '../twilio-provider';
import { MetaWhatsAppProvider } from '../meta-provider';

describe('WhatsApp Providers', () => {
  describe('Twilio Provider', () => {
    it('should implement WhatsAppProvider interface', () => {
      const provider = new TwilioWhatsAppProvider({
        accountSid: 'ACtest',
        authToken: 'test',
        fromNumber: 'whatsapp:+14155238886'
      });

      expect(provider.sendTemplate).toBeDefined();
      expect(provider.sendSurveyInvite).toBeDefined();
      expect(provider.getMessageStatus).toBeDefined();
      expect(provider.getName()).toBe('Twilio');
    });

    it('should send survey invite', async () => {
      const provider = new TwilioWhatsAppProvider({
        accountSid: process.env.TWILIO_ACCOUNT_SID!,
        authToken: process.env.TWILIO_AUTH_TOKEN!,
        fromNumber: process.env.TWILIO_WHATSAPP_NUMBER!
      });

      const result = await provider.sendSurveyInvite({
        to: '+5215512345678',
        name: 'Juan Test',
        topic: 'testing',
        questionCount: 5,
        surveyLink: 'https://example.com/survey/abc'
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });

  describe('Meta Provider', () => {
    it('should implement WhatsAppProvider interface', () => {
      const provider = new MetaWhatsAppProvider({
        phoneNumberId: '123456',
        accessToken: 'test_token'
      });

      expect(provider.sendTemplate).toBeDefined();
      expect(provider.sendSurveyInvite).toBeDefined();
      expect(provider.getName()).toBe('Meta');
    });

    it('should send survey invite', async () => {
      const provider = new MetaWhatsAppProvider({
        phoneNumberId: process.env.META_PHONE_NUMBER_ID!,
        accessToken: process.env.META_ACCESS_TOKEN!
      });

      const result = await provider.sendSurveyInvite({
        to: '+5215512345678',
        name: 'Juan Test',
        topic: 'testing',
        questionCount: 5,
        surveyLink: 'https://example.com/survey/abc'
      });

      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
    });
  });
});
```

---

## 🔄 Paso 7: Migración entre Providers

```typescript
// scripts/migrate-provider.ts

/**
 * Script para migrar de Twilio a Meta (o viceversa)
 *
 * Uso:
 * node scripts/migrate-provider.js --from twilio --to meta
 */

import { db } from '@/lib/db';

async function migrateProvider(from: string, to: string) {
  console.log(`🔄 Migrando de ${from} a ${to}...`);

  // 1. Actualizar mensajes pendientes
  const pendingMessages = await db.whatsappMessage.updateMany({
    where: {
      provider: from,
      status: 'queued'
    },
    data: {
      provider: to,
      status: 'pending_migration'
    }
  });

  console.log(`✅ ${pendingMessages.count} mensajes marcados para migración`);

  // 2. Verificar templates en nuevo provider
  console.log('🔍 Verificando templates...');

  const templates = [
    'friendly_short',
    'professional_detailed',
    'direct_minimal',
    'incentive_focused',
    'personalized_context',
    'link_only'
  ];

  for (const template of templates) {
    // Verificar que exista en nuevo provider
    // (implementar según provider)
  }

  // 3. Actualizar variables de entorno
  console.log('⚙️ Actualizar .env con:');
  console.log(`WHATSAPP_PROVIDER=${to}`);

  // 4. Reiniciar servidor
  console.log('🔄 Reiniciar servidor para aplicar cambios');
}

// Ejecutar
const args = process.argv.slice(2);
const from = args[args.indexOf('--from') + 1];
const to = args[args.indexOf('--to') + 1];

migrateProvider(from, to);
```

---

## 📊 Paso 8: Analytics Multi-Provider

```typescript
// app/(dashboard)/analytics/whatsapp/page.tsx

import { db } from '@/lib/db';

export default async function WhatsAppAnalytics() {
  // Estadísticas por provider
  const statsByProvider = await db.whatsappMessage.groupBy({
    by: ['provider', 'status'],
    _count: true
  });

  const twilioStats = statsByProvider.filter(s => s.provider === 'Twilio');
  const metaStats = statsByProvider.filter(s => s.provider === 'Meta');

  // Calcular costos
  const twilioCount = twilioStats.reduce((sum, s) => sum + s._count, 0);
  const metaCount = metaStats.reduce((sum, s) => sum + s._count, 0);

  const twilioCost = twilioCount * 0.0042; // USD
  const metaCost = metaCount * 0.001; // USD promedio

  return (
    <div>
      <h1>WhatsApp Multi-Provider Analytics</h1>

      <div className="grid grid-cols-2 gap-4">
        <ProviderCard
          name="Twilio"
          messageCount={twilioCount}
          cost={twilioCost}
          stats={twilioStats}
        />

        <ProviderCard
          name="Meta Direct"
          messageCount={metaCount}
          cost={metaCost}
          stats={metaStats}
        />
      </div>

      <CostComparisonChart
        twilioCost={twilioCost}
        metaCost={metaCost}
      />
    </div>
  );
}
```

---

## 🎯 Variables de Entorno Finales

```bash
# .env

# Elegir provider activo
WHATSAPP_PROVIDER=twilio # o 'meta'

# Twilio (si WHATSAPP_PROVIDER=twilio)
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=xxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Template SIDs de Twilio
TWILIO_TEMPLATE_FRIENDLY_SHORT_SID=HXxxxxx
TWILIO_TEMPLATE_PROFESSIONAL_SID=HXxxxxx
TWILIO_TEMPLATE_DIRECT_SID=HXxxxxx
TWILIO_TEMPLATE_INCENTIVE_SID=HXxxxxx
TWILIO_TEMPLATE_PERSONALIZED_SID=HXxxxxx
TWILIO_TEMPLATE_LINK_ONLY_SID=HXxxxxx

# Meta (si WHATSAPP_PROVIDER=meta)
META_APP_ID=123456789012345
META_APP_SECRET=abcdef1234567890
META_WABA_ID=987654321098765
META_PHONE_NUMBER_ID=112233445566778
META_ACCESS_TOKEN=EAABwzLixnjYBO...
META_WEBHOOK_VERIFY_TOKEN=tu_token_secreto

# App URL
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
```

---

## ✅ Checklist de Implementación

```
□ Crear interface WhatsAppProvider en /lib/whatsapp/types.ts
□ Implementar TwilioWhatsAppProvider
□ Implementar MetaWhatsAppProvider
□ Crear factory pattern (createWhatsAppProvider)
□ Actualizar API route /send-bulk para usar factory
□ Agregar variables de entorno
□ Escribir tests para ambos providers
□ Implementar logging por provider
□ Dashboard de analytics multi-provider
□ Documentar para el equipo
```

---

## 🚀 Beneficios

### 1. Flexibilidad
```typescript
// Cambiar provider sin tocar código
WHATSAPP_PROVIDER=meta # en .env
// ✅ Todo funciona igual
```

### 2. Testing
```typescript
// Mock provider para tests
class MockWhatsAppProvider implements WhatsAppProvider {
  async sendSurveyInvite() {
    return { success: true, messageId: 'mock-123' };
  }
  // ...
}
```

### 3. Estrategia Híbrida
```typescript
// Usar ambos providers simultáneamente
function getProviderForCampaign(campaign: Campaign): WhatsAppProvider {
  if (campaign.priority === 'high') {
    return new TwilioWhatsAppProvider(); // Más confiable
  }

  return new MetaWhatsAppProvider(); // Más barato
}
```

### 4. Migración Gradual
```typescript
// Migrar en fases
if (user.isBetaTester) {
  provider = new MetaWhatsAppProvider();
} else {
  provider = new TwilioWhatsAppProvider();
}
```

---

## 🎓 Próximos Pasos

1. **Implementar abstraction layer** siguiendo esta guía
2. **Probar con ambos providers** en staging
3. **Decidir estrategia:**
   - Solo Twilio
   - Solo Meta
   - Híbrido (ambos)
4. **Migrar gradualmente** si aplica
5. **Monitorear costos** y ajustar

---

## 📚 Recursos

- [Twilio Provider Setup](../TWILIO_WHATSAPP_SETUP.md)
- [Meta Provider Setup](./META_WHATSAPP_SETUP.md)
- [Providers Comparison](./WHATSAPP_PROVIDERS_COMPARISON.md)

---

**Creado por:** ChatForm Team
**Última actualización:** 2025-11-03
**Versión:** 1.0
