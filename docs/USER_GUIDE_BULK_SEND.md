# 📖 Guía de Usuario: Envío Masivo de Encuestas

## 🎯 ¿Qué es el Envío Masivo?

El envío masivo te permite enviar tu encuesta a múltiples contactos por WhatsApp de forma automática, usando un archivo CSV con los números de teléfono.

**Beneficios:**
- ✅ Automatiza el envío a cientos o miles de contactos
- ✅ Personaliza mensajes con el nombre de cada persona
- ✅ Alcanza ~40% de tasa de respuesta (vs ~15% de email)
- ✅ Rastrea quién recibió y quién respondió

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener:

1. **✅ API Key generada**
   - Ve a Settings → API
   - Click en "Generate API Key"
   - Guarda la key (solo se muestra una vez)

2. **✅ Créditos de envío disponibles**
   - Verifica en tu Dashboard
   - Cada envío consume 1 crédito
   - Puedes comprar más en Settings → Billing

3. **✅ Encuesta activa**
   - Tu encuesta debe estar publicada
   - Status: "Activa"

4. **✅ Lista de contactos**
   - Archivo CSV con números de teléfono
   - Consentimiento de los usuarios (importante para compliance)

---

## 🚀 Paso a Paso

### Paso 1: Prepara tu archivo CSV

#### Formato requerido:
```csv
phone,name
"+5215512345678","Juan Pérez"
"+5215587654321","María López"
"+5215523456789","Carlos Rodríguez"
```

#### Reglas importantes:
- ✅ Primera línea debe ser: `phone,name`
- ✅ Números en formato internacional: `+52` + 10 dígitos
- ✅ Sin espacios en los números
- ✅ Nombres entre comillas dobles
- ✅ Una persona por línea

#### Errores comunes:
```csv
❌ 5512345678,Juan         → Falta +52
❌ +52 55 1234 5678,María  → Tiene espacios
❌ 52123456789,Carlos      → Falta el +
✅ "+5215512345678","Juan" → Correcto
```

#### Descargar ejemplo:
En la página de envío masivo, click en el botón **"Ejemplo"** para descargar un CSV de muestra.

---

### Paso 2: Accede al Envío Masivo

1. Ve a **Encuestas** en el menú lateral
2. Selecciona tu encuesta
3. Click en **"Compartir"**
4. Click en el botón verde **"Envío Masivo"**

---

### Paso 3: Sube tu CSV

1. Click en **"Seleccionar CSV"**
2. Elige tu archivo
3. Espera a que se cargue

**El sistema mostrará:**
- ✅ Números válidos detectados
- ❌ Números inválidos (si los hay)
- 👥 Total de contactos a enviar

---

### Paso 4: Vista Previa

Revisa la tabla con todos tus contactos:
- Número de teléfono
- Nombre
- Orden de envío

**Si ves errores:**
- Corrige tu CSV
- Vuelve a subirlo

---

### Paso 5: Selecciona Plantilla (Próximamente)

*Esta función estará disponible en la próxima versión.*

Por ahora, usamos una plantilla amigable por defecto:

```
¡Hola {{name}}! 👋

Queremos saber tu opinión sobre {{tu encuesta}}.
Son solo X preguntas rápidas.

[Link de la encuesta]

¡Tu feedback nos ayuda mucho! 🙌
```

---

### Paso 6: Confirma y Envía

1. Verifica:
   - ✅ Número de contactos
   - ✅ Créditos disponibles
   - ✅ API Key activa

2. Click en **"Enviar a X contactos"**

3. **Espera** - El proceso puede tomar varios minutos

**Tiempos estimados:**
- 10 contactos: ~30 segundos
- 50 contactos: ~2 minutos
- 100 contactos: ~3-4 minutos
- 500 contactos: ~10-15 minutos

---

### Paso 7: Monitorea el Progreso

Verás en tiempo real:
- **Barra de progreso:** % completado
- **Contador:** "25 de 100 enviados"
- **Tiempo estimado:** Minutos restantes

**Importante:**
- ❌ No cierres la ventana
- ❌ No recargues la página
- ✅ Puedes minimizar el navegador

---

### Paso 8: Revisa Resultados

Al terminar, verás un resumen:

```
✅ Exitosos: 95
❌ Errores: 5
```

**Tabla detallada:**
| Estado | Teléfono | Nombre | Mensaje |
|--------|----------|--------|---------|
| ✅ | +5215512... | Juan | Enviado |
| ❌ | +5215587... | María | No entregado |

**Razones de error comunes:**
- Número inválido o fuera de servicio
- Usuario bloqueó tu número
- Límite de WhatsApp alcanzado
- Error temporal de Twilio

---

## 📊 Después del Envío

