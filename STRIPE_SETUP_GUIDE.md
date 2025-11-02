# Guía Completa de Setup de Stripe - ChatForm

**Fecha:** 2 Noviembre 2025
**Tiempo estimado total:** 2-3 horas

---

## RESUMEN

Stripe te permitirá:
- ✅ Cobrar suscripciones mensuales ($39, $99, $299)
- ✅ Gestionar upgrades/downgrades automáticos
- ✅ Customer Portal para que usuarios cancelen
- ✅ Webhooks para sincronizar estado de pagos

---

## PASO 1: CREAR CUENTA STRIPE (15 minutos)

### 1.1 Registro
1. Ir a https://dashboard.stripe.com/register
2. Ingresar email y crear contraseña
3. Verificar email
4. Completar información del negocio:
   - Nombre de negocio: ChatForm
   - País: (tu país)
   - Tipo de negocio: SaaS

### 1.2 Activar modo Test
- Por defecto estarás en "Test Mode" (toggle en la esquina superior derecha)
- **IMPORTANTE:** Haz todo el setup en Test Mode primero
- Solo cambiarás a Production cuando estés listo para cobrar de verdad

**Resultado:** Cuenta Stripe creada ✅

---

## PASO 2: OBTENER API KEYS (5 minutos)

### 2.1 Navegar a API Keys
```
Dashboard → Developers → API Keys
```

### 2.2 Copiar las keys de TEST
Verás 2 keys:

**Publishable key** (empieza con `pk_test_`)
```
pk_test_51ABC123...
```

**Secret key** (empieza con `sk_test_`)
```
sk_test_51ABC123...
```

### 2.3 Agregar a .env.local
```bash
# Stripe Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_51ABC123...
STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
```

**⚠️ IMPORTANTE:**
- `STRIPE_SECRET_KEY` es secreta, NUNCA la expongas en frontend
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` es pública, se puede usar en cliente

**Resultado:** API Keys configuradas ✅

---

## PASO 3: CREAR PRODUCTOS Y PRECIOS (30 minutos)

### 3.1 Navegar a Products
```
Dashboard → Products → Add product
```

### 3.2 Crear Product 1: ChatForm Starter

**Product info:**
- Name: `ChatForm Starter`
- Description: `Plan Starter - 3 encuestas, 200 respuestas WhatsApp/mes`

**Pricing:**
- Pricing model: `Recurring`
- Price: `$39.00`
- Billing period: `Monthly`

Click **Save product**

**Copiar Price ID:**
- Verás algo como: `price_1ABC123...`
- Copiar este ID

### 3.3 Crear Product 2: ChatForm Pro

**Product info:**
- Name: `ChatForm Pro`
- Description: `Plan Pro - Encuestas ilimitadas, 1000 respuestas WhatsApp/mes, AI Features`

**Pricing:**
- Pricing model: `Recurring`
- Price: `$99.00`
- Billing period: `Monthly`

Click **Save product**

**Copiar Price ID:**
- `price_1DEF456...`

### 3.4 Crear Product 3: ChatForm Business

**Product info:**
- Name: `ChatForm Business`
- Description: `Plan Business - Todo ilimitado, 3000 respuestas WhatsApp/mes, Priority support`

**Pricing:**
- Pricing model: `Recurring`
- Price: `$299.00`
- Billing period: `Monthly`

Click **Save product**

**Copiar Price ID:**
- `price_1GHI789...`

### 3.5 Agregar Price IDs a .env.local
```bash
# Stripe Price IDs (Test Mode)
STRIPE_STARTER_PRICE_ID=price_1ABC123...
STRIPE_PRO_PRICE_ID=price_1DEF456...
STRIPE_BUSINESS_PRICE_ID=price_1GHI789...
```

**Resultado:** 3 productos creados ✅

---

## PASO 4: CONFIGURAR WEBHOOK (20 minutos)

### 4.1 ¿Qué es un Webhook?
Stripe te enviará eventos cuando:
- Un usuario pague exitosamente
- Una suscripción se cancele
- Un pago falle
- etc.

Tu app necesita recibir estos eventos para actualizar el plan del usuario.

### 4.2 Crear Webhook Endpoint

**Opción A: Development (Local testing)**

Si estás testeando localmente:
```
Dashboard → Developers → Webhooks → Add endpoint

