# Configuración de Twilio para WhatsApp

Este documento explica cómo configurar Twilio para que ChatForm funcione con WhatsApp.

## 📋 Requisitos Previos

1. Cuenta de Twilio (gratuita para desarrollo)
2. Número de WhatsApp Business o Twilio Sandbox

---

## 🚀 Paso 1: Crear Cuenta en Twilio

1. Ve a [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Regístrate con tu email
3. Verifica tu número de teléfono
4. Completa el cuestionario inicial

---

## 🔑 Paso 2: Obtener Credenciales

1. Ve al [Dashboard de Twilio](https://console.twilio.com/)
2. En la página principal verás:
   - **Account SID** (ejemplo: `ACxxxxxxxxxxxxx`)
   - **Auth Token** (click en "Show" para verlo)
3. Guarda estas credenciales, las necesitarás más adelante

---

## 📱 Paso 3: Configurar WhatsApp Sandbox (Desarrollo)

Para desarrollo, Twilio ofrece un Sandbox gratuito:

1. Ve a **Messaging** > **Try it out** > **Send a WhatsApp message**
2. O directo: [https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
3. Verás un código como: `join <palabra-clave>`
4. Envía ese código por WhatsApp al número: **+1 415 523 8886**
5. Tu número estará conectado al sandbox

**Número del Sandbox:** `whatsapp:+14155238886`

---

## 🔗 Paso 4: Configurar Webhook

El webhook permite que Twilio envíe los mensajes de WhatsApp a tu app:

1. En el Sandbox de WhatsApp, busca la sección **Sandbox Configuration**
2. En **"When a message comes in"** ingresa:
   ```
   https://app.chatform.mx/api/webhooks/whatsapp
   ```
3. Método: **HTTP POST**
4. Guarda los cambios

---

## ⚙️ Paso 5: Configurar Variables de Entorno

Agrega estas variables en Dokploy o tu `.env.production`:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

**Importante:**
- El `TWILIO_WHATSAPP_NUMBER` debe incluir el prefijo `whatsapp:`
- En producción, reemplaza con tu número de WhatsApp Business API

---

## 🧪 Paso 6: Probar la Integración

### Opción A: Desde la UI

1. Ve a [https://app.chatform.mx/surveys](https://app.chatform.mx/surveys)
2. Haz click en una encuesta activa
3. Haz click en "Compartir"
4. Copia el "Link directo a WhatsApp"
5. Abre el link en tu navegador
6. Te llevará a WhatsApp con el comando pre-escrito
7. Envía el mensaje

### Opción B: Manual

1. Abre WhatsApp
2. Envía un mensaje al número del Sandbox: `+1 415 523 8886`
3. Escribe: `START_<shortCode>` (ejemplo: `START_IOpTRpaA`)
4. El bot debería responder con el mensaje de bienvenida

---

## 🔥 Paso 7: WhatsApp Business API (Producción)

Para producción necesitas WhatsApp Business API:

### Opción 1: Twilio WhatsApp Business

1. Ve a **Messaging** > **Senders** > **WhatsApp senders**
2. Click en **Request Access**
3. Completa el formulario de Facebook Business
4. Espera aprobación (puede tomar días/semanas)
5. Una vez aprobado, configura tu número

**Costos:**
- Mensajes de entrada: Gratis
- Mensajes de salida: ~$0.005 USD por mensaje

### Opción 2: Meta WhatsApp Business API

Si prefieres configurarlo directamente con Meta:
1. Ve a [https://business.whatsapp.com/](https://business.whatsapp.com/)
2. Sigue el proceso de verificación
3. Usa la API de Meta directamente

---

## 🐛 Troubleshooting

### El bot no responde

1. **Verifica el webhook:**
   ```bash
   curl -X POST https://app.chatform.mx/api/webhooks/whatsapp \
     -d "From=whatsapp:+1234567890" \
     -d "Body=START_test"
   ```

2. **Revisa los logs de Twilio:**
   - Ve a **Monitor** > **Logs** > **WhatsApp**
   - Busca errores en el webhook

3. **Verifica las variables de entorno:**
   ```bash
   # En el servidor
   docker service inspect app-chatform-appchayform-pfeamz | grep -i twilio
   ```

### Error "Webhook returned HTTP 500"

- Revisa los logs de la aplicación
- Verifica que la base de datos esté accesible
- Confirma que el `shortCode` existe en la base de datos

### Mensajes no se reciben

- Verifica que el webhook esté configurado correctamente
- Asegúrate de que el URL sea HTTPS (no HTTP)
- Verifica que tu número esté conectado al Sandbox

---

## 📊 Monitoreo

### Ver estadísticas de mensajes

1. Ve a **Monitor** > **Logs** > **WhatsApp**
2. Filtra por fecha/error
3. Ve los mensajes enviados/recibidos

### Webhook logs

- Twilio registra cada llamada al webhook
- Puedes ver requests/responses
- Útil para debugging

---

## 💰 Costos

### Sandbox (Desarrollo)
- **Gratis** ✅
- Limitado a números que se unan al sandbox
- Mensajes ilimitados

### WhatsApp Business API (Producción)
- **Entrada:** Gratis
- **Salida:** ~$0.005 USD por mensaje
- **Plantillas:** Requieren aprobación de Meta

---

## 🔐 Seguridad

### Validar Webhooks

El código ya valida que los mensajes vengan de Twilio. Si necesitas más seguridad:

```typescript
import twilio from 'twilio';

const isValidRequest = twilio.validateRequest(
  authToken,
  signature,
  url,
  params
);
```

### Rate Limiting

Considera agregar rate limiting para prevenir spam:
- Limitar mensajes por número
- Timeout entre mensajes
- Máximo de sesiones activas

---

## 📚 Recursos

- [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Twilio Pricing](https://www.twilio.com/whatsapp/pricing)
- [Dashboard de Twilio](https://console.twilio.com/)

---

## ✅ Checklist de Configuración

- [ ] Cuenta de Twilio creada
- [ ] Account SID y Auth Token copiados
- [ ] WhatsApp Sandbox configurado
- [ ] Número de prueba conectado al Sandbox
- [ ] Webhook configurado en Twilio
- [ ] Variables de entorno agregadas en Dokploy
- [ ] Servicio de Docker reiniciado
- [ ] Prueba enviada por WhatsApp
- [ ] Bot respondió correctamente

---

¿Necesitas ayuda? Revisa los logs o crea un issue en el repositorio.
