# APIs Faltantes - Resumen Ejecutivo

**Fecha:** 2 Noviembre 2025

## RESUMEN

Las páginas de Settings **YA EXISTEN** y tienen formularios funcionales, pero cuando el usuario hace click en "Guardar", las APIs no existen y da error 404.

---

## 3 APIs QUE FALTAN

### 1. ❌ User Profile API
**Archivo:** `app/src/app/api/user/profile/route.ts` (NO EXISTE)

**Llamado desde:**
- `app/src/app/(dashboard)/settings/profile/profile-form.tsx` (línea con fetch)

**Métodos necesarios:**
- `PATCH /api/user/profile` - Actualizar nombre/email/password

**Tiempo:** 2 horas

---

### 2. ❌ Tenant/Workspace API
**Archivo:** `app/src/app/api/tenant/route.ts` (NO EXISTE)

**Llamado desde:**
- `app/src/app/(dashboard)/settings/workspace/workspace-form.tsx` (línea con fetch)

**Métodos necesarios:**
- `PATCH /api/tenant` - Actualizar nombre/slug del workspace

**Tiempo:** 1.5 horas

---

### 3. ❌ API Key Management
**Archivo:** `app/src/app/api/tenant/api-key/route.ts` (NO EXISTE)

**Llamado desde:**
- `app/src/app/(dashboard)/settings/api/api-key-manager.tsx` (líneas 32 y 55)

**Métodos necesarios:**
- `POST /api/tenant/api-key` - Generar nueva API key
- `DELETE /api/tenant/api-key` - Revocar API key

**Tiempo:** 2 horas

---

## TOTAL: 3 archivos, 5.5 horas

## LO BUENO ✅

1. **UI ya existe** - Las páginas de settings están completas
2. **Formularios funcionan** - Los forms capturan los datos correctamente
3. **Componentes client listos** - Ya tienen loading states, error handling
4. **Solo falta backend** - Crear 3 archivos de API routes

## SIGUIENTE PASO

¿Quieres que implemente estas 3 APIs ahora? Tardaría ~5-6 horas y tendrías:

- ✅ Usuarios pueden actualizar su perfil
- ✅ Usuarios pueden cambiar workspace name/slug
- ✅ Usuarios pueden generar/revocar API keys
- ✅ Settings completamente funcionales

**No requiere Stripe** - Esto es independiente de billing.

---

## OPCIONAL: Billing APIs (si quieres monetizar)

Si también quieres implementar billing/pagos, serían **4 APIs adicionales** (6-8 horas más):

1. `POST /api/billing/create-checkout` - Crear sesión Stripe
2. `POST /api/billing/webhook` - Recibir eventos de Stripe
3. `POST /api/billing/cancel-subscription` - Cancelar suscripción
4. `GET /api/billing/portal` - Customer portal de Stripe

Pero esto **requiere tener cuenta Stripe** configurada primero.

---

## MI RECOMENDACIÓN

**Paso 1 (ahora):** Implementar las 3 Settings APIs (5-6h)
- No requiere nada externo
- Hace que settings funcione 100%
- Los usuarios pueden gestionar su cuenta

**Paso 2 (después):** Billing con Stripe (6-8h)
- Solo si quieres monetizar ya
- Requiere cuenta Stripe configurada
- Puedes hacer esto semanas/meses después

¿Empiezo con las Settings APIs?
