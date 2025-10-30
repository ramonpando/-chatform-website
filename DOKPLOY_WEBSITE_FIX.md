# Fix Dokploy Website Deployment

## Problema Identificado

Dokploy está intentando hacer build desde la **raíz del repositorio** (`/root/chatform/`) en lugar de desde el subdirectorio `/website` donde está el proyecto Next.js.

Error en el deployment:
```
Nixpacks was unable to generate a build plan for this app.
The contents of the app directory are:
PRD_Product_Requirements_Document.md
.git/
app/
website/    <-- El proyecto Next.js está aquí
...
```

## Soluciones

### Opción 1: Configurar en Dokploy UI (Recomendado)

1. **Acceder a Dokploy**: http://chatform.mx:3000 o http://[IP]:3000
2. **Ir al proyecto**: ChatForm Website
3. **Configuración > Build Settings**
4. **Root Directory**: Cambiar a `/website` o `website`
5. **Guardar y Redeploy**

### Opción 2: Usar Dockerfile Personalizado

He creado `Dockerfile.website` en la raíz que maneja correctamente el subdirectorio.

**Pasos en Dokploy UI:**
1. Ir a Build Settings
2. **Build Type**: Cambiar de "Nixpacks" a "Dockerfile"
3. **Dockerfile Path**: `Dockerfile.website`
4. Guardar y Redeploy

### Opción 3: Crear .dokploy.yml (Alternativa)

Crear archivo `.dokploy.yml` en la raíz:

```yaml
# .dokploy.yml
buildPath: website
builder: nixpacks
```

---

## Verificación Post-Deploy

Después del redeploy exitoso, verifica que:

1. ✅ Los nuevos logos (v2) aparezcan en el sitio
2. ✅ El color primario sea WhatsApp Green (#25D366)
3. ✅ La tipografía sea Inter (no Arial)
4. ✅ El botón CTA tenga efecto de scale y sombra

## Cambios que deberías ver

### Logo
- **Navbar**: Logo negro (`logo-black.svg`)
- **Footer**: Logo blanco (`logo-white.svg`)

### Colores
- **Botón CTA**: Verde WhatsApp (#25D366)
- **Badge "Gratis hasta 100 respuestas"**: Fondo verde translúcido
- **Checkmarks**: Verde WhatsApp
- **Texto "WhatsApp" en título**: Verde WhatsApp

### Tipografía
- **Font**: Inter (en vez de Arial)
- **Suavizado**: Antialiased

---

## Redeploy Manual Desde Consola (Si necesario)

Si necesitas hacer rebuild del contenedor manualmente:

```bash
# Ver servicios
docker service ls | grep chatform

# Actualizar el servicio (forzar rebuild)
docker service update --force chatformwebsite-chatformwebsite-ejfazo

# Ver logs
docker service logs chatformwebsite-chatformwebsite-ejfazo --follow
```

---

## Estado Actual

- ✅ Código pusheado a GitHub con todos los cambios
- ✅ Design System completo creado
- ✅ Logos v2 en `/website/public`
- ❌ Deployment pendiente (esperando configuración Dokploy)

## Próximo Paso

**Acceder a Dokploy UI y cambiar el Root Directory a `website`**, luego hacer redeploy.

Una vez que hagas esto, los cambios se reflejarán inmediatamente en chatform.mx

---

## Contacto / Soporte

Si no tienes acceso a Dokploy UI, necesitarás las credenciales del administrador para poder configurar el Root Directory correctamente.
