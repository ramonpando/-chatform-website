# API Requirements - ChatForm

**Fecha:** 2 Noviembre 2025
**Estado:** Documentación de APIs faltantes y requirements de Stripe

---

## ESTADO ACTUAL DE APIs

### ✅ APIs Implementadas (14 endpoints)

#### Auth (2)
- ✅ `POST /api/auth/signup` - Registro de usuarios
- ✅ `ALL /api/auth/[...nextauth]` - NextAuth handlers

#### AI Features (4)
- ✅ `POST /api/ai/generate-survey` - Generar encuesta con AI
- ✅ `POST /api/ai/analyze-responses` - Analizar respuestas
- ✅ `POST /api/ai/survey-chat` - Chat conversacional
- ✅ `GET /api/ai/usage` - Ver uso de AI

#### Surveys (5)
- ✅ `GET /api/surveys` - Listar encuestas
- ✅ `POST /api/surveys` - Crear encuesta
- ✅ `GET /api/surveys/[id]` - Obtener encuesta
- ✅ `PUT /api/surveys/[id]` - Actualizar encuesta
- ✅ `DELETE /api/surveys/[id]` - Eliminar encuesta

#### Survey Features (3)
- ✅ `GET /api/surveys/[id]/customization` - Obtener branding
- ✅ `PUT /api/surveys/[id]/customization` - Actualizar branding
- ✅ `GET /api/surveys/[id]/export` - Exportar a CSV

#### Public APIs (3)
- ✅ `GET /api/public/surveys/[shortCode]` - Encuesta pública
- ✅ `GET /api/v1/surveys/[id]/responses/export` - Exportar respuestas
- ✅ `POST /api/v1/surveys/[id]/trigger` - Trigger encuesta

#### Webhooks (1)
- ✅ `POST /api/webhooks/whatsapp` - Webhook de WhatsApp

**Total implementadas:** 14 endpoints ✅

---

## ❌ APIs FALTANTES (7 endpoints)

### 1. User Profile API

