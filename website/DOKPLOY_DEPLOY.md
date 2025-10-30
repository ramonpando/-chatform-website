# 🚀 Deploy ChatForm Website en Dokploy

## Opción 1: Via Dokploy Web UI (Más Fácil - RECOMENDADO)

### Paso 1: Acceder a Dokploy
Ir a: https://dokploy.bravix.com.mx

### Paso 2: Crear Nueva Aplicación
1. Click en **"Create Application"** o **"New Project"**
2. Selecciona **"Application"**
3. Dale un nombre: `chatform-website`

### Paso 3: Configurar Source
Selecciona una de estas opciones:

**Opción A: Git Deploy (Mejor para CI/CD)**
- Source Type: `Git`
- Repository: (si tienes repo) o...

**Opción B: Nixpacks (Detecta Next.js automático)**
- Source Type: `Nixpacks`
- Build Path: `/root/chatform/website`

**Opción C: Docker (Más control)**
- Source Type: `Docker`
- Dockerfile path: `/root/chatform/website/Dockerfile`

### Paso 4: Configuración de Build

```yaml
Build Method: Nixpacks (recomendado) o Docker
Port: 3000
Health Check: /
Environment Variables: (ninguna por ahora)
```

### Paso 5: Deploy
1. Click **"Deploy"**
2. Espera 2-5 minutos mientras builds
3. Dokploy te dará una URL automática

