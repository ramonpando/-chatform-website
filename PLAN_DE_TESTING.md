# 🧪 Plan de Testing - ChatForm

**Fecha:** 2 Noviembre 2025
**Objetivo:** Probar todas las funcionalidades antes del lanzamiento

---

## 📋 ESTRATEGIA DE TESTING

### **Fases:**
1. ✅ Testing Local (localhost)
2. ✅ Testing Staging (antes de producción)
3. ✅ Testing Producción (post-deploy)

---

## 1️⃣ TESTING LOCAL (AHORA)

### **Pre-requisitos:**
```bash
cd app
npm run dev
# App corriendo en http://localhost:3000
```

---

### **A. Test Auth System** (15 minutos)

#### 1. **Signup:**
```
URL: http://localhost:3000/signup

Pasos:
1. Nombre: Test User
2. Email: test@chatform.mx
3. Password: Test1234!
4. Click "Crear cuenta"

✅ Verificar:
- Redirecciona a /dashboard
- Usuario logueado
- Session activa
- Tenant creado en DB
```

#### 2. **Login:**
```
URL: http://localhost:3000/login

Pasos:
1. Email: test@chatform.mx
2. Password: Test1234!
3. Click "Iniciar sesión"

✅ Verificar:
- Login exitoso
- Redirecciona a /dashboard
- Session persiste al recargar
```

#### 3. **Logout:**
```
Pasos:
1. Click en menú usuario
2. Click "Cerrar sesión"

✅ Verificar:
- Redirecciona a /login
- Session terminada
```

---

### **B. Test Survey Creation** (20 minutos)

#### 1. **Crear encuesta básica:**
```
URL: http://localhost:3000/surveys/new

Pasos:
1. Título: "Encuesta de Prueba"
2. Descripción: "Testing ChatForm"
3. Agregar pregunta "Multiple Choice":
   - Texto: "¿Cómo nos conociste?"
   - Opciones: "Google", "Redes Sociales", "Amigo"
4. Agregar pregunta "Rating":
   - Texto: "Califica del 1 al 10"
5. Agregar pregunta "Open Text":
   - Texto: "Comentarios adicionales"
6. Click "Guardar"

✅ Verificar:
- Survey guardada en DB
- Aparece en /surveys
- shortCode generado
```

#### 2. **Editar encuesta:**
```
Pasos:
1. Ir a /surveys
2. Click en encuesta creada
3. Modificar título
4. Agregar nueva pregunta
5. Guardar

✅ Verificar:
- Cambios guardados
- updatedAt actualizado
```

#### 3. **Eliminar encuesta:**
```
Pasos:
1. Ir a /surveys
2. Click eliminar
3. Confirmar

✅ Verificar:
- Survey eliminada
- Ya no aparece en lista
```

---

### **C. Test AI Features** (30 minutos)

#### 1. **AI Conversational Builder:**
```
URL: http://localhost:3000/surveys/new

Pasos:
1. Click "Chat con IA"
2. Escribir: "Quiero una encuesta de satisfacción de producto"
3. Enviar mensaje
4. IA sugiere preguntas
5. Escribir: "Agrega una pregunta de NPS"
6. IA agrega pregunta
7. Click "Aplicar Encuesta"

✅ Verificar:
- Chat responde correctamente
- Preguntas se agregan al draft
- Working draft preview funciona
- Apply inserta preguntas en form builder
- Contador de mensajes funciona (max 20)

⚠️ Si falla:
- Verificar OPENAI_API_KEY en .env.local
- Check console para errores
- Verificar que plan sea Pro/Business
```

#### 2. **AI Survey Generator:**
```
URL: http://localhost:3000/surveys/new

Pasos:
1. Click "Generar con IA" (si tienes botón)
2. O usar endpoint directo:
   POST http://localhost:3000/api/ai/generate-survey
   Body: {
     "description": "Encuesta de satisfacción de producto",
     "numQuestions": 5,
     "tone": "formal",
     "language": "es"
   }

✅ Verificar:
- Genera 5 preguntas
- Preguntas relevantes al tema
- Diferentes tipos de pregunta
- Response time < 10 segundos

⚠️ Si falla:
- Verificar OPENAI_API_KEY
- Check rate limit (5/hora)
- Verificar plan limits
```

