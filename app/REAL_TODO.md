# ChatForm - TODO REAL para MVP Funcional

**Fecha:** 31 Oct 2025
**Estado Actual:** 70% (no 95% como dije antes - fui optimista)

---

## ❌ FEATURES CRÍTICAS FALTANTES

### 1. **AI Survey Generator** - CRÍTICO ⚠️
**Estado:** No implementado (0%)
**Prioridad:** ALTA - Es el diferenciador clave del producto

**Lo que falta:**
- Integración con OpenAI API
- Prompt engineering para generar encuestas
- UI en `/surveys/new` con input de texto
- "Describe tu encuesta" → AI genera título + preguntas
- Preview de lo generado
- Botón "Usar" o "Regenerar"

**Archivos a crear/modificar:**
- `/api/ai/generate-survey` POST endpoint
- Modificar `/surveys/new/page.tsx` para agregar AI mode
- Component `<AiSurveyGenerator />`

**Tiempo estimado:** 6-8 horas

---

### 2. **AI Insights & Analysis** - CRÍTICO ⚠️
**Estado:** No implementado (0%)
**Prioridad:** ALTA - Feature vendido en todos los planes

**Lo que falta:**
- Análisis de respuestas abiertas con OpenAI
- Sentiment analysis (positivo/negativo/neutral)
- Resumen automático de insights
- NPS calculation
- Temas/keywords extraction
- UI en `/surveys/[id]/results` para mostrar insights

**Archivos a crear:**
- `/api/ai/analyze-responses` POST endpoint
- Component `<AiInsights />` en results page
- Background job para análisis automático

**Tiempo estimado:** 8-10 horas

---

### 3. **Survey Demo/Preview Interactivo** - CRÍTICO ⚠️
**Estado:** Preview estático existe, NO es interactivo (20%)
**Prioridad:** ALTA - Los usuarios necesitan testear antes de publicar

**Lo que falta:**
- Simulador de WhatsApp en browser
- Chat interface que simule el flujo real
- Estado de conversación (pregunta actual, respuestas)
- Validación de respuestas (rating 1-10, opciones válidas)
- Botones de "Siguiente" o input según tipo
- Vista previa del resultado final
- Botón "Resetear" para volver a empezar

**Archivos a crear:**
- Component `<WhatsAppSimulator />` (client component)
- Modificar preview en survey editor
- Agregar en `/surveys/[id]/share` como "Test Survey"

**Tiempo estimado:** 4-6 horas

---

### 4. **WhatsApp Business API Integration** - CRÍTICO ⚠️
**Estado:** Webhook existe, NO hay conexión real (30%)
**Prioridad:** ALTA - Sin esto el producto no funciona

**Lo que falta:**

#### Opción A: Twilio (más fácil, $)
- Crear cuenta Twilio
- Configurar WhatsApp Business Profile
- Obtener número de WhatsApp
- Configurar webhook URL en Twilio
- Testing con número real
- Agregar credentials a env vars

#### Opción B: Meta WhatsApp Cloud API (gratis, más complejo)
- Crear Meta Business Account
- Solicitar WhatsApp Business API access
- Verificar business
- Obtener Phone Number ID
- Configurar webhook
- Testing en sandbox primero

**Archivos a modificar:**
- `.env` con credenciales
- `/api/webhooks/whatsapp/route.ts` (ya existe, ajustar según provider)
- Función `sendWhatsAppMessage` (ya existe, verificar)

**Documentación necesaria:**
- Guía de setup en `/docs/whatsapp-setup.md`
- Troubleshooting

**Tiempo estimado:** 3-4 horas (setup + testing)

---

### 5. **Google OAuth Configuration** - MEDIA PRIORIDAD ⚠️
**Estado:** Código existe, NO configurado (50%)
**Prioridad:** MEDIA - El login con email funciona

**Lo que falta:**
- Crear Google Cloud Project
- Habilitar Google OAuth API
- Crear OAuth 2.0 Credentials
- Configurar redirect URIs
- Agregar `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` a `.env`
- Testing del flujo completo
- Manejo de errores en OAuth

**Archivos a modificar:**
- `.env.local` y `.env.production`
- Posibles ajustes en `/lib/auth/config.ts`

**Tiempo estimado:** 1-2 horas

---

### 6. **API Endpoints para Settings** - MEDIA PRIORIDAD ⚠️
**Estado:** UI existe, APIs NO existen (0%)
**Prioridad:** MEDIA - Settings se muestran pero no se pueden guardar

**Endpoints faltantes:**

#### a) `/api/user/profile` PATCH
```typescript
// Actualizar nombre, email, password del usuario
{
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}
```

#### b) `/api/tenant` PATCH
```typescript
// Actualizar workspace
{
  name?: string;
  slug?: string;
}
```

#### c) `/api/tenant/api-key` POST & DELETE
```typescript
// POST: Generar nueva API key
// DELETE: Revocar API key existente
```

**Archivos a crear:**
- `/api/user/profile/route.ts`
- `/api/tenant/route.ts`
- `/api/tenant/api-key/route.ts`

**Tiempo estimado:** 3-4 horas

---

### 7. **Database Setup** - CRÍTICO ⚠️
**Estado:** Schema definido, NO en base de datos (0%)
**Prioridad:** CRÍTICA - Nada funciona sin esto

**Lo que falta:**
1. Crear proyecto en Supabase
2. Obtener `DATABASE_URL`
3. Configurar `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=http://localhost:3000
```
4. Push schema: `npm run db:push`
5. Verificar tablas en Supabase dashboard
6. Seed data de prueba (opcional)

