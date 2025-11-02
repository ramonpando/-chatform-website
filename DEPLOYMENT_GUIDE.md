# 🚀 ChatForm - Guía de Deployment a Producción

**Fecha:** 2 Noviembre 2025
**Versión:** 1.0.0
**Estado:** ✅ BUILD EXITOSO

---

## ✅ BUILD VERIFICADO

El build de producción se completó exitosamente:

```bash
✓ Compiled successfully in 20.5s
✓ Running TypeScript ... PASSED
✓ Collecting page data ... DONE
✓ Generating static pages (30/30) in 1069.2ms
✓ Finalizing page optimization ... DONE
```

**Total de rutas generadas:** 39 rutas (18 APIs + 21 páginas)

---

## 📋 PRE-REQUISITOS

Antes de deployar a producción, asegúrate de tener:

### 1. **Dominio configurado**
- ✅ Dominio: `chatform.mx`
- ✅ DNS apuntando a tu servidor
- ✅ SSL/HTTPS configurado

### 2. **Servicios externos configurados**
- ✅ Supabase PostgreSQL (DATABASE_URL)
- ✅ Stripe en Test Mode (puede cambiarse a Live más tarde)
- ✅ OpenAI API Key
- ✅ Twilio WhatsApp configurado

### 3. **Variables de entorno listas**
Ver sección "Variables de Entorno" más abajo.

---

## 🎯 OPCIONES DE DEPLOYMENT

Elige la plataforma que prefieras:

### **Opción A: Vercel** (Recomendado para Next.js)
### **Opción B: Railway**
### **Opción C: Docker (cualquier servidor)**

---

## 🔑 VARIABLES DE ENTORNO PARA PRODUCCIÓN

Crea un archivo `.env.production` o configura estas variables en tu plataforma:

```env
# ========================================
# DATABASE
# ========================================
DATABASE_URL=postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

# ========================================
# NEXTAUTH
# ========================================
NEXTAUTH_SECRET=fBMTaMxL96CONdkZWP2YJZ0+Cn6Q4A8r44xOGVCNhPU=
NEXTAUTH_URL=https://chatform.mx

# ========================================
# STRIPE (TEST MODE - cambiar a LIVE cuando estés listo)
# ========================================
STRIPE_SECRET_KEY=sk_test_*** (copiar de .env.local)
STRIPE_PUBLISHABLE_KEY=pk_test_*** (copiar de .env.local)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_*** (copiar de .env.local)

# Price IDs (TEST MODE)
STRIPE_STARTER_PRICE_ID=price_*** (copiar de .env.local)
STRIPE_PRO_PRICE_ID=price_*** (copiar de .env.local)
STRIPE_BUSINESS_PRICE_ID=price_*** (copiar de .env.local)

# Webhook Secret (TEST MODE)
STRIPE_WEBHOOK_SECRET=whsec_*** (copiar de .env.local)

# ========================================
# OPENAI
# ========================================
OPENAI_API_KEY=sk-proj-*** (copiar de .env.local)

# ========================================
# TWILIO WHATSAPP
# ========================================
TWILIO_ACCOUNT_SID=AC*** (copiar de .env.local)
TWILIO_AUTH_TOKEN=*** (copiar de .env.local)
TWILIO_WHATSAPP_NUMBER=whatsapp:+*** (copiar de .env.local)

# ========================================
# APP URLS
# ========================================
NEXT_PUBLIC_APP_URL=https://chatform.mx
```

---

## 🚀 DEPLOYMENT POR PLATAFORMA

---

### **OPCIÓN A: VERCEL** (Más Fácil)

#### 1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

#### 2. **Login en Vercel**
```bash
vercel login
```

#### 3. **Deploy desde el directorio app**
```bash
cd app
vercel
```

#### 4. **Configurar Variables de Entorno**
```bash
# En Vercel Dashboard:
# 1. Ir a tu proyecto
# 2. Settings → Environment Variables
# 3. Copiar TODAS las variables de arriba
# 4. Seleccionar: Production, Preview, Development
```

#### 5. **Deploy a Producción**
```bash
vercel --prod
```

#### 6. **Configurar Dominio Custom**
```bash
# En Vercel Dashboard:
# Settings → Domains
# Agregar: chatform.mx
# Configurar DNS según instrucciones
```

**Tiempo estimado:** 15-20 minutos

---

### **OPCIÓN B: RAILWAY**

#### 1. **Instalar Railway CLI**
```bash
npm install -g @railway/cli
```

#### 2. **Login en Railway**
```bash
railway login
```

#### 3. **Inicializar proyecto**
```bash
cd app
railway init
```

#### 4. **Configurar Variables de Entorno**
```bash
# Opción 1: Desde CLI
railway variables set DATABASE_URL="postgresql://..."
railway variables set NEXTAUTH_SECRET="..."
# ... (todas las demás)

# Opción 2: Desde Dashboard
# 1. Ir a railway.app
# 2. Tu proyecto → Variables
# 3. Pegar todas las variables
```

#### 5. **Deploy**
```bash
railway up
```

#### 6. **Configurar Dominio**
```bash
# En Railway Dashboard:
# Settings → Domains
# Agregar: chatform.mx
```

**Tiempo estimado:** 20-25 minutos

---

### **OPCIÓN C: DOCKER (Cualquier Servidor)**

#### 1. **Crear Dockerfile**

Ya existe en `/root/chatform/app/Dockerfile` (si no, créalo):

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. **Build Docker Image**
```bash
cd app
docker build -t chatform:latest .
```

#### 3. **Crear archivo .env para producción**
```bash
cp .env.local .env.production
# Editar .env.production con las URLs de producción
```

