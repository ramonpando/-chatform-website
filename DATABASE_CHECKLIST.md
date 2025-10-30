# ChatForm - Database Checklist
**Fecha:** 30 Oct 2025
**Database:** Supabase PostgreSQL

---

## ⚠️ **VERIFICAR AHORA MISMO**

Antes de probar, necesitas verificar que el schema esté correcto en Supabase.

---

## 📋 **Checklist de Verificación**

### **1. Conectar a Supabase**

```bash
# Opción A: psql (si lo tienes instalado)
psql postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

# Opción B: Supabase Dashboard
# https://app.supabase.com → Tu proyecto → SQL Editor
```

---

### **2. Verificar Tablas Existen**

```sql
-- Ver todas las tablas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Debe mostrar:
-- questions
-- responses
-- short_links
-- survey_sessions  ← CRÍTICO
-- surveys
-- tenant_users
-- tenants
-- users
```

**✅ SI EXISTEN:** Continúa al paso 3

**❌ SI NO EXISTEN:** Corre migrations:
```bash
cd /root/chatform/app
npm run db:push
```

---

### **3. Verificar Estructura de `survey_sessions`**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'survey_sessions'
ORDER BY ordinal_position;
```

**Debe tener ESTOS campos:**
```
id                      | uuid              | NO
survey_id               | uuid              | NO
tenant_id               | uuid              | NO
phone_number            | character varying | NO
whatsapp_name           | character varying | YES
status                  | character varying | NO
current_question_index  | integer           | NO
delivery_method         | character varying | NO
started_at              | timestamp         | NO
completed_at            | timestamp         | YES
last_interaction_at     | timestamp         | NO
```

**❌ SI FALTAN CAMPOS:** Corre migrations:
```bash
npm run db:push
```

---

### **4. Verificar Estructura de `responses`**

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'responses'
ORDER BY ordinal_position;
```

**Debe tener:**
```
id               | uuid              | NO
session_id       | uuid              | NO
question_id      | uuid              | NO
answer_text      | text              | YES
answer_option    | character varying | YES
answer_rating    | integer           | YES
created_at       | timestamp         | NO
```

---

### **5. Verificar Indexes**

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('survey_sessions', 'responses')
ORDER BY tablename, indexname;
```

**Debe tener al menos:**
```
survey_sessions | sessions_survey_idx   | (survey_id)
survey_sessions | sessions_phone_idx    | (phone_number)
survey_sessions | sessions_status_idx   | (status)
responses       | responses_session_idx | (session_id)
responses       | responses_question_idx| (question_id)
```

**❌ SI FALTAN:** Se crean automáticamente con `db:push`

---

### **6. Verificar Foreign Keys**

```sql
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('survey_sessions', 'responses')
ORDER BY tc.table_name;
```

**Debe mostrar:**
```
survey_sessions → surveys (survey_id)
survey_sessions → tenants (tenant_id)
responses → survey_sessions (session_id)
responses → questions (question_id)
```

---

### **7. Test Queries**

```sql
-- Ver encuestas activas
SELECT id, title, short_code, status, response_count
FROM surveys
WHERE status = 'active';

-- Ver sessions recientes
SELECT id, phone_number, status, current_question_index, created_at
FROM survey_sessions
ORDER BY created_at DESC
LIMIT 5;

-- Ver respuestas recientes
SELECT r.id, q.question_text, r.answer_text, r.answer_rating, r.created_at
FROM responses r
JOIN questions q ON r.question_id = q.id
ORDER BY r.created_at DESC
LIMIT 10;
```

---

## 🔧 **Cómo Correr Migrations**

### **Si las tablas NO existen o faltan campos:**

**1. Verificar DATABASE_URL:**
```bash
cd /root/chatform/app
cat .env.local | grep DATABASE_URL