Endpoint URL: https://tu-dominio-temporal.ngrok.io/api/billing/webhook
(Necesitarás ngrok o similar para exponer localhost)
```

**Opción B: Production/Staging**

Si ya tienes dominio:
```
Endpoint URL: https://chatform.io/api/billing/webhook
```

### 4.3 Seleccionar Eventos

Haz click en **"Select events"** y marca estos 5:

✅ `checkout.session.completed`
✅ `customer.subscription.updated`
✅ `customer.subscription.deleted`
✅ `invoice.payment_succeeded`
✅ `invoice.payment_failed`

### 4.4 Copiar Webhook Secret

Después de crear el endpoint, verás un **Signing secret**:
```
whsec_ABC123...
```

### 4.5 Agregar a .env.local
```bash
# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_ABC123...
```

**Resultado:** Webhook configurado ✅

---

## PASO 5: TESTING LOCAL CON STRIPE CLI (30 minutos)

### 5.1 Instalar Stripe CLI

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Descargar desde https://github.com/stripe/stripe-cli/releases
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.0/stripe_1.19.0_linux_x86_64.tar.gz
tar -xvf stripe_1.19.0_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Windows:**
```bash
# Usar Scoop
scoop install stripe
```

### 5.2 Login en Stripe CLI
```bash
stripe login
```

Se abrirá el browser para autorizar. Click en **Allow access**.

### 5.3 Forward Webhooks a localhost

En una terminal separada, ejecuta:
```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

Verás algo como:
```
> Ready! Your webhook signing secret is whsec_ABC123XYZ (^C to quit)
```

**⚠️ IMPORTANTE:** Copia ese webhook secret y agrégalo a `.env.local`:
```bash
# Stripe Webhook Secret (LOCAL testing)
STRIPE_WEBHOOK_SECRET=whsec_ABC123XYZ
```

**Déjalo corriendo** - esta terminal debe estar activa mientras testees localmente.

### 5.4 Trigger Test Events

En OTRA terminal:
```bash
# Test checkout completado
stripe trigger checkout.session.completed

# Test subscription updated
stripe trigger customer.subscription.updated

# Test payment succeeded
stripe trigger invoice.payment_succeeded
```

Verás los eventos llegar a tu localhost. Revisa logs en consola.

**Resultado:** Testing local funcionando ✅

---

## PASO 6: CONFIGURAR CUSTOMER PORTAL (15 minutos)

El Customer Portal permite que tus usuarios:
- Vean su suscripción actual
- Cambien método de pago
- Cancelen su suscripción
- Vean historial de facturas

### 6.1 Activar Portal
```
Dashboard → Settings → Billing → Customer Portal
```

### 6.2 Configurar Opciones

**Business information:**
- Business name: ChatForm
- Support email: support@tudominio.com

**Functionality:**
- ✅ Allow customers to update payment methods
- ✅ Allow customers to cancel subscriptions
- ✅ Allow customers to switch plans (upgrade/downgrade)

**Cancellation behavior:**
- ⚪ Cancel immediately
- ⚫ Cancel at end of billing period (recomendado)

**Invoice template:**
- Personalizar colores con tu branding (opcional)

Click **Save changes**

**Resultado:** Customer Portal activado ✅

---

## PASO 7: TARJETAS DE PRUEBA (Test Cards)

Para testear pagos en Test Mode, usa estas tarjetas:

### Tarjetas que FUNCIONAN ✅
```
Número: 4242 4242 4242 4242
CVV: Cualquier 3 dígitos
Fecha: Cualquier fecha futura
Nombre: Cualquier nombre
```

### Tarjetas que FALLAN ❌
```
# Card declined
Número: 4000 0000 0000 0002

# Insufficient funds
Número: 4000 0000 0000 9995

# Expired card
Número: 4000 0000 0000 0069
```

### Tarjetas con 3D Secure
```
# Requiere autenticación
Número: 4000 0025 0000 3155
```

**Documentación completa:** https://stripe.com/docs/testing

---

## PASO 8: .ENV COMPLETO

Tu `.env.local` debería verse así:

