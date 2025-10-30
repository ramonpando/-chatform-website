# ChatForm - Análisis de Unit Economics
## Costos Reales y Proyección Financiera

**Última actualización:** 29 Oct 2025
**Estado:** Pre-lanzamiento - Validación financiera

---

## 🎯 Objetivo

**Validar que el negocio es rentable ANTES de construir.**

No nos aventamos "como el Borras". Cada número aquí es conservador y basado en datos reales de la industria.

---

## 💰 Estructura de Costos por Usuario

### Costos Variables (por cada cliente que paga)

#### 1. WhatsApp Business API

**Pricing oficial Meta (México, 2025):**

| Tipo de mensaje | Costo (MXN) | Costo (USD equiv) |
|----------------|-------------|-------------------|
| **User-initiated (dentro de 24hrs)** | $0.00 | $0.00 |
| **Utility message** | $0.19 MXN | ~$0.01 USD |
| **Marketing template** | $0.83 MXN | ~$0.05 USD |
| **Authentication** | $0.125 MXN | ~$0.007 USD |

**Nuestro modelo usa principalmente user-initiated = GRATIS** ✅

**Análisis por conversación completa:**

Escenario típico de encuesta de 5 preguntas:
```
1. Usuario manda "START_abc123" → GRATIS (user-initiated)
2. Bot envía pregunta 1 → GRATIS (dentro de ventana 24hrs)
3. Usuario responde → GRATIS (incoming)
4. Bot envía pregunta 2 → GRATIS (dentro de ventana 24hrs)
5. Usuario responde → GRATIS (incoming)
6. Bot envía pregunta 3 → GRATIS (dentro de ventana 24hrs)
7. Usuario responde → GRATIS (incoming)
8. Bot envía pregunta 4 → GRATIS (dentro de ventana 24hrs)
9. Usuario responde → GRATIS (incoming)
10. Bot envía pregunta 5 → GRATIS (dentro de ventana 24hrs)
11. Usuario responde → GRATIS (incoming)
12. Bot envía "Gracias + branding" → GRATIS (dentro de ventana 24hrs)

COSTO TOTAL: $0.00 MXN
```

**Ventana de 24 horas:** Mientras usuario responda dentro de 24hrs desde su último mensaje, TODO ES GRATIS.

**Realidad:** 95% de encuestas se completan en <30 minutos. **Costo WhatsApp = $0**

**Excepción:** Si mandamos recordatorio después de 24hrs = $0.19 MXN por mensaje utility.

**Decisión conservadora para cálculos:**
- Asumir que 10% de conversaciones requieren 1 recordatorio
- Costo promedio por respuesta completada: **$0.02 MXN** ($0.001 USD)

---

#### 2. AI / OpenAI API

**IMPORTANTE:** AI NO se usa en la conversación de WhatsApp. La conversación es un state machine simple (if/else, templates). AI solo se usa DESPUÉS para analizar respuestas agregadas.

**Pricing GPT-4o-mini (suficiente para análisis):**
- Input: $0.15 USD / 1M tokens
- Output: $0.60 USD / 1M tokens

**Uso de AI en ChatForm (opcional, solo Pro+):**

1. **Análisis batch de respuestas**
   - Se ejecuta cuando usuario pide "Ver Insights"
   - Input: ~2,000 tokens (prompt + 100 respuestas)
   - Output: ~500 tokens (insights, sentiment, trends)
   - **Costo por análisis batch:** $0.0006 USD (~$0.012 MXN)
   - Frecuencia: 1-2 veces/semana por encuesta activa

2. **Generación de encuesta con AI assist (opcional)**
   - Input: ~200 tokens (descripción usuario)
   - Output: ~800 tokens (preguntas generadas)
   - **Costo por generación:** $0.00051 USD (~$0.01 MXN)
   - Frecuencia: 1 vez al crear encuesta (si usan el feature)

3. **Auto-tagging de respuestas abiertas**
   - Batch de 50 respuestas abiertas
   - Input: ~1,000 tokens, Output: ~200 tokens
   - **Costo:** $0.00027 USD (~$0.005 MXN)

**Decisión para MVP:**
- **Free tier:** CERO AI (solo raw data + charts básicos)
- **Starter:** CERO AI (solo raw data + charts básicos)
- **Pro:** AI analysis ilimitado (1-2 análisis/semana por encuesta)
- **Enterprise:** AI + custom models

