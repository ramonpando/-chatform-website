# ChatForm - Documentación del Proyecto

> El Typeform de WhatsApp - Crea encuestas conversacionales que obtienen 3x más respuestas

---

## 📋 Índice

1. [Estado Actual](#estado-actual)
2. [Arquitectura](#arquitectura)
3. [Credenciales](#credenciales)
4. [Desarrollo Local](#desarrollo-local)
5. [Roadmap](#roadmap)

---

## 🎯 Estado Actual

### ✅ Completado

#### Landing Page (`/website`)
- [x] Diseño completo con Tailwind CSS
- [x] Hero section con CTA
- [x] Sección de características
- [x] Pricing con modelo híbrido (Free, Starter $29, Pro $59, Enterprise $299)
- [x] Sección de casos de uso (6 industrias)
- [x] FAQ section
- [x] Logo final integrado
- [x] **Deployado en**: https://chatform.bravix.com.mx

#### App Base (`/app`)
- [x] Next.js 16 con App Router
- [x] Tailwind CSS v4
- [x] TypeScript configurado
- [x] Esquema de base de datos (8 tablas)
- [x] Supabase conectado y migrado
- [x] NextAuth v5 configurado (sin Drizzle Adapter, solo JWT)
- [x] Middleware de autenticación
- [x] API de Signup funcional
- [x] Login y Signup pages
- [x] Dashboard layout con sidebar
- [x] Dashboard home page
- [x] Multi-tenancy configurado

### 🚧 En Progreso

**Actualmente trabajando en**: Sistema de autenticación funcional end-to-end

**Bloqueado por**: Incompatibilidad de Drizzle Adapter con Edge Runtime de Next.js 16
- **Solución aplicada**: Removido Drizzle Adapter, usando JWT puro

### 📝 Próximo Paso

Verificar que el flujo de login funcione completamente con el nuevo sistema JWT-only.

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
Frontend: Next.js 16 + React 19 + Tailwind CSS v4
Backend: Next.js API Routes + tRPC
Database: PostgreSQL (Supabase)
ORM: Drizzle ORM
Auth: NextAuth v5 (JWT strategy)
Payments: Stripe (pendiente)
WhatsApp: WhatsApp Business API (pendiente)
```

### Estructura del Proyecto

```
chatform/
├── website/              # Landing page (Next.js)
│   ├── components/
│   │   └── sections/    # Hero, Features, Pricing, etc.
│   └── app/
│       └── page.tsx     # Homepage
│
├── app/                  # Aplicación principal (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, Signup
│   │   │   ├── (dashboard)/    # Dashboard pages
│   │   │   └── api/            # API routes
│   │   ├── components/
│   │   │   ├── dashboard/      # Sidebar, etc.
│   │   │   └── providers/      # Session provider
│   │   └── lib/
│   │       ├── auth/           # NextAuth config
│   │       └── db/             # Drizzle config & schema
│   └── .env.local        # Credenciales locales (git-ignored)
│
├── CREDENCIALES.md       # 🔐 Credenciales (git-ignored)
└── claude.md            # Este archivo
```

### Base de Datos (Supabase)

**8 Tablas principales**:

1. **tenants** - Organizaciones/clientes
   - Plan (free/starter/pro/enterprise)
   - Límites (responses, surveys, sendCredits)
   - Stripe customer ID

2. **users** - Usuarios del sistema
   - Email, name, passwordHash
   - OAuth fields (image, emailVerified)

3. **tenant_users** - Relación many-to-many
   - Role (owner/admin/member)

4. **surveys** - Encuestas creadas
   - Title, description, status
   - shortCode para links únicos

5. **questions** - Preguntas de cada survey
   - Type (multiple_choice, rating, open_text)
   - Options (JSON)
   - Order

6. **survey_sessions** - Conversaciones individuales
   - WhatsApp phone, name
   - Status (active/completed/abandoned)
   - Current question

7. **responses** - Respuestas individuales
   - Answer value (text/number/JSON)

8. **short_links** - URL shortener
   - shortCode → survey mapping
   - Click tracking

---

## 🔐 Credenciales

**⚠️ IMPORTANTE**: Todas las credenciales están en `CREDENCIALES.md` (git-ignored)

### Ubicación de credenciales:

1. **Desarrollo local**: `/root/chatform/CREDENCIALES.md`
2. **Producción**: Vercel Environment Variables (pendiente configurar)
3. **Backup seguro**: 1Password/LastPass (recomendado)

### Credenciales actuales:

- ✅ Supabase (PostgreSQL)
- ✅ NEXTAUTH_SECRET
- ⏳ Google OAuth (pendiente)
- ⏳ Stripe (pendiente)
- ⏳ WhatsApp Business API (pendiente)

**Ver detalles en**: `CREDENCIALES.md`

---

## 💻 Desarrollo Local

### Prerrequisitos

```bash
- Node.js 20+ (usando nvm)
- npm 10+
- PostgreSQL (via Supabase)
```

### Setup Inicial

```bash
# 1. Clonar repo
cd /root/chatform

# 2. Instalar dependencias
cd website && npm install
cd ../app && npm install

# 3. Configurar environment variables
cd app
cp .env.example .env.local
# Editar .env.local con credenciales de CREDENCIALES.md

# 4. Migrar base de datos
npm run db:push

# 5. Iniciar development servers

# Terminal 1 - Landing page
cd website
npm run dev
# → http://localhost:3000

# Terminal 2 - App
cd app
npm run dev
# → http://localhost:3002
```

### Scripts Disponibles

#### Website
```bash
npm run dev      # Dev server (port 3000)
npm run build    # Build para producción
npm run deploy   # Deploy a Vercel
```

#### App
```bash
npm run dev          # Dev server (port 3002)
npm run build        # Build para producción
npm run db:generate  # Generar migrations de Drizzle
npm run db:push      # Push schema a Supabase
npm run db:studio    # Abrir Drizzle Studio
```

### Drizzle Studio (Database UI)

```bash
cd app
npm run db:studio
# Abre en http://localhost:4000
```

---

## 🗺️ Roadmap

### MVP (Semana 1-2) - EN PROGRESO

#### Fase 1: Auth & Dashboard ✅
- [x] Setup proyecto Next.js
- [x] Configurar Supabase
- [x] Diseñar schema de DB
- [x] Implementar NextAuth
- [x] Crear login/signup pages
- [x] Dashboard layout
- [ ] **Probar login completo end-to-end** ← ESTAMOS AQUÍ

#### Fase 2: Survey Builder
- [ ] `/surveys` - Lista de encuestas
- [ ] `/surveys/new` - Crear encuesta
- [ ] Question builder UI
  - [ ] Multiple choice
  - [ ] Rating (1-10)
  - [ ] Open text
- [ ] Drag & drop para reordenar
- [ ] Preview mode

#### Fase 3: Link Generation
- [ ] Generar shortCode único
- [ ] Crear wa.me link
- [ ] QR code generation (usando `qrcode` lib)
- [ ] Copy to clipboard UI

#### Fase 4: WhatsApp Integration (Simulado)
- [ ] Mock webhook endpoint
- [ ] Conversational flow simulator
- [ ] Save responses a DB
- [ ] Test con números reales

### Post-MVP (Semana 3-4)

#### Analíticas & Responses
- [ ] Dashboard de responses
- [ ] Filtros y stats
- [ ] Individual response view
- [ ] Charts con Recharts
- [ ] CSV export

#### WhatsApp Real
- [ ] Aplicar a WhatsApp Business API
- [ ] Webhook real
- [ ] Message templates
- [ ] Rate limiting

#### Payments (Stripe)
- [ ] Product setup en Stripe
- [ ] Checkout flow
- [ ] Webhook para subscriptions
- [ ] Upgrade/downgrade plans
- [ ] Usage tracking & limits

### Futuro (Semana 5+)

- [ ] Webhooks salientes (integrations)
- [ ] Team management
- [ ] Custom branding removal
- [ ] A/B testing de encuestas
- [ ] NPS automation
- [ ] Integraciones (Zapier, Make)

---

## 🐛 Problemas Conocidos

### Solucionados ✅

1. **Drizzle Adapter en Edge Runtime** (2025-10-30)
   - **Problema**: Next.js 16 usa Edge Runtime por default, incompatible con Drizzle Adapter
   - **Solución**: Removido Drizzle Adapter, usando JWT strategy puro
   - **Impacto**: Sin cambios en funcionalidad, sessions solo en JWT (no DB)

2. **Password con caracteres especiales en DATABASE_URL**
   - **Problema**: Password `Ktp$12924744` tenía `$` que rompía parsing
   - **Solución**: URL-encode el `$` como `%24`

3. **Middleware deprecation warning**
   - **Problema**: Next.js 16 deprecó `middleware.ts`
   - **Solución**: Ignorar por ahora, funciona bien. Migrar a `proxy.ts` después

---

## 📚 Recursos

### Documentación
- [Next.js 16 Docs](https://nextjs.org/docs)
- [NextAuth v5 Docs](https://next-auth.js.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/cloud-api)

### Servicios
- [Supabase Dashboard](https://supabase.com/dashboard/project/arpjwdaodkuwebgnexce)
- [Vercel Dashboard](https://vercel.com)
- [Stripe Dashboard](https://dashboard.stripe.com) (pendiente)

---

## 👥 Contacto

**Equipo**: ChatForm Development
**Última actualización**: 2025-10-30

---

## 📝 Notas

### Decisiones de Arquitectura

1. **JWT-only auth (sin database sessions)**
   - Más simple
   - Mejor performance
   - Compatible con Edge Runtime

2. **Multi-tenancy desde día 1**
   - Cada signup crea tenant automático
   - Session incluye tenantId
   - Todas las queries filtran por tenant

3. **Pricing híbrido**
   - Free tier sin sends automáticos
   - Starter/Pro con sends incluidos
   - Enterprise BYOA (Bring Your Own Account)

4. **Branding strategy para crecimiento viral**
   - "Powered by ChatForm" en Free Y Starter
   - Solo removemos en Pro ($59)
   - Máxima exposición de marca

---

**¿Preguntas?** Consultar `CREDENCIALES.md` para accesos, o este archivo para arquitectura.
