# Dokploy Deployment Guide - ChatForm

Guía completa para deployar ChatForm en Dokploy.

---

## 🚨 Problema: Redirects a localhost

**Síntoma**: Los botones del website redirigen a `http://localhost:3002` en lugar de tu dominio.

**Causa**: Variable de entorno `NEXT_PUBLIC_APP_URL` no configurada correctamente en Dokploy.

**Solución**: Configurar variables de entorno en Dokploy.

---

## 📋 Variables de Entorno Requeridas

### 1. Database (Supabase)

```env
DATABASE_URL=postgresql://postgres:PASSWORD@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres
```

**Importante**: Escapar caracteres especiales en la contraseña:
- `!` → `%21`
- `$` → `%24`
- `#` → `%23`

### 2. NextAuth (Autenticación)

```env
NEXTAUTH_SECRET=fBMTaMxL96CONdkZWP2YJZ0+Cn6Q4A8r44xOGVCNhPU=
NEXTAUTH_URL=https://app.chatform.mx
```

**⚠️ CRÍTICO**: `NEXTAUTH_URL` debe ser tu dominio real, NO localhost.

### 3. Public URLs

```env
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
```

**⚠️ CRÍTICO**: Esta variable DEBE estar configurada en Dokploy.
- Se usa para generar links absolutos
- Se compila en el cliente
- Si no está, defaultea a `http://localhost:3000`

### 4. Stripe (Billing)

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_STARTER=price_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_BUSINESS=price_...
```

### 5. Twilio WhatsApp

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 6. OpenAI (AI Features)

```env
OPENAI_API_KEY=sk-...
```

### 7. Email (Opcional - Resend)

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=support@chatform.mx
```

---

## 🔧 Pasos de Deployment en Dokploy

### 1. Crear Aplicación

1. Login a Dokploy
2. Click "New Application"
3. Seleccionar "GitHub Repository"
4. Conectar repo: `ramonpando/chatform-website`
5. Branch: `main`

### 2. Configurar Build

**Build Command**:
```bash
cd app && npm install && npm run build
```

**Start Command**:
```bash
cd app && npm start
```

**Port**: `3000`

**Environment**: `production`

### 3. Configurar Variables de Entorno

**⚠️ PASO CRÍTICO**: Ir a Environment Variables y agregar **TODAS** las variables listadas arriba.

**Orden de prioridad**:
1. Variables en Dokploy (✅ Correctas)
2. `.env.production` (❌ No se usa en Dokploy)
3. `.env.local` (❌ Solo para desarrollo)

### 4. Configurar Dominio

1. Ir a "Domains"
2. Agregar dominio: `app.chatform.mx`
3. Configurar DNS:
   ```
   Type: A
   Name: app
   Value: [IP de Dokploy]
   ```