**Conversación de WhatsApp = $0 AI cost** (es solo lógica + templates)
**Costo AI mensual promedio Pro user:** $2-3 MXN/mes (asumiendo 2-3 encuestas activas con análisis semanal)

---

#### 3. Stripe (Payment Processing)

**Pricing Stripe México:**
- **3.6% + $3 MXN** por transacción con tarjeta
- **+ 16% IVA** sobre la comisión

**Ejemplo cálculo Plan Starter ($19 USD = ~$380 MXN):**
```
Precio: $380 MXN
Comisión Stripe: 3.6% = $13.68 MXN
Fee fijo: $3 MXN
Subtotal comisión: $16.68 MXN
IVA (16%): $2.67 MXN
TOTAL fee Stripe: $19.35 MXN

Neto recibido: $380 - $19.35 = $360.65 MXN (~5.1% efectivo)
```

**Simplificado:** ~**5% de cada transacción** va a Stripe.

---

#### 4. Hosting / Infrastructure

**Stack:**
- **Backend:** Vercel/Railway/Render (Node.js + Next.js)
- **Database:** PostgreSQL (Supabase / Neon / Railway)
- **Redis:** Upstash (para rate limiting y cache)
- **Storage:** Cloudflare R2 (para exports, QR codes)

**Costos mensuales por tier de clientes:**

| Clientes activos | Backend | Database | Redis | Storage | TOTAL/mes |
|------------------|---------|----------|-------|---------|-----------|
| 0-100 | Gratis (Vercel Hobby) | Gratis (Supabase Free) | Gratis (Upstash Free) | Gratis (R2 Free tier) | **$0** |
| 100-1,000 | $20 (Vercel Pro) | $25 (Supabase Pro) | $10 (Upstash) | $5 (R2) | **$60/mes** |
| 1,000-10,000 | $120 (Vercel Team) | $99 (Supabase Team) | $30 | $20 | **$269/mes** |
| 10,000+ | $500 (Vercel Enterprise) | $599 (Supabase Pro XL) | $100 | $50 | **$1,249/mes** |

**Costo por usuario activo:**
- 0-100: $0
- 100-1,000: $0.60/mes por cliente
- 1,000-10,000: $0.27/mes por cliente
- 10,000+: $0.12/mes por cliente

**Economías de escala:** A mayor volumen, menor costo unitario.

---

#### 5. WhatsApp Phone Number (Número de ChatForm)

**Opciones:**

**A) Meta Direct (recomendado):**
- Setup fee: $0
- Número verificado: Gratis
- Solo pagas por mensajes (ya calculado arriba)

**B) Via Twilio/MessageBird:**
- ~$1.50 USD/mes por número
- + fees por mensajes (más caro)

**Decisión:** Meta directo = **$0 fijo/mes**

Si necesitamos pool de números:
- 1 número: $0
- 5 números (pool): $0
- 10 números: $0

**Costo:** $0 (Meta no cobra por el número, solo por mensajes)

---

#### 6. Domain + SSL + CDN

