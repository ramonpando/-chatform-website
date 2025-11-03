# 📱 WhatsApp Integration - Guía Completa

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Twilio](#configuración-de-twilio)
3. [Plantillas de WhatsApp](#plantillas-de-whatsapp)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Flujo de Envío Masivo](#flujo-de-envío-masivo)
6. [Variables de Entorno](#variables-de-entorno)
7. [Limitaciones y Consideraciones](#limitaciones-y-consideraciones)

---

## 🎯 Requisitos Previos

### 1. Cuenta de Twilio
- Cuenta activa en [Twilio](https://www.twilio.com)
- WhatsApp Business API habilitado
- Número de teléfono verificado

### 2. WhatsApp Business
- Cuenta de WhatsApp Business
- Perfil de negocio verificado
- Número aprobado para API

### 3. Variables de Entorno
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

---

## 🔧 Configuración de Twilio

### Paso 1: Crear Cuenta Twilio
1. Registrarse en https://www.twilio.com/try-twilio
2. Verificar email y teléfono
3. Obtener créditos gratuitos de prueba ($15 USD)

### Paso 2: Configurar WhatsApp Sandbox (Desarrollo)
```
1. Dashboard → Messaging → Try it out → WhatsApp
2. Enviar "join [palabra-clave]" al número de Twilio
3. Confirmar conexión
```

**Limitaciones del Sandbox:**
- ❌ Solo para pruebas
- ❌ Requiere que usuarios hagan "join"
- ❌ No es para producción
- ✅ Gratis e inmediato

### Paso 3: Solicitar Producción (Requerido para Lanzamiento)
```
1. Dashboard → Messaging → WhatsApp → Request Production Access
2. Llenar formulario de negocio
3. Esperar aprobación (2-5 días hábiles)
4. Configurar número oficial
```

**Requisitos de Producción:**
- ✅ Negocio registrado
- ✅ Política de privacidad pública
- ✅ Términos de servicio
- ✅ Caso de uso aprobado

---

## 📝 Plantillas de WhatsApp

### Tipos de Plantillas

#### 1. Plantillas Default (Pre-aprobadas por ChatForm)
```
Ventajas:
✅ Listas para usar inmediatamente
✅ Ya aprobadas por WhatsApp
✅ Optimizadas para alta tasa de respuesta
✅ Sin proceso de aprobación

Desventajas:
❌ Personalización limitada a variables
❌ No reflejan marca específica
```

#### 2. Plantillas Custom (Usuario)
```
Ventajas:
✅ 100% personalizables
✅ Reflejan tu marca
✅ Contenido específico de tu negocio

Desventajas:
❌ Requieren aprobación de WhatsApp
❌ 24-48 horas de espera
❌ Pueden ser rechazadas
```

### Proceso de Aprobación de Plantilla Custom

```mermaid
graph TD
    A[Usuario crea plantilla] --> B[Submit a ChatForm]
    B --> C{Admin revisa}
    C -->|Rechaza| D[Usuario notificado]
    C -->|Aprueba| E[Enviar a WhatsApp Business API]
    E --> F[WhatsApp revisa]
    F -->|Rechaza| G[Admin notifica usuario]
    F -->|Aprueba| H[Plantilla disponible]
    H --> I[Usuario puede usar]
```

**Tiempo total:** 2-5 días hábiles

### Reglas de WhatsApp para Plantillas

✅ **Permitido:**
- Saludos personalizados
- Información clara del propósito
- Call to action específico
- Variables bien definidas
- URLs cortas

❌ **Prohibido:**
- Lenguaje ofensivo
- Engaños o información falsa
- Promociones agresivas sin consentimiento
- Contenido sensible sin contexto
- Spam o contenido no solicitado

---

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
├─────────────────────────────────────────────────┤
│  • TemplateSelector                             │
│  • BulkSendClient                               │
│  • TemplateManager                              │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           API Routes (Next.js)                   │
├─────────────────────────────────────────────────┤
│  • /api/surveys/[id]/send-bulk                  │
│  • /api/whatsapp/templates                      │
│  • /api/webhooks/whatsapp                       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          WhatsApp Helper (Lib)                   │
├─────────────────────────────────────────────────┤
│  • templates.ts                                 │
│  • fillTemplate()                               │
│  • validateTemplate()                           │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           Twilio WhatsApp API                    │
└─────────────────────────────────────────────────┘
```

### Database Schema

```sql
-- Plantillas de WhatsApp
CREATE TABLE whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  message TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]',
  category VARCHAR(50) DEFAULT 'custom',
  status VARCHAR(20) DEFAULT 'pending',
  whatsapp_template_id VARCHAR(100),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_tenant_status (tenant_id, status),
  INDEX idx_whatsapp_template (whatsapp_template_id)
);

-- Envíos masivos (tracking)
CREATE TABLE bulk_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID NOT NULL REFERENCES surveys(id),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  template_id UUID REFERENCES whatsapp_templates(id),
  total_contacts INT NOT NULL,
  sent_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'processing',
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,

  INDEX idx_survey_sends (survey_id),
  INDEX idx_tenant_sends (tenant_id)
);
```

---

## 🔄 Flujo de Envío Masivo

### 1. Upload CSV
```javascript
// Formato esperado
phone,name
"+5215512345678","Juan Pérez"
"+5215587654321","María López"
```

### 2. Validación
```javascript
- Formato E.164 del teléfono (+52...)
- Nombres no vacíos
- Máximo de contactos según plan
- Créditos disponibles suficientes
```

### 3. Selección de Plantilla
```javascript
- Usuario elige plantilla
- Sistema rellena variables automáticas:
  * {{link}} → URL de encuesta
  * {{topic}} → Título encuesta
  * {{question_count}} → Número preguntas
  * {{estimated_time}} → Tiempo estimado
- Usuario completa variables custom:
  * {{name}} → Desde CSV
  * {{company}} → De tenant
  * {{sender}} → De usuario
```

### 4. Envío con Rate Limiting
```javascript
for (const contact of contacts) {
  await sendWhatsAppMessage(contact);
  await sleep(1100); // 60 msgs/min = 1.1s entre cada uno
}
```

### 5. Tracking y Reporting
```javascript
- Crear sesión de encuesta
- Enviar mensaje via Twilio
- Actualizar contadores (sent/failed)
- Decrementar créditos
- Log de errores
```

---

## 🔐 Variables de Entorno

### Producción (Dokploy)
```bash
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# App URLs
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
NEXTAUTH_URL=https://chatform.mx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Build-time (Build Args en Dokploy)
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
```

### Desarrollo Local
```bash
# .env.local
TWILIO_ACCOUNT_SID=AC_test_xxxxx
TWILIO_AUTH_TOKEN=test_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ⚠️ Limitaciones y Consideraciones

### Rate Limits

| Proveedor | Límite | Ventana |
|-----------|--------|---------|
| Twilio WhatsApp | 60 msg/min | Por número |
| WhatsApp Business | 1,000 msg/día | Tier 1 (nuevo) |
| WhatsApp Business | 10,000 msg/día | Tier 2 |
| WhatsApp Business | 100,000 msg/día | Tier 3 |

**Implementado en código:**
```javascript
// Rate limiting: 1.1 segundos entre mensajes = ~54 msg/min
await new Promise(resolve => setTimeout(resolve, 1100));
```

### Costos

#### Twilio Pricing (México)
```
Mensaje de inicio (template): $0.0042 USD
Mensaje de respuesta: Gratis (24h window)
```

**Ejemplo:**
- 1,000 encuestas enviadas = $4.20 USD
- 10,000 encuestas enviadas = $42 USD

#### WhatsApp Business API
```
Primeros 1,000 mensajes/mes: Gratis
Después: Varía por país y tipo de mensaje
```

### Mejores Prácticas

✅ **DO:**
- Personalizar con nombre del usuario
- Ser claro sobre el propósito
- Incluir tiempo estimado
- Respetar horarios (9am-9pm)
- Ofrecer opt-out
- Medir tasas de respuesta

❌ **DON'T:**
- Enviar sin consentimiento
- Spam repetitivo
- Mensajes a horarios inapropiados
- Ocultar identidad del remitente
- Promesas exageradas

### Compliance y Legal

**Requisitos Legales México:**
- ✅ Consentimiento explícito del usuario
- ✅ Opción de darse de baja
- ✅ Política de privacidad clara
- ✅ Cumplir con LFPDPPP

**Documentación requerida:**
- Aviso de privacidad publicado
- Términos y condiciones
- Proceso de opt-out claro
- Registro de consentimientos

---

## 🚀 Roadmap

### Q4 2024
- [x] Integración básica con Twilio
- [x] Envío masivo con CSV
- [x] 6 plantillas default
- [ ] Template selector UI
- [ ] Métricas básicas

### Q1 2025
- [ ] Sistema de plantillas custom
- [ ] Workflow de aprobación
- [ ] Analytics avanzados
- [ ] A/B testing de templates
- [ ] Segmentación de audiencia

### Q2 2025
- [ ] Chatbot conversacional
- [ ] Respuestas automáticas
- [ ] NLP para análisis de respuestas
- [ ] Integración con CRM

---

## 📚 Referencias

- [Twilio WhatsApp API Docs](https://www.twilio.com/docs/whatsapp)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [WhatsApp Template Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates/guidelines)
- [Twilio Pricing](https://www.twilio.com/whatsapp/pricing)

---

**Última actualización:** 2025-11-03
**Versión:** 1.0
**Mantenedor:** Claude + Ramón
