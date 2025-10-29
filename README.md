# ChatForm

ChatForm es una plataforma SaaS para crear formularios conversacionales e interactivos.

## Tecnologías

- **Frontend**: Next.js 15 con React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: PostgreSQL (por configurar)
- **ORM**: Prisma (por configurar)
- **Autenticación**: NextAuth.js (por configurar)

## Estructura del Proyecto

```
chatform/
├── src/
│   ├── app/              # App Router de Next.js
│   │   ├── api/          # API Routes
│   │   ├── auth/         # Páginas de autenticación
│   │   ├── dashboard/    # Dashboard de la aplicación
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Página principal
│   │   └── globals.css   # Estilos globales
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/           # Componentes de UI
│   │   ├── forms/        # Componentes de formularios
│   │   └── layouts/      # Layouts
│   ├── lib/              # Utilidades y librerías
│   ├── types/            # Tipos de TypeScript
│   ├── hooks/            # React Hooks personalizados
│   ├── services/         # Servicios y lógica de negocio
│   └── config/           # Configuración
├── public/               # Archivos estáticos
└── package.json
```

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env

# Ejecutar en modo desarrollo
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

- `DATABASE_URL` - URL de conexión a PostgreSQL
- `NEXTAUTH_URL` - URL de la aplicación
- `NEXTAUTH_SECRET` - Secret para NextAuth.js

## Desarrollo

El proyecto está configurado con:

- ✅ Next.js 15 con App Router
- ✅ TypeScript para tipado estático
- ✅ Tailwind CSS para estilos
- ✅ ESLint para calidad de código
- ✅ Turbopack para desarrollo rápido

## Próximos Pasos

- [ ] Configurar base de datos con Prisma
- [ ] Implementar sistema de autenticación
- [ ] Crear componentes del constructor de formularios
- [ ] Implementar lógica conversacional
- [ ] Agregar analytics y seguimiento

## Licencia

MIT