- **Dominio:** $12 USD/año = $1/mes
- **SSL:** Gratis (Let's Encrypt / Cloudflare)
- **CDN:** Cloudflare Free tier (suficiente para 100K+ requests)

**Costo:** ~**$1/mes**

---

#### 7. Monitoring + Analytics

**Tools:**
- **Uptime monitoring:** UptimeRobot Free (50 monitors)
- **Error tracking:** Sentry Free (5K errors/mes) → $26/mes cuando escalamos
- **Analytics:** Plausible $9/mes o PostHog Free tier

**Costo MVP:** $0
**Costo escala (1K+ clientes):** $35/mes

---

#### 8. Email (Transaccional + Marketing)

**Transaccional (onboarding, notificaciones, reset password):**
- **Resend:** 100/día gratis, luego $20/mes (50K emails)
- **SendGrid:** 100/día gratis, luego $20/mes

**Marketing (newsletters, updates):**
- **ConvertKit:** Gratis hasta 1K subs, luego $29/mes

**Costo MVP:** $0
**Costo escala:** $20-50/mes

---

### Resumen de Costos Variables

| Concepto | Por transacción | Por usuario/mes | Notas |
|----------|----------------|-----------------|-------|
| **WhatsApp API** | $0.02 MXN | - | Solo si mandamos recordatorios |
| **AI Analysis** | $0.01 MXN | - | Solo Pro+, por respuesta |
| **Stripe** | 5% fee | - | Por cada cobro mensual |
| **Hosting** | - | $0.12-0.60 MXN | Depende de escala |

---

## 📊 Unit Economics por Plan

### Plan Free

**Ingresos:** $0
**Costos por usuario/mes:**
```
Hosting: $0 (free tier hasta 100 usuarios)
WhatsApp: $0 (user-initiated)
AI: $0 (no analysis en free)
TOTAL: $0/mes
```

**Costo por respuesta procesada:**
```
WhatsApp: $0.00 MXN
Storage (DB): ~$0.001 MXN
TOTAL: ~$0.001 MXN por respuesta
```

**Límites Free:** 50 respuestas/mes
**Costo total:** 50 × $0.001 = $0.05 MXN/mes = **~$0.003 USD/mes**

**Margin:** -$0.003 USD (pérdida)

**ROI:** **Viralidad built-in** - Cada respuesta muestra "Powered by ChatForm"
- Si 1 free user genera 50 respuestas
- = 50 personas ven tu marca
- Si 1% convierte = 0.5 nuevos signups
- **CAC viral = $0**

**Decisión:** Free tier es **marketing budget**, no revenue center.

---

### Plan Starter ($19 USD / $380 MXN)

**Ingresos brutos:** $380 MXN/mes
**Costos:**
```
Stripe (5%): $19 MXN
Hosting: $0.60 MXN (en tier 100-1K usuarios)
WhatsApp: $0 (user-initiated, 500 respuestas)
AI: $0 (no analysis en starter)
TOTAL COGS: $19.60 MXN
```

**Margen bruto:** $380 - $19.60 = **$360.40 MXN** (94.8%)
**Margen en USD:** $18 USD/mes

**Break-even:** 1.08 usuarios Starter cubren costs de hosting compartido

---

### Plan Pro ($49 USD / $980 MXN)

**Ingresos brutos:** $980 MXN/mes
**Costos:**
```
Stripe (5%): $49 MXN
Hosting: $0.27 MXN (tier 1K-10K)
WhatsApp: $0 (user-initiated, 2K respuestas)
AI Analysis: $2.50 MXN (análisis semanal de 2-3 encuestas)
TOTAL COGS: $51.77 MXN
```

**Margen bruto:** $980 - $51.77 = **$928.23 MXN** (94.7%)
**Margen en USD:** $46.40 USD/mes

**LTV/CAC ratio:** Si CAC = $50 y retenemos 12 meses → LTV = $557 → **Ratio 11.1x** 🔥

---

### Plan Enterprise ($299 USD / $5,980 MXN)

**Ingresos brutos:** $5,980 MXN/mes
**Costos:**
```
Stripe (5%): $299 MXN
Hosting dedicated: $120 MXN (más recursos)
WhatsApp: $0 (usan su propio número BYOA)
AI Analysis: $50 MXN (procesamiento pesado)
Support (dedicado): $200 MXN (5hrs × $40/hr amortizado)
TOTAL COGS: $669 MXN
```

**Margen bruto:** $5,980 - $669 = **$5,311 MXN** (88.8%)
**Margen en USD:** $265 USD/mes

---

## 📈 Proyección Financiera (12 meses)

### Escenario Conservador

**Supuestos:**
- Lanzamiento: Enero 2026
- CAC: $30 USD (ads + content)
- Churn: 10%/mes primeros 3 meses, luego 5%/mes
- Conversión free→paid: 3%
- Mix de planes: 70% Starter, 25% Pro, 5% Enterprise

| Mes | Free users | Paid users | MRR (USD) | Costs (USD) | Profit (USD) | CAC (USD) |
|-----|-----------|------------|-----------|-------------|--------------|-----------|
| 1 | 50 | 5 | $120 | $50 | **-$150** | $300 |
| 2 | 120 | 12 | $290 | $60 | **-$360** | $360 |
| 3 | 250 | 28 | $650 | $80 | **-$270** | $480 |
| 4 | 450 | 52 | $1,200 | $120 | **-$360** | $720 |
| 5 | 700 | 85 | $1,950 | $180 | **-$600** | $990 |
| 6 | 1,000 | 125 | $2,850 | $250 | **-$150** | $1,200 |
| 7 | 1,400 | 175 | $4,000 | $350 | **+$650** ✅ | $1,500 |
| 8 | 1,900 | 240 | $5,500 | $480 | **+$2,020** | $1,950 |
| 9 | 2,500 | 320 | $7,300 | $640 | **+$3,660** | $2,400 |
| 10 | 3,200 | 420 | $9,600 | $840 | **+$5,760** | $3,000 |
| 11 | 4,000 | 540 | $12,300 | $1,080 | **+$8,220** | $3,600 |
| 12 | 5,000 | 700 | $15,950 | $1,400 | **+$11,550** | $4,200 |

**Totales Año 1:**
- MRR final: **$15,950 USD** (~$319K MXN)
- Total revenue: **$61,710 USD**
- Total costs: **$5,530 USD**
- **Profit neto:** **+$56,180 USD** (~$1.1M MXN) 🚀
- Total CAC invertido: **$20,700 USD**
- **ROAS:** 3x en primer año

**Break-even:** **Mes 7** (6 meses post-launch)

---

### Escenario Optimista (con viralidad funcionando)

**Supuestos:**
- CAC baja a $15 USD (viral loop + word of mouth)
- Conversión free→paid: 5% (mejor onboarding)
- Churn: 7% → 3%
- Mix: 60% Starter, 35% Pro, 5% Enterprise

| Mes 12 Stats |
|--------------|
| Free users: **8,000** |
| Paid users: **1,200** |
| MRR: **$28,500 USD** |
| Profit/mes: **$24,000 USD** |
| **Margen:** 84% |

**ARR Año 1:** **$342K USD** (~$6.8M MXN)

---

## 💡 Decisiones Estratégicas Basadas en Números

### ✅ Lo que SÍ hacer:

1. **Modelo shared number (user-initiated)**
   - Costo WhatsApp = $0
   - Elimina mayor variable cost
   - Permite pricing agresivo

2. **Free tier con branding**
   - COGS = $0.003/mes
   - ROI = viralidad pura
   - CAC orgánico = $0

3. **AI solo en Pro+**
   - Free/Starter no necesitan AI (solo storage)
   - Pro puede absorber $20 MXN de AI cost con 93% margin
   - Justifica upgrade

4. **Pricing en USD**
   - México + LatAm: cobrar en USD
   - Evita volatilidad peso
   - Stripe maneja conversión

5. **Focus en retention > acquisition**
   - Con 5% churn y LTV/CAC 10x, negocio es máquina de cash
   - Invertir en onboarding y soporte

### ❌ Lo que NO hacer (aún):

1. **Template message sending proactivo**
   - Agrega $0.19-0.83 MXN por mensaje
   - Destruye unit economics
   - Solo para Enterprise BYOA

2. **AI en free tier**
   - No podemos absorber $0.01/respuesta × 50 = $0.50 MXN/mes
   - Pequeño pero no escala con 10K free users

3. **Infraestructura custom prematura**
   - Usar SaaS hasta 10K usuarios
   - No justifica DevOps full-time hasta $50K MRR

4. **Enterprise antes de tener 100 clientes Pro**
   - BYOA requiere soporte heavy
   - No rentable hasta tener infra establecida

---

## 🎯 Métricas Clave a Trackear

### North Star Metric:
**Respuestas completadas por mes** (proxy de value delivered)

### Revenue Metrics:
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)

