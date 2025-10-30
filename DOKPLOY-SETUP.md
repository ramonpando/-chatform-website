# 🚀 Guía Rápida: Deployar ChatForm App en Dokploy

## Paso 1: Configurar DNS (app.chatform.mx)

En tu proveedor de DNS (Cloudflare, GoDaddy, etc.):

**Agregar registro CNAME:**
```
Type: CNAME
Name: app
Target: chatform.bravix.com.mx (o la IP/dominio de tu servidor Dokploy)
TTL: Auto
```

**O si usas IP directa:**
```
Type: A
Name: app
Value: [IP_DE_DOKPLOY]
TTL: Auto
```

---

## Paso 2: Actualizar Website en Dokploy

### En el proyecto existente de Website:

1. Ir a **Settings → Environment Variables**
2. Agregar:
   ```
   NEXT_PUBLIC_APP_URL=https://app.chatform.mx
   ```
3. Click en **Redeploy**

---

## Paso 3: Crear Proyecto App en Dokploy

### 3.1 Nuevo Proyecto:
- Click en **"Create Project"**
- Name: `chatform-app`
- Type: **Application**

### 3.2 Git Configuration:
- Repository: Tu repositorio (mismo del website o separado)
- Branch: `main` o `master`
- Build Path: `app` (si está en la misma repo, especifica la carpeta)

### 3.3 Build Settings:
```bash
# Build Command:
cd app && npm install && npm run build

# Start Command:
cd app && npm start

# Port:
3000
```

### 3.4 Environment Variables:

Agregar TODAS estas variables en Dokploy:

```env
DATABASE_URL=postgresql://postgres:Ktp%2412924744@db.arpjwdaodkuwebgnexce.supabase.co:5432/postgres

NEXTAUTH_SECRET=fBMTaMxL96CONdkZWP2YJZ0+Cn6Q4A8r44xOGVCNhPU=

NEXTAUTH_URL=https://app.chatform.mx

NEXT_PUBLIC_APP_URL=https://app.chatform.mx
```

⚠️ **IMPORTANTE**: Copia estas exactamente como están (con el %24 en la password)

### 3.5 Domain Configuration:
1. Ir a **Domains**
2. Click **"Add Domain"**
3. Ingresar: `app.chatform.mx`
4. Habilitar **SSL/HTTPS** (Let's Encrypt)
5. Guardar

### 3.6 Deploy:
1. Click en **"Deploy"**
2. Monitorear logs
3. Esperar a que termine (puede tardar 2-5 minutos)

---

## Paso 4: Verificar Deployment

### 4.1 Verificar DNS:
```bash
# En tu terminal local:
dig app.chatform.mx
# o
ping app.chatform.mx
```

Debe resolver a la IP correcta.

### 4.2 Probar la App:

1. **Ir a**: https://app.chatform.mx/login
2. **Debe cargar** la página de login

3. **Crear cuenta de prueba**:
   - Email: prueba@chatform.mx
   - Password: Test1234
   - Name: Usuario Prueba

4. **Verificar que funciona**:
   - Login exitoso
   - Redirige al dashboard
   - Sidebar se muestra
   - Puede crear encuesta

### 4.3 Probar integración con Website:

1. Ir a: https://chatform.bravix.com.mx
2. Click en **"Iniciar sesión"**
3. Debe redirigir a https://app.chatform.mx/login
4. Login funciona

---

## 🐛 Troubleshooting

### Error: "NEXTAUTH_URL is not set"
**Solución**:
- Verificar que `NEXTAUTH_URL` esté en las variables de entorno de Dokploy
- Debe ser exactamente: `https://app.chatform.mx`
- Redeploy después de agregar

### Error: Can't connect to database
**Solución**:
- Verificar que `DATABASE_URL` esté correcta
- La password tiene `%24` (no `$`)
- En Supabase, agregar IP de Dokploy a whitelist si es necesario

### Error: 502 Bad Gateway
**Solución**:
- Verificar logs en Dokploy
- Confirmar que el puerto es 3000
- Verificar que el build se completó exitosamente

### Botones de website no redirigen
**Solución**:
- Verificar `NEXT_PUBLIC_APP_URL` en el proyecto website
- Redeploy website
- Hard refresh en el navegador (Ctrl+Shift+R)

### DNS no resuelve
**Solución**:
- Esperar 5-10 minutos (propagación DNS)
- Verificar registro en proveedor DNS
- Usar `dig` o `nslookup` para confirmar

---

## ✅ Checklist Final

- [ ] DNS configurado (app.chatform.mx)
- [ ] Proyecto app creado en Dokploy
- [ ] Variables de entorno configuradas
- [ ] Dominio agregado en Dokploy
- [ ] SSL habilitado
- [ ] Deploy exitoso (sin errores en logs)
- [ ] App accesible en https://app.chatform.mx
- [ ] Login funciona
- [ ] Signup funciona
- [ ] Dashboard carga
- [ ] Website redirige correctamente al app

---

## 📝 Comandos Útiles

### Ver logs en tiempo real:
En Dokploy → Logs tab

### Redeploy:
Dokploy → Deploy button

### Verificar variables:
Dokploy → Settings → Environment Variables

---

## 🎉 Todo Listo!

Una vez completados todos los pasos, tendrás:

- **Landing**: https://chatform.bravix.com.mx
- **App**: https://app.chatform.mx

Funcionando correctamente con autenticación y base de datos!

---

**¿Necesitas ayuda?** Consulta logs en Dokploy o revisa DEPLOYMENT.md para más detalles.
