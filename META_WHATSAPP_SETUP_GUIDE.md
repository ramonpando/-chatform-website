# Guía: Configurar Meta WhatsApp Cloud API desde Cero

Esta guía te ayudará a configurar WhatsApp Business API usando Meta (Facebook) desde cero, completamente gratis.

## 📋 Requisitos Previos

- Cuenta de Facebook (personal o de negocio)
- Número de teléfono para WhatsApp Business (NO puede estar registrado en WhatsApp)
- Tarjeta de crédito/débito (solo para verificación, NO se cobra si estás en plan gratuito)

## 🚀 Paso 1: Crear Cuenta de Meta Developer

1. Ve a: https://developers.facebook.com/
2. Click en **"Get Started"** (arriba derecha)
3. Inicia sesión con tu cuenta de Facebook
4. Completa el registro como desarrollador

## 🏢 Paso 2: Crear una App de Meta

1. En el dashboard: https://developers.facebook.com/apps/
2. Click en **"Create App"**
3. Selecciona **"Business"** como tipo de app
4. Llena el formulario:
   - **App Name**: ChatForm WhatsApp (o el nombre que prefieras)
   - **App Contact Email**: tu email
   - **Business Account**: Crea uno nuevo o selecciona existente
5. Click **"Create App"**

## 💬 Paso 3: Agregar WhatsApp al App

1. En el dashboard de tu app, busca **"WhatsApp"** en productos
2. Click en **"Set up"** en WhatsApp
3. Te llevará a la página de configuración de WhatsApp

## 📱 Paso 4: Configurar Número de Teléfono de Prueba

Meta te da un número de prueba GRATIS para empezar:

1. En la sección **"API Setup"**
2. Verás un número de prueba (Test number) con formato: `+1 555-XXX-XXXX`
3. Puedes enviar mensajes a 5 números verificados (agrégalos en la sección "To")
4. **IMPORTANTE**: Este número es solo para pruebas, para producción necesitas tu propio número

## 🔑 Paso 5: Obtener Credenciales

Necesitas 3 cosas:

### 1. Phone Number ID
- En **"API Setup"** → copia el **"Phone number ID"**
- Ejemplo: `123456789012345`

### 2. WhatsApp Business Account ID
- En **"API Setup"** → copia el **"WhatsApp Business Account ID"**
- Ejemplo: `102345678901234`

### 3. Access Token (Temporal)
- En **"API Setup"** → copia el **"Temporary access token"**
- Ejemplo: `EAAxxxxxxxxxxxxxxx`
- ⚠️ Este token expira en 24 horas, luego crearemos uno permanente

## 🔐 Paso 6: Crear Access Token Permanente

El token temporal expira, necesitas uno permanente:

1. Ve a: **Settings** → **Basic** (menú izquierdo)
2. Copia el **"App ID"** y **"App Secret"**
3. Ve a: https://developers.facebook.com/tools/accesstoken/
4. Busca tu app y click **"Generate Token"**
5. Selecciona los permisos:
   - `whatsapp_business_messaging`
   - `whatsapp_business_management`
6. Este token NO expira (pero puede ser revocado)

## 📞 Paso 7: Agregar Tu Número de Producción (Opcional)

Si quieres usar tu propio número (recomendado para producción):

1. En WhatsApp Manager: https://business.facebook.com/wa/manage/home/
2. Click **"Add phone number"**
3. Ingresa tu número de teléfono (NO debe estar en WhatsApp)
4. Verifica por SMS/llamada
5. **IMPORTANTE**: Necesitas verificación de negocio para enviar mensajes ilimitados

## ⚙️ Paso 8: Configurar Webhook

El webhook recibe mensajes de usuarios:

1. En tu app → **WhatsApp** → **Configuration**
2. Click **"Edit"** en Webhook
3. Configura:
   - **Callback URL**: `https://app.chatform.mx/api/webhooks/whatsapp-meta`
   - **Verify Token**: Genera uno aleatorio (ejemplo: `mi_token_secreto_123`)
4. Subscribe a estos campos:
   - `messages` (mensajes entrantes)
   - `message_status` (estado de mensajes)

## 🔒 Paso 9: Guardar Credenciales en ChatForm

Guarda estas credenciales de forma segura:

```env
# Meta WhatsApp Cloud API
META_WHATSAPP_PHONE_ID=123456789012345
META_WHATSAPP_BUSINESS_ACCOUNT_ID=102345678901234
META_WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxx
META_WHATSAPP_VERIFY_TOKEN=mi_token_secreto_123
```

## 📨 Paso 10: Crear Templates Aprobados

Para enviar mensajes proactivos (Business Initiated), necesitas templates aprobados:

1. Ve a WhatsApp Manager: https://business.facebook.com/wa/manage/message-templates/
2. Click **"Create Template"**
3. Llena el formulario:
   - **Name**: `chatform_survey_invite`
   - **Category**: `UTILITY` (para encuestas/notificaciones)
   - **Language**: `Spanish`
   - **Message**: Tu mensaje con variables

Ejemplo de template:
```
Hola {{1}},

Nos gustaría conocer tu opinión sobre {{2}}.

Por favor completa nuestra breve encuesta respondiendo a este mensaje.

¡Gracias!
```

4. Submit para aprobación (toma ~15 minutos)

## ✅ Paso 11: Probar el Setup

Antes de integrar con ChatForm, prueba con cURL:

```bash
curl -X POST "https://graph.facebook.com/v21.0/PHONE_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "521XXXXXXXXXX",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": { "code": "en_US" }
    }
  }'
```

Si responde con `"success": true` → ¡Todo funciona!

## 📊 Límites y Costos

### Plan Gratuito (Tier 1):
- **1,000 conversaciones/mes GRATIS**
- Conversación = ventana de 24 horas
- Perfecto para empezar

### Después de 1,000:
- $0.005 - $0.09 USD por conversación (depende del país)
- México: ~$0.03 USD por conversación
- Ejemplo: 5,000 conversaciones = ~$150 USD/mes

### Verificación de Negocio:
- Sin verificar: máx 250 conversaciones/día
- Verificado: ilimitado
- La verificación es gratis pero toma 1-2 semanas

## 🆘 Solución de Problemas

### Error: "Phone number not registered"
→ Ve a WhatsApp Manager y verifica que el número esté agregado

### Error: "Template not approved"
→ Los templates pueden tardar hasta 24 horas en aprobarse

### Error: "Access token expired"
→ Usa el token permanente, no el temporal

### No recibo webhooks
→ Verifica que la URL sea HTTPS y esté accesible públicamente

## 📚 Recursos Útiles

- Documentación oficial: https://developers.facebook.com/docs/whatsapp/cloud-api
- WhatsApp Manager: https://business.facebook.com/wa/manage/home/
- API Explorer: https://developers.facebook.com/tools/explorer/
- Plantillas: https://business.facebook.com/wa/manage/message-templates/

## 🎯 Siguiente Paso

Una vez que tengas:
1. ✅ App creada
2. ✅ Phone Number ID
3. ✅ Access Token permanente
4. ✅ Verify Token para webhook

Avísame y configuramos ChatForm para usar Meta en lugar de Twilio.

---

**¿Dudas?** Cualquier paso que no entiendas, pregúntame y te ayudo en detalle.