#### 4. **Run Container**
```bash
docker run -d \
  --name chatform \
  -p 3000:3000 \
  --env-file .env.production \
  chatform:latest
```

#### 5. **Configurar Nginx como Reverse Proxy**
```nginx
# /etc/nginx/sites-available/chatform.mx
server {
    listen 80;
    server_name chatform.mx www.chatform.mx;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. **Habilitar SSL con Certbot**
```bash
sudo certbot --nginx -d chatform.mx -d www.chatform.mx
```

**Tiempo estimado:** 30-40 minutos

---

## 🔧 POST-DEPLOYMENT CHECKLIST

Después del deploy, verifica:

### **1. Health Check**
```bash
curl https://chatform.mx
# Debe retornar HTML de la landing page
```

### **2. Test Auth**
- ✅ Ir a https://chatform.mx/signup
- ✅ Crear cuenta
- ✅ Verificar login
- ✅ Verificar que crea tenant en DB

### **3. Test Stripe Webhook**
- ✅ Ir a Stripe Dashboard → Webhooks
- ✅ Verificar que el endpoint `https://chatform.mx/api/billing/webhook` esté configurado
- ✅ Enviar test event: `checkout.session.completed`
- ✅ Verificar logs en tu servidor

### **4. Test WhatsApp Webhook**
- ✅ Ir a Twilio Console → WhatsApp Sandbox Settings
- ✅ Configurar: `https://chatform.mx/api/webhooks/whatsapp`
- ✅ Enviar mensaje de prueba: `START_abc123`
- ✅ Verificar que funciona

### **5. Test AI Features**
- ✅ Crear encuesta
- ✅ Usar AI Conversational Builder
- ✅ Verificar que OpenAI responde
- ✅ Verificar que no hay errores en consola

### **6. Test Billing Flow**
- ✅ Ir a /settings/billing
- ✅ Click "Upgrade to Pro"
- ✅ Usar tarjeta test: 4242 4242 4242 4242
- ✅ Completar checkout
- ✅ Verificar que plan se actualiza en DB

---

## 🔐 SEGURIDAD POST-DEPLOYMENT

### **1. Actualizar Stripe Webhook en Producción**
```bash
# Si cambiaste el dominio, actualiza en Stripe Dashboard:
# Webhooks → Endpoints
# Edit: https://chatform.mx/api/billing/webhook
```

### **2. Actualizar Twilio Webhook**
```bash
# En Twilio Console:
# WhatsApp → Sandbox Settings
# When a message comes in: https://chatform.mx/api/webhooks/whatsapp
```

### **3. Rate Limiting** (Opcional pero recomendado)
Considera agregar rate limiting con:
- Upstash Redis + @upstash/ratelimit
- Cloudflare (automático)
- Nginx rate limiting

### **4. Monitoring** (Recomendado)
- **Sentry** para error tracking
- **Vercel Analytics** si usas Vercel
- **Uptime monitoring:** UptimeRobot, Pingdom

---

## 📊 MONITORING Y LOGS

### **Vercel:**
```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver logs de producción
vercel logs --production
```

### **Railway:**
```bash
# Ver logs
railway logs
```

### **Docker:**
```bash
# Ver logs del container
docker logs -f chatform

# Ver últimas 100 líneas
docker logs --tail 100 chatform
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Build falla en producción**
```bash
# Verificar que todas las env vars estén configuradas
# Verificar que DATABASE_URL sea accesible desde el servidor
# Revisar logs de build
```

### **Problema: Database connection error**
```bash
# Verificar que DATABASE_URL esté correcta
# Verificar que el servidor tenga acceso a Supabase
# Test manual:
psql $DATABASE_URL -c "SELECT 1"
```

### **Problema: Stripe webhook no funciona**
```bash
# Verificar STRIPE_WEBHOOK_SECRET
# Verificar que el endpoint esté accesible públicamente
# Test con Stripe CLI:
stripe listen --forward-to https://chatform.mx/api/billing/webhook
```

### **Problema: WhatsApp no envía mensajes**
```bash
# Verificar TWILIO credentials
# Verificar que el webhook esté configurado
# Verificar saldo en Twilio account
# Check logs en Twilio Console → Monitor → Logs
```

---

## 🔄 ROLLBACK (Si algo sale mal)

### **Vercel:**
```bash
# Ver deployments anteriores
vercel ls

# Promover deployment anterior a producción
vercel promote <deployment-url>
```

### **Railway:**
```bash
# Ver deployments
railway status

# Rollback al deployment anterior
railway rollback
```

### **Docker:**
```bash
# Detener container actual
docker stop chatform
docker rm chatform

# Volver a imagen anterior
docker run -d --name chatform -p 3000:3000 --env-file .env.production chatform:previous-tag
```

---

## 🎉 ¡LISTO PARA PRODUCCIÓN!

Tu aplicación ChatForm está ahora deployada y lista para recibir usuarios reales.

### **Próximos pasos:**
1. ✅ Verificar todos los tests de POST-DEPLOYMENT
2. ✅ Configurar monitoring y alertas
3. ✅ Hacer backup de la base de datos
4. ✅ Documentar runbook para equipo
5. ✅ Lanzar! 🚀

---

## 📞 SOPORTE

Si encuentras problemas durante el deployment:
1. Revisa logs de la plataforma
2. Verifica todas las env vars
3. Test cada integración individual
4. Revisa la sección de Troubleshooting

---

**Build Date:** 2 Noviembre 2025
**Build Status:** ✅ SUCCESSFUL
**TypeScript:** ✅ PASSED
**Production Ready:** ✅ YES

¡Éxito con tu lanzamiento! 🎊
