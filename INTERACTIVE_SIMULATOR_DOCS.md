# Interactive WhatsApp Simulator - Documentación

## 📍 Ubicación

**Componente:** `/app/src/components/surveys/form-builder-v2.tsx`
**Vista:** Preview panel en el editor de encuestas (`/surveys/new` y `/surveys/[id]/edit`)

---

## ✅ Estado: **100% COMPLETO**

El simulador interactivo está totalmente implementado y funcional.

---

## 🎯 Características Implementadas

### 1️⃣ UI Estilo WhatsApp

- ✅ Header verde con avatar y "En línea"
- ✅ Fondo beige (#ECE5DD) estilo WhatsApp
- ✅ Burbujas blancas para mensajes del bot (redondeadas izquierda)
- ✅ Burbujas verdes (#DCF8C6) para respuestas del usuario (redondeadas derecha)
- ✅ Timestamps en cada mensaje (HH:MM)
- ✅ Diseño responsive 360x640px (tamaño de móvil)
- ✅ Shadow y bordes realistas

### 2️⃣ Flujo Interactivo

**Botones:**
- ✅ Botón "Simular" - Inicia la simulación
- ✅ Botón "Reiniciar" - Reinicia la conversación
- ✅ Disabled cuando no hay preguntas

**Estado:**
- ✅ `isSimulating` - Indica si está en modo simulación
- ✅ `currentQuestionIndex` - Pregunta actual (0-indexed)
- ✅ `userResponses` - Object con respuestas {questionId: answer}
- ✅ `showTyping` - Muestra typing indicator
- ✅ `isCompleted` - True cuando termina la encuesta

**Mensajes:**
- ✅ Welcome message al inicio
- ✅ Thank you message al final
- ✅ Todas las preguntas en orden

### 3️⃣ Tipos de Preguntas Soportados

#### ✅ Multiple Choice
- Muestra botones para cada opción
- Full width buttons
- Hover effect
- Click envía respuesta

#### ✅ Yes/No
- Igual que multiple choice
- Botones "Sí" y "No"

#### ✅ Rating (1-10)
- Grid de 10 botones (5 columnas × 2 filas)
- Números del 1 al 10
- Hover effect con color azul
- Click envía respuesta

#### ✅ Email
- Input tipo email
- Placeholder: "tu@email.com"
- Validación: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Alert si email inválido

#### ✅ Phone
- Input tipo tel
- Placeholder: "+52 55 1234 5678"
- Validación: mínimo 10 dígitos (ignora caracteres no numéricos)
- Alert si teléfono inválido

#### ✅ Number
- Input tipo number
- Placeholder: "123"
- Validación: `isNaN(Number(answer))`
- Alert si no es número

#### ✅ Short Text
- Input tipo text
- Placeholder: "Texto corto (máx. 100 caracteres)"
- maxLength={100} en el input
- Contador de caracteres: "X/100"
- Color rojo si excede 100
- Validación: alerta si > 100 caracteres
- Auto-truncate en el input

#### ✅ Open Text
- Input tipo text
- Placeholder: "Escribe tu respuesta..."
- Sin límite de caracteres
- Acepta Enter para enviar

### 4️⃣ Validaciones Implementadas

**Email:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(answer)) {
  alert("Por favor ingresa un email válido");
  return;
}
```

**Phone:**
```javascript
const phoneRegex = /\d{10,}/;
if (!phoneRegex.test(answer.replace(/\D/g, ""))) {
  alert("Por favor ingresa un número de teléfono válido (mínimo 10 dígitos)");
  return;
}
```

**Number:**
```javascript
if (isNaN(Number(answer))) {
  alert("Por favor ingresa un número válido");
  return;
}
```

**Short Text:**
```javascript
if (answer.length > 100) {
  alert("El texto debe ser menor a 100 caracteres");
  return;
}
```

### 5️⃣ Animaciones y UX

- ✅ **Typing Indicator** - 3 dots animados (bounce con delays)
- ✅ **Auto-scroll** - Scroll automático al final del chat
- ✅ **Delays** - 800ms entre pregunta y respuesta
- ✅ **Auto-focus** - Input tiene auto-focus cuando aparece
- ✅ **Enter key** - Envía respuesta al presionar Enter
- ✅ **Button states** - Disabled cuando está typing o no hay texto
- ✅ **Smooth transitions** - Transiciones en hover y clicks

### 6️⃣ Input Controls

**Send Button:**
- Botón verde WhatsApp (#075E54)
- Icono ▶ (play)
- Disabled cuando:
  - `showTyping` es true
  - `inputValue` está vacío
  - No hay pregunta actual

**Input Field:**
- Responsive width
- Border radius completo (rounded-full)
- Focus ring azul
- Type específico según tipo de pregunta (email, tel, number, text)

---

## 🔄 Flujo de Uso

### 1. Inicio

```
Usuario → Click "Simular"
  ↓
Estado:
- isSimulating = true
- currentQuestionIndex = 0
- userResponses = {}
- inputValue = ""
```

### 2. Durante Simulación

```
Bot muestra: Welcome Message (si existe)
  ↓
Bot muestra: Pregunta 1
  ↓
Usuario responde (button o input)
  ↓
handleResponse(answer):
  1. Valida respuesta según tipo
  2. Guarda en userResponses
  3. Limpia input
  4. Muestra typing indicator (800ms)
  5. Avanza a siguiente pregunta
  ↓
Repite para cada pregunta
  ↓
Bot muestra: Thank You Message
  ↓
isCompleted = true
```

### 3. Finalización

```
Usuario ve:
- Todas las preguntas y respuestas
- Thank you message
- Input disabled con placeholder
- Botón "Reiniciar" disponible
```

---

## 📊 Métricas de Completitud

| Característica | Estado |
|----------------|--------|
| UI WhatsApp | ✅ 100% |
| Flujo interactivo | ✅ 100% |
| Multiple choice | ✅ 100% |
| Yes/No | ✅ 100% |
| Rating | ✅ 100% |
| Email | ✅ 100% |
| Phone | ✅ 100% |
| Number | ✅ 100% |
| Short text | ✅ 100% |
| Open text | ✅ 100% |
| Validaciones | ✅ 100% |
| Animaciones | ✅ 100% |
| Auto-scroll | ✅ 100% |
| Typing indicator | ✅ 100% |
| Character counter | ✅ 100% |

**Total:** ✅ **100% COMPLETO**

---

## 🎨 Código Clave

### Estados

```typescript
const [isSimulating, setIsSimulating] = useState(false);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
const [userResponses, setUserResponses] = useState<Record<string, string>>({});
const [showTyping, setShowTyping] = useState(false);
const [inputValue, setInputValue] = useState("");
```

### Funciones Principales

```typescript
const startSimulation = () => {
  setIsSimulating(true);
  setCurrentQuestionIndex(0);
  setUserResponses({});
  setInputValue("");
};

const resetSimulation = () => {
  setIsSimulating(false);
  setCurrentQuestionIndex(-1);
  setUserResponses({});
  setInputValue("");
};

const handleResponse = (answer: string) => {
  // Validations
  // Save response
  // Show typing
  // Move to next question after 800ms
};
```

---

## 🚀 Mejoras Futuras (Opcional)

Aunque el simulator está completo, posibles mejoras futuras:

- [ ] Sonidos de notificación (opcional)
- [ ] Checkmarks azules en mensajes enviados
- [ ] Mostrar "Escribiendo..." como texto en lugar de dots
- [ ] Guardar respuestas en localStorage para recuperar sesión
- [ ] Exportar respuestas de prueba como CSV
- [ ] Compartir link de preview simulado
- [ ] Modo oscuro del simulador

---

## 🐛 Testing

**Casos de prueba verificados:**

✅ Simular encuesta completa con todos los tipos de pregunta
✅ Reiniciar en medio de la encuesta
✅ Validación de email inválido
✅ Validación de teléfono inválido
✅ Validación de número inválido
✅ Validación de short_text > 100 caracteres
✅ Contador de caracteres funciona correctamente
✅ Typing indicator aparece entre preguntas
✅ Auto-scroll funciona correctamente
✅ Enter key envía respuesta
✅ Botones disabled cuando corresponde

---

## 📝 Notas Técnicas

- El simulator NO guarda respuestas en DB (es solo preview)
- Las respuestas se guardan en memoria local del componente
- Al salir del editor, las respuestas de prueba se pierden
- El simulator es independiente del flujo real de WhatsApp
- Útil para testear UX antes de publicar

---

**Fecha:** 2 Noviembre 2025
**Estado:** ✅ Completo y funcional
**Commit:** 373ad26 "Complete interactive WhatsApp simulator with validations"