#### 3. **AI Response Analyzer:**
```
Prerequisito: Tener encuesta con respuestas

Pasos:
1. Ir a /surveys/[id]/results
2. Click "Analizar Respuestas"
3. Esperar análisis (10-15 seg)

✅ Verificar:
- Sentiment analysis muestra %
- Themes extraídos
- Keywords listados
- Insights generados
- Recommendations presentes
- Botón "Regenerar" funciona

⚠️ Si falla:
- Verificar que haya respuestas open_text
- Mínimo 5 respuestas recomendado
- Plan debe ser Pro
```

---

### **D. Test WhatsApp Integration** (45 minutos)

#### **OPCIÓN 1: Test con Simulator (Más Rápido)**

```
URL: http://localhost:3000/surveys/[id]/edit

Pasos:
1. Crear encuesta con 3 preguntas
2. Click en tab "Preview" o "Simular"
3. Click "Iniciar Simulación"
4. Responder pregunta 1
5. Responder pregunta 2
6. Responder pregunta 3
7. Ver mensaje de "Gracias"

✅ Verificar:
- Typing indicators funcionan
- Validaciones funcionan:
  - Email: formato válido
  - Phone: 10 dígitos mínimo
  - Number: solo números
  - Rating: 1-10 solamente
- Progress counter (1/3, 2/3, 3/3)
- Botón "Reiniciar" funciona
- Auto-scroll a última pregunta
```

#### **OPCIÓN 2: Test con WhatsApp Real (Más Completo)**

**Prerequisitos:**
1. Twilio credentials en .env.local
2. Configurar webhook en Twilio Console

**Configuración Twilio Webhook:**
```
1. Ir a: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Click "WhatsApp Sandbox Settings"
3. En "When a message comes in":
   URL: http://localhost:3000/api/webhooks/whatsapp
   Method: HTTP POST

⚠️ PROBLEMA: localhost no es accesible desde Twilio

SOLUCIÓN: Usar ngrok
```

**Setup con ngrok:**
```bash
# 1. Instalar ngrok
brew install ngrok
# o descargar de https://ngrok.com/download

# 2. Exponer localhost
ngrok http 3000

# 3. Copiar URL pública
# Ejemplo: https://abc123.ngrok.io

# 4. Configurar en Twilio
When a message comes in: https://abc123.ngrok.io/api/webhooks/whatsapp
Method: HTTP POST

# 5. Activar sandbox
Enviar mensaje a tu número Twilio con:
join <codigo-sandbox>
```

**Test WhatsApp Real:**
```
Pasos:
1. Crear encuesta corta (2-3 preguntas)
2. Copiar shortCode (ej: abc123)
3. Desde tu WhatsApp personal, enviar a número Twilio:
   START_abc123

4. Responder preguntas una por una

5. Verificar en dashboard:
   - Session creada en DB
   - Respuestas guardadas
   - Stats actualizados

✅ Verificar:
- Recibe mensaje inicial
- Preguntas llegan en orden
- Validaciones funcionan
- Mensaje de gracias al final
- Respuestas en /surveys/[id]/results

⚠️ Troubleshooting:
- Si no llega mensaje: verificar ngrok URL
- Si da error: check logs con `ngrok http 3000 --log=stdout`
- Verificar TWILIO credentials en .env
```

---

### **E. Test Billing & Stripe** (30 minutos)

#### 1. **Checkout Flow:**
```
URL: http://localhost:3000/settings/billing

Pasos:
1. Plan actual: Free
2. Click "Upgrade to Pro"
3. Redirecciona a Stripe Checkout
4. Usar tarjeta de prueba:
   Número: 4242 4242 4242 4242
   CVV: 123
   Fecha: 12/25
   Nombre: Test User
5. Click "Subscribe"
6. Esperar redirect

✅ Verificar:
- Checkout session creada
- Stripe Customer creado
- Redirect a /settings/billing?success=true
- Plan actualizado a "pro" en DB
- subscriptionStatus = "active"
- stripeCustomerId guardado
- stripeSubscriptionId guardado

⚠️ Si falla:
- Verificar STRIPE_SECRET_KEY
- Verificar STRIPE_PRO_PRICE_ID
- Check webhook recibe evento
```

