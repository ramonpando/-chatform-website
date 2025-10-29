# ChatForm — Developer Blueprint (Technical & Product Overview)

## 1. Vision
**ChatForm** (chatform.mx) es una plataforma SaaS que permite crear, enviar y analizar encuestas conversacionales por WhatsApp. Los usuarios pueden definir preguntas, lanzar flujos tipo Typeform, recibir respuestas en tiempo real y obtener insights automáticos mediante IA.

> **Tagline:** “El Typeform de WhatsApp.”

---

## 2. Objetivo del MVP
Construir una versión funcional y escalable de ChatForm que permita:
- Crear encuestas (form builder JSON o UI simple).
- Enviar encuestas por WhatsApp usando Twilio o Meta Cloud API.
- Recibir y procesar respuestas (textuales o seleccionadas).
- Analizar respuestas con IA (temas, sentimiento, resumen, NPS/CSAT).
- Visualizar resultados en un dashboard básico.
- Activar acciones automáticas (reseñas o win-back).

---

## 3. Research UX de form builders (Typeform, Tally, Landbot, Formbricks)

### 3.1 Hallazgos clave
- **Typeform**: flujo conversacional paso a paso, teclado-friendly, lógica condicional visual (“Logic Jump”), bloques reutilizables y despliegue omnicanal. Destaca por personalización contextual (recall de respuestas previas) y feedback microinteracciones (progreso, sonidos).  
- **Tally**: builder ultraligero con atajos tipo `Notion`, bloques embebidos, hidden fields y lógicas simples escritas en lenguaje natural. Ofrece previsualización instantánea y colaboración simultánea.  
- **Landbot**: enfoque de árbol visual con nodos arrastrables, ideal para conversaciones ramificadas. Facilita integraciones con APIs externas mediante bloques configurables.  
- **Formbricks/Formsort**: código abierto y enterprise con fuerte foco en data governance, versionado y analytics embebidos. Permite AB testing de encuestas y extensibilidad por plugins.

### 3.2 Principios UX a replicar en ChatForm
- **Construcción sin fricción**: atajos de teclado, acciones contextuales y edición inline para minimizar clics.  
- **Claridad de flujo**: vista dual builder + preview, con simulación de la conversación en tiempo real dentro de un mock de WhatsApp.  
- **Lógica condicional comprensible**: expresiones visuales “SI [respuesta] ENTONCES [acción]” con validaciones guiadas.  
- **Biblioteca de bloques**: plantillas rápidas para NPS, CSAT, preguntas abiertas, listas, consentimientos.  
- **Colaboración y control de versiones**: historial de cambios, draft vs published, comentarios inline (fase posterior del roadmap).  
- **Accesibilidad**: navegación completo con teclado, contraste alto, reader-friendly.

### 3.3 Pains a evitar
- Formularios largos sin segmentación → fomentar secciones y lógica.  
- Falta de preview móvil → imprescindible para alinear con experiencia WhatsApp.  
- Exportaciones limitadas → desde MVP debe existir CSV y webhook.  
- Lógica opaca → representar dependencias para depuración rápida.

### 3.4 Investigación pendiente
- Test de usabilidad con 3–5 usuarios objetivo para validar modelo mental de builder.  
- Benchmark de componentes open source (ej. `react-flow`, `@formbricks/ui`, `dnd-kit`) evaluando licencias y mantenibilidad.  
- Evaluar necesidad de colaboración en tiempo real (WebRTC/WebSockets) frente a edición seriada.

## 4. WhatsApp Business Platform: capacidades y restricciones

### 4.1 Qué sí se puede hacer
- **Mensajes salientes**: iniciar conversaciones con **message templates** aprobados (categorías utility, marketing, authentication).  
- **Conversaciones 24h**: respuestas ilimitadas mientras el usuario interactúe (session messages) sin plantilla.  
- **Mensajes interactivos**: soporta `quick reply buttons`, `list messages`, `call-to-action buttons`, `flow messages` (beta) y `location`.  
- **Rich media**: texto, imagen, audio, video, documentos (hasta 100 MB) y stickers.  
- **Automatización**: webhooks para eventos entrantes, integración con CRMs, bots basados en intents.  
- **Enlaces externos**: compartir URLs, deep links a formularios o portales (con control de Meta).  
- **Multi-numero / Multi-tenant**: posible gestionando WABA (WhatsApp Business Account) con varios números y firmas.

### 4.2 Qué no se puede o está restringido
- **Sin opt-in explícito**: prohibido iniciar conversaciones con usuarios que no dieron consentimiento claro.  
- **Promociones invasivas**: plantillas marketing deben cumplir políticas; contenido sensible o financiero requiere aprobación específica.  
- **Templates dinámicos excesivos**: placeholders limitados; no se permite crear mensajes completamente libres con datos sensibles.  
- **Sin broadcasting masivo tipo listas difusas**: cada mensaje incurre en costo por conversación; no hay “broadcast” ilimitado sin pagar.  
- **24h window**: si pasan 24h desde la última interacción del usuario, se debe reabrir con plantilla aprobada.  
- **Restricción de contenido**: no enviar datos de tarjetas, claves, información médica sensible sin cumplir normativas.  
- **Limitaciones de UI**: no se puede modificar la interfaz WhatsApp; se debe trabajar dentro de los mensajes estándar (no hay formularios embebidos nativos).  
- **Pagos y compras**: disponibles solo en mercados habilitados; requeriría onboarding adicional con Meta.  
- **Automatizaciones intrusivas**: Meta puede bloquear bots que generen mala experiencia (high block/report rate).  
- **Acceso a metadatos**: no se reciben métricas de lectura por usuario final salvo estados básicos (sent/delivered/read).  
- **Multi-dispositivo**: no hay acceso a chats grupales ni a contactos que no estén en la base de datos con opt-in.

