# Estrategia de WhatsApp para ChatForm

## 🎯 Problema Original

**WhatsApp era el mayor costo operativo de ChatForm:**

- **Twilio**: ~$0.10 USD por mensaje
- **5,000 mensajes/mes** = $500 USD/mes = **$6,000 USD/año**
- Costo aumentaba linealmente con cada cliente
- Hacía difícil ofrecer precios competitivos

---

## 💡 Solución: Meta WhatsApp Cloud API + Pool de Números

### Ventajas de Meta Cloud API:

1. **1,000 conversaciones gratis/mes por número**
2. Sin restricciones en México
3. API oficial de Meta/Facebook
4. Después de 1,000: ~$0.03 USD/conversación (70% más barato que Twilio)

### Estrategia de Pool:

```
ChatForm mantiene 5 números de WhatsApp Business:

Número 1: 1,000 conversaciones gratis/mes
Número 2: 1,000 conversaciones gratis/mes
Número 3: 1,000 conversaciones gratis/mes
Número 4: 1,000 conversaciones gratis/mes
Número 5: 1,000 conversaciones gratis/mes
─────────────────────────────────────────
TOTAL:    5,000 conversaciones GRATIS/mes
```

**Load Balancer**: Distribuye mensajes entre números automáticamente

---

## 💰 Impacto Financiero

### Comparación de Costos:

| Volumen | Twilio (Antes) | Meta Pool (Ahora) | Ahorro |
|---------|----------------|-------------------|---------|
| 1,000 mensajes | $100 USD | **$0 USD** | $100 |
| 5,000 mensajes | $500 USD | **$0 USD** | $500 |
| 10,000 mensajes | $1,000 USD | **$150 USD** | $850 |
| 50,000 mensajes | $5,000 USD | **$1,350 USD** | $3,650 |

**Ahorro anual (5,000 mensajes/mes):** $6,000 USD

---

## 📊 Modelo de Negocio ChatForm

### Plan Starter ($29/mes)
- Hasta 1,000 encuestas/mes
- **Usa pool de ChatForm**
- Costo WhatsApp para ChatForm: $0
- Margen: 100%

### Plan Pro ($79/mes)
- Hasta 5,000 encuestas/mes
- **Usa pool de ChatForm**
- Costo WhatsApp para ChatForm: $0 (dentro de 5,000 gratis)
- Margen: 100%

### Plan Business ($299/mes)
- Hasta 20,000 encuestas/mes
- **Opción A**: Pool de ChatForm
  - Costo para ChatForm: ~$450/mes (después de 5,000 gratis)
  - Margen: ~$850/mes
- **Opción B**: Cliente configura su propio número Meta
  - Costo para ChatForm: $0
  - Cliente paga directamente a Meta

### Plan Enterprise (custom)
- Ilimitado
- **Requiere número propio del cliente**
- Cliente configura sus credenciales de Meta
- Costo para ChatForm: $0
- Escalabilidad infinita

---

## 🏗️ Arquitectura Técnica

### Fase 1: Pool de ChatForm (Implementado)

**Componentes:**
- ✅ Meta WhatsApp Cloud API integration
- ✅ Webhook `/api/webhooks/whatsapp-meta`
- ✅ Envío de mensajes via Meta
- ✅ Manejo de conversaciones completas

**Pendiente:**
- [ ] Base de datos: Tabla `whatsapp_numbers`
- [ ] Load balancer para distribuir entre números
- [ ] Dashboard de uso por número
- [ ] Reset automático mensual de contadores

### Fase 2: Multi-tenant (Enterprise)

**Componentes:**
- [ ] Campos en `tenants`:
  - `metaWhatsappPhoneId`
  - `metaWhatsappAccessToken`
  - `metaWhatsappBusinessAccountId`
- [ ] UI para clientes configuren sus credenciales
- [ ] Webhook dinámico por tenant
- [ ] Guía de onboarding para configurar Meta

---

## 🗄️ Estructura de Base de Datos

### Tabla: `whatsapp_numbers` (Pool de ChatForm)