#### 2. **Webhook Events:**
```
Test manual de webhook:

# Opción A: Usar Stripe CLI
stripe listen --forward-to localhost:3000/api/billing/webhook
stripe trigger checkout.session.completed

# Opción B: Test en Stripe Dashboard
1. Ir a: https://dashboard.stripe.com/test/events
2. Click "+ Send test webhook"
3. Evento: checkout.session.completed
4. Endpoint: https://tu-url/api/billing/webhook

✅ Verificar console logs:
- "✅ Checkout completed for tenant..."
- Plan actualizado en DB
- subscriptionStatus = "active"
```

#### 3. **Cancel Subscription:**
```
URL: http://localhost:3000/settings/billing

Pasos:
1. Click "Cancel Subscription"
2. Confirmar
3. Esperar response

✅ Verificar:
- Status cambia a "canceling"
- cancel_at_period_end = true
- Mensaje de confirmación
- Acceso hasta fin de periodo
```

#### 4. **Customer Portal:**
```
URL: http://localhost:3000/settings/billing

Pasos:
1. Click "Manage Subscription"
2. Redirecciona a Stripe Portal
3. Ver historial de pagos
4. Ver método de pago
5. Click "Return to ChatForm"

✅ Verificar:
- Portal URL generada
- Redirect funciona
- Return URL correcto
```

---

### **F. Test Settings APIs** (20 minutos)

#### 1. **Update Profile:**
```
URL: http://localhost:3000/settings/profile

Pasos:
1. Cambiar nombre: "Test User Updated"
2. Click "Guardar"
3. Recargar página

✅ Verificar:
- Nombre actualizado en DB
- Muestra nuevo nombre en UI
- Navbar muestra nuevo nombre
```

#### 2. **Change Password:**
```
Pasos:
1. Current password: Test1234!
2. New password: NewPass123!
3. Confirm: NewPass123!
4. Click "Actualizar Contraseña"
5. Logout
6. Login con nuevo password

✅ Verificar:
- Password actualizado
- Hash en DB cambió
- Login con nuevo password funciona
- Login con viejo password falla
```

#### 3. **Update Workspace:**
```
URL: http://localhost:3000/settings/workspace

Pasos:
1. Cambiar nombre: "ChatForm Testing"
2. Cambiar slug: "chatform-test"
3. Click "Guardar"

✅ Verificar:
- Workspace actualizado en DB
- Slug único validado
- Solo owner/admin puede actualizar
```

#### 4. **Generate API Key:**
```
URL: http://localhost:3000/settings/api

Pasos:
1. Click "Generar API Key"
2. Copiar key (cfk_...)
3. Guardar en lugar seguro
4. Recargar página

✅ Verificar:
- Key empieza con "cfk_"
- Se muestra completa solo una vez
- Hash guardado en DB
- Prefix visible en UI
- Solo owner/admin puede generar
```

#### 5. **Revoke API Key:**
```
Pasos:
1. Click "Revocar"
2. Confirmar
3. Verificar mensaje

✅ Verificar:
- apiKeyHash = null en DB
- apiKeyPrefix = null en DB
- UI muestra "No tienes API key"
```

---

## 2️⃣ TESTING STAGING (PRE-PRODUCCIÓN)

### **Setup Staging:**
```bash
# 1. Deploy a ambiente staging
vercel --scope staging
# o
railway up --environment staging

# 2. Configurar env vars en plataforma
DATABASE_URL=...
NEXTAUTH_URL=https://staging.chatform.mx
NEXT_PUBLIC_APP_URL=https://staging.chatform.mx
... (todas las demás)

# 3. Configurar Stripe webhook para staging
https://staging.chatform.mx/api/billing/webhook
```

### **Tests en Staging:**
- ✅ Repetir TODOS los tests de local
- ✅ Test con URLs reales (no localhost)
- ✅ Test con SSL/HTTPS
- ✅ Test de performance (loading times)
- ✅ Test en diferentes browsers:
  - Chrome
  - Firefox
  - Safari
  - Mobile Chrome
  - Mobile Safari
- ✅ Test responsive design

---

## 3️⃣ TESTING PRODUCCIÓN (POST-DEPLOY)

### **Smoke Tests (Críticos):**

#### 1. **Health Check:**
```
GET https://chatform.mx
✅ Status 200
✅ Página carga < 3 segundos
```

#### 2. **Auth Flow:**
```
1. Signup nuevo usuario
2. Login
3. Logout
✅ Todo funciona sin errores
```

#### 3. **Create Survey:**
```
1. Crear encuesta
2. Publicar
3. Copiar link
✅ Survey funcional
```