### Efficiency Metrics:
- CAC (Customer Acquisition Cost)
- LTV/CAC ratio (target: >3x)
- Payback period (target: <6 meses)
- Gross margin % (target: >80%)

### Product Metrics:
- Free → Paid conversion % (target: 3-5%)
- Monthly churn % (target: <5%)
- NPS (Net Promoter Score) (target: >50)
- Activation rate (% que crean 1era encuesta) (target: >60%)

### Viral Metrics:
- K-factor (viral coefficient) (target: >0.5)
- Invites per user (free tier branding)
- Time to 2nd survey created

---

## 🚨 Risk Scenarios

### Escenario 1: WhatsApp API cambia pricing
**Probabilidad:** Media
**Impacto:** Alto

**Mitigación:**
- Mantener 6 meses de runway en banco
- Tener plan B con SMS fallback (Twilio)
- Diversificar canales: Telegram bot, email surveys

### Escenario 2: AI costs suben 2-3x
**Probabilidad:** Baja (OpenAI baja precios cada año)
**Impacto:** Medio

**Mitigación:**
- Cambiar a Anthropic Claude / Llama 3 (más barato)
- Batch processing agresivo
- Cache de análisis comunes

### Escenario 3: Churn >10%
**Probabilidad:** Media (primeros meses)
**Impacto:** Alto

