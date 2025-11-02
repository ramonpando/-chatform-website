# Sistema de Soporte - ChatForm

Documentación completa del sistema de tickets de soporte integrado.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Base de Datos](#base-de-datos)
4. [API Endpoints](#api-endpoints)
5. [Componentes Frontend](#componentes-frontend)
6. [Flujo de Usuario](#flujo-de-usuario)
7. [Validaciones](#validaciones)
8. [Próximas Mejoras](#próximas-mejoras)

---

## Descripción General

Sistema completo de tickets de soporte que permite a los usuarios crear y rastrear solicitudes de ayuda desde el dashboard. Incluye:

- Formulario intuitivo con categorización y priorización
- FAQs integradas para resolver dudas comunes
- Quick links a recursos de ayuda
- Tracking con números de ticket únicos
- Integración completa con el sistema de autenticación

**Ubicación**: `/support` (ruta protegida, requiere autenticación)

---

## Arquitectura

```
/support (página principal)
  ├── support-form.tsx (formulario de creación)
  └── FAQs (preguntas frecuentes)

/api/support/tickets (API endpoint)
  └── POST - Crear nuevo ticket

Database
  └── support_tickets (tabla PostgreSQL)
```

### Archivos Principales

1. **`/app/src/app/(dashboard)/support/page.tsx`**
   - Server Component
   - Layout de la página de soporte
   - Quick help cards (API docs, email, chat)
   - FAQs con detalles expandibles
   - Integra el formulario de tickets

2. **`/app/src/app/(dashboard)/support/support-form.tsx`**
   - Client Component ("use client")
   - Formulario interactivo con estado local
   - Validación frontend
   - Feedback de éxito/error
   - Contador de caracteres

3. **`/app/src/app/api/support/tickets/route.ts`**
   - API Route Handler
   - Validación de datos
   - Generación de ticket numbers
   - Persistencia en DB

4. **`/app/src/lib/db/schema.ts`**
   - Definición de tabla `support_tickets`
   - Relaciones con `tenants` y `users`
   - Índices para performance

5. **`/app/src/components/dashboard/sidebar.tsx`**
   - Navegación actualizada
   - Link "Soporte" con ícono Headphones

---

## Base de Datos

### Tabla: `support_tickets`

```typescript
export const supportTickets = pgTable('support_tickets', {
  // Identificadores
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),

  // Información del ticket
  ticketNumber: varchar('ticket_number', { length: 20 }).notNull().unique(),
  subject: varchar('subject', { length: 200 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  priority: varchar('priority', { length: 20 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('open'),
  message: text('message').notNull(),

  // Información del usuario (denormalizada)
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 255 }),

  // Resolución
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => users.id, { onDelete: 'set null' }),
  resolutionNotes: text('resolution_notes'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

### Índices

```typescript
index('support_tickets_tenant_idx').on(table.tenantId),
index('support_tickets_user_idx').on(table.userId),
index('support_tickets_status_idx').on(table.status),
index('support_tickets_created_idx').on(table.createdAt),
index('support_tickets_number_idx').on(table.ticketNumber),
```

### Relaciones

- **tenant**: Cada ticket pertenece a un tenant (cascade delete)
- **user**: Usuario que creó el ticket (set null on delete)
- **resolver**: Usuario que resolvió el ticket (set null on delete)

### Estados del Ticket

| Estado | Descripción |
|--------|-------------|
| `open` | Ticket recién creado, pendiente de revisión |
| `in_progress` | Ticket siendo trabajado por soporte |
| `resolved` | Ticket resuelto, esperando confirmación |
| `closed` | Ticket cerrado completamente |

---

## API Endpoints

### POST `/api/support/tickets`

Crea un nuevo ticket de soporte.

**Authentication**: Required (NextAuth session)

**Request Body**:
```json
{
  "subject": "string (1-200 chars)",
  "category": "technical|billing|feature|account|api|other",
  "priority": "low|normal|high",
  "message": "string (1-2000 chars)",
  "userEmail": "string (email)",
  "userName": "string (optional)",
  "tenantId": "uuid"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "ticket": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "ticketNumber": "TKT-L123ABC-XYZ",
    "subject": "Problema con integración",
    "category": "technical",
    "priority": "high",
    "status": "open",
    "createdAt": "2025-11-02T12:00:00Z"
  }
}
```

**Response Error (400)**:
```json
{
  "error": "Faltan campos requeridos"
}
```

**Response Error (401)**:
```json
{
  "error": "No autenticado"
}
```

**Response Error (500)**:
```json
{
  "error": "Error al crear el ticket. Por favor intenta de nuevo."
}
```

### Validaciones del Endpoint

```typescript
// Campos requeridos
if (!subject || !category || !priority || !message || !userEmail || !tenantId) {
  return 400;
}

// Longitud de subject
if (subject.length > 200) {
  return 400;
}

// Longitud de message
if (message.length > 2000) {
  return 400;
}

// Categoría válida
const validCategories = ["technical", "billing", "feature", "account", "api", "other"];
if (!validCategories.includes(category)) {
  return 400;
}

// Prioridad válida
const validPriorities = ["low", "normal", "high"];
if (!validPriorities.includes(priority)) {
  return 400;
}
```

### Generación de Ticket Number

Formato: `TKT-{timestamp36}-{random3}`

```typescript
const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
```

**Ejemplos**:
- `TKT-L123ABC-XYZ`
- `TKT-M456DEF-ABC`
- `TKT-N789GHI-QWE`

**Ventajas**:
- Único y fácil de comunicar
- Incluye timestamp para ordenamiento
- Fácil de buscar en logs

---

## Componentes Frontend

### Page Component (`page.tsx`)

**Type**: Server Component

**Características**:
- Requiere autenticación (redirect a `/login` si no autenticado)
- Layout con max-width 4xl
- Tres secciones principales:
  1. **Header**: Título y descripción
  2. **Quick Help Cards**: Grid con 3 cards
  3. **Support Form Section**: Formulario integrado
  4. **FAQs Section**: Accordion con preguntas frecuentes

**Quick Help Cards**:
```typescript
1. Documentación API (/docs) - BookOpen icon, bg-blue-100
2. Chat en Vivo (próximamente) - MessageCircle icon, bg-green-100
3. Email (support@chatform.mx) - Mail icon, bg-purple-100
```

**FAQs Incluidas**:
1. ¿Cómo configuro WhatsApp?
2. ¿Cuánto cuesta cada respuesta adicional?
3. ¿Puedo cancelar en cualquier momento?
4. ¿Los datos de mis encuestas son privados?
5. ¿Cómo uso el AI Survey Generator?

### Form Component (`support-form.tsx`)

**Type**: Client Component

**Props**:
```typescript
interface SupportFormProps {
  userEmail: string;
  userName: string;
  tenantId: string;
}
```

**Estado Local**:
```typescript
const [subject, setSubject] = useState("");
const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");
const [category, setCategory] = useState("technical");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState("");
const [ticketNumber, setTicketNumber] = useState("");
```

**Campos del Formulario**:

1. **Category Select**:
   - Problema Técnico
   - Facturación
   - Solicitud de Feature
   - Cuenta y Configuración
   - Integración API
   - Otro

2. **Priority Select**:
   - Baja - Pregunta general
   - Normal - Necesito ayuda
   - Alta - Problema urgente (muestra tiempo de respuesta: 2-4 horas)

3. **Subject Input**:
   - Type: text
   - MaxLength: 200
   - Placeholder: "Describe brevemente tu problema"
   - Contador de caracteres

4. **Message Textarea**:
   - Rows: 8
   - MaxLength: 2000
   - Placeholder con instrucciones
   - Contador de caracteres

**Features del Formulario**:
- Validación frontend (campos requeridos)
- Loading states (botón y campos disabled)
- Success feedback (verde, auto-hide en 5s)
- Error feedback (rojo, persistente)
- Tips section con mejores prácticas
- Indicador de tiempo de respuesta según prioridad

### Sidebar Integration

**Cambios en `sidebar.tsx`**:
```typescript
import { Headphones } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Encuestas", href: "/surveys", icon: FileText },
  { name: "Analíticas", href: "/analytics", icon: BarChart3 },
  { name: "Soporte", href: "/support", icon: Headphones }, // ← NUEVO
  { name: "Configuración", href: "/settings", icon: Settings },
];
```

**Estilo del Link**:
- Active: `bg-slate-900 text-white shadow-sm`
- Inactive: `text-slate-700 hover:bg-slate-100`

---

## Flujo de Usuario

### 1. Acceso a Soporte

```
Usuario autenticado → Dashboard → Click en "Soporte" (sidebar)
                                    ↓
                              Página /support
```

### 2. Exploración Inicial

```
Página /support
  ├── Quick Help Cards (explora recursos)
  │   ├── API Docs (clic → abre en nueva pestaña)
  │   ├── Email (clic → abre cliente de correo)
  │   └── Chat (próximamente)
  │
  └── FAQs (revisa preguntas comunes)
      └── Click para expandir/colapsar
```

### 3. Creación de Ticket

```
1. Selecciona Categoría → (ej: "Problema Técnico")
2. Selecciona Prioridad → (ej: "Alta - Problema urgente")
   └── Muestra: "urgente: 2-4 horas"
3. Escribe Asunto → Max 200 chars, contador en tiempo real
4. Escribe Mensaje → Max 2000 chars, contador en tiempo real
5. Lee Tips → Mejores prácticas para respuesta rápida
6. Click "Enviar Ticket"
   ↓
7. Validación frontend
   ├── Campos vacíos → Error: "Por favor completa todos los campos"
   └── Todo OK → Loading state (botón: "Enviando...")
   ↓
8. POST /api/support/tickets
   ├── 401 → Redirect /login
   ├── 400 → Muestra error específico
   ├── 500 → Error genérico
   └── 200 → Success!
       ↓
9. Success State
   ├── Mensaje verde: "✓ Ticket creado exitosamente"
   ├── Muestra: "Número de ticket: TKT-ABC123"
   ├── Form reset (campos vacíos)
   └── Auto-hide en 5 segundos
```

### 4. Post-Creación

```
Usuario recibe:
  ├── Confirmación visual en pantalla
  ├── Número de ticket único (TKT-XXX)
  └── Confirmación de email de respuesta

Equipo de soporte recibe:
  └── [TODO] Email notification con detalles del ticket
```

---

## Validaciones

### Frontend (React State)

```typescript
// Validación de campos requeridos
if (!subject || !message) {
  setError("Por favor completa todos los campos");
  return;
}

// Límites aplicados con maxLength en inputs
// subject: maxLength={200}
// message: maxLength={2000}
```

### Backend (API Route)

```typescript
// 1. Autenticación
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: "No autenticado" }, { status: 401 });
}

// 2. Campos requeridos
if (!subject || !category || !priority || !message || !userEmail || !tenantId) {
  return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
}

// 3. Longitud de subject
if (subject.length > 200) {
  return NextResponse.json({ error: "El asunto no puede exceder 200 caracteres" }, { status: 400 });
}

// 4. Longitud de message
if (message.length > 2000) {
  return NextResponse.json({ error: "El mensaje no puede exceder 2000 caracteres" }, { status: 400 });
}

// 5. Categoría válida
const validCategories = ["technical", "billing", "feature", "account", "api", "other"];
if (!validCategories.includes(category)) {
  return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
}

// 6. Prioridad válida
const validPriorities = ["low", "normal", "high"];
if (!validPriorities.includes(priority)) {
  return NextResponse.json({ error: "Prioridad inválida" }, { status: 400 });
}
```

### Database Constraints

```sql
-- Unique ticket number
ticket_number VARCHAR(20) NOT NULL UNIQUE

-- Not null constraints
subject VARCHAR(200) NOT NULL
category VARCHAR(50) NOT NULL
priority VARCHAR(20) NOT NULL
message TEXT NOT NULL
user_email VARCHAR(255) NOT NULL

-- Foreign keys with cascade
tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE
user_id UUID REFERENCES users(id) ON DELETE SET NULL
```

---

## Próximas Mejoras

### Prioridad Alta

- [ ] **Email Notifications**: Enviar email al equipo de soporte al crear ticket
- [ ] **Panel Admin**: Interfaz para que el equipo gestione tickets
- [ ] **Respuestas**: Sistema de comentarios/respuestas en tickets
- [ ] **Updates de Status**: Notificar al usuario cuando cambia el status

### Prioridad Media

- [ ] **Adjuntar Archivos**: Permitir screenshots en tickets
- [ ] **Búsqueda de Tickets**: Usuario puede ver sus tickets previos
- [ ] **Templates**: Plantillas de respuesta para casos comunes
- [ ] **Métricas**: Dashboard de performance del equipo de soporte

### Prioridad Baja

- [ ] **Chat en Vivo**: Implementar chat en tiempo real
- [ ] **Knowledge Base**: Base de conocimientos searchable
- [ ] **Chatbot IA**: Respuestas automáticas con GPT
- [ ] **Ratings**: Permitir al usuario calificar la respuesta

---

## Testing

### Manual Testing Checklist

#### Formulario
- [ ] Submit con campos vacíos muestra error
- [ ] Contador de caracteres funciona correctamente
- [ ] Disabled state durante loading
- [ ] Success message se muestra y auto-hide funciona
- [ ] Error message persiste hasta nuevo intento
- [ ] Form reset después de success

#### API
- [ ] POST sin auth retorna 401
- [ ] POST con datos inválidos retorna 400
- [ ] POST exitoso retorna ticket con número único
- [ ] Ticket se persiste en DB correctamente
- [ ] Relaciones FK funcionan (tenant, user)

#### Navegación
- [ ] Link "Soporte" aparece en sidebar
- [ ] Active state en /support
- [ ] Redirect a /login si no autenticado

#### Base de Datos
- [ ] Ticket number es único
- [ ] Cascade delete funciona (eliminar tenant elimina tickets)
- [ ] Set null funciona (eliminar user deja ticket)
- [ ] Índices mejoran performance de queries

---

## Troubleshooting

### Error: "No autenticado"

**Causa**: Session no válida o expirada
**Solución**: Logout y login de nuevo

### Error: "Faltan campos requeridos"

**Causa**: Frontend envió datos incompletos
**Solución**: Verificar que subject y message no estén vacíos

### Error: "Error al crear el ticket"

**Causa**: Error de base de datos o servidor
**Solución**:
1. Verificar conexión a DB
2. Revisar logs del servidor
3. Verificar que tabla `support_tickets` existe

### Ticket number no es único

**Causa**: Colisión extremadamente improbable
**Solución**: El constraint UNIQUE en DB lanzará error, implementar retry logic

---

## Referencias

- **Schema**: `/app/src/lib/db/schema.ts` líneas 338-385
- **API Route**: `/app/src/app/api/support/tickets/route.ts`
- **Page**: `/app/src/app/(dashboard)/support/page.tsx`
- **Form**: `/app/src/app/(dashboard)/support/support-form.tsx`
- **Migration**: `/app/src/lib/db/migrations/0004_uneven_bruce_banner.sql`

---

**Last Updated**: 2025-11-02
**Version**: 1.1.0
**Author**: ChatForm Team
