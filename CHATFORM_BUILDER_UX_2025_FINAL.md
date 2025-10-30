# ChatForm - Form Builder UI/UX Plan 2025
## Del research a la implementación

**Fecha:** 30 Oct 2025
**Status:** Plan Definitivo Aprobado
**Objetivo:** Implementar form builder moderno con AI-first approach y UX 2025

---

## 📊 Estado Actual del Proyecto

### ✅ Lo que YA está construido:

**Backend & Database:**
- ✅ Next.js 16 + React 19
- ✅ PostgreSQL con Drizzle ORM
- ✅ NextAuth v5 (authentication)
- ✅ Multi-tenant architecture (tenants, users, tenant_users)
- ✅ Database schema completo (surveys, questions, responses, sessions)
- ✅ REST API para CRUD de surveys
- ✅ Stripe integration preparada

**Form Builder Básico:**
- ✅ Survey editor funcional ([survey-editor.tsx](app/src/components/surveys/survey-editor.tsx))
- ✅ 3 tipos de preguntas: Multiple Choice, Rating (1-10), Open Text
- ✅ CRUD completo de encuestas
- ✅ Preview mode simple
- ✅ Drag handle UI (sin funcionalidad)

**Estructura de datos:**
```typescript
interface Question {
  id: string;
  type: "multiple_choice" | "rating" | "open_text";
  text: string;
  options?: string[]; // solo para multiple_choice
  order: number;
}
```

### 🚧 Lo que FALTA (este documento):

1. **AI Form Generator** - El usuario describe → AI genera preguntas
2. **3-Column Layout** - Structure | Preview | Properties
3. **Live Interactive Preview** - Chat-style con interacción real
4. **Más question types** - Email, Yes/No, Date, NPS
5. **AI Assistant Panel** - Sugerencias y ayuda contextual
6. **Drag & Drop reordering** - Funcionalidad real (no solo UI)
7. **Question properties panel** - Validations, logic, settings

---

## 🎯 Decisiones Finales (Basadas en tu feedback)

### 1. Arquitectura UI
**✅ 3 columnas** - Structure (270px) | Preview (fluid) | Properties (340px)

### 2. Approach de Creación
**✅ AI-first (Hybrid)** - Parece AI-first pero el usuario tiene control total:
- Usuario describe encuesta → AI genera preguntas
- Usuario puede editar, reordenar, eliminar
- Usuario puede agregar manualmente
- AI sugiere mejoras en tiempo real

### 3. Preview
**✅ 100% interactivo** - El usuario VIVE la experiencia como será en WhatsApp:
- Chat-style interface
- Puede responder preguntas
- Ve flujo completo
- Device switcher (mobile/desktop)

### 4. Question Types (Prioridad)
**MVP (Fase 1):**
1. ✅ Text (short/long) - Ya existe como "open_text"
2. ✅ Multiple Choice - Ya existe
3. ✅ Rating (1-10) - Ya existe
4. ⭐ **Email** - Con validación
5. ⭐ **Yes/No** - Simple boolean

**Fase 2:**
6. NPS (0-10 con categorización automática)
7. Phone
8. Date
9. File Upload

### 5. Data Export
**✅ Formato definido:**
- **Link/QR**: Ya planeado en MVP
- **CSV Upload**: Envío automático (Fase 2)
- **Webhooks**: Para integraciones (Fase 2)

### 6. Timeline
**✅ 1 mes pulido** - 4 semanas para MVP completo y bien hecho

---

## 🎨 Research Summary: UX Trends 2025

### Hallazgos del mercado:

**✅ Form Builders modernos (Typeform, Tally, Fillout):**
- One question at a time (conversational)
- AI-driven personalization
- Multi-step forms
- Real-time validation
- Minimal fields
- Progress indicators

**✅ AI Conversational Interfaces 2025:**
- Hybrid input (botones + chat)
- Quick replies para guiar
- Short messages (max 3 líneas)
- Transparent AI disclosure
- Task-oriented (no solo chat)

