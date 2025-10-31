# ChatForm

> Crea encuestas con IA y envíalas por WhatsApp - 10x más respuestas que email

**La IA crea tu encuesta en segundos.** Describe lo que quieres preguntar y nuestra IA genera el formulario completo. Envía por WhatsApp, obtén análisis automático y toma decisiones basadas en datos reales.

## Estructura del Proyecto

Este repositorio contiene dos proyectos Next.js separados:

```
chatform/
├── website/          # Landing page (Next.js 15)
│   ├── components/   # Componentes de la landing
│   ├── app/          # App Router de Next.js
│   └── README.md     # Documentación del website
│
├── app/              # Aplicación ChatForm (Next.js 16)
│   ├── src/          # Código fuente
│   │   ├── app/      # App Router (auth, dashboard, surveys)
│   │   ├── components/ # Componentes React
│   │   └── lib/      # Auth, DB, utils
│   ├── drizzle.config.ts # Configuración de Drizzle ORM
│   └── README.md     # Documentación de la app
│
└── docs/             # Documentación general
    ├── DEPLOYMENT.md     # Guía de deployment
    ├── DOKPLOY-SETUP.md  # Guía de Dokploy
    └── claude.md         # Documentación técnica
```

## Stack Tecnológico

### Website (Landing Page)
- **Framework:** Next.js 15
- **Styling:** Tailwind CSS v4
- **Deployment:** Dokploy → https://chatform.mx

### App (Aplicación)
- **Framework:** Next.js 16 + React 19
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL (Supabase)
- **ORM:** Drizzle ORM
- **Auth:** NextAuth v5 (JWT strategy)
- **Deployment:** Dokploy → https://app.chatform.mx (pendiente)

## Desarrollo Local

### Website
```bash
cd website
npm install
npm run dev
# → http://localhost:3000
```

### App
```bash
cd app
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales

# Migrar base de datos
npm run db:push

# Iniciar servidor
npm run dev
# → http://localhost:3002
```

## Deployment

Ver [DEPLOYMENT.md](DEPLOYMENT.md) y [DOKPLOY-SETUP.md](DOKPLOY-SETUP.md) para instrucciones completas.

### Resumen:

**Website:**
- Build path: `website`
- Puerto: 3000
- Dominio: chatform.mx
- Env vars: `NEXT_PUBLIC_APP_URL`

**App:**
- Build path: `app`
- Puerto: 3000
- Dominio: app.chatform.mx
- Env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`

## Documentación

### 📚 Guías Principales

- **[DEPLOYMENT_WORKFLOW.md](DEPLOYMENT_WORKFLOW.md)** - ⭐ Workflow completo de deployment (NUEVO)
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - ⚡ Referencia rápida (NUEVO)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía básica de deployment
- **[DOKPLOY-SETUP.md](DOKPLOY-SETUP.md)** - Setup en Dokploy paso a paso
- **[claude.md](claude.md)** - Documentación técnica completa

## Estado Actual

✅ **Completado:**
- Landing page deployada en chatform.mx
- App base con autenticación multi-tenant
- Survey builder completo (create, edit, list, results)
- API REST para CRUD de surveys
- Database schema en Supabase con stats
- Dockerfile optimizado con Node 20
- Compatibilidad con Next.js 16 + React 19
- Zod v4 y TypeScript errors resueltos
- Documentación completa de deployment
- Configuración de Dokploy lista

🚀 **Deployment Status:**
- ✅ Website: Deployado en chatform.mx
- ✅ App: Configurado y listo para deploy en app.chatform.mx
- ✅ Git: Todo el código en GitHub

📝 **Próximos Pasos:**
- WhatsApp Business API integration
- Stripe payments
- Analytics dashboard
- Team management
- Auditoría de endpoints API cuando el sistema esté 100% funcional (alinear implementación y documentación)

## Licencia

MIT
