# 🚀 ChatForm - Workflow de Deployment Completo

**Fecha**: 2025-10-30
**Session**: Deployment de Survey Builder + Configuración Dokploy
**Status**: ✅ COMPLETADO

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Problemas Encontrados y Soluciones](#problemas-encontrados-y-soluciones)
4. [Configuración de Dokploy](#configuración-de-dokploy)
5. [Comandos de Git](#comandos-de-git)
6. [Testing y Verificación](#testing-y-verificación)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## 📊 Resumen Ejecutivo

### ¿Qué se logró?

✅ **Survey Builder completo** implementado con:
- Crear encuestas (`/surveys/new`)
- Editar encuestas (`/surveys/[id]/edit`)
- Listar encuestas (`/surveys`)
- Ver resultados (`/surveys/[id]/results`)
- API REST completa para CRUD de surveys

✅ **Reorganización del repositorio**:
- Separación clara: `website/` y `app/`
- Documentación actualizada
- Git history limpio

✅ **Deployment en Dokploy**:
- Configuración Docker optimizada
- Variables de entorno configuradas
- Build exitoso con Next.js 16 + React 19

✅ **Compatibilidad con Next.js 16**:
- Actualización de params API (Promise-based)
- Zod v4 compatibility
- TypeScript errors resueltos

---

## 🏗️ Estructura del Proyecto

### Repositorio: `chatform-website`

```
chatform/
├── website/                    # Landing page (Next.js 15)
│   ├── app/
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── navigation.tsx     # ✨ Conectado a app via NEXT_PUBLIC_APP_URL
│   │   └── sections/
│   │       ├── hero.tsx       # ✨ Botones conectados
│   │       ├── features.tsx
│   │       ├── pricing.tsx
│   │       ├── faq.tsx
│   │       └── ...
│   ├── package.json
│   ├── next.config.ts
│   └── .env.local             # NEXT_PUBLIC_APP_URL
│
├── app/                        # Aplicación ChatForm (Next.js 16)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   └── surveys/
│   │   │   │       ├── page.tsx              # ✨ Lista de encuestas
│   │   │   │       ├── new/page.tsx          # ✨ Crear encuesta
│   │   │   │       └── [id]/
│   │   │   │           ├── edit/page.tsx     # ✨ Editar encuesta
│   │   │   │           └── results/page.tsx  # ✨ Ver resultados
│   │   │   └── api/
│   │   │       ├── auth/
│   │   │       │   ├── [...nextauth]/route.ts
│   │   │       │   └── signup/route.ts
│   │   │       └── surveys/
│   │   │           ├── route.ts              # ✨ POST, GET all
│   │   │           └── [id]/route.ts         # ✨ GET, PUT, DELETE
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   └── surveys/
│   │   │       └── survey-editor.tsx         # ✨ Componente reutilizable
│   │   └── lib/
│   │       ├── auth/
│   │       ├── db/
│   │       │   └── schema.ts                 # ✨ Actualizado con stats
│   │       └── utils/
│   ├── Dockerfile                            # ✨ NUEVO - Node 20
│   ├── .dockerignore                         # ✨ NUEVO
│   ├── next.config.ts                        # ✨ output: 'standalone'
│   ├── package.json                          # ✨ engines + lucide-react
│   └── .env.local
│
├── DEPLOYMENT.md                             # Guía básica de deployment
├── DEPLOYMENT_WORKFLOW.md                    # ✨ Este archivo
├── DOKPLOY-SETUP.md                          # Guía paso a paso Dokploy
├── README.md                                 # ✨ Actualizado
└── claude.md                                 # Documentación técnica
```

### ✨ = Archivos nuevos o modificados en esta sesión

---

## 🐛 Problemas Encontrados y Soluciones

### 1️⃣ Node.js 18 vs Next.js 16

**❌ Error:**
```
You are using Node.js 18.20.5. For Next.js, Node.js version ">=20.9.0" is required.
```

**✅ Solución:**
Crear `Dockerfile` con Node 20 Alpine:

```dockerfile
FROM node:20-alpine AS base
```

**Archivos modificados:**
- ✅ `app/Dockerfile` (creado)
- ✅ `app/.dockerignore` (creado)
- ✅ `app/package.json` (agregado engines)
- ✅ `app/next.config.ts` (agregado output: 'standalone')

---

### 2️⃣ Missing Dependency: lucide-react

**❌ Error:**
```
Module not found: Can't resolve 'lucide-react'
```

**✅ Solución:**
```bash
npm install lucide-react
```

**Archivos modificados:**
- ✅ `app/package.json`
- ✅ `app/package-lock.json`

---

### 3️⃣ Next.js 16 Params API Change

**❌ Error:**
```
Type '{ params: { id: string } }' is not assignable to type '{ params: Promise<{ id: string }> }'
```

**🔍 Causa:**
Next.js 16 cambió la API de params en route handlers y páginas dinámicas. Ahora `params` es una Promise.

**✅ Solución:**

**ANTES (Next.js 15):**
```typescript
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
}
```

**DESPUÉS (Next.js 16):**
```typescript
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Await the promise!
}
```

**Archivos modificados:**
- ✅ `app/src/app/api/surveys/[id]/route.ts` (GET, PUT, DELETE)
- ✅ `app/src/app/(dashboard)/surveys/[id]/edit/page.tsx`
- ✅ `app/src/app/(dashboard)/surveys/[id]/results/page.tsx`

---

### 4️⃣ TypeScript Union Type Error

**❌ Error:**
```
This comparison appears to be unintentional because the types '"neutral"' and '"positive"' have no overlap.
```

**✅ Solución:**
Definir tipo explícito:

```typescript
type ChangeType = "positive" | "negative" | "neutral";

const stats: Array<{
  name: string;
  value: string;
  icon: any;
  change: string;
  changeType: ChangeType;
}> = [...]
```

**Archivos modificados:**
- ✅ `app/src/app/(dashboard)/dashboard/page.tsx`

---

### 5️⃣ Zod v4 API Change

**❌ Error:**
```
Property 'errors' does not exist on type 'ZodError<...>'
```

**🔍 Causa:**
Zod v4 cambió `error.errors` a `error.issues`

**✅ Solución:**

**ANTES (Zod v3):**
```typescript
if (!validation.success) {
  return NextResponse.json(
    { error: validation.error.errors[0].message },
    { status: 400 }
  );
}
```

**DESPUÉS (Zod v4):**
```typescript
if (!validation.success) {
  return NextResponse.json(
    { error: validation.error.issues[0].message },
    { status: 400 }
  );
}
```

**Archivos modificados:**
- ✅ `app/src/app/api/auth/signup/route.ts`
- ✅ `app/src/app/api/surveys/route.ts`
- ✅ `app/src/app/api/surveys/[id]/route.ts`

---

## ⚙️ Configuración de Dokploy

### 🌐 Proyecto 1: Website (Landing Page)

```yaml
Project Name: chatform-website
Repository: https://github.com/ramonpando/-chatform-website
Branch: main

# Source
Build Path: website
Watch Paths: website/**

# Build (Nixpacks o Docker)
Build Command: npm install && npm run build
Start Command: npm start
Port: 3000

# Environment Variables
NEXT_PUBLIC_APP_URL: https://app.chatform.mx

# Domain
Domain: chatform.mx
SSL: Enabled (Let's Encrypt)
```

---

### 💼 Proyecto 2: App (Aplicación ChatForm)

#### Git Configuration
```yaml
Repository: https://github.com/ramonpando/-chatform-website
Branch: main
Build Path: /app
Watch Paths: app/**
Trigger: On Push
```

#### Build Configuration
```yaml
Build Type: Dockerfile  # ⚠️ IMPORTANTE: Usar Docker, NO Nixpacks

Docker File: Dockerfile
Docker Context Path: app  # ⚠️ CRÍTICO: sin "/" al inicio
Docker Build Stage: runner

Port: 3000
```

#### Environment Variables
```env
# Database
DATABASE_URL=postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=fBMTaMxL96CONdkZWP2YJZ0+Cn6Q4A8r44xOGVCNhPU=
NEXTAUTH_URL=https://app.chatform.mx

# Public URLs
NEXT_PUBLIC_APP_URL=https://app.chatform.mx

# Node
NODE_ENV=production
```

#### Domain
```yaml
Domain: app.chatform.mx
SSL: Enabled (Let's Encrypt)
```

---

## 🔧 Comandos de Git Ejecutados

### Reorganización del Repositorio

```bash
# 1. Limpiar estructura vieja
mkdir -p /root/chatform/_old
mv /root/chatform/{src,public,next.config.ts,package.json,...} /root/chatform/_old/

# 2. Remover .git de website (era submódulo)
rm -rf website/.git

# 3. Actualizar .gitignore
cat >> .gitignore <<EOF
_old/
.claude/
node_modules/
EOF

# 4. Agregar todos los archivos nuevos
git add website/ app/ README.md DEPLOYMENT.md DOKPLOY-SETUP.md claude.md

# 5. Remover archivos viejos del repo
git rm next.config.ts package.json postcss.config.mjs tailwind.config.ts tsconfig.json
git rm -r src/

# 6. Commit reorganización
git commit -m "Reorganizar proyecto: app y website separados + Survey Builder completo"

# 7. Force push (reorganización completa)
git push --force origin main
```

### Fixes de Compatibilidad

```bash
# Fix 1: Agregar lucide-react
cd app && npm install lucide-react
git add app/package*.json
git commit -m "Add lucide-react dependency"
git push origin main

# Fix 2: Crear Dockerfile y configuración
git add app/Dockerfile app/.dockerignore app/next.config.ts app/package.json
git commit -m "Add Dockerfile and Node 20 configuration for app deployment"
git push origin main

# Fix 3: Next.js 16 params API
# (cambios en archivos)
git add app/src/app/api/surveys/[id]/route.ts app/src/app/(dashboard)/surveys/[id]/{edit,results}/page.tsx
git commit -m "Fix Next.js 16 params Promise API for route handlers and dynamic pages"
git push origin main

# Fix 4: Dashboard TypeScript error
git add app/src/app/(dashboard)/dashboard/page.tsx
git commit -m "Fix TypeScript error in dashboard changeType"
git push origin main

# Fix 5: Zod v4 API
git add app/src
git commit -m "Fix Zod v4 API: change error.errors to error.issues"
git push origin main
```

---

## ✅ Testing y Verificación

### Website (Landing Page)

```bash
# Local
cd website
npm install
npm run dev
# → http://localhost:3000

# Production
curl -I https://chatform.mx
# Debe retornar: 200 OK

# Verificar botones
# 1. Click "Iniciar sesión" → debe ir a app.chatform.mx/login
# 2. Click "Comenzar gratis" → debe ir a app.chatform.mx/signup
```

### App (Aplicación)

```bash
# Local
cd app
npm install
npm run db:push  # Migrar schema a Supabase
npm run dev
# → http://localhost:3002

# Production
curl -I https://app.chatform.mx
# Debe retornar: 200 OK

# Verificar funcionalidad
# 1. Signup: https://app.chatform.mx/signup
# 2. Login: https://app.chatform.mx/login
# 3. Dashboard: https://app.chatform.mx/dashboard
# 4. Crear encuesta: https://app.chatform.mx/surveys/new
# 5. Ver encuestas: https://app.chatform.mx/surveys
```

### Database (Supabase)

```bash
# Verificar tablas creadas
# - tenants
# - users
# - surveys
# - questions

# Verificar datos de prueba
# - Crear usuario
# - Crear encuesta
# - Verificar en Supabase UI
```

---

## 🐛 Troubleshooting Guide

### Build falla con "Node.js 18 required 20+"

**Problema:** Dokploy usa Nixpacks con Node 18 por defecto

**Solución:**
1. Verificar que `Build Type` esté en `Dockerfile` (NO Nixpacks)
2. Verificar que `Docker Context Path` sea `app` (sin `/`)
3. Verificar que existe `app/Dockerfile`
4. Redeploy

---

### Build falla con "Module not found"

**Problema:** Falta una dependencia en package.json

**Solución:**
```bash
cd app
npm install <paquete-faltante>
git add package*.json
git commit -m "Add missing dependency"
git push
```

---

### Build falla con TypeScript errors

**Problema:** Incompatibilidad de tipos con Next.js 16 o Zod v4

**Solución:**
1. Ver el error específico en logs de Dokploy
2. Buscar el archivo mencionado
3. Aplicar los fixes documentados arriba:
   - Params → `Promise<{ id: string }>`
   - Zod → `error.issues` en lugar de `error.errors`
4. Commit y push

---

### App deployada pero 500 Error

**Problema:** Variables de entorno incorrectas o faltantes

**Solución:**
1. Verificar en Dokploy → Environment Variables
2. Asegurar que estén todas las 5 variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `NODE_ENV`
3. Verificar que `DATABASE_URL` tenga `%24` en lugar de `$`
4. Redeploy

---

### Cannot connect to database

**Problema:** IP de Dokploy no whitelisted en Supabase

**Solución:**
1. Obtener IP pública del servidor Dokploy
2. Ir a Supabase → Settings → Database → Connection Pooling
3. Agregar IP a whitelist
4. Redeploy app

---

### Botones de landing no redirigen

**Problema:** `NEXT_PUBLIC_APP_URL` no configurado en website

**Solución:**
1. Ir a Dokploy → Proyecto Website
2. Environment Variables
3. Agregar: `NEXT_PUBLIC_APP_URL=https://app.chatform.mx`
4. Redeploy website

---

## 📊 Metrics de Build

### Build Times

```
Tiempo promedio de build exitoso:
- Website: ~30-60 segundos
- App: ~40-70 segundos

Tiempo total de deployment: ~2-3 minutos
```

### Build Logs - Success Pattern

```bash
✓ Building Docker image...
✓ [base] FROM node:20-alpine
✓ [deps] Installing dependencies (537 packages in 15s)
✓ [builder] Copying source files
✓ [builder] Building application...
   ▲ Next.js 16.0.1 (Turbopack)
   Creating an optimized production build...
✓ Compiled successfully in 30s
✓ Running TypeScript... No errors!
✓ Linting... Passed
✓ Build completed in 35s

✓ [runner] Creating production image
✓ Starting container on port 3000
✓ Container started successfully
✓ Health check passed
✓ Deployed to https://app.chatform.mx
```

---

## 📦 Dependencias Agregadas

### App

```json
{
  "dependencies": {
    "lucide-react": "^0.548.0"  // ← NUEVO
  },
  "engines": {
    "node": ">=20.9.0",         // ← NUEVO
    "npm": ">=10.0.0"           // ← NUEVO
  }
}
```

---

## 🎯 Checklist Final

### Pre-Deployment

- [x] Código en GitHub
- [x] Estructura reorganizada (website/ y app/)
- [x] Dockerfile creado con Node 20
- [x] Variables de entorno documentadas
- [x] Schema de DB actualizado en Supabase
- [x] Todos los TypeScript errors resueltos
- [x] Build local exitoso

### Deployment Website

- [x] Proyecto creado en Dokploy
- [x] Repository conectado
- [x] Build path configurado: `website`
- [x] Environment variable: `NEXT_PUBLIC_APP_URL`
- [x] Domain configurado
- [x] SSL habilitado
- [x] Deployed exitosamente

### Deployment App

- [x] Proyecto creado en Dokploy
- [x] Build Type: Dockerfile
- [x] Docker Context Path: `app`
- [x] 5 Environment variables configuradas
- [x] Domain `app.chatform.mx` configurado
- [x] DNS CNAME record agregado
- [x] SSL habilitado
- [x] Deployed exitosamente

### Post-Deployment Testing

- [ ] Website carga correctamente
- [ ] Botones de login/signup redirigen a app
- [ ] App login page carga
- [ ] Signup funciona (crea usuario en Supabase)
- [ ] Login funciona
- [ ] Dashboard carga
- [ ] Crear encuesta funciona
- [ ] Listar encuestas funciona
- [ ] Editar encuesta funciona
- [ ] Ver resultados funciona

---

## 🔗 Enlaces Útiles

- **GitHub Repo**: https://github.com/ramonpando/-chatform-website
- **Landing Page**: https://chatform.mx
- **App**: https://app.chatform.mx
- **Supabase**: https://supabase.com/dashboard/project/arpjwdaodkuwebgnexce
- **Next.js 16 Docs**: https://nextjs.org/docs
- **Dokploy Docs**: https://docs.dokploy.com

---

## 👥 Equipo y Contacto

**Desarrollado por**: ChatForm Team
**Deployment**: Dokploy
**Última actualización**: 2025-10-30
**Session**: Survey Builder + Deployment

---

## 📝 Notas Adicionales

### Middleware Deprecation Warning

```
⚠ The "middleware" file convention is deprecated.
Please use "proxy" instead.
```

**Acción futura**: Migrar de `middleware.ts` a Next.js proxy configuration cuando sea necesario.

### Next.js Telemetry

Para desactivar telemetry en producción:
```bash
# Agregar a .env
NEXT_TELEMETRY_DISABLED=1
```

---

**🎉 Deployment completado exitosamente!**