**✅ Minimalist UI 2025:**
- Abundant white space (95% de interfaces modernas)
- Monochromatic palettes
- Content-first approach
- Dark mode obligatorio
- Micro-interactions sutiles

**✅ Competidores:**
- **Typeform**: $29-99/mo, beautiful UI, solo 10 respuestas free
- **Tally**: Unlimited free, Notion-like, clean
- **Fillout**: Balance simplicidad/poder

**Nuestro diferenciador:** WhatsApp-first + AI + más barato

---

## 🏗️ Arquitectura del Form Builder

### Layout de 3 Columnas

```
┌─────────────────────────────────────────────────────────────────┐
│  Logo  |  Encuesta de Feedback  |  Save  [Test] [Publish ▼]    │
├───────────────┬─────────────────────┬───────────────────────────┤
│               │                     │                           │
│   STRUCTURE   │      PREVIEW        │      PROPERTIES          │
│   (270px)     │      (FLUID)        │      (340px)             │
│   Fixed       │   Resizable         │   Fixed                   │
│               │                     │                           │
│ ┌───────────┐ │  ┌───────────────┐  │  Question Settings       │
│ │ ⚡ AI Gen │ │  │               │  │  ┌─────────────────────┐ │
│ │ Welcome   │ │  │  📱 WhatsApp  │  │  │ Type: Email         │ │
│ └───────────┘ │  │  Chat Style   │  │  │ ☑ Required          │ │
│               │  │               │  │  │ ☑ Validate format   │ │
│ Questions (3) │  │  Interactive  │  │  │                     │ │
│ ┌───────────┐ │  │  Preview      │  │  │ Validation:         │ │
│ │ 1. Email  │◀│  │               │  │  │ ● Email format     │ │
│ │ 2. Rating │ │  │  [Test mode]  │  │  │ ○ Custom regex     │ │
│ │ 3. Texto  │ │  │               │  │  └─────────────────────┘ │
│ │   [+]     │ │  │  Device:      │  │                           │
│ └───────────┘ │  │  📱 💻        │  │  Conditional Logic       │
│               │  └───────────────┘  │  ┌─────────────────────┐ │
│ Thank You     │                     │  │ Show if:            │ │
│               │                     │  │ + Add condition     │ │
│ [Publish ▼]   │  [← Reset Test]     │  └─────────────────────┘ │
└───────────────┴─────────────────────┴───────────────────────────┘
```

### Flujo del Usuario

**Escenario 1: AI-First (Usuario nuevo)**
```
1. Click "Nueva Encuesta"
   ↓
2. Modal: "¿Qué quieres preguntar?"
   Input: "Feedback de usuarios sobre mi app"
   [Generar con IA ✨]
   ↓
3. AI genera automáticamente:
   - Welcome message
   - 3-5 preguntas relevantes
   - Thank you message
   ↓
4. Preview muestra conversación completa
   Usuario ve: "Perfecto! Puedes editarlo"
   ↓
5. Usuario refina:
   - Click pregunta → edita
   - Arrastra para reordenar
   - Agrega/elimina
   ↓
6. [Publish] → Get link/QR
```

**Escenario 2: Manual (Usuario avanzado)**
```
1. Click "Nueva Encuesta"
   ↓
2. Click "Start from scratch"
   ↓
3. Canvas vacío con:
   [+ Add Question]
   💡 "O describe tu encuesta y la crearemos por ti"
   ↓
4. Click + → Dropdown tipos:
   - Email
   - Multiple Choice
   - Rating
   - Text
   - Yes/No
   ↓
5. Llena manualmente
   AI asiste: "¿Quieres validar el email automáticamente?"
```

---

## 🧩 Componentes Detallados

### 1. Structure Panel (Izquierda - 270px)