### 4.3 Implicaciones para ChatForm
- Necesario gestionar **template management** (creación, traducciones, estado) y monitorear costos por tipo de conversación.  
- Al diseñar flujos, considerar que cada respuesta del usuario puede llegar vía texto libre → el parser debe tolerar desviaciones.  
- Para métricas NPS/CSAT, usar botones numéricos o palabras clave para minimizar errores de parsing.  
- Debemos almacenar evidencias del opt-in (timestamp, fuente) para auditorías.  
- El builder debe diferenciar pasos que requieren plantilla (primer mensaje) vs pasos en sesión.  
- Las automatizaciones (win-back) deben reabrir sesión mediante plantilla y respetar categorías aprobadas.  
- Legal/compliance: avisos de privacidad y posibilidad de opt-out (`STOP`, `BAJA`) gestionados automáticamente.

## 5. Arquitectura propuesta (modelo C4)

### 5.1 Contexto
- **Form Creator (Admin)**: diseña encuestas y revisa insights.  
- **WhatsApp Respondent**: recibe preguntas y responde en chat.  
- **ChatForm Platform**: portal web + APIs + workers.  
- **Servicios externos**: WhatsApp Cloud API (Meta), proveedor IA (OpenAI/Anthropic), almacenamiento de archivos (S3), integraciones (Slack, Google Sheets).

### 5.2 Contenedores
| Contenedor | Tecnología sugerida | Responsabilidad |
|------------|--------------------|-----------------|
| Frontend Web | Next.js 14, TypeScript, Tailwind, React Query | Builder, dashboard, autenticación, consumo de APIs. |
| Backend API | NestJS / Fastify + TypeScript | GraphQL/REST, auth, gestión de formularios, lógica de negocio. |
| Orchestrator Worker | Node.js workers con BullMQ + Redis | Procesar envíos, gestionar estados de conversación, retries. |
| AI Pipeline | Worker dedicado (Node.js/Python) | Procesar respuestas (NLU, sentimiento, clustering). |
| Data Layer | PostgreSQL (Supabase/Neon) + Prisma | Persistencia relacional multi-tenant. |
| File/Media Storage | AWS S3 / Supabase Storage | Plantillas, assets, adjuntos. |
| Observabilidad | OpenTelemetry + Sentry + Grafana/Prometheus | Trazas, logs, alertas. |
| Integrations Hub | Serverless functions / queue consumers | Slack, Sheets, Webhooks salientes. |

### 5.3 Componentes clave
- **Form Builder Service**: CRUD de formularios, versiones, librería de bloques, validación de esquema JSON, preview renderer.  
- **Conversation Engine**: interpreta el JSON y genera estados conversacionales; administra sesiones, aplica lógica condicional, guarda progreso.  
- **Messaging Adapter**: encapsula WhatsApp Cloud API, manejo de templates, reintentos, métricas de entrega.  
- **Contact & Consent Service**: almacena opt-ins, listas, etiquetas y gestión de bajas.  
- **Analytics & Insights Service**: consolida respuestas, llama al pipeline IA, agrega resultados para dashboards.  
- **Automation Rules Engine**: define triggers (ej. score < 7) y acciones (Slack alert, nueva campaña).  
- **Admin API & Access Control**: roles (Owner, Editor, Viewer) y límites por plan.

### 5.4 Consideraciones transversales
- **Multi-tenancy** con scoping por `account_id` en cada tabla y aislamiento de plantillas.  
- **Idempotencia** en webhooks para evitar duplicados.  
- **Seguridad**: JWT + refresh tokens, hashing de webhooks, cifrado de PII sensible (contacto).  
- **Versionado**: cada publicación de formulario genera `form_version_id`; las sesiones se atan a una versión.  
- **Testing**: suite e2e con Playwright (builder) y pruebas simuladas de webhook (msw + vitest).  
- **Feature flags** via `LaunchDarkly`/`Unleash` para activar beta de IA o integraciones.

## 6. Roadmap detallado y backlog por sprint (MVP 8 semanas)