```bash
# Database
DATABASE_URL=postgresql://postgres:...@db.xxx.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your-secret-32-chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (opcional)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_1...
STRIPE_PRO_PRICE_ID=price_1...
STRIPE_BUSINESS_PRICE_ID=price_1...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## PASO 9: CREAR BILLING APIs (Siguiente paso)

Ahora que Stripe está configurado, necesitas crear 4 endpoints:

### APIs a implementar:

1. **`POST /api/billing/create-checkout`**
   - Crea sesión de Stripe Checkout
   - Usuario hace click en "Upgrade to Pro"
   - Se abre Stripe checkout
   - Usuario paga
   - Stripe redirige de vuelta a tu app

2. **`POST /api/billing/webhook`**
   - Recibe eventos de Stripe
   - Actualiza plan en DB cuando pago exitoso
   - Maneja cancelaciones
   - Maneja pagos fallidos

3. **`POST /api/billing/cancel-subscription`**
   - Cancela suscripción del usuario
   - Llama a Stripe API
   - Actualiza DB

4. **`GET /api/billing/portal`**
   - Genera URL del Customer Portal
   - Usuario puede gestionar su suscripción

**Tiempo estimado:** 6-8 horas de implementación

---

## MODO PRODUCCIÓN (Cuando estés listo)

### Cambiar de Test a Live Mode:

1. **Activar cuenta Stripe:**
   - Dashboard → Settings → Account
   - Completar información de negocio
   - Agregar cuenta bancaria
   - Verificar identidad (puede tomar 1-2 días)

2. **Obtener Live API Keys:**
   - Dashboard → Toggle "Test mode" OFF
   - Ir a Developers → API Keys
   - Copiar `pk_live_...` y `sk_live_...`

3. **Recrear Products en Live Mode:**
   - Los productos de Test mode NO se transfieren
   - Crear los 3 products de nuevo
   - Copiar nuevos Price IDs

4. **Crear Webhook en Live Mode:**
   - Dashboard (Live mode) → Webhooks
   - Agregar endpoint con URL de producción
   - Copiar nuevo webhook secret

5. **Actualizar .env.production:**
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_live_...
   STRIPE_STARTER_PRICE_ID=price_live_...
   STRIPE_PRO_PRICE_ID=price_live_...
   STRIPE_BUSINESS_PRICE_ID=price_live_...
   ```

---

## TROUBLESHOOTING

### Webhook no llega a localhost
**Problema:** Eventos no se reciben
**Solución:**
1. Verificar que `stripe listen` está corriendo
2. Verificar que puerto sea correcto (3000)
3. Verificar que app esté corriendo en `npm run dev`

### Error "Invalid API key"
**Problema:** Stripe rechaza la key
**Solución:**
1. Verificar que key empiece con `sk_test_` (test) o `sk_live_` (prod)
2. Copiar key completa sin espacios
3. Verificar que esté en `.env.local`, no `.env`

### Test card declined
**Problema:** Tarjeta de prueba no funciona
**Solución:**
1. Usar exactamente `4242 4242 4242 4242`
2. Verificar que estés en Test Mode
3. Cualquier CVV y fecha futura funciona

### Webhook signature verification failed
**Problema:** Error al verificar webhook
**Solución:**
1. Verificar que `STRIPE_WEBHOOK_SECRET` sea correcto
2. Si estás usando Stripe CLI, copiar el secret que te da al hacer `stripe listen`
3. Si es producción, copiar del dashboard

---

## RECURSOS ÚTILES

- **Dashboard:** https://dashboard.stripe.com
- **Documentación:** https://stripe.com/docs
- **Test Cards:** https://stripe.com/docs/testing
- **Webhooks:** https://stripe.com/docs/webhooks
- **Checkout:** https://stripe.com/docs/payments/checkout
- **Customer Portal:** https://stripe.com/docs/billing/subscriptions/integrating-customer-portal

---

## PRÓXIMOS PASOS

1. ✅ Completar este setup (2-3 horas)
2. ⏳ Implementar 4 Billing APIs (6-8 horas) - TE DIGO CUANDO TERMINES ESTE SETUP
3. ⏳ Testing end-to-end (2 horas)
4. ⏳ Deploy a producción (1 hora)
5. ⏳ Activar Live mode (cuando estés listo para cobrar)

**Total para tener billing funcional:** ~12-15 horas

---

## RESUMEN DE COSTOS

**Stripe Fees:**
- 2.9% + $0.30 por transacción exitosa
- Ejemplo: Suscripción de $99/mes = $2.87 + $0.30 = **$3.17 de fee**
- Tú recibes: **$95.83**

**Sin costos mensuales** - Solo pagas por transacciones exitosas.

---

¿Listo para empezar? Comienza con el **PASO 1** y ve avanzando. Cuando termines, me dices y te ayudo a implementar las Billing APIs.