#### `GET /api/user/profile`
**Purpose:** Obtener perfil del usuario actual
**Auth:** Required (session)
**Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  image?: string;
}
```

#### `PATCH /api/user/profile`
**Purpose:** Actualizar perfil del usuario
**Auth:** Required (session)
**Request Body:**
```typescript
{
  name?: string;
  email?: string;
  currentPassword?: string;  // Required if changing email
  newPassword?: string;      // Optional: cambiar contraseña
}
```
**Validations:**
- Name: min 2 caracteres
- Email: formato válido, único en DB
- Si cambia email: validar currentPassword
- Si newPassword: validar currentPassword, min 8 caracteres
**Response:**
```typescript
{
  success: true;
  user: {
    id: string;
    name: string;
    email: string;
  }
}
```

**Tiempo estimado:** 2 horas

---

### 2. Tenant/Workspace API

#### `GET /api/tenant`
**Purpose:** Obtener información del workspace actual
**Auth:** Required (session)
**Response:**
```typescript
{
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'pro' | 'business';
  createdAt: Date;
  subscriptionStatus?: string;
  apiKeyPrefix?: string;
  limits: {
    maxSurveys: number;
    maxWhatsAppResponses: number;
    responsesUsedThisMonth: number;
    aiGenerationsThisMonth: number;
  }
}
```

#### `PATCH /api/tenant`
**Purpose:** Actualizar workspace
**Auth:** Required (owner or admin role)
**Request Body:**
```typescript
{
  name?: string;
  slug?: string;
}
```
**Validations:**
- Name: min 2 caracteres, max 100
- Slug: lowercase, alphanumeric + hyphens, único en DB
- Solo owner/admin puede actualizar
**Response:**
```typescript
{
  success: true;
  tenant: {
    id: string;
    name: string;
    slug: string;
  }
}
```

**Tiempo estimado:** 1.5 horas

---

### 3. API Keys Management

#### `POST /api/api-keys`
**Purpose:** Generar nueva API key
**Auth:** Required (owner or admin role)
**Request Body:**
```typescript
{
  name: string;  // Nombre descriptivo de la key
}
```
**Logic:**
1. Generar key: `cfk_` + nanoid(32)
2. Hash con bcrypt
3. Guardar hash y prefix en DB
4. Retornar key SOLO UNA VEZ
**Response:**
```typescript
{
  success: true;
  apiKey: string;  // "cfk_abc123..." - MOSTRAR SOLO UNA VEZ
  prefix: string;  // "cfk_abc" (primeros 7 chars)
  name: string;
  createdAt: Date;
  warning: "Guarda esta key ahora. No podrás verla de nuevo."
}
```

#### `GET /api/api-keys`
**Purpose:** Listar API keys (sin mostrar key completa)
**Auth:** Required (owner or admin role)
**Response:**
```typescript
{
  apiKeys: [
    {
      id: string;
      name: string;
      prefix: string;  // "cfk_abc"
      createdAt: Date;
      lastUsedAt?: Date;
    }
  ]
}
```

#### `DELETE /api/api-keys/[id]`
**Purpose:** Revocar API key
**Auth:** Required (owner or admin role)
**Response:**
```typescript
{
  success: true;
  message: "API key revoked"
}
```

**Tiempo estimado:** 3 horas

**Archivos relacionados:**
- Utilidades ya existen en `/app/src/lib/security/api-keys.ts`
- Solo falta implementar endpoints

---

### 4. Billing/Stripe APIs

#### `POST /api/billing/create-checkout`
**Purpose:** Crear sesión de Stripe Checkout
**Auth:** Required (owner role)
**Request Body:**
```typescript
{
  priceId: string;  // Stripe Price ID (price_xxx)
  plan: 'starter' | 'pro' | 'business';
}
```
**Logic:**
1. Validar que usuario es owner
2. Verificar que tenant no tiene suscripción activa
3. Crear Stripe Customer si no existe
4. Crear Stripe Checkout Session
5. Retornar URL de checkout
**Response:**
```typescript
{
  success: true;
  checkoutUrl: string;  // URL de Stripe Checkout
  sessionId: string;
}
```

#### `POST /api/billing/webhook`
**Purpose:** Manejar webhooks de Stripe
**Auth:** Stripe signature verification
**Events a manejar:**
1. `checkout.session.completed`
   - Activar suscripción
   - Actualizar plan en tenant
   - Actualizar stripeCustomerId y stripeSubscriptionId
2. `customer.subscription.updated`
   - Actualizar subscriptionStatus
3. `customer.subscription.deleted`
   - Downgrade a plan Free
   - Resetear limits
4. `invoice.payment_succeeded`
   - Log del pago
5. `invoice.payment_failed`
   - Notificar al usuario
**Response:**
```typescript
{ received: true }
```

#### `POST /api/billing/cancel-subscription`
**Purpose:** Cancelar suscripción
**Auth:** Required (owner role)
**Logic:**
1. Validar que hay suscripción activa
2. Cancelar en Stripe (cancel_at_period_end: true)
3. Actualizar subscriptionStatus
**Response:**
```typescript
{
  success: true;
  message: "Subscription will cancel at period end",
  cancelAt: Date;
}
```

#### `GET /api/billing/portal`
**Purpose:** Crear enlace a Stripe Customer Portal
**Auth:** Required (owner role)
**Logic:**
1. Verificar que hay stripeCustomerId
2. Crear portal session
3. Retornar URL
**Response:**
```typescript
{
  success: true;
  portalUrl: string;
}
```

**Tiempo estimado:** 6-8 horas

---

## STRIPE REQUIREMENTS

### Qué necesitas de Stripe:

#### 1. Cuenta Stripe
**Paso 1:** Crear cuenta
- Ir a https://dashboard.stripe.com/register
- Completar información de negocio
- Verificar email

#### 2. API Keys (Test Mode primero)
**Paso 2:** Obtener keys de test
```
Dashboard → Developers → API Keys

Keys necesarias:
✅ Publishable key: pk_test_...
✅ Secret key: sk_test_...
```

Agregar a `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### 3. Crear Products y Prices
**Paso 3:** Crear productos

```
Dashboard → Products → Add product

Product 1: ChatForm Starter
- Price: $39/month
- Recurring: Monthly
- Copiar Price ID: price_xxx_starter

Product 2: ChatForm Pro
- Price: $99/month
- Recurring: Monthly
- Copiar Price ID: price_xxx_pro

Product 3: ChatForm Business
- Price: $299/month
- Recurring: Monthly
- Copiar Price ID: price_xxx_business
```

