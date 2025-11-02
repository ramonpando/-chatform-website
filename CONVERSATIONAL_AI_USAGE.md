# Conversational AI Survey Builder - Guía de Uso

## 🎯 Resumen

El Conversational AI Builder permite crear encuestas mediante chat iterativo con IA, en lugar del método tradicional de "generar una vez y listo".

**Estado:** ✅ MVP Implementado (Branch: `feature/conversational-ai-builder`)

---

## 🚀 Cómo Usar

### 1. Requisitos

**Configuración necesaria:**
```bash
# En /root/chatform/app/.env.local
OPENAI_API_KEY=sk-... # Tu API key de OpenAI
```

**Plan requerido:**
- Solo usuarios **Pro** ($99/mes) o **Business** ($299/mes)
- Free y Starter no tienen acceso

### 2. Acceder al Builder

1. Ve a **Nueva Encuesta**: `/surveys/new`
2. Verás el botón **"Chat con IA"** (gradiente purple-blue)
3. Haz clic para abrir el modal de chat

### 3. Comandos Naturales Soportados

El AI entiende lenguaje natural. Ejemplos:

#### Agregar Preguntas
```
User: "Agrega una pregunta sobre precio"
AI: [ADD_QUESTION] Agregué: "¿El precio influyó en tu decisión?" (tipo: multiple_choice con opciones Sí/No/Parcialmente)

User: "Agrega pregunta abierta sobre experiencia"
AI: [ADD_QUESTION] Agregué: "¿Cómo fue tu experiencia con nuestro producto?" (tipo: open_text)
```

#### Modificar Preguntas
```
User: "Cambia la pregunta 2 a texto corto"
AI: [MODIFY_QUESTION #2] Cambié el tipo a: "short_text"

User: "Modifica pregunta 3 para ser más específica"
AI: [MODIFY_QUESTION #3] Cambié a: "¿Qué característica específica te gustaría que mejoráramos?"
```

#### Eliminar Preguntas
```
User: "Elimina la pregunta 5"
AI: [DELETE_QUESTION #5] Pregunta eliminada

User: "Borra la última pregunta"
AI: [DELETE_QUESTION #8] Última pregunta eliminada
```

#### Preguntas Clarificadoras
```
User: "Quiero una encuesta de churn"
AI: "Perfecto. ¿Para qué tipo de producto es? ¿SaaS, e-commerce, o otro?"

User: "SaaS B2B"
AI: "Entendido. ¿Cuál es tu mayor preocupación: churn temprano (< 3 meses) o después de renovación?"
```

### 4. Flujo Típico de Uso

**Ejemplo completo:**

```
1. User: "Necesito una encuesta de satisfacción post-compra"
   AI: "Perfecto. ¿Es para e-commerce, SaaS, o servicio físico?"

2. User: "E-commerce de ropa"
   AI: "Entiendo. ¿Quieres medir satisfacción con el producto, envío, o ambos?"

3. User: "Ambos"
   AI: [GENERATE_DRAFT] He creado un borrador con 6 preguntas:
       1. ¿Cómo calificarías tu experiencia de compra? (rating)
       2. ¿La ropa cumplió tus expectativas? (multiple_choice)
       3. ¿Cómo fue el tiempo de envío? (rating)
       ...

4. User: "Agrega pregunta sobre talla"
   AI: [ADD_QUESTION] Agregué: "¿La talla fue correcta?" (tipo: multiple_choice)

5. User: "Cambia pregunta 2 a texto abierto"
   AI: [MODIFY_QUESTION #2] Cambié a tipo open_text: "¿Qué opinas de la calidad?"

6. User: "Perfecto, aplica la encuesta"
   AI: "¡Listo! Tu encuesta de 7 preguntas está lista. Puedes editarla más en el builder."
```

### 5. Límites y Restricciones

| Límite | Valor |
|--------|-------|
| Mensajes por conversación | 20 |
| Reset de límite | 1 hora |
| Tiempo de respuesta | ~2-3 segundos |
| Preguntas max recomendadas | 10 |

**Nota:** El contador de mensajes restantes se muestra en el header del chat.

---

## 🎨 Interfaz

### Botón de Acceso
- **Ubicación:** Empty state del form builder
- **Estilo:** Gradiente purple-blue (destaca sobre otros botones)
- **Texto:** "Chat con IA"
- **Visibilidad:** Solo Pro/Business

### Modal de Chat
```
┌────────────────────────────────────────┐
│ AI Survey Assistant          [X]       │
│ 18 mensajes restantes                  │
├────────────────────────────────────────┤
│ [Borrador: 3 preguntas] [Aplicar]     │
├────────────────────────────────────────┤
│                                        │
│ AI: ¡Hola! ¿Qué tipo de encuesta?     │
│                                        │
│              You: Churn de SaaS →     │
│                                        │
│ AI: Perfecto. ¿Churn temprano o...    │
│                                        │
├────────────────────────────────────────┤
│ [Escribe tu mensaje...] [Enviar →]    │
│ Presiona Enter para enviar             │
└────────────────────────────────────────┘
```

