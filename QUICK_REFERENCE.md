# ⚡ ChatForm - Quick Reference

> Referencia rápida para deployment y troubleshooting

---

## 🚀 Deployment Rápido

### Website
```bash
# Dokploy Configuration
Build Path: website
Env: NEXT_PUBLIC_APP_URL=https://app.chatform.mx
Domain: chatform.mx
```

### App
```bash
# Dokploy Configuration
Build Type: Dockerfile
Docker Context: app
Port: 3000
Domain: app.chatform.mx

# Environment Variables (5 requeridas)
DATABASE_URL=postgresql://postgres:Ktp%2412924744@db...
NEXTAUTH_SECRET=fBMTaMxL96CONdkZWP...
NEXTAUTH_URL=https://app.chatform.mx
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
NODE_ENV=production
```

---

## 🔥 Errores Comunes

### ❌ "Node.js 18, required 20+"
✅ **Fix**: Build Type debe ser `Dockerfile` (NO Nixpacks)

### ❌ "Module not found: lucide-react"
✅ **Fix**: `npm install lucide-react`

### ❌ "params is not a Promise"
✅ **Fix**:
```ts
// Cambiar
{ params }: { params: { id: string } }
// Por
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

### ❌ "error.errors does not exist"
✅ **Fix**: Cambiar `error.errors` → `error.issues` (Zod v4)

### ❌ "connect ENETUNREACH 2600:xxxx (IPv6)"
✅ **Fix**: Usar Transaction Pooler en lugar de Direct Connection
```env
# ANTES (Direct - IPv6)
postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres

# DESPUÉS (Pooler - IPv4)
postgresql://postgres.PROJECT:PASSWORD@aws-REGION.pooler.supabase.com:6543/postgres
```

### ❌ "UntrustedHost error"
✅ **Fix**: Agregar `trustHost: true` en NextAuth config

---

## 📂 Estructura de Archivos Clave

```
chatform/
├── website/              # Landing (Next.js 15)
│   └── components/
│       └── navigation.tsx    # Botones → app
│
├── app/                  # App (Next.js 16)
│   ├── Dockerfile        # ⚠️ IMPORTANTE
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   │   └── surveys/  # Survey Builder
│   │   │   └── api/
│   │   │       └── surveys/  # REST API
│   │   └── components/
│   │       └── surveys/
│   │           └── survey-editor.tsx
│   └── package.json      # engines: node >=20
│
└── DEPLOYMENT_WORKFLOW.md  # Documentación completa
```

---

## 🔧 Comandos Útiles

### Local Development
```bash
# Website
cd website && npm run dev

# App
cd app && npm run dev

# Database
cd app && npm run db:push
cd app && npm run db:studio
```

### Git
```bash
# Deploy changes
git add .
git commit -m "descripción"
git push origin main
# → Auto-deploy en Dokploy si Watch Paths configurado
```

### Testing
```bash
# Check if deployed
curl -I https://chatform.mx
curl -I https://app.chatform.mx

# Check API
curl https://app.chatform.mx/api/surveys
```

---

## 📞 Contacto y Recursos

- **Repo**: https://github.com/ramonpando/-chatform-website
- **Docs completos**: [DEPLOYMENT_WORKFLOW.md](./DEPLOYMENT_WORKFLOW.md)
- **Setup Dokploy**: [DOKPLOY-SETUP.md](./DOKPLOY-SETUP.md)
- **Deployment básico**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Última actualización**: 2025-10-30
