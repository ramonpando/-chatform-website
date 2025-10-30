# Twilio WhatsApp Setup - ChatForm MVP

**Objetivo:** Configurar Twilio WhatsApp para testing del flujo conversacional

---

## 🚀 **Paso 1: Configurar Twilio**

### **1.1 Get Twilio Credentials**

Ya tienes un número de Twilio, necesitas:

```bash
# En tu dashboard de Twilio:
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886  # O tu número
```

### **1.2 Agregar a `.env.local`**

Crea `/root/chatform/app/.env.local`:

```env
# Database
DATABASE_URL=postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=tu-secret-actual
NEXTAUTH_URL=http://localhost:3000

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🌐 **Paso 2: Exponer Webhook con ngrok**

Twilio necesita un webhook público para enviar mensajes.

### **2.1 Instalar ngrok**

```bash
# Si no lo tienes instalado:
brew install ngrok  # Mac
# O descarga de https://ngrok.com/download

# Autenticar (una sola vez)
ngrok authtoken YOUR_NGROK_TOKEN
```

### **2.2 Iniciar tu app**

```bash
cd /root/chatform/app
npm run dev
```

La app corre en `http://localhost:3000`

### **2.3 Exponer con ngrok**

En otra terminal:

```bash
ngrok http 3000
```

Output:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

**Copia esa URL:** `https://abc123.ngrok.io`

---

## 📲 **Paso 3: Configurar Webhook en Twilio**

### **3.1 Ir a Twilio Console**

1. Ve a [Twilio Console](https://console.twilio.com/)
2. Click en **Messaging** → **Try it out** → **Send a WhatsApp message**
3. O busca tu número de WhatsApp en **Phone Numbers**

### **3.2 Configurar Webhook**

En la configuración del número:

**When a message comes in:**
```
https://abc123.ngrok.io/api/webhooks/whatsapp
```

**Method:** POST

**Save** la configuración

---

## 🧪 **Paso 4: Testing**

### **4.1 Crear una encuesta de prueba**

1. Inicia sesión en tu app: `http://localhost:3000`
2. Crea una encuesta nueva con 2-3 preguntas
3. **Copia el shortCode** (ej: `abc123xyz`)

### **4.2 Probar el flujo completo**

**A) Abrir página pública:**
```
http://localhost:3000/s/abc123xyz
```

Debes ver:
- Título de la encuesta
- Lista de preguntas
- Botón verde "Responder en WhatsApp"

**B) Click en el botón**

Te redirige a WhatsApp Web/App con mensaje:
```
START_abc123xyz
```

**C) Enviar el mensaje**

El bot debe responder:
```
¡Hola! Gracias por participar en: [Título de tu encuesta]

📊 Esta encuesta tiene 3 preguntas y toma ~2 minutos.

*Pregunta 1/3*

¿Cómo calificas tu experiencia?

_Responde con un número del 1 al 10_
```

**D) Responder**

Tú:
```
9
```

Bot:
```
*Pregunta 2/3*

¿Por qué diste ese score?

_Escribe tu respuesta_
```

**E) Continuar hasta completar**

Al final:
```
✅ ¡Gracias por completar la encuesta! Tu opinión es muy valiosa para nosotros.
```

---

## 🔍 **Debugging**

### **Ver logs en tiempo real:**

**Terminal 1** (Next.js):
```bash
cd /root/chatform/app
npm run dev
```

Verás logs de:
- Webhook recibido
- Estado de sesión
- Respuestas guardadas

**Terminal 2** (ngrok):
```bash
ngrok http 3000
```

Abre `http://localhost:4040` para ver:
- Todos los requests de Twilio
- Payloads completos
- Responses de tu API

### **Verificar en Database:**

```bash
# Conectar a DB
psql postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

# Ver sesiones activas
SELECT * FROM survey_sessions WHERE status = 'active';

# Ver respuestas
SELECT * FROM responses ORDER BY created_at DESC LIMIT 10;
```

---

## 🐛 **Problemas Comunes**

### **1. "Survey not found"**

**Causa:** shortCode incorrecto

**Solución:**
```sql
-- Verificar shortCodes en DB
SELECT id, title, short_code, status FROM surveys;
```

### **2. Webhook no responde**

**Causa:** ngrok no está corriendo o URL incorrecta en Twilio

**Solución:**
- Verifica que ngrok esté activo: `http://localhost:4040`
- Verifica que la URL en Twilio sea `https://TU-NGROK.ngrok.io/api/webhooks/whatsapp`
- Reinicia ngrok y actualiza URL en Twilio

### **3. "Twilio credentials not configured"**

**Causa:** `.env.local` no tiene las variables

**Solución:**
```bash
# Verifica que exista
cat /root/chatform/app/.env.local

# Debe tener:
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

Reinicia el dev server después de agregar variables.

### **4. "Cannot find module @/lib/db"**

**Causa:** TypeScript no puede resolver paths

**Solución:**
```bash
cd /root/chatform/app
npm run build  # Test build
```

---

## 📊 **Verificar que funciona**

### **Checklist:**

- [ ] Página `/s/[shortCode]` carga correctamente
- [ ] Botón "Responder en WhatsApp" abre WhatsApp
- [ ] Enviar `START_abc123` recibe welcome message
- [ ] Responder pregunta 1 envía pregunta 2
- [ ] Completar encuesta muestra "Gracias"
- [ ] Respuestas se guardan en DB
- [ ] Dashboard `/surveys/[id]/results` muestra respuestas

---

## 🎯 **Próximos Pasos**

Una vez que esto funcione:

1. ✅ **Crear Share page** con QR code
2. ✅ **Implementar API trigger endpoint** para integraciones
3. ✅ **Setup OpenAI** para AI Form Generator
4. ✅ **Aplicar a WhatsApp Business API** (producción)

---

## 📝 **Ejemplo de Flujo Completo**

```
Usuario en Instagram ve:
"📊 ¿Qué te pareció tu compra?"
Link: chatform.mx/s/abc123

↓

Click → Abre página pública linda

↓

"Responder en WhatsApp" → Abre WhatsApp

↓

Envía START_abc123

↓

Bot: "¡Hola! 3 preguntas, 2 minutos"
Bot: "Pregunta 1: ¿Cómo calificas?"

↓

Usuario: "9"

↓

Bot: "Pregunta 2: ¿Por qué?"

↓

Usuario: "Excelente calidad"

↓

Bot: "Pregunta 3: ¿Volverías a comprar?"

↓

Usuario: "Sí"

↓

Bot: "✅ ¡Gracias!"

↓

Dashboard del dueño:
- 1 nueva respuesta
- NPS: 9 (Promoter)
- Sentiment: Positive
- Topic: product_quality
```

---

**Estado:** ✅ LISTO PARA PROBAR
**Tiempo estimado de setup:** 15 minutos
**Dependencias:** Twilio account + ngrok