**Tiempo estimado:** 30 min - 1 hora

---

### 8. **Stripe Checkout Flow** - BAJA PRIORIDAD (Post-MVP)
**Estado:** UI de billing existe, checkout NO (10%)
**Prioridad:** BAJA - Puede agregarse después

**Lo que falta:**
- Crear cuenta Stripe
- Crear products y prices
- Implementar Stripe Checkout Session
- Webhook para actualizar subscriptions
- Customer Portal para cancelar

**Tiempo estimado:** 6-8 horas

---

## 📊 PROGRESO REAL

```
Pantallas (UI):           ████████████████████   95% ✅
Auth básico:              ████████████████████   95% ✅
Survey CRUD:              ████████████████████   95% ✅
WhatsApp webhook:         ██████░░░░░░░░░░░░░░   30% ⚠️
AI Generator:             ░░░░░░░░░░░░░░░░░░░░    0% ❌
AI Insights:              ░░░░░░░░░░░░░░░░░░░░    0% ❌
Demo Interactivo:         ████░░░░░░░░░░░░░░░░   20% ❌
Google OAuth:             ██████████░░░░░░░░░░   50% ⚠️
Settings APIs:            ░░░░░░░░░░░░░░░░░░░░    0% ❌
Database:                 ░░░░░░░░░░░░░░░░░░░░    0% ❌
Stripe:                   ░░░░░░░░░░░░░░░░░░░░    0% ⏸️

TOTAL MVP REAL:           ██████████████░░░░░░   70% ⚠️
```

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### **Fase 1: Hacer que funcione básicamente** (6-8 horas)
**Objetivo:** Poder crear y responder una encuesta real

1. ✅ **Database Setup** (1h)
   - Supabase + db:push
   - Verificar que queries funcionen

2. ✅ **WhatsApp Connection** (3-4h)
   - Decidir: Twilio o Meta API
   - Setup y testing
   - Enviar primera encuesta real

3. ✅ **Settings APIs** (2-3h)
   - Profile update
   - Workspace update
   - API key generation

**Total Fase 1:** 6-8 horas → App funcional al 85%

---

### **Fase 2: Features de AI** (14-18 horas)
**Objetivo:** Diferenciadores clave del producto

4. ✅ **AI Survey Generator** (6-8h)
   - OpenAI integration
   - UI con modo AI
   - Testing y refinamiento

5. ✅ **AI Insights** (8-10h)
   - Análisis de respuestas
   - Sentiment analysis
   - NPS calculation
   - UI de insights

**Total Fase 2:** 14-18 horas → App funcional al 95%

---

### **Fase 3: Polish & Extras** (6-8 horas)
**Objetivo:** Mejorar UX

6. ✅ **Demo Interactivo** (4-6h)
   - WhatsApp simulator
   - Testing flow

7. ✅ **Google OAuth** (1-2h)
   - Configurar credentials
   - Testing

8. ⏸️ **Stripe** (post-launch)
   - Puede esperar

**Total Fase 3:** 6-8 horas → App funcional al 100%

---

## ⏱️ TIEMPO TOTAL REAL

| Fase | Horas | Prioridad |
|------|-------|-----------|
| Fase 1: Funcional Básico | 6-8h | 🔴 CRÍTICA |
| Fase 2: AI Features | 14-18h | 🔴 CRÍTICA |
| Fase 3: Polish | 6-8h | 🟡 ALTA |
| **TOTAL para MVP real** | **26-34h** | - |

**Con 6-8 horas/día:** 4-5 días de trabajo

---

## 🚦 PRIORIDADES PARA MAÑANA

### **Sesión 1: Database (URGENTE - 1h)**
1. Crear Supabase project
2. Configurar `.env.local`
3. `npm run db:push`
4. Verificar conexión

### **Sesión 2: WhatsApp (CRÍTICO - 3-4h)**
1. Decidir provider (Twilio recomendado para MVP)
2. Setup account
3. Configurar webhook
4. Test real con tu número

### **Sesión 3: Settings APIs (2-3h)**
1. `/api/user/profile`
2. `/api/tenant`
3. `/api/tenant/api-key`

**Total día:** 6-8 horas → App funcional básicamente

---

## 💡 DECISIONES A TOMAR

1. **WhatsApp Provider:**
   - Twilio ($$ pero fácil, rápido) ← Recomiendo para MVP
   - Meta Cloud API (gratis pero burocrático)

2. **AI Provider:**
   - OpenAI GPT-4 (mejor calidad, $$)
   - OpenAI GPT-3.5 (más barato, bueno)
   - Anthropic Claude (alternativa)

3. **Launch Strategy:**
   - Opción A: Completar todo (26-34h más)
   - Opción B: Launch sin AI, agregar después
   - Opción C: Launch con AI Generator solamente (más rápido)

**Mi recomendación:** Opción A o C. El AI es el diferenciador clave.

---

## 📝 CONCLUSIÓN

**Progreso REAL: ~70%**

Lo que **SÍ tienes:**
- ✅ UI completa y pulida
- ✅ Auth funcionando
- ✅ CRUD de encuestas
- ✅ Webhook de WhatsApp (código existe)
- ✅ Schema de DB diseñado

Lo que **FALTA (crítico):**
- ❌ Database conectada (30 min)
- ❌ WhatsApp funcionando en producción (3-4h)
- ❌ AI Generator (6-8h)
- ❌ AI Insights (8-10h)
- ❌ Settings APIs (2-3h)

**Próximo paso:** Empezar por Database y WhatsApp mañana. Sin eso, nada funciona.

¿Empezamos mañana con Database setup?