# Debe ser:
# DATABASE_URL=postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres
```

**2. Verificar schema file:**
```bash
cat src/lib/db/schema.ts | grep "survey_sessions" -A 20
```

Debe tener el schema completo (ya lo verificamos).

**3. Push schema a Supabase:**
```bash
npm run db:push
```

Debes ver:
```
✓ Pulling schema from remote database
✓ Applying schema changes
✓ Done
```

**4. Verificar de nuevo:**
```bash
# Conectar y verificar
psql [DATABASE_URL]

\dt  -- Ver tablas
\d survey_sessions  -- Ver estructura
```

---

## 🐛 **Problemas Comunes**

### **Error: "relation does not exist"**

**Causa:** Tablas no existen en Supabase

**Solución:**
```bash
cd /root/chatform/app
npm run db:push
```

---

### **Error: "column does not exist"**

**Causa:** Schema local más nuevo que Supabase

**Solución:**
```bash
npm run db:push
```

---

### **Error: "cannot connect to database"**

**Causa:** DATABASE_URL incorrecta

**Solución:**
```bash
# Verificar URL
cat .env.local | grep DATABASE_URL

# Debe tener el password encoded: Ktp%2412924744
# No debe tener espacios ni saltos de línea
```

---

### **Migrations se quedan colgadas**

**Causa:** Conexión lenta o timeout

**Solución:**
```bash
# Ctrl+C para cancelar
# Reintentar:
npm run db:push
```

---

## 📊 **Data Seed (Opcional)**

Si quieres crear data de prueba:

```sql
-- 1. Crear un tenant de prueba
INSERT INTO tenants (id, name, slug, plan, send_credits_limit)
VALUES (
  gen_random_uuid(),
  'Test Restaurant',
  'test-restaurant',
  'starter',
  100
) RETURNING *;

-- 2. Crear una encuesta de prueba
INSERT INTO surveys (
  id,
  tenant_id,
  title,
  description,
  welcome_message,
  thank_you_message,
  status,
  short_code
) VALUES (
  gen_random_uuid(),
  '[TENANT_ID_DEL_PASO_1]',
  'Encuesta de Satisfacción',
  'Queremos saber tu opinión',
  '¡Hola! Gracias por tu visita. Nos gustaría conocer tu opinión.',
  '¡Gracias por tu tiempo! Tu opinión nos ayuda a mejorar.',
  'active',
  'test123'
) RETURNING *;

-- 3. Agregar preguntas
INSERT INTO questions (survey_id, question_text, question_type, order_index, required)
VALUES
  ('[SURVEY_ID]', '¿Qué tan probable es que nos recomiendes?', 'rating', 0, true),
  ('[SURVEY_ID]', '¿Qué te gustó más?', 'multiple_choice', 1, true),
  ('[SURVEY_ID]', '¿Algo que podamos mejorar?', 'open_text', 2, false);

-- Para multiple choice, también necesitas:
UPDATE questions
SET options = '["La comida", "El servicio", "El ambiente", "Los precios"]'
WHERE question_type = 'multiple_choice';
```

---

## ✅ **Verificación Final**

Después de correr migrations, ejecuta TODOS estos queries:

```sql
-- 1. Contar tablas (debe ser 8)
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema = 'public';

-- 2. Ver estructura de survey_sessions
\d survey_sessions

-- 3. Ver estructura de responses
\d responses

-- 4. Test query de join
SELECT
  s.title,
  ss.phone_number,
  ss.status,
  COUNT(r.id) as response_count
FROM surveys s
LEFT JOIN survey_sessions ss ON s.id = ss.survey_id
LEFT JOIN responses r ON ss.id = r.session_id
GROUP BY s.id, ss.id;
```

**Si TODO funciona:** ✅ Database lista!

**Si algo falla:** Copia el error y debug

---

## 🚀 **Después de Verificar**

Una vez que el database esté correcto:

1. ✅ Start dev server: `npm run dev`
2. ✅ Start ngrok: `ngrok http 3000`
3. ✅ Configurar webhook en Twilio
4. ✅ Probar flujo completo

---

**SIGUIENTE PASO:** Verificar database ahora
**HERRAMIENTA:** Supabase Dashboard SQL Editor o psql
**TIEMPO:** 5 minutos
