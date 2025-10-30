# ChatForm

> El Typeform de WhatsApp - Crea encuestas conversacionales que obtienen 3x más respuestas

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

- **[claude.md](claude.md)** - Documentación técnica completa
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía de deployment
- **[DOKPLOY-SETUP.md](DOKPLOY-SETUP.md)** - Setup en Dokploy paso a paso

## Estado Actual

✅ **Completado:**
- Landing page deployada en chatform.mx
- App base con autenticación
- Survey builder completo (create, edit, list, results)
- Multi-tenancy configurado
- Database schema en Supabase

🚧 **En Progreso:**
- Deployment de app a app.chatform.mx

📝 **Próximos Pasos:**
- WhatsApp Business API integration
- Stripe payments
- Analytics dashboard
- Team management

## Licencia

MIT