### Paso 6: Configurar Dominio (Opcional)
1. En la app, ve a **"Domains"**
2. Agrega: `chatform.bravix.com.mx` (o tu dominio)
3. Dokploy configurará Traefik automáticamente
4. SSL se genera automáticamente (Let's Encrypt)

---

## Opción 2: Deploy Manual con Docker

Si prefieres hacerlo manualmente desde CLI:

### Paso 1: Build la imagen
```bash
cd /root/chatform/website

docker build -t chatform-website:latest .
```

### Paso 2: Run el container
```bash
docker run -d \
  --name chatform-website \
  -p 3001:3000 \
  --restart unless-stopped \
  chatform-website:latest
```

### Paso 3: Verificar
```bash
docker ps | grep chatform
curl http://localhost:3001
```

### Paso 4: Agregar a Dokploy
1. En Dokploy UI, crea nueva app
2. Selecciona "Docker Registry"
3. Image: `chatform-website:latest`
4. Deploy

---

## Opción 3: Docker Compose (Para desarrollo local)

Si quieres usar docker-compose:

```bash
cd /root/chatform/website

# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 📋 Checklist de Deploy

### Antes de Deploy:
- [x] Dockerfile creado
- [x] .dockerignore creado
- [x] next.config.ts con output: 'standalone'
- [x] All sections completadas
- [x] SEO optimizado
- [x] Sin errores de build

### Durante Deploy:
- [ ] Crear app en Dokploy
- [ ] Configurar build settings
- [ ] Click Deploy
- [ ] Esperar build completo
- [ ] Verificar health check pasa

### Después de Deploy:
- [ ] Probar la URL live
- [ ] Configurar dominio custom
- [ ] SSL certificado activo
- [ ] Verificar todas las secciones cargan
- [ ] Testear responsive en mobile
- [ ] Compartir URL con equipo

---

## 🔧 Configuración Recomendada en Dokploy

### General Settings:
```
Name: chatform-website
Type: Application
Framework: Next.js 16
```

### Build Settings:
```
Build Method: Nixpacks (auto-detecta Next.js)
Install Command: npm ci
Build Command: npm run build
Start Command: (auto-generado por Nixpacks)
Port: 3000
```

### Environment Variables:
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```
(No necesitas más por ahora, es solo frontend)

### Resource Limits:
```
Memory: 512MB (suficiente para Next.js static)
CPU: 0.5 cores
```

### Health Check:
```
Path: /
Port: 3000
Interval: 30s
Timeout: 10s
Retries: 3
```

### Domains:
```
Primary: chatform.bravix.com.mx (o tu dominio)
SSL: Auto (Let's Encrypt via Traefik)
```

---

## 🎯 URLs Esperadas

Después del deploy tendrás:

1. **URL interna de Dokploy**:
   - `http://chatform-website.dokploy.internal:3000`

2. **URL pública (auto-generada por Dokploy)**:
   - `https://chatform-website-xyz.dokploy.bravix.com.mx`

3. **Tu dominio custom** (si configuras):
   - `https://chatform.bravix.com.mx`
   - O `https://www.chatform.com` (cuando tengas el dominio)

---

## 🐛 Troubleshooting

### Build falla con "ELIFECYCLE"
```bash
# Limpia node_modules y reinstala
cd /root/chatform/website
rm -rf node_modules .next
npm ci
```

### Build falla con "out of memory"
- Incrementa Memory Limit en Dokploy a 1GB
- O usa `NODE_OPTIONS=--max-old-space-size=2048`

### Container no inicia
```bash
# Check logs
docker logs chatform-website

# Check si el puerto está en uso
netstat -tulpn | grep 3000
```

### Health check falla
- Verifica que la app responde en `/`
- Aumenta timeout a 30s
- Check logs del container

### SSL no se genera
- Verifica que el dominio apunta a tu servidor
- DNS debe tener A record a tu IP
- Espera 5-10 minutos para propagación
- Traefik genera cert automáticamente

---

## 📊 Verificación Post-Deploy

### 1. Check Health
```bash
curl https://tu-dominio.com
curl https://tu-dominio.com/sitemap.xml
```

### 2. Check Performance
- Lighthouse score (aim for 90+)
- Time to First Byte < 500ms
- Largest Contentful Paint < 2.5s

### 3. Check SEO
```bash
curl -I https://tu-dominio.com
# Verifica headers: content-type, cache-control, etc.
```

### 4. Check All Sections Load
Abre en browser y verifica:
- [x] Navigation sticky
- [x] Hero con animaciones
- [x] Social Proof visible
- [x] How It Works cards
- [x] Features grid
- [x] Testimonials
- [x] Pricing cards
- [x] FAQ accordion funciona
- [x] Final CTA
- [x] Footer con links

---

## 🔐 Security Checklist

- [x] Container runs as non-root user (nextjs)
- [x] No secrets in code (ninguno por ahora)
- [x] SSL/TLS enabled (via Traefik)
- [x] Security headers (Next.js defaults)
- [ ] Rate limiting (configurar en Traefik si necesario)
- [ ] DDoS protection (Cloudflare opcional)

---

## 📈 Monitoring (Opcional)

Dokploy incluye monitoring básico, pero puedes agregar:

1. **Uptimerobot / UptimeKuma**: Monitor uptime
2. **Google Analytics**: Track visitors
3. **Sentry**: Error tracking
4. **Plausible**: Privacy-friendly analytics

---

## 🚀 CI/CD Automático (Siguiente Paso)

Para deploys automáticos:

1. **Push code a GitHub**
2. **Conecta repo en Dokploy**
3. **Enable auto-deploy** en settings
4. Cada push a `main` → auto-deploy

---

## 💡 Tips Pro

### Cache Busting:
Next.js maneja esto automáticamente con hashed filenames

### Zero Downtime Deploys:
Dokploy hace rolling updates por defecto

### Rollback Rápido:
En Dokploy UI → Deployments → Click en deploy anterior → Rollback

### Multiple Environments:
- Crea 2 apps: `chatform-website-staging` y `chatform-website-prod`
- Staging: auto-deploy en push
- Prod: manual deploy después de testing

---

## ✅ Próximos Pasos Después de Deploy

1. ✅ **Deploy completado**
2. ⏳ Configurar dominio custom
3. ⏳ Agregar Google Analytics
4. ⏳ Setup monitoring (UptimeKuma)
5. ⏳ Crear `staging` environment
6. ⏳ Conectar a GitHub para CI/CD
7. ⏳ Agregar OG image real
8. ⏳ Comenzar Sprint 0 del backend

---

## 📞 Soporte

Si tienes issues:
1. Check logs en Dokploy UI
2. Verifica Docker logs: `docker logs chatform-website`
3. Review este documento
4. Check Dokploy docs: https://dokploy.com/docs

---

**¡Listo para deployar!** 🎉

Ve a: https://dokploy.bravix.com.mx y crea tu app!
