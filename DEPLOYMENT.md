# 🚀 ChatForm - Guía de Deployment

## Estructura de Dominios

### Producción:
- **Landing Page**: https://chatform.bravix.com.mx (o chatform.mx)
- **App**: https://app.chatform.mx (PENDIENTE DE CONFIGURAR)

---

## 📦 Deployment en Dokploy

### 1. Landing Page (Website) - ✅ YA DEPLOYADO

**Dominio actual**: chatform.bravix.com.mx

**Variables de entorno necesarias**:
```env
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
```

**Pasos para actualizar**:
1. Ir a Dokploy → Proyecto Website
2. Settings → Environment Variables
3. Agregar: `NEXT_PUBLIC_APP_URL=https://app.chatform.mx`
4. Redeploy

---

### 2. App (Aplicación) - ⏳ PENDIENTE

**Dominio sugerido**: app.chatform.mx

#### Variables de entorno necesarias:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=fBMTaMxL96CONdkZWP2YJZ0+Cn6Q4A8r44xOGVCNhPU=
NEXTAUTH_URL=https://app.chatform.mx

# Public URLs
NEXT_PUBLIC_APP_URL=https://app.chatform.mx
```

#### Pasos para deployar:

1. **Crear nuevo proyecto en Dokploy**:
   - Name: `chatform-app`
   - Repository: (tu repo de git)
   - Branch: `main`
   - Build Command: `cd app && npm install && npm run build`
   - Start Command: `cd app && npm start`
   - Port: `3000`

2. **Configurar dominio**:
   - Ir a Domains
   - Agregar: `app.chatform.mx`
   - SSL: Auto (Let's Encrypt)

3. **Agregar variables de entorno**:
   - Copiar todas las variables de arriba
   - ⚠️ IMPORTANTE: Cambiar `NEXTAUTH_URL` a la URL de producción

4. **Deploy**:
   - Click en "Deploy"
   - Esperar a que compile
   - Verificar logs

---

## 🔧 Configuración DNS

### Para que funcione `app.chatform.mx`:

Agregar registro CNAME o A en tu proveedor de DNS:

**Opción A - CNAME** (Recomendado si Dokploy da una URL):
```
Type: CNAME
Name: app
Value: [URL_DE_DOKPLOY]
TTL: 3600
```

**Opción B - A Record** (Si Dokploy da una IP):
```
Type: A
Name: app
Value: [IP_DE_DOKPLOY]
TTL: 3600
```

---

## ✅ Checklist de Deployment

### Website (Landing):
- [x] Código en repositorio
- [x] Deployado en Dokploy
- [x] Dominio configurado (chatform.bravix.com.mx)
- [ ] Variable `NEXT_PUBLIC_APP_URL` configurada
- [ ] Redeploy después de agregar variable

### App:
- [ ] Código en repositorio (mismo o separado)
- [ ] Proyecto creado en Dokploy
- [ ] Variables de entorno configuradas
- [ ] Dominio `app.chatform.mx` configurado
- [ ] DNS configurado
- [ ] SSL habilitado
- [ ] Deployado y funcionando
- [ ] Probado login/signup
- [ ] Verificar conexión a Supabase

---

## 🔐 Seguridad en Producción

### Variables que NUNCA deben commitearse:
- ✅ `DATABASE_URL` - En .env.local (git-ignored)
- ✅ `NEXTAUTH_SECRET` - En .env.local (git-ignored)
- ✅ Todas las credenciales en `CREDENCIALES.md` (git-ignored)

### En Dokploy:
- ✅ Todas las variables se configuran en el panel
- ✅ No se incluyen en el código
- ✅ Cada ambiente (dev/prod) tiene sus propias variables

---

## 🧪 Testing Post-Deployment

### Website:
1. Visitar https://chatform.bravix.com.mx
2. Click en "Iniciar sesión" → Debe redirigir a app.chatform.mx/login
3. Click en "Comenzar gratis" → Debe redirigir a app.chatform.mx/signup

### App:
1. Visitar https://app.chatform.mx/login
2. Crear cuenta de prueba
3. Verificar que se crea en Supabase
4. Login con cuenta
5. Ver dashboard
6. Crear encuesta de prueba
7. Verificar que se guarda en DB

---

## 🐛 Troubleshooting

### Error: "NEXTAUTH_URL is not set"
- Verificar variable `NEXTAUTH_URL` en Dokploy
- Debe ser la URL pública (https://app.chatform.mx)

### Error: "Can't connect to database"
- Verificar `DATABASE_URL`
- Confirmar que IP de Dokploy está whitelisted en Supabase

### Botones de landing no redirigen correctamente:
- Verificar `NEXT_PUBLIC_APP_URL` en website
- Redeploy website después de cambiar

### 404 en rutas de la app:
- Verificar que el build command incluye `cd app`
- Verificar logs de Dokploy

---

## 📞 Próximos Pasos

1. **Decidir dominio del app**: `app.chatform.mx` u otro
2. **Configurar DNS** para el subdominio
3. **Crear proyecto en Dokploy** para el app
4. **Configurar variables de entorno** en Dokploy
5. **Deploy y probar**

---

**Última actualización**: 2025-10-30