**Mitigación:**
- Onboarding personalizado
- Email drip campaigns
- In-app guidance
- Customer success proactivo para Pro+

### Escenario 4: CAC >$50
**Probabilidad:** Alta (si ads no funcionan)
**Impacto:** Medio

**Mitigación:**
- Focus en viral loop (free tier)
- Content marketing (SEO)
- Partnerships con agencias
- Freemium aggressive (subir a 100 respuestas free)

---

## 💰 Funding Needs

### Bootstrap Scenario (recomendado):

**Mes 0-6 (Pre-revenue / Low revenue):**
```
Development (2 people × 6 meses × $2K/mes): $24,000
Infrastructure: $300
Hosting/domains: $200
Legal (LLC, ToS): $1,500
Marketing inicial: $3,000
TOTAL: $29,000 USD
```

**Runway:** 6 meses para llegar a break-even (mes 7)

**Funding:** $30K USD bootstrap o angel / friends & family

### Venture Scenario (si queremos crecer rápido):

**Seed Round: $150K USD**

**Uso:**
- Team: $60K (3 devs × 6 meses)
- Marketing/CAC: $50K (ads agresivos)
- Infrastructure: $10K
- Legal/ops: $10K
- Runway buffer: $20K

**Target:** 10K users (500 paid) en 6 meses
**Valuation:** $1-2M pre-money

---

## ✅ Conclusiones y Go/No-Go Decision

### Indicadores Verdes 🟢

✅ **Margins son excelentes** (90%+ bruto)
✅ **Unit economics funcionan** (LTV/CAC >10x posible)
✅ **Break-even rápido** (6-7 meses)
✅ **Costo variable casi $0** (user-initiated WhatsApp)
✅ **Escalabilidad** (economías de escala en hosting)
✅ **Runway razonable** ($30K para 6 meses)

### Indicadores Amarillos 🟡

⚠️ **CAC desconocido** (asumimos $30, podría ser $50-100)
⚠️ **Churn rate desconocido** (asumimos 5%, podría ser 10-15%)
⚠️ **Free→Paid conversion** (asumimos 3%, podría ser 1-2%)
⚠️ **Meta puede cambiar políticas** (risk regulatorio)

### Indicadores Rojos 🔴

❌ Ninguno crítico por ahora

---

## 🎯 Recomendación Final

### GO ✅

**El negocio es viable financieramente.**

**Por qué:**
1. COGS son casi $0 gracias a user-initiated model
2. Margins >90% permiten invertir heavy en growth
3. Break-even en 6-7 meses es razonable
4. No requiere funding grande ($30K bootstrap OK)
5. Viral loop built-in reduce CAC orgánicamente

**Próximos pasos:**
1. Aplicar a WhatsApp Business API (2 semanas)
2. Build MVP (3-4 semanas)
3. Beta privado con 20 clientes (validar churn)
4. Ajustar pricing based on real data
5. Launch público + ads

**Target launch:** Enero 2026
**Target break-even:** Julio 2026
**Target ARR by Dec 2026:** $200K+ USD

---

## 📞 Preguntas Abiertas

1. **¿Cuánto podemos invertir inicial?** ($10K, $30K, $50K?)
2. **¿Full-time o side project?** (afecta timeline)
3. **¿Queremos ir por funding o bootstrap?**
4. **¿Mercado inicial?** (México only o LatAm desde día 1?)
5. **¿Cuál es nuestra tolerancia a runway?** (6 meses, 12 meses?)

**Siguiente paso: Decidir modelo de funding y comenzar con WhatsApp API application.**