### Rastrea las Respuestas

1. Ve a **Encuestas → [Tu encuesta] → Resultados**
2. Verás:
   - Cuántos recibieron el mensaje
   - Cuántos abrieron el link
   - Cuántos completaron la encuesta

### Métricas Importantes

```
Tasa de Entrega = Enviados exitosos / Total
Tasa de Apertura = Clicks en link / Enviados
Tasa de Respuesta = Completados / Clicks
```

**Benchmarks:**
- Entrega: >95%
- Apertura: 40-60%
- Respuesta: 30-50%

---

## 💡 Mejores Prácticas

### Horarios Óptimos
```
✅ Martes a Jueves: 10am - 8pm
✅ Lunes y Viernes: 2pm - 6pm
❌ Evitar: Madrugadas, domingos, días festivos
```

### Frecuencia
```
✅ 1 mensaje por tema/campaña
❌ Múltiples mensajes en corto tiempo = Spam
```

### Personalización
```
✅ Usa nombres reales de contactos
✅ Menciona contexto relevante
❌ No uses: "Estimado usuario", "Cliente"
```

### Contenido
```
✅ Sé claro sobre el propósito
✅ Menciona tiempo estimado
✅ Ofrece valor (sorteo, descuento, feedback)
❌ No engañes sobre el contenido
```

### Legal y Compliance
```
✅ Obtén consentimiento previo
✅ Ofrece opción de darse de baja
✅ Respeta solicitudes de no contacto
✅ Cumple con LFPDPPP (México)
```

---

## 🐛 Solución de Problemas

### "Necesitas generar una API key"
```
Solución:
1. Settings → API
2. Generate API Key
3. Guarda la key
4. Intenta nuevamente
```

### "No tienes suficientes créditos"
```
Solución:
1. Settings → Billing
2. Compra más créditos
3. O reduce el número de contactos
```

### "Error al subir CSV"
```
Solución:
1. Verifica formato del CSV
2. Revisa que tenga header: phone,name
3. Asegura formato +52... en teléfonos
4. Elimina líneas vacías
5. Guarda con encoding UTF-8
```

### "Algunos mensajes no se enviaron"
```
Posibles causas:
- Número inválido o inexistente
- Usuario bloqueó el número
- Límite de WhatsApp alcanzado
- Error temporal de Twilio

Solución:
- Revisa los detalles en tabla de resultados
- Corrige números inválidos
- Reintenta solo los fallidos
```

### "Mensajes no llegan"
```
Checklist:
□ Twilio configurado correctamente
□ Números en formato correcto (+52...)
□ WhatsApp Business habilitado
□ No estás en sandbox sin hacer "join"
□ Verifica logs en Twilio Console
```

---

## ❓ FAQ

### ¿Cuánto cuesta cada envío?
- **Costo en ChatForm:** 1 crédito por envío exitoso
- **Costo de Twilio:** ~$0.0042 USD por mensaje
- **Total:** Depende de tu plan

### ¿Puedo cancelar un envío en progreso?
❌ No por ahora. Una vez iniciado, continuará hasta completar.
*Feature en roadmap para Q1 2025*

### ¿Los usuarios pueden responder por WhatsApp?
✅ Sí, si envías desde un número habilitado para conversaciones.
❌ No, si solo envías links (depende de configuración).

### ¿Puedo personalizar el mensaje?
⏳ Próximamente. Por ahora usa plantilla default.
✅ Sprint 1 agregará selector de plantillas.
✅ Sprint 2 agregará plantillas custom.

### ¿Funciona en todos los países?
✅ Sí, siempre que:
- Formato de número sea correcto
- Twilio soporte ese país
- WhatsApp esté disponible

### ¿Hay límite de envíos por día?
Depende de tu plan:
- **Free:** 50 envíos/mes
- **Starter:** 500 envíos/mes
- **Pro:** 2,000 envíos/mes
- **Business:** 10,000 envíos/mes
- **Enterprise:** Ilimitado

---

## 📚 Recursos Adicionales

- [API Documentation](./API_BULK_SEND.md)
- [WhatsApp Integration Guide](./WHATSAPP_INTEGRATION.md)
- [Video Tutorial](https://youtube.com/chatform) *(próximamente)*
- [Soporte](mailto:support@chatform.mx)

---

## 🆘 ¿Necesitas Ayuda?

**Soporte técnico:**
- Email: support@chatform.mx
- Chat en vivo: Dashboard → Soporte
- WhatsApp: +52 55 1234 5678

**Horario de atención:**
- Lunes a Viernes: 9am - 6pm (CDMX)
- Respuesta promedio: < 2 horas

---

**Última actualización:** 2025-11-03
**Versión:** 1.0