```tsx
<div className="w-[270px] border-r bg-white flex flex-col">
  {/* AI Quick Action */}
  <div className="p-4 border-b">
    <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-md flex items-center justify-center gap-2 hover:opacity-90">
      <Sparkles className="w-4 h-4" />
      Generate with AI
    </button>
  </div>

  {/* Survey Structure */}
  <div className="flex-1 overflow-y-auto p-4 space-y-2">
    {/* Welcome Message */}
    <div className="text-xs font-medium text-gray-500 mb-2">
      FLOW
    </div>

    <SectionCard
      icon={<MessageSquare />}
      title="Welcome"
      subtitle="Greeting message"
      onClick={() => selectSection('welcome')}
      isSelected={selected === 'welcome'}
    />

    {/* Questions */}
    <div className="text-xs font-medium text-gray-500 mt-4 mb-2">
      QUESTIONS ({questions.length})
    </div>

    {questions.map((q, i) => (
      <QuestionCard
        key={q.id}
        number={i + 1}
        question={q}
        isSelected={selectedQuestion === q.id}
        onClick={() => selectQuestion(q.id)}
        onDragStart={() => handleDragStart(i)}
        onDragOver={() => handleDragOver(i)}
        onDrop={() => handleDrop(i)}
      />
    ))}

    {/* Add Button */}
    <button className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
      <Plus className="w-4 h-4" />
      Add Question
    </button>

    {/* Thank You */}
    <div className="text-xs font-medium text-gray-500 mt-4 mb-2">
      ENDING
    </div>

    <SectionCard
      icon={<Check />}
      title="Thank You"
      subtitle="Closing message"
      onClick={() => selectSection('thankyou')}
      isSelected={selected === 'thankyou'}
    />
  </div>

  {/* Footer Actions */}
  <div className="p-4 border-t space-y-2">
    <button className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200">
      Save Draft
    </button>
    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
      <Rocket className="w-4 h-4" />
      Publish
    </button>
  </div>
</div>
```

### 2. Preview Panel (Centro - Fluid)

```tsx
<div className="flex-1 bg-gray-50 flex flex-col">
  {/* Header */}
  <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <h3 className="font-medium text-gray-900">Preview</h3>
      <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
        <button className={cn("px-3 py-1 rounded text-sm", isMobile && "bg-white shadow-sm")}>
          <Smartphone className="w-4 h-4" />
        </button>
        <button className={cn("px-3 py-1 rounded text-sm", !isMobile && "bg-white shadow-sm")}>
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    </div>

    <button
      onClick={resetTest}
      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
    >
      <RotateCcw className="w-4 h-4" />
      Reset Test
    </button>
  </div>

  {/* Chat Preview */}
  <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
    <div className={cn(
      "bg-white rounded-2xl shadow-xl border overflow-hidden transition-all",
      isMobile ? "w-[375px] h-[667px]" : "w-[600px] h-[700px]"
    )}>
      {/* WhatsApp-style header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium">ChatForm</div>
          <div className="text-xs opacity-80">Online</div>
        </div>
      </div>

      {/* Chat area */}
      <div className="h-[calc(100%-120px)] overflow-y-auto p-4 bg-[#ECE5DD] bg-[url('/whatsapp-bg.png')]">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {/* Current Question */}
        {currentQuestion && (
          <div className="space-y-3">
            {/* Bot message */}
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none shadow px-4 py-3 max-w-[80%]">
                <p className="text-gray-900">{currentQuestion.text}</p>
                <span className="text-xs text-gray-500 mt-1">
                  {formatTime(new Date())}
                </span>
              </div>
            </div>

            {/* Input area based on type */}
            {renderQuestionInput(currentQuestion)}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t bg-white px-4 py-3 flex items-center gap-2">
        {isWaitingResponse ? (
          <div className="flex-1 text-center text-sm text-gray-500">
            Waiting for response...
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Type your answer..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={testAnswer}
              onChange={(e) => setTestAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            />
            <button
              onClick={submitAnswer}
              className="w-10 h-10 rounded-full bg-[#075E54] text-white flex items-center justify-center hover:bg-[#064E46]"
            >
              <Send className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </div>
  </div>
</div>
```