Agregar a `.env.local`:
```env
STRIPE_STARTER_PRICE_ID=price_xxx_starter
STRIPE_PRO_PRICE_ID=price_xxx_pro
STRIPE_BUSINESS_PRICE_ID=price_xxx_business
```

#### 4. Configurar Webhook
**Paso 4:** Setup webhook endpoint

```
Dashboard → Developers → Webhooks → Add endpoint

Endpoint URL: https://tu-dominio.com/api/billing/webhook

Events to listen:
✅ checkout.session.completed
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed

Copiar Webhook Secret: whsec_xxx
```

Agregar a `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

#### 5. Configurar Customer Portal (Opcional pero recomendado)
**Paso 5:** Habilitar portal

```
Dashboard → Settings → Billing → Customer Portal

Configurar:
✅ Allow customers to update payment methods
✅ Allow customers to cancel subscriptions
✅ Allow customers to switch plans

Invoice template: Personalizar con tu branding
```

#### 6. Test con Stripe CLI (Desarrollo local)
**Paso 6:** Testing webhooks localmente

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks a localhost
stripe listen --forward-to localhost:3000/api/billing/webhook

# Copiar el webhook secret que te da (whsec_xxx)
# Agregarlo a .env.local como STRIPE_WEBHOOK_SECRET
```

**Test cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

CVV: Cualquier 3 dígitos
Fecha: Cualquier fecha futura
```

---

## RESUMEN DE TRABAJO NECESARIO

### APIs Faltantes (Total: 12-15 horas)

| API | Endpoints | Tiempo |
|-----|-----------|--------|
| User Profile | GET, PATCH | 2h |
| Tenant | GET, PATCH | 1.5h |
| API Keys | POST, GET, DELETE | 3h |
| Billing | 4 endpoints | 6-8h |

### Stripe Setup (Total: 2-3 horas)

| Tarea | Tiempo |
|-------|--------|
| Crear cuenta y verificar | 30 min |
| Crear products/prices | 30 min |
| Configurar webhook | 30 min |
| Testing local | 1h |
| Documentación | 30 min |

---

## PRIORIZACIÓN RECOMENDADA

### Opción A: Solo Settings (4-6h)
Si NO necesitas billing aún:
1. ✅ User Profile API (2h)
2. ✅ Tenant API (1.5h)
3. ✅ API Keys API (3h)

**Resultado:** Usuarios pueden actualizar perfil, workspace, generar API keys

### Opción B: Full Production Ready (15-20h)
Si quieres monetizar:
1. ✅ Settings APIs (4-6h)
2. ✅ Billing APIs (6-8h)
3. ✅ Stripe setup (2-3h)
4. ✅ Testing E2E (2-3h)

**Resultado:** App 100% funcional con pagos

### Opción C: Demo Mode (0h)
Continuar sin implementar:
- Settings muestran UI pero no guardan
- Billing muestra planes pero no procesa pagos
- Perfecto para demos y testing

**Resultado:** App funcional para demostración

---

## SIGUIENTE PASO RECOMENDADO

### Para ti ahora:

**Decisión 1:** ¿Necesitas billing/Stripe ahora o después?
- **Ahora** → Vamos con Opción B (full production)
- **Después** → Vamos con Opción A (solo settings)
- **Demo solo** → Opción C (no hacer nada)

**Decisión 2:** Si eliges Stripe:
- ¿Ya tienes cuenta Stripe? Sí/No
- ¿Modo test o producción? Test primero
- ¿Necesitas ayuda con setup? Sí → puedo guiarte

---

## ARCHIVOS A CREAR

### Si implementamos Settings APIs:
```
app/src/app/api/user/profile/route.ts
app/src/app/api/tenant/route.ts
app/src/app/api/api-keys/route.ts
app/src/app/api/api-keys/[id]/route.ts
```

### Si implementamos Billing:
```
app/src/app/api/billing/create-checkout/route.ts
app/src/app/api/billing/webhook/route.ts
app/src/app/api/billing/cancel-subscription/route.ts
app/src/app/api/billing/portal/route.ts
```

### Utilidades adicionales:
```
app/src/lib/stripe/client.ts (Stripe SDK client)
app/src/lib/stripe/webhooks.ts (Webhook handlers)
app/src/lib/stripe/plans.ts (Plan mapping)
```

---

**¿Qué prefieres hacer?** Dime y empezamos con lo que necesites.