4. Habilitar SSL (Let's Encrypt automático)

### 5. Deploy

1. Click "Deploy"
2. Esperar a que termine el build (~3-5 min)
3. Verificar logs para errores

### 6. Verificación Post-Deploy

Verificar que todo funcione:

```bash
# 1. Landing page carga
curl https://app.chatform.mx

# 2. API responde
curl https://app.chatform.mx/api/health

# 3. Variables correctas
# Abrir https://app.chatform.mx → inspeccionar network
# Los redirects deben ser a app.chatform.mx, NO localhost
```

---

## 🐛 Troubleshooting

### Problema 1: Redirects a localhost

**Síntoma**:
- Click en "Comenzar Gratis" → `http://localhost:3002/signup`
- Links en la app van a localhost

**Diagnóstico**:
```bash
# SSH a Dokploy container
docker exec -it chatform-app sh

# Verificar variable
echo $NEXT_PUBLIC_APP_URL
# Debe mostrar: https://app.chatform.mx
# Si muestra: http://localhost:3000 → PROBLEMA
```

**Solución**:
1. Ir a Dokploy → Environment Variables
2. Buscar `NEXT_PUBLIC_APP_URL`
3. Si no existe: Agregar con valor `https://app.chatform.mx`
4. Si existe pero es incorrecta: Editar a `https://app.chatform.mx`
5. **IMPORTANTE**: Redeploy completo (no solo restart)
   - Las variables `NEXT_PUBLIC_*` se compilan en build time
   - Restart NO es suficiente, necesitas rebuild

**Comando para forzar rebuild**:
```bash
# En Dokploy
1. Stop application
2. Clear build cache (si disponible)
3. Deploy
```

### Problema 2: Database connection failed

**Síntoma**: Error `ECONNREFUSED` o `authentication failed`

**Solución**:
1. Verificar que `DATABASE_URL` esté correcta
2. Verificar que Supabase permita conexiones desde IP de Dokploy
3. Verificar escapado de caracteres especiales en password

### Problema 3: NextAuth session error

**Síntoma**: Login funciona pero logout inmediato

**Solución**:
1. Verificar `NEXTAUTH_URL` sea tu dominio real
2. Verificar `NEXTAUTH_SECRET` sea el mismo que en dev
3. Verificar cookies: Debe ser `__Secure-authjs.session-token` en HTTPS

### Problema 4: Stripe webhooks fallan

**Síntoma**: Subscripciones no se activan

**Solución**:
1. Ir a Stripe Dashboard → Webhooks
2. Actualizar URL a: `https://app.chatform.mx/api/billing/webhook`
3. Eventos necesarios:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Problema 5: WhatsApp no responde

**Síntoma**: Mensajes enviados pero bot no responde

**Solución**:
1. Ir a Twilio Console → WhatsApp
2. Actualizar webhook URL: `https://app.chatform.mx/api/webhooks/whatsapp`
3. Method: POST
4. Verificar logs en Dokploy para errores

---

## 📊 Monitoreo

### Logs en Tiempo Real

```bash
# En Dokploy Dashboard
1. Ir a "Logs"
2. Seleccionar "Application Logs"
3. Ver errores en tiempo real
```

### Métricas Importantes

- **CPU Usage**: < 50% normal, > 80% problema
- **Memory Usage**: < 512MB normal, > 1GB problema
- **Response Time**: < 500ms normal, > 2s problema

### Alertas Recomendadas

1. **Downtime alert**: Si app no responde por > 2 min
2. **Error rate alert**: Si > 5% requests fallan
3. **Memory alert**: Si uso > 1GB por > 5 min

---

## 🔄 CI/CD Workflow

### Git Push → Auto Deploy

1. Commit cambios localmente
2. Push a GitHub `main` branch
3. Dokploy detecta push automáticamente
4. Inicia rebuild y redeploy
5. Verificar en logs que deploy fue exitoso

### Rollback

Si algo sale mal después del deploy:

1. Ir a Dokploy → Deployments
2. Seleccionar deployment anterior
3. Click "Rollback"
4. Esperar a que termine

---

## 📝 Checklist Pre-Production

Antes de lanzar a producción, verificar:

- [ ] `NEXT_PUBLIC_APP_URL` configurada correctamente
- [ ] `NEXTAUTH_URL` apunta a dominio real
- [ ] Stripe webhooks configurados con dominio real
- [ ] Twilio webhooks configurados con dominio real
- [ ] DNS configurado correctamente (A record)
- [ ] SSL habilitado (HTTPS)
- [ ] Database migrations aplicadas
- [ ] Variables de entorno secretas NO commiteadas
- [ ] Logs no muestran errores
- [ ] Test de signup/login funciona
- [ ] Test de crear encuesta funciona
- [ ] Test de WhatsApp funciona (si aplica)
- [ ] Test de Stripe checkout funciona (modo test)

---

## 🔐 Seguridad

### Variables Secretas

**NUNCA** commitear estas variables a Git:
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL`
- `TWILIO_AUTH_TOKEN`
- `OPENAI_API_KEY`

### Recomendaciones

1. Usar Dokploy environment variables (cifradas)
2. Rotar `NEXTAUTH_SECRET` cada 3 meses
3. Monitorear accesos inusuales a DB
4. Habilitar 2FA en Stripe, Twilio, Supabase
5. Usar Stripe test keys hasta estar listo para producción

---

## 📧 Soporte

Si tienes problemas con el deployment:

1. Revisar logs de Dokploy
2. Revisar documentación de Dokploy: https://docs.dokploy.com
3. Contactar soporte de Dokploy: support@dokploy.com

---

**Last Updated**: 2025-11-02
**Version**: 1.0.0
**Tested on**: Dokploy 1.x