### 3. Properties Panel (Derecha - 340px)

```tsx
<div className="w-[340px] border-l bg-white overflow-y-auto">
  {!selectedItem ? (
    // Empty state
    <div className="p-6 text-center text-gray-500">
      <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>Select a question to edit its properties</p>
    </div>
  ) : (
    <div className="p-6 space-y-6">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Type
        </label>
        <select
          value={question.type}
          onChange={(e) => updateQuestion({ type: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="email">Email</option>
          <option value="multiple_choice">Multiple Choice</option>
          <option value="rating">Rating</option>
          <option value="open_text">Text</option>
          <option value="yes_no">Yes/No</option>
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text
        </label>
        <textarea
          value={question.text}
          onChange={(e) => updateQuestion({ text: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="What do you want to ask?"
        />
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-700">Settings</div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => updateQuestion({ required: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Required</span>
        </label>

        {question.type === 'email' && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={question.validateEmail}
              onChange={(e) => updateQuestion({ validateEmail: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm text-gray-700">Validate email format</span>
          </label>
        )}
      </div>

      {/* Type-specific options */}
      {question.type === 'multiple_choice' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                />
                {question.options.length > 2 && (
                  <button onClick={() => deleteOption(i)}>
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add option
            </button>
          </div>
        </div>
      )}

      {/* Conditional Logic (Fase 2) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Conditional Logic
          </label>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            Pro
          </span>
        </div>
        <button className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600">
          + Add condition
        </button>
      </div>

      {/* AI Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-blue-900 mb-1">
              AI Suggestion
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Consider adding a follow-up question: "What could we improve?"
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Add question →
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
```

---

## 🤖 AI Integration

### AI Form Generator

```typescript
// lib/ai/form-generator.ts
export async function generateFormFromDescription(description: string) {
  const prompt = `
You are an expert survey designer. Generate a conversational survey based on this description:
"${description}"

Return a JSON object with:
- welcomeMessage: A friendly greeting (2-3 sentences, warm tone)
- questions: Array of 3-5 relevant questions
- thankYouMessage: A closing message (1-2 sentences)

Each question should have:
- type: email | multiple_choice | rating | open_text | yes_no
- text: The question text (conversational, friendly)
- options: Array of options (only for multiple_choice, 2-5 options)
- required: boolean

Make it conversational, friendly, and focused. Use Spanish.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content);
}
```

### AI Assistant (Contextual Suggestions)

```typescript
// Triggers:
// 1. On question creation
// 2. After 3 questions added
// 3. On specific question types (email → suggest validation)