### 6.1 Resumen por sprint
| Sprint | Tema central | Entregables clave | Métricas de aceptación |
|--------|--------------|-------------------|------------------------|
| 1 | Fundaciones | Repo, CI/CD, modelo de datos, auth básica, proveedores configurados | Deploy auto, migraciones corriendo, login email/password. |
| 2 | Builder v1 | UI drag & drop, tipos de pregunta base, persistencia JSON, preview | Crear formulario simple <10 min, preview funcional. |
| 3 | Orquestación WhatsApp | Webhooks, motor de estado, envío plantilla inicial, conversación lineal | Conversación end-to-end con 3 contactos demo. |
| 4 | Dashboard respuestas | Listado respuestas, filtros básicos, export CSV | Ver respuesta en <5 s post recepción. |
| 5 | IA insights | Pipeline sentimiento/NPS/temas, UI insights | Insight disponible <5 min, precisión >80% en validación interna. |
| 6 | Automatizaciones | Reglas win-back, Slack, Sheets, manejo opt-out | Regla se dispara <2 min tras evento. |
| 7 | Hardening Beta | QA, performance, observabilidad, documentación interna | 0 blockers críticos, error rate <1%. |
| 8 | Launch Prep | Docs cliente, pricing, T&C, checklist soporte | Go-live checklist firmado, métricas monitoreo listas. |

### 6.2 Historias clave por sprint
- **Sprint 1**  
  - Como desarrollador quiero pipeline CI (lint/test/deploy) para confiar en releases.  
  - Como admin necesito registrarme e iniciar sesión seguro con Magic Link/OTP opcional.  
  - Como sistema necesito almacenar contactos, formularios y respuestas con integridad referencial.
- **Sprint 2**  
  - Como creator quiero añadir preguntas tipo texto, opción múltiple, NPS, CSAT, fecha.  
  - Como creator quiero arrastrar el orden y duplicar bloques rápidamente.  
  - Como creator necesito previsualizar el flujo en modo WhatsApp antes de publicar.  
- **Sprint 3**  
  - Como creator deseo enviar plantilla inicial a lista de contactos y rastrear estado.  
  - Como respondent quiero responder vía WhatsApp y recibir confirmación de recepción.  
  - Como sistema debo manejar lógica condicional básica (branching simple).  
- **Sprint 4**  
  - Como admin quiero ver tabla de respuestas con filtro por formulario, fecha, etiqueta.  
  - Como admin necesito exportar CSV y recibir webhook con nueva respuesta.  
  - Como admin deseo ver tasa de completitud y drop-off por pregunta.  
- **Sprint 5**  
  - Como admin quiero panel de insights (sentimiento, topics, NPS promedio).  
  - Como sistema debo procesar respuestas en background y guardar resultados IA versionados.  
  - Como admin deseo editar prompts de análisis (avanzado).  
- **Sprint 6**  
  - Como admin quiero definir regla “si NPS <= 6, enviar follow-up” y configurar canal (Slack/WhatsApp).  
  - Como cliente final debo poder escribir “BAJA/STOP” y quedar excluido de futuros envíos.  
  - Como admin quiero push a Google Sheets de nuevas respuestas.  
- **Sprint 7**  
  - Como equipo deseo monitorear tiempos de entrega y errores con panel observabilidad.  
  - Como QA necesito pruebas de carga (1k respuestas/h) y documentación test.  
  - Como soporte quiero guías de troubleshooting de plantillas.  
- **Sprint 8**  
  - Como marketing quiero landing y pricing conectados con toggles de plan.  
  - Como legal necesito políticas de privacidad, términos, registro de opt-in.  
  - Como soporte quiero playbook de onboarding y training videos.

### 6.3 Dependencias y riesgos
- **Dependencia Meta**: aprobación de plantillas y verificación WABA puede tardar 1–2 semanas → iniciar en Sprint 1.  
- **IA costos**: definir proveedor y budget antes del Sprint 5; considerar fallback heurístico.  
- **Experiencia builder**: si la librería elegida limita features, preparar plan B (ej. migrar de `react-flow` a `xyflow`).  
- **Datos sensibles**: revisar compliance (LOPD, GDPR) y preparar DPA con proveedores.

### 6.4 Definición de hecho (DoD)
- Código revisado y con cobertura mínima 70% en módulos críticos.  
- QA manual completado por al menos 2 roles.  
- Docs actualizadas (README, manual de feature).  
- Métricas y alertas configuradas para cada nueva feature.  
- Sin bugs críticos abiertos en el sprint.

## 7. Investigación adicional prioritaria
- **Regulatorio**: requisitos de privacidad por país (México, Colombia, Chile) y almacenamiento de PII fuera del país.  
- **Pricing y costos**: modelar costo por conversación WhatsApp vs margen esperado por plan.  
- **SLAs**: definir tiempos de respuesta soporte, acuerdos con proveedores IA.  
- **Estrategia de datos**: evaluar warehouse futuro (BigQuery/Snowflake) y políticas de retención.  
- **Experimentos**: plan de AB testing para cadencia de mensajes, copy de plantillas y prompts IA.

## 8. Próximos pasos inmediatos
1. Prototipar wireframes del builder (Figma) incorporando hallazgos UX.  
2. Detallar diagramas C4 visuales (contexto, contenedores, componentes) y validarlos con el equipo técnico.  
3. Priorizar backlog con effort estimado (story points) y alinear dependencias con equipo de producto/ops.  
4. Iniciar proceso de alta en WhatsApp Business Platform (Meta) y preparar documentación de opt-in.