```sql
CREATE TABLE whatsapp_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  display_name VARCHAR(100), -- "ChatForm 1", "ChatForm 2"

  -- Meta credentials
  meta_phone_id VARCHAR(100) NOT NULL,
  meta_access_token TEXT NOT NULL,
  meta_business_account_id VARCHAR(100) NOT NULL,
  meta_app_id VARCHAR(100),

  -- Usage tracking
  messages_this_month INTEGER DEFAULT 0,
  monthly_limit INTEGER DEFAULT 1000,
  last_reset_at TIMESTAMP DEFAULT NOW(),

  -- Status
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'suspended'
  priority INTEGER DEFAULT 1, -- Para load balancing

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Actualización: `tenants` (Enterprise/Business)

```sql
ALTER TABLE tenants ADD COLUMN use_own_whatsapp BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN meta_whatsapp_phone_id VARCHAR(100);
ALTER TABLE tenants ADD COLUMN meta_whatsapp_access_token TEXT;
ALTER TABLE tenants ADD COLUMN meta_whatsapp_business_account_id VARCHAR(100);
ALTER TABLE tenants ADD COLUMN whatsapp_messages_this_month INTEGER DEFAULT 0;
```

---

## 🔄 Lógica de Load Balancing

### Algoritmo Round-Robin con Capacidad:

```typescript
async function selectWhatsAppNumber(): Promise<WhatsAppNumber> {
  // 1. Obtener números activos
  const activeNumbers = await db.query.whatsappNumbers.findMany({
    where: eq(whatsappNumbers.status, "active"),
    orderBy: [asc(whatsappNumbers.priority), asc(whatsappNumbers.messagesThisMonth)]
  });

  // 2. Filtrar números con capacidad disponible
  const availableNumbers = activeNumbers.filter(
    n => n.messagesThisMonth < n.monthlyLimit
  );

  if (availableNumbers.length === 0) {
    // Todos los números excedieron el límite gratuito
    // Usar el que tenga menos uso (para distribuir costos post-gratuito)
    return activeNumbers[0];
  }

  // 3. Seleccionar el número con menos uso
  const selectedNumber = availableNumbers[0];

  // 4. Incrementar contador
  await db.update(whatsappNumbers)
    .set({
      messagesThisMonth: selectedNumber.messagesThisMonth + 1,
      updatedAt: new Date()
    })
    .where(eq(whatsappNumbers.id, selectedNumber.id));

  return selectedNumber;
}
```

### Reset Mensual (Cron Job):

```typescript
// /api/cron/reset-whatsapp-counters
export async function GET(req: Request) {
  // Reset contadores el día 1 de cada mes
  await db.update(whatsappNumbers)
    .set({
      messagesThisMonth: 0,
      lastResetAt: new Date()
    });

  return NextResponse.json({ status: "reset_complete" });
}
```

---

## 📈 Escalabilidad

### Crecimiento de ChatForm:

| Mes | Mensajes/mes | Números necesarios | Costo Meta | Ahorro vs Twilio |
|-----|--------------|--------------------|-----------:|----------------:|
| Mes 1 | 2,000 | 2 | $0 | $200 |
| Mes 3 | 5,000 | 5 | $0 | $500 |
| Mes 6 | 10,000 | 10 | $150 | $850 |
| Mes 12 | 25,000 | 25 | $750 | $1,750 |
| Año 2 | 100,000 | 100 | $3,000 | $7,000 |

**Costo de agregar un número**: $0 (solo tiempo de configuración)

**Ventaja competitiva**: Puedes ofrecer precios 50% más bajos que competidores que usan Twilio

---

## 🚀 Plan de Implementación

### Semana 1: Validación
- [x] Configurar 1 número de Meta
- [x] Implementar webhook Meta
- [x] Probar flujo completo end-to-end
- [ ] Verificar webhooks funcionando

### Semana 2: Pool Básico
- [ ] Crear tabla `whatsapp_numbers`
- [ ] Migrar número actual a pool
- [ ] Implementar load balancer básico
- [ ] Agregar 4 números más (total 5)
- [ ] UI admin para ver uso de números

### Semana 3: Monitoreo
- [ ] Dashboard de métricas por número
- [ ] Alertas cuando número alcanza 900 mensajes
- [ ] Cron job de reset mensual
- [ ] Logs detallados de distribución

### Semana 4: Multi-tenant (Opcional)
- [ ] Schema update para tenants
- [ ] UI para clientes Business/Enterprise
- [ ] Guía de configuración de Meta
- [ ] Webhook dinámico por tenant

---

## 📋 Checklist de Configuración de Número

Para agregar un nuevo número al pool:

1. **Meta Developer:**
   - [ ] Crear nueva App en Meta
   - [ ] Agregar producto WhatsApp
   - [ ] Obtener Phone Number ID
   - [ ] Generar Access Token permanente

2. **Base de Datos:**
   - [ ] Insertar registro en `whatsapp_numbers`
   - [ ] Verificar status = 'active'

3. **Webhook:**
   - [ ] Configurar webhook URL en Meta
   - [ ] Verify Token: `chatform_webhook_2024`
   - [ ] Subscribe a: messages, message_status

4. **Pruebas:**
   - [ ] Enviar mensaje de prueba
   - [ ] Verificar recepción de respuesta
   - [ ] Confirmar encuesta completa funciona

---

## 🎓 Guía para Clientes Enterprise

*Cuando clientes Enterprise/Business quieran su propio número:*

1. **Crear App de Meta** (5 min)
2. **Configurar WhatsApp Business** (10 min)
3. **Obtener credenciales** (2 min)
4. **Pegar en ChatForm** (1 min)
5. **¡Listo!** - 1,000 gratis/mes

Beneficios para el cliente:
- Control total de su número
- 1,000 conversaciones gratis/mes
- Reportes directos de Meta
- Sin intermediarios

---

## 💡 Conclusión

**Antes de Meta:**
- WhatsApp era el 80% de los costos operativos
- Necesitabas cobrar mínimo $100/mes para ser rentable
- Escalabilidad limitada por costos

**Después de Meta:**
- WhatsApp cuesta $0 hasta 5,000 mensajes/mes
- Puedes ofrecer plan desde $29/mes con buen margen
- Escalabilidad infinita agregando números (gratis)

**Resultado**: ChatForm ahora es competitivo en precio y puede escalar sin límites.

---

## 🔗 Referencias

- [Meta WhatsApp Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Guía de configuración para ChatForm](META_WHATSAPP_SETUP_GUIDE.md)
- [Pricing de Meta](https://developers.facebook.com/docs/whatsapp/pricing)
- [Comparación con Twilio](WHATSAPP_PROVIDERS_COMPARISON.md)