export async function getSuggestion(context: {
  currentQuestions: Question[];
  selectedQuestion?: Question;
  surveyType?: string;
}) {
  // AI analiza contexto y sugiere mejoras
  // Ejemplos:
  // - "Consider validating email format"
  // - "Add a follow-up question for negative responses"
  // - "This survey is too long (10+ questions), consider splitting"
}
```

---

## 📋 Plan de Implementación (4 Semanas)

### **Semana 1: Foundation + Structure Panel**

**Días 1-2: Refactor Existing**
- [ ] Migrar de layout single-page a 3-column layout
- [ ] Crear componentes base: `StructurePanel`, `PreviewPanel`, `PropertiesPanel`
- [ ] Setup context para compartir estado entre paneles

**Días 3-4: Structure Panel**
- [ ] Lista de preguntas con drag & drop (react-beautiful-dnd)
- [ ] Question cards con iconos por tipo
- [ ] Add question dropdown mejorado
- [ ] Welcome/Thank you sections

**Días 5-7: Properties Panel**
- [ ] Question type selector
- [ ] Settings por tipo de pregunta
- [ ] Email type con validación
- [ ] Yes/No type
- [ ] Save/update logic

**Deliverable:** 3-column layout funcional, drag & drop working

---

### **Semana 2: Preview Interactivo**

**Días 1-3: WhatsApp-style Preview**
- [ ] Chat container con diseño WhatsApp
- [ ] Message bubbles (bot/user)
- [ ] Device switcher (mobile/desktop)
- [ ] Scroll automático

**Días 4-5: Interactive Testing**
- [ ] Input handlers por question type
- [ ] Answer submission
- [ ] Progress through questions
- [ ] Reset test button

**Días 6-7: Question Rendering**
- [ ] Email input con validación visual
- [ ] Multiple choice con botones
- [ ] Rating con números/estrellas
- [ ] Yes/No con botones
- [ ] Open text con textarea

**Deliverable:** Preview 100% interactivo, usuario puede probar flujo completo

---

### **Semana 3: AI Integration**

**Días 1-2: OpenAI Setup**
- [ ] API integration
- [ ] Prompt engineering para form generation
- [ ] Error handling y fallbacks

**Días 3-4: AI Form Generator**
- [ ] Modal "Describe your survey"
- [ ] Generate button
- [ ] Loading state con streaming (opcional)
- [ ] Parse AI response → questions

**Días 5-6: AI Assistant Panel**
- [ ] Contextual suggestions logic
- [ ] Suggestion cards en properties panel
- [ ] "Add question" from suggestion
- [ ] Improvement suggestions

**Día 7: Polish**
- [ ] Error messages
- [ ] Edge cases
- [ ] Rate limiting

**Deliverable:** AI genera encuestas funcionales, sugerencias contextuales

---

### **Semana 4: Polish + Production**

**Días 1-2: UX Improvements**
- [ ] Loading states en todos los actions
- [ ] Toast notifications
- [ ] Empty states bonitos
- [ ] Keyboard shortcuts
- [ ] Tooltips y hints

**Días 3-4: Mobile Responsive**
- [ ] 3-column → Stack en mobile
- [ ] Tabs para navegar entre paneles
- [ ] Touch-friendly buttons
- [ ] Mobile preview

**Días 5-6: Testing**
- [ ] E2E test del flujo completo
- [ ] Cross-browser testing
- [ ] Performance optimization
- [ ] Accessibility audit

**Día 7: Launch Prep**
- [ ] Documentation
- [ ] Video tutorial grabado
- [ ] Deploy a staging
- [ ] Beta users onboarding

**Deliverable:** Form builder production-ready

---

## 🎨 Componentes UI (shadcn/ui)

### Necesarios para el proyecto:

```bash
# Ya instalados (del landing)
- Button
- Input
- Textarea
- Select
- Dialog
- Dropdown Menu

# A instalar:
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add tooltip
npx shadcn@latest add switch
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
npx shadcn@latest add skeleton

# External libraries:
npm install @dnd-kit/core @dnd-kit/sortable  # Drag & drop (más moderno que react-beautiful-dnd)
npm install framer-motion  # Animations
npm install react-hot-toast  # Toast notifications
```

---

## 🔄 Data Flow

### Create Survey with AI

```
User Input → AI API → Parse Response → Update State → Render Preview

1. User: "encuesta de satisfacción post-compra"
2. API: POST /api/ai/generate-form { description }
3. OpenAI: Returns { welcomeMessage, questions[], thankYouMessage }
4. Frontend: setState(generatedForm)
5. Preview: Renders chat with all questions
6. User: Can edit/publish
```

### Interactive Testing

```
User Action → Validate → Update Chat → Next Question

1. User types answer in preview
2. Client validates based on question type
3. Add user message bubble
4. Wait 500ms (simulate typing)
5. Add bot message with next question
6. Repeat until completed
7. Show thank you message
```

### Save Survey

```
User Click Save → Validate → API Call → Database → Redirect

