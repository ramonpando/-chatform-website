# ChatForm

**Encuestas conversacionales por WhatsApp con IA**

ChatForm es una plataforma SaaS completa que permite crear, distribuir y analizar encuestas a través de WhatsApp de forma conversacional. Incluye generación automática con IA, análisis inteligente de respuestas, y una API REST para integraciones.

---

## 🚀 Quick Start

```bash
cd chatform/app
npm install

# Setup environment
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Database
npm run db:push

# Run
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## ✨ Features

- ✅ **WhatsApp Conversacional** - Encuestas nativas en WhatsApp vía Twilio
- ✅ **AI Generator** - Genera encuestas completas con GPT-4o-mini
- ✅ **AI Analysis** - Análisis de sentimientos e insights automáticos
- ✅ **20+ Templates** - NPS, satisfacción, feedback prediseñados
- ✅ **Analytics Dashboard** - Métricas en tiempo real
- ✅ **Stripe Billing** - Free, Starter ($39), Pro ($99), Business ($249)
- ✅ **REST API** - Documentación completa en `/docs`
- ✅ **Multi-tenant** - RBAC con roles

---

## 🛠️ Tech Stack

**Frontend**: Next.js 16, TypeScript, Tailwind CSS  
**Backend**: Node.js, PostgreSQL (Supabase), Drizzle ORM  
**Auth**: NextAuth 5.0  
**Payments**: Stripe  
**WhatsApp**: Twilio  
**AI**: OpenAI GPT-4o-mini  

---

## 🔌 API

Base URL: `https://chatform.mx/api/v1`

```bash
# Get responses
curl https://chatform.mx/api/v1/surveys/abc123/responses \
  -H "Authorization: Bearer tu_api_key"

# Trigger survey
curl -X POST https://chatform.mx/api/v1/surveys/abc123/trigger \
  -H "Authorization: Bearer tu_api_key" \
  -d '{"phoneNumber": "+521234567890"}'
```

Docs completas: [/docs](https://chatform.mx/docs)

---

## 📊 Plans

| Plan | Precio | Surveys | WhatsApp/mes | AI |
|------|--------|---------|--------------|-----|
| Free | $0 | 1 | 0 | ❌ |
| Starter | $39 | 5 | 200 | ❌ |
| Pro | $99 | 20 | 1000 | ✅ |
| Business | $249 | ∞ | 3000 | ✅ |

---

## 🚀 Deployment

**Vercel** (Recomendado):
1. Push a GitHub
2. Conectar en Vercel
3. Configurar env vars
4. Deploy automático

**Webhooks Post-Deploy**:
- Stripe: `https://tu-dominio.com/api/billing/webhook`
- Twilio: `https://tu-dominio.com/api/webhooks/whatsapp`

---

## 📚 Documentation

- **API**: `/docs` en la app
- **Schema**: `/app/src/lib/db/schema.ts`
- **Audit**: `/WEBSITE_AUDIT_REPORT.md`

---

## 📝 Changelog

### v1.0.0 (2025-11-02) 🚀

**Production Ready**:
- Landing page profesional
- API docs completa
- Settings handlers (password, delete account)
- Middleware fix (landing pública)
- Todos los bugs críticos resueltos

---

## 📄 License

MIT

---

**Made with ❤️ using Claude Code**