---

## 💡 Tips de Uso

### ✅ Buenas Prácticas

1. **Sé específico en tu primera pregunta:**
   - ❌ "Quiero una encuesta"
   - ✅ "Quiero encuesta de churn para SaaS B2B"

2. **Itera incrementalmente:**
   - ✅ "Agrega pregunta sobre precio"
   - ✅ "Cambia pregunta 2 a opción múltiple"
   - ❌ "Regenera todo desde cero"

3. **Usa números de pregunta:**
   - ✅ "Modifica pregunta 3"
   - ❌ "Modifica esa pregunta que agregaste antes"

4. **Pide aclaraciones:**
   - Si el AI no entendió, reformula
   - El AI aprende del contexto de la conversación

### ❌ Evita

1. **Comandos ambiguos:**
   - ❌ "Hazla mejor"
   - ✅ "Cambia pregunta 2 para ser más específica"

2. **Mensajes muy largos:**
   - Máximo 2-3 acciones por mensaje
   - El AI procesa mejor instrucciones claras

3. **Borrar todo el progreso:**
   - No puedes "deshacer" en el chat
   - Usa el builder para edits manuales después

---

## 🧪 Testing

### Cómo Probar Localmente

1. **Setup:**
   ```bash
   cd /root/chatform/app
   echo 'OPENAI_API_KEY=sk-...' >> .env.local
   npm run dev
   ```

2. **Cambiar tu plan temporalmente:**
   ```sql
   -- En tu DB (Supabase)
   UPDATE tenants
   SET plan = 'pro'
   WHERE id = 'tu-tenant-id';
   ```

3. **Probar:**
   - Crear nueva encuesta
   - Clic en "Chat con IA"
   - Enviar: "Quiero encuesta de feedback"
   - Observar respuesta del AI

### Casos de Prueba

| Caso | Input | Esperado |
|------|-------|----------|
| Agregar | "Agrega pregunta de rating" | [ADD_QUESTION] con tipo rating |
| Modificar | "Cambia pregunta 2 a texto" | [MODIFY_QUESTION #2] |
| Eliminar | "Elimina pregunta 5" | [DELETE_QUESTION #5] |
| Clarificación | "Encuesta de churn" | AI pregunta por detalles |
| Límite | Enviar 21 mensajes | Error 429 (límite alcanzado) |

---

## 📊 Métricas y Monitoreo

### KPIs a Trackear

1. **Adoption:**
   - % de usuarios Pro/Business que lo prueban
   - Promedio de mensajes por conversación

2. **Engagement:**
   - % de conversaciones que resultan en survey publicada
   - Tasa de "Apply" vs "Cancel"

3. **Costos:**
   - Gasto total OpenAI/mes
   - Costo promedio por usuario

### Esperado (Mes 1):
- 30% de usuarios Pro lo prueban
- 5+ mensajes promedio
- 70% aplican la encuesta
- $150 costo AI total

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. "No tienes permiso para usar esta función"
**Causa:** Usuario no es Pro/Business
**Solución:** Upgrade a plan Pro

#### 2. "Has alcanzado el límite de 20 mensajes"
**Causa:** Límite por conversación excedido
**Solución:** Aplica la encuesta actual y abre nueva conversación

#### 3. "Error al procesar tu mensaje"
**Causa:** OpenAI API key inválida o sin crédito
**Solución:** Verificar API key en `.env.local`

#### 4. AI no ejecuta comandos
**Causa:** Prompt no detectado
**Solución:** Usa lenguaje más directo: "Agrega pregunta sobre X"

---

## 🔮 Próximos Pasos (Roadmap)

### Phase 2 (Q2 2025):
- [ ] Persistir historial de conversaciones
- [ ] Sugerencias proactivas del AI
- [ ] Usar templates como starting point
- [ ] Voice input (Whisper API)

### Phase 3 (H2 2025):
- [ ] Collaborative chat (team members)
- [ ] AI recuerda preferencias del usuario
- [ ] Multi-language support
- [ ] Streaming responses (SSE)

---

## 💰 Costos

### Por Conversación:
- **Modelo:** GPT-4o-mini
- **Input:** ~10,000 tokens (20 mensajes × 500 tokens)
- **Output:** ~4,000 tokens (20 respuestas × 200 tokens)
- **Total:** ~$0.15

### Escalado:
```
1,000 conversaciones/mes = $150
100 usuarios Pro @ $99 = $9,900 revenue
Margen: 98.5% 💰
```

---

## 📞 Soporte

**Issues conocidos:**
- Ninguno reportado aún (MVP recién lanzado)

**Para reportar bugs:**
1. Describe el input exacto que enviaste
2. Respuesta que recibiste
3. Comportamiento esperado
4. Screenshot del chat

---

**Última actualización:** 2025-11-02
**Versión:** MVP 1.0
**Status:** ✅ En producción (branch feature)