Current flow (mantener):
POST /api/surveys → Creates survey + questions
PUT /api/surveys/:id → Updates survey + questions
```

---

## 🎯 Success Metrics

### Technical
- [ ] 3-column layout responsive en <1920px
- [ ] Preview interactive funciona 100%
- [ ] Drag & drop sin bugs
- [ ] AI genera formularios válidos >95% del tiempo
- [ ] Load time <2s

### UX
- [ ] Usuario crea encuesta en <3 minutos (con AI)
- [ ] Preview refleja exactamente WhatsApp experience
- [ ] 0 confusión sobre cómo agregar preguntas
- [ ] AI suggestions útiles >80% del tiempo

### Product
- [ ] 10 beta users crean su primera encuesta
- [ ] 8/10 usan AI generator
- [ ] 5+ question types usados
- [ ] 0 bugs críticos en testing

---

## 🚀 Más Allá del MVP (Fase 2)

### Features Post-Launch:

1. **Conditional Logic**
   - IF answer = X THEN show question Y
   - Skip logic visual builder
   - Branching paths en preview

2. **Templates Gallery**
   - NPS Survey
   - CSAT
   - Post-Purchase Feedback
   - Product Feedback
   - Event Registration

3. **Advanced Question Types**
   - Date picker
   - File upload
   - Location
   - Phone (with country code)

4. **Collaboration**
   - Comments on questions
   - Version history
   - Team permissions

5. **A/B Testing**
   - Multiple variants
   - Auto-optimize based on completion rate

---

## 📝 Next Steps Inmediatos

### Para empezar AHORA:

1. **Crear branch** `feature/form-builder-v2`
2. **Setup 3-column layout** base (sin funcionalidad)
3. **Migrar editor actual** a structure panel
4. **Crear preview panel** con WhatsApp style (estático primero)
5. **Daily progress**: Commit al final de cada día

### Preguntas para resolver antes de empezar:

1. ✅ **OpenAI API key**: ¿Ya tienes? ¿Configurada en env?
2. ✅ **Drag & drop library**: ¿@dnd-kit o react-beautiful-dnd?
   - **Recomendación**: @dnd-kit (más moderno, mejor TS support)
3. ✅ **State management**: ¿Zustand o solo React Context?
   - **Recomendación**: React Context para MVP, Zustand si crece
4. ✅ **Preview testing state**: ¿Guardar en DB o solo local?
   - **Recomendación**: Solo local (session storage)

---

## ✅ Checklist Pre-Implementation

- [ ] OpenAI API key configurada
- [ ] @dnd-kit instalado
- [ ] shadcn/ui components necesarios instalados
- [ ] Design tokens actualizados (colores, spacing)
- [ ] Wireframes revisados y aprobados
- [ ] Database schema actualizado (si necesario)
- [ ] Este documento aprobado por founder

---

## 🎨 Design Tokens Finales

```css
/* Spacing */
--space-column: 270px;  /* Structure panel */
--space-properties: 340px;  /* Properties panel */
--space-preview-min: 600px;  /* Preview min width */

/* Colors (mantener del landing) */
--color-primary: #2563eb;  /* blue-600 */
--color-secondary: #06b6d4;  /* cyan-600 */
--color-ai: #8b5cf6;  /* purple-600 para AI features */
--color-whatsapp: #075E54;  /* WhatsApp green */
--color-whatsapp-bg: #ECE5DD;  /* WhatsApp beige */

/* Border Radius (mantener consistencia) */
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px - buttons */
--radius-lg: 0.5rem;    /* 8px - cards */
--radius-xl: 0.75rem;   /* 12px - panels */
--radius-2xl: 1rem;     /* 16px - preview */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

---

## 🎬 Conclusión

Este documento define la implementación completa del Form Builder moderno para ChatForm, basado en:

1. ✅ **Research de mercado 2025** - Best practices actuales
2. ✅ **Tu feedback específico** - 3 columnas, AI-first, preview interactivo
3. ✅ **Código existente** - Aprovechar lo construido
4. ✅ **Timeline realista** - 4 semanas para MVP pulido

**Ready to build? Let's go! 🚀**

---

**Última actualización:** 30 Oct 2025
**Versión:** 1.0 Final
**Status:** Aprobado - Ready for Implementation
