# ChatForm - Changelog

## [Unreleased] - 2025-11-01

### Added - UX/UI Improvements & Analytics Fix

#### 🎨 Mejoras de Experiencia de Usuario

**AI Generator Modal:**
- ✅ Diálogo de confirmación antes de generar con IA mostrando créditos restantes
- ✅ Información de uso visible al abrir el modal (no después de generar)
- ✅ Preview completo de la encuesta generada antes de aceptarla
- ✅ Botón "Descartar" para rechazar y regenerar si no gusta el resultado
- ✅ Estados visuales claros: Cargando → Confirmación → Generando → Preview → Aceptar/Rechazar

**Form Builder:**
- ✅ Badge "Nueva Encuesta" en modo creación (antes decía "PUBLICADA" incorrectamente)
- ✅ Indicador visual mejorado para preguntas seleccionadas (barra azul lateral + colores más oscuros)
- ✅ Confirmación antes de eliminar preguntas para evitar eliminaciones accidentales
- ✅ Indicador de autoguardado en tiempo real ("Guardando..." / "Guardado" con checkmark)
- ✅ Botón "Generar con IA" en sidebar ahora funcional y conectado al modal

#### 📊 Sistema de Analytics Preciso

**Problema resuelto:** Analytics mostraba 11 vistas cuando solo 2 personas habían abierto el link

**Solución implementada:**
- ✅ Nueva tabla `survey_views` con tracking detallado de vistas únicas
- ✅ Deduplicación por IP + User Agent (fingerprint SHA-256)
- ✅ Ventana de cooldown de 24 horas por usuario único
- ✅ Filtrado automático de bots y crawlers:
  - WhatsApp link previews
  - Facebook/Twitter/LinkedIn crawlers
  - Google/Bing bots
  - Scrapers (curl, wget, python-requests)
- ✅ Soporte para IPv4 e IPv6
- ✅ Detección correcta de IP detrás de proxies (Vercel, Cloudflare)
- ✅ Storage de metadata: referrer, user agent, timestamp

**Antes vs Ahora:**
- ❌ Antes: Cada page load = +1 vista (recargas, bots, previews incluidos)
- ✅ Ahora: Solo usuarios únicos humanos, máximo 1 vista cada 24h

### Technical Implementation

**Nuevos Archivos:**
- `/src/lib/utils/tracking.ts` - Utilidades de detección de bots y fingerprinting
- `/src/lib/db/migrations/0003_calm_molecule_man.sql` - Migración de tabla survey_views
- `/scripts/update-plan-to-pro.ts` - Script para actualizar planes de usuario

**Archivos Modificados:**
- `/src/lib/db/schema.ts` - Nueva tabla `surveyViews` con relaciones
- `/src/app/s/[shortCode]/page.tsx` - Sistema de tracking con deduplicación
- `/src/components/surveys/ai-generator-modal.tsx` - 3 estados de modal (confirmación, generación, preview)
- `/src/components/surveys/form-builder-v2.tsx` - Mejoras UX y visuales

**Database Schema:**
```sql
CREATE TABLE survey_views (
  id UUID PRIMARY KEY,
  survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
  ip_address VARCHAR(45),          -- IPv4 or IPv6
  user_agent TEXT,
  fingerprint VARCHAR(64),         -- SHA-256 hash
  referrer TEXT,
  is_bot BOOLEAN DEFAULT false,
  viewed_at TIMESTAMP DEFAULT NOW()
);

-- Índices optimizados para queries rápidas
CREATE INDEX survey_views_survey_idx ON survey_views(survey_id);
CREATE INDEX survey_views_survey_ip_idx ON survey_views(survey_id, ip_address);
CREATE INDEX survey_views_fingerprint_idx ON survey_views(fingerprint);
CREATE INDEX survey_views_viewed_at_idx ON survey_views(viewed_at);
```

### Migration Applied
```bash
npm run db:generate  # Genera migración 0003
npm run db:push      # Aplica a producción
```

---

## Next Steps - AI Response Analyzer

### Planned Features
- [ ] Endpoint `/api/ai/analyze-responses` para análisis de respuestas abiertas
- [ ] Detección automática de sentimientos (positivo, neutral, negativo)
- [ ] Extracción de temas y keywords principales
- [ ] Resumen automático de tendencias
- [ ] Dashboard de insights con visualizaciones
- [ ] Límites por plan:
  - Free: No disponible
  - Starter: No disponible
  - Pro: Análisis ilimitado de respuestas

---

## Version History

### [0.3.0] - 2025-10-30
- Added WhatsApp Simulator with real-time preview
- Survey customization system (colors, logo)
- Public survey page with premium design

### [0.2.0] - 2025-10-29
- AI Survey Generator (GPT-4o-mini)
- Usage tracking and limits by plan
- Form builder V2 with drag & drop

### [0.1.0] - 2025-10-28
- Initial release
- Multi-tenant architecture
- Basic survey creation
- WhatsApp integration