#### 4. **WhatsApp:**
```
1. Enviar START_<code> a número production
2. Completar encuesta
3. Ver respuestas en dashboard
✅ E2E funcional
```

#### 5. **Stripe:**
```
⚠️ USAR TEST MODE EN PRODUCCIÓN PRIMERO
1. Upgrade a Pro (test card)
2. Verificar webhook
3. Verificar plan actualizado
✅ Billing funcional

Cuando estés listo para LIVE mode:
- Cambiar a Live keys
- Re-crear productos en Live mode
- Re-configurar webhook en Live mode
```

---

## 🐛 TROUBLESHOOTING COMÚN

### **Problema: AI no responde**
```
Causa: OPENAI_API_KEY inválida
Solución:
1. Verificar key en .env
2. Verificar saldo en OpenAI account
3. Check console: Network tab → request failed?
4. Verificar plan limits (Pro/Business only)
```

### **Problema: WhatsApp no envía mensajes**
```
Causa: Twilio credentials incorrectas
Solución:
1. Verificar TWILIO_ACCOUNT_SID
2. Verificar TWILIO_AUTH_TOKEN
3. Verificar TWILIO_WHATSAPP_NUMBER formato
4. Check Twilio console logs
5. Verificar saldo Twilio account
```

### **Problema: Stripe webhook no funciona**
```
Causa: Webhook secret incorrecto
Solución:
1. Verificar STRIPE_WEBHOOK_SECRET
2. Verificar URL en Stripe dashboard
3. Check signature verification en logs
4. Test con Stripe CLI:
   stripe trigger checkout.session.completed
```

### **Problema: Database connection failed**
```
Causa: DATABASE_URL incorrecta
Solución:
1. Verificar formato:
   postgresql://user:pass@host:5432/db
2. Verificar password escaping:
   $ → %24
3. Test conexión:
   psql $DATABASE_URL -c "SELECT 1"
```

---

## 📊 CHECKLIST FINAL

Antes de lanzar a producción, verificar:

### **Funcionalidad:**
- [ ] Auth (signup, login, logout)
- [ ] Survey CRUD (create, read, update, delete)
- [ ] AI Conversational Builder
- [ ] AI Survey Generator
- [ ] AI Response Analyzer
- [ ] WhatsApp E2E (enviar, recibir, guardar)
- [ ] Stripe Checkout
- [ ] Stripe Webhooks
- [ ] Cancel Subscription
- [ ] Customer Portal
- [ ] Settings (profile, workspace, api keys)
- [ ] Analytics y reportes
- [ ] CSV export

### **Performance:**
- [ ] Página carga < 3 segundos
- [ ] API response < 500ms (promedio)
- [ ] AI response < 10 segundos
- [ ] WhatsApp response < 5 segundos
- [ ] No memory leaks
- [ ] Database queries optimizadas

### **Security:**
- [ ] HTTPS habilitado
- [ ] API keys nunca en logs
- [ ] Password hashing funcional
- [ ] RBAC enforcement en todas las APIs
- [ ] Stripe webhook signature verification
- [ ] Rate limiting en AI endpoints
- [ ] No credentials en código

### **UX:**
- [ ] Error messages claros
- [ ] Loading states en todos los botones
- [ ] Success notifications
- [ ] Mobile responsive
- [ ] Accesibilidad básica (aria-labels)
- [ ] Tooltips en features complejas

---

## 📈 MÉTRICAS A MONITOREAR

Post-launch, trackear:

### **Técnicas:**
- API error rate (< 1%)
- API latency (p95 < 1000ms)
- Database query time (p95 < 100ms)
- WhatsApp delivery rate (> 95%)
- Stripe webhook success rate (> 99%)

### **Negocio:**
- Signup conversions
- Free → Paid conversion
- Churn rate
- MRR (Monthly Recurring Revenue)
- Customer Lifetime Value

### **Producto:**
- Surveys created
- WhatsApp responses received
- AI generations used
- Response completion rate

---

## 🎯 PRÓXIMO PASO

1. **Ahora:** Ejecutar testing local (2-3 horas)
2. **Hoy:** Deploy a staging (30 min)
3. **Mañana:** Testing staging completo (2 horas)
4. **Cuando esté listo:** Deploy a producción
5. **Post-launch:** Monitoring y optimización

---

**¿Empezamos con el testing local?** 🧪

Dime cuál test quieres hacer primero y te guío paso a paso.
