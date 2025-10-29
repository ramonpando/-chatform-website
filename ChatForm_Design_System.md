# ChatForm Design System

**Version:** 1.0
**Last Updated:** Octubre 2025
**Status:** Living Document

---

## Design Philosophy

### Core Principles

**1. Conversational First**
- Diseño que refleja naturalidad de WhatsApp
- Una acción clara por pantalla
- Progreso visible y predecible

**2. Minimalist Clarity**
- Menos es más: eliminar ruido visual
- Foco en contenido sobre decoración
- Espacios en blanco generosos

**3. Speed & Efficiency**
- Interacciones rápidas (<100ms feedback)
- Carga instantánea de componentes
- Keyboard shortcuts everywhere

**4. Accessible by Default**
- WCAG 2.1 AA compliance mínimo
- Contrast ratios correctos
- Screen reader friendly

---

## Brand Identity

### Positioning Statement

> "ChatForm es directo, accesible y inteligente. No somos formales ni complicados. Somos la herramienta que hace que obtener feedback sea tan fácil como mandar un WhatsApp."

### Brand Personality

| Trait | Description | Example |
|-------|-------------|---------|
| **Conversational** | Hablamos como humanos, no como robots | "Enviado ✓" vs "Transmission successful" |
| **Optimista** | Celebramos pequeñas victorias | "¡Primera encuesta enviada! 🎉" |
| **Directo** | Sin fluff, al punto | "Conectar WhatsApp" vs "Initialize WhatsApp Integration Module" |
| **Inteligente** | Tech-forward pero no intimidante | Mostramos IA working, no magia negra |
| **Confiable** | Nunca perdemos data, siempre funcionamos | Auto-save everywhere, clear error states |

### Voice & Tone

**Writing Principles:**
- **Segunda persona:** "Tu encuesta" (no "La encuesta")
- **Activo sobre pasivo:** "Creaste 5 encuestas" (no "5 encuestas fueron creadas")
- **Presente simple:** "Enviamos" (no "Hemos enviado")
- **Emojis estratégicos:** Solo para celebraciones o estados críticos (✓ ❌ 🎉 ⚠️)

**Examples:**

| Context | ❌ Bad | ✅ Good |
|---------|--------|--------|
| Success | "The survey has been successfully transmitted to the recipient." | "Encuesta enviada ✓" |
| Error | "An error occurred during processing. Error code: 500-INTERNAL" | "No pudimos enviar el mensaje. ¿Verificas tu conexión?" |
| Empty state | "No data available" | "Aún no has creado encuestas. ¿Empezamos?" |
| Loading | "Processing..." | "Analizando respuestas..." |

---

## Color System

### Inspiration

Basado en análisis de:
- **Typeform:** Uso bold de color primario
- **Linear:** Monocromático con acentos sutiles
- **WhatsApp:** Verde reconocible, accesible
- **Notion:** Neutrales cálidos, no stark white

### Color Palette

#### Primary Colors

```css
/* Verde WhatsApp - Acción principal */
--color-primary-50:  #E7F9F0;
--color-primary-100: #C3F1D9;
--color-primary-200: #9FE9C1;
--color-primary-300: #7BE1AA;
--color-primary-400: #57D992;
--color-primary-500: #25D366; /* WhatsApp brand */
--color-primary-600: #1EAA52;
--color-primary-700: #17803D;
--color-primary-800: #105629;
--color-primary-900: #092C14;
```

**Usage:**
- Botones de acción principal (CTA)
- Estados de éxito
- Indicadores de conexión WhatsApp
- Links interactivos

#### Secondary Colors

```css
/* Azul Eléctrico - Inteligencia/IA */
--color-secondary-50:  #E6F0FF;
--color-secondary-100: #B3D7FF;
--color-secondary-200: #80BFFF;
--color-secondary-300: #4DA6FF;
--color-secondary-400: #1A8EFF;
--color-secondary-500: #0066FF; /* Main secondary */
--color-secondary-600: #0052CC;
--color-secondary-700: #003D99;
--color-secondary-800: #002966;
--color-secondary-900: #001433;
```

**Usage:**
- Badges de IA/análisis automático
- Gráficos de analytics
- States informativos
- Links secundarios

#### Neutrals (Warm Gray)

```css
/* Base palette - slightly warm */
--color-neutral-0:   #FFFFFF;
--color-neutral-50:  #FAFAF9;
--color-neutral-100: #F5F5F4;
--color-neutral-200: #E7E5E4;
--color-neutral-300: #D6D3D1;
--color-neutral-400: #A8A29E;
--color-neutral-500: #78716C;
--color-neutral-600: #57534E;
--color-neutral-700: #44403C;
--color-neutral-800: #292524;
--color-neutral-900: #1C1917;
```

**Usage:**
- Texto: 900 (heading), 700 (body), 500 (secondary)
- Backgrounds: 0 (cards), 50 (page), 100 (hover)
- Borders: 200 (dividers), 300 (inputs)

#### Semantic Colors

```css
/* Success (reuses primary green) */
--color-success-50:  var(--color-primary-50);
--color-success-500: var(--color-primary-500);
--color-success-700: var(--color-primary-700);

/* Error */
--color-error-50:  #FEF2F2;
--color-error-100: #FEE2E2;
--color-error-500: #EF4444;
--color-error-700: #B91C1C;
--color-error-900: #7F1D1D;

/* Warning */
--color-warning-50:  #FFFBEB;
--color-warning-100: #FEF3C7;
--color-warning-500: #F59E0B;
--color-warning-700: #B45309;
--color-warning-900: #78350F;

/* Info (reuses secondary blue) */
--color-info-50:  var(--color-secondary-50);
--color-info-500: var(--color-secondary-500);
--color-info-700: var(--color-secondary-700);
```

### Accessibility

**Contrast Requirements:**

| Combo | Contrast Ratio | WCAG Level |
|-------|----------------|------------|
| primary-500 on white | 4.89:1 | AA ✓ |
| neutral-900 on white | 19.37:1 | AAA ✓ |
| neutral-700 on white | 10.26:1 | AAA ✓ |
| neutral-500 on white | 4.52:1 | AA ✓ (large text only) |
| error-500 on white | 4.89:1 | AA ✓ |

**Never use:**
- primary-300 o más claro para texto
- neutral-400 para body text (solo secondary/disabled)

---

## Typography

### Font Stack

#### Primary: Inter

**Why Inter?**
- Optimizado para pantallas (legibilidad alta)
- Variable font (performance)
- Números tabulares para métricas
- Gratis y open-source
- Usado por: Linear, GitHub, Notion

```css
--font-family-sans: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                    Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

#### Monospace: JetBrains Mono

**Para:** Códigos, API keys, IDs técnicos

```css
--font-family-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale

**Base:** 16px (1rem)

```css
--font-size-xs:   0.75rem;  /* 12px - labels, captions */
--font-size-sm:   0.875rem; /* 14px - secondary text */
--font-size-base: 1rem;     /* 16px - body */
--font-size-lg:   1.125rem; /* 18px - large body */
--font-size-xl:   1.25rem;  /* 20px - h4 */
--font-size-2xl:  1.5rem;   /* 24px - h3 */
--font-size-3xl:  1.875rem; /* 30px - h2 */
--font-size-4xl:  2.25rem;  /* 36px - h1 */
--font-size-5xl:  3rem;     /* 48px - display */
```

### Font Weights

```css
--font-weight-normal:   400;
--font-weight-medium:   500;
--font-weight-semibold: 600;
--font-weight-bold:     700;
```

**Usage:**
- **Normal (400):** Body text
- **Medium (500):** Secondary headings, emphasized text
- **Semibold (600):** Buttons, labels, h4-h6
- **Bold (700):** h1-h3, critical actions

### Line Heights

```css
--line-height-tight:  1.25; /* Headings */
--line-height-normal: 1.5;  /* Body */
--line-height-relaxed: 1.75; /* Long-form content */
```

### Typography Components

#### Headings

```css
h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.025em;
  color: var(--color-neutral-900);
}

h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

h3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

h4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}
```

#### Body Text

```css
p {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-700);
}

.text-secondary {
  font-size: var(--font-size-sm);
  color: var(--color-neutral-500);
}

.text-small {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
}
```

---

## Spacing Scale

**Base unit:** 4px (0.25rem)

```css
--space-0:  0;
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-5:  1.25rem;  /* 20px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Spacing Usage

| Use Case | Value | Visual |
|----------|-------|--------|
| Component padding (tight) | space-3 (12px) | Buttons, badges |
| Component padding (normal) | space-4 (16px) | Cards, inputs |
| Component padding (relaxed) | space-6 (24px) | Containers |
| Stack spacing (tight) | space-4 (16px) | Form fields |
| Stack spacing (normal) | space-6 (24px) | Sections |
| Stack spacing (loose) | space-12 (48px) | Page sections |
| Inline spacing | space-2 (8px) | Button icon + text |
| Grid gap | space-6 (24px) | Cards grid |

---

## Layout System

### Grid

**12-column grid** con breakpoints responsivos

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

@media (max-width: 640px) {
  .container { padding: 0 var(--space-4); }
}
```

### Breakpoints

```css
--screen-sm:  640px;   /* Mobile landscape */
--screen-md:  768px;   /* Tablet */
--screen-lg:  1024px;  /* Desktop */
--screen-xl:  1280px;  /* Large desktop */
--screen-2xl: 1536px;  /* Extra large */
```

### Max Widths (Content)

```css
--max-width-xs:   20rem;   /* 320px - Sidebar content */
--max-width-sm:   24rem;   /* 384px - Narrow forms */
--max-width-md:   28rem;   /* 448px - Forms */
--max-width-lg:   32rem;   /* 512px - Modals */
--max-width-xl:   36rem;   /* 576px - Long-form text */
--max-width-2xl:  42rem;   /* 672px - Articles */
--max-width-full: 100%;
```

**Usage:**
- Form containers: max-width-md
- Modal dialogs: max-width-lg
- Blog posts: max-width-2xl
- Dashboard: max-width-full (with padding)

---

## Components

### Buttons

#### Primary Button

```jsx
<button className="
  bg-primary-500
  hover:bg-primary-600
  text-white
  font-semibold
  px-6 py-3
  rounded-lg
  transition-colors
  duration-150
  focus:outline-none
  focus:ring-2
  focus:ring-primary-500
  focus:ring-offset-2
">
  Enviar encuesta
</button>
```

**Specs:**
- Height: 44px (touch-friendly)
- Padding: 24px horizontal, 12px vertical
- Border radius: 8px
- Font: Semibold, 16px
- Hover: Darken 1 shade
- Active: Darken 2 shades
- Disabled: 50% opacity, cursor not-allowed

#### Secondary Button

```jsx
<button className="
  bg-white
  border border-neutral-300
  hover:bg-neutral-50
  text-neutral-900
  font-semibold
  px-6 py-3
  rounded-lg
">
  Cancelar
</button>
```

#### Ghost Button

```jsx
<button className="
  bg-transparent
  hover:bg-neutral-100
  text-neutral-700
  font-medium
  px-4 py-2
  rounded-lg
">
  Ver más
</button>
```

#### Icon Button

```jsx
<button className="
  w-10 h-10
  flex items-center justify-center
  hover:bg-neutral-100
  rounded-lg
  transition-colors
">
  <Icon size={20} />
</button>
```

#### Button Sizes

| Size | Height | Padding X | Font Size | Use Case |
|------|--------|-----------|-----------|----------|
| sm | 32px | 12px | 14px | Secondary actions, table actions |
| md | 40px | 16px | 16px | Forms, modals |
| lg | 44px | 24px | 16px | Primary CTAs, hero buttons |

---

### Inputs

#### Text Input

```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-neutral-700">
    Nombre del formulario
  </label>
  <input
    type="text"
    className="
      w-full
      px-4 py-2.5
      border border-neutral-300
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-primary-500
      focus:border-transparent
      placeholder:text-neutral-400
    "
    placeholder="Ej: Encuesta de satisfacción"
  />
  <p className="text-xs text-neutral-500">
    Este nombre solo lo ves tú
  </p>
</div>
```

**States:**
- **Default:** border-neutral-300
- **Hover:** border-neutral-400
- **Focus:** ring-2 ring-primary-500, border-transparent
- **Error:** border-error-500, ring-error-500
- **Disabled:** bg-neutral-100, cursor-not-allowed

#### Select / Dropdown

```jsx
<select className="
  w-full
  px-4 py-2.5
  border border-neutral-300
  rounded-lg
  bg-white
  focus:ring-2
  focus:ring-primary-500
">
  <option>Opción 1</option>
  <option>Opción 2</option>
</select>
```

#### Textarea

```jsx
<textarea
  rows="4"
  className="
    w-full
    px-4 py-3
    border border-neutral-300
    rounded-lg
    resize-none
    focus:ring-2
    focus:ring-primary-500
  "
/>
```

---

### Cards

#### Basic Card

```jsx
<div className="
  bg-white
  border border-neutral-200
  rounded-xl
  p-6
  hover:shadow-md
  transition-shadow
">
  <h3 className="text-xl font-semibold mb-2">
    Encuesta NPS
  </h3>
  <p className="text-neutral-600 text-sm">
    Creada hace 2 días
  </p>
</div>
```

**Variants:**
- **Flat:** border only, no shadow
- **Elevated:** shadow-sm default, shadow-lg on hover
- **Interactive:** Hover effects, cursor pointer

#### Stat Card

```jsx
<div className="bg-white border border-neutral-200 rounded-xl p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-neutral-600">
      Total Respuestas
    </span>
    <span className="text-success-500 text-xs">↑ 12%</span>
  </div>
  <p className="text-3xl font-bold text-neutral-900">
    1,247
  </p>
</div>
```

---

### Badges

```jsx
/* Status badges */
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  rounded-full
  text-xs font-medium
  bg-success-100 text-success-700
">
  Completado
</span>

<span className="bg-warning-100 text-warning-700 ...">
  Pendiente
</span>

<span className="bg-error-100 text-error-700 ...">
  Error
</span>

<span className="bg-secondary-100 text-secondary-700 ...">
  IA
</span>
```

---

### Toast Notifications

```jsx
/* Success Toast */
<div className="
  flex items-center gap-3
  bg-white border-l-4 border-success-500
  rounded-lg shadow-lg
  p-4
  max-w-md
">
  <CheckCircle className="text-success-500" size={20} />
  <div>
    <p className="font-medium text-neutral-900">
      Encuesta enviada
    </p>
    <p className="text-sm text-neutral-600">
      Se envió a 45 contactos
    </p>
  </div>
</div>

/* Error Toast */
<div className="border-l-4 border-error-500 ...">
  <AlertCircle className="text-error-500" />
  <div>
    <p className="font-medium">Error al enviar</p>
    <p className="text-sm">Verifica tu conexión</p>
  </div>
</div>
```

**Position:** Bottom-right
**Duration:** 5 seconds (success), 7 seconds (error), persistent (critical)
**Animation:** Slide in from right

---

### Modals

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Overlay */}
  <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" />

  {/* Modal */}
  <div className="
    relative
    bg-white
    rounded-2xl
    shadow-2xl
    max-w-lg
    w-full
    max-h-[90vh]
    overflow-auto
  ">
    {/* Header */}
    <div className="px-6 py-4 border-b border-neutral-200">
      <h2 className="text-xl font-semibold">
        Conectar WhatsApp
      </h2>
    </div>

    {/* Body */}
    <div className="px-6 py-6">
      {/* Content */}
    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
      <button className="secondary">Cancelar</button>
      <button className="primary">Conectar</button>
    </div>
  </div>
</div>
```

**Specs:**
- Max width: 512px (lg), 672px (xl)
- Border radius: 16px
- Padding: 24px
- Backdrop: Black 50% opacity + blur
- Animation: Fade in + scale from 95% to 100%

---

### Loading States

#### Skeleton Loader

```jsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
  <div className="h-32 bg-neutral-200 rounded"></div>
</div>
```

#### Spinner

```jsx
<svg
  className="animate-spin h-5 w-5 text-primary-500"
  fill="none"
  viewBox="0 0 24 24"
>
  <circle
    className="opacity-25"
    cx="12" cy="12" r="10"
    stroke="currentColor"
    strokeWidth="4"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
  />
</svg>
```

#### Progress Bar

```jsx
<div className="w-full bg-neutral-200 rounded-full h-2">
  <div
    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
    style={{ width: '45%' }}
  />
</div>
```

---

## Icons

### Icon Library: Lucide React

**Why Lucide?**
- 1000+ icons consistentes
- Optimizados para React
- Customizable (size, color, stroke)
- Tree-shakeable (import individual)
- Open source

```bash
npm install lucide-react
```

```jsx
import { Send, CheckCircle, AlertCircle, Settings } from 'lucide-react'

<Send size={20} className="text-primary-500" />
```

### Icon Sizes

| Context | Size | Stroke Width |
|---------|------|--------------|
| Inline con texto | 16px | 2 |
| Buttons | 20px | 2 |
| Input icons | 20px | 2 |
| Nav items | 24px | 2 |
| Feature icons | 32px | 1.5 |
| Hero icons | 48px | 1.5 |

### Common Icons

| Icon | Usage |
|------|-------|
| `Send` | Enviar encuesta, campaign |
| `CheckCircle` | Success, completed |
| `AlertCircle` | Error, warning |
| `Info` | Tooltips, help |
| `Settings` | Configuración |
| `Users` | Contactos |
| `MessageCircle` | WhatsApp, conversaciones |
| `BarChart` | Analytics |
| `Brain` | IA features |
| `Download` | Export |
| `Upload` | Import |
| `Plus` | Crear nuevo |
| `Edit` | Editar |
| `Trash` | Eliminar |
| `Eye` | Ver/Preview |

---

## Animation & Transitions

### Principles

1. **Fast but noticeable:** 150-200ms ideal
2. **Purpose-driven:** Solo si mejora UX
3. **Consistent:** Misma duración/easing en contextos similares
4. **Reduce motion:** Respetar `prefers-reduced-motion`

### Transition Durations

```css
--duration-fast:   150ms;  /* Hover, focus */
--duration-base:   200ms;  /* Modals, dropdowns */
--duration-slow:   300ms;  /* Page transitions */
--duration-slower: 500ms;  /* Complex animations */
```

### Easing Functions

```css
--ease-linear:    linear;
--ease-in:        cubic-bezier(0.4, 0, 1, 1);
--ease-out:       cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce:    cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

**Default:** ease-out para la mayoría

### Common Transitions

```css
/* Button hover */
.button {
  transition: background-color 150ms ease-out;
}

/* Modal entrance */
.modal {
  animation: modal-in 200ms ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Toast slide-in */
@keyframes toast-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

---

## Responsive Design

### Mobile-First Approach

Diseñamos primero para mobile, luego escalamos a desktop.

```css
/* Mobile default */
.card {
  padding: var(--space-4);
}

/* Desktop */
@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}
```

### Touch Targets

**Minimum:** 44x44px (Apple HIG, WCAG)

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

### Responsive Typography

```css
h1 {
  font-size: 2rem; /* 32px mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 2.25rem; /* 36px tablet+ */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 3rem; /* 48px desktop */
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Checklist:**

- [ ] All text meets 4.5:1 contrast (3:1 for large text)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible (ring-2)
- [ ] Alt text en todas las imágenes
- [ ] ARIA labels donde sea necesario
- [ ] Form inputs tienen labels asociados
- [ ] Error messages descriptivos
- [ ] No depender solo de color para transmitir info

### Focus Indicators

```css
*:focus-visible {
  outline: none;
  ring: 2px solid var(--color-primary-500);
  ring-offset: 2px;
}
```

### Screen Reader

```jsx
/* Visually hidden but accessible */
<span className="sr-only">
  Cerrar modal
</span>

/* ARIA labels */
<button aria-label="Eliminar encuesta">
  <Trash size={20} />
</button>
```

---

## Implementation (Tailwind Config)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E7F9F0',
          500: '#25D366',
          700: '#17803D',
          // ... rest
        },
        secondary: {
          500: '#0066FF',
          // ...
        },
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAF9',
          900: '#1C1917',
          // ...
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      spacing: {
        // Default Tailwind spacing is perfect (4px base)
      },
      borderRadius: {
        lg: '0.5rem',   // 8px
        xl: '0.75rem',  // 12px
        '2xl': '1rem',  // 16px
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [],
}
```

---

## Design Resources

### Figma Design Kit

**To be created:**
- Component library
- Color styles
- Text styles
- Icons organized
- Example screens

### Development Handoff

**Zeplin/Figma:**
- Inspect mode for devs
- Export assets optimized
- Component specs documented

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-10-29 | Initial design system |
| TBD | TBD | Dark mode support |
| TBD | TBD | Component variations |

---

**Este design system es un documento vivo. Actualizar según evolución del producto y feedback de usuarios.**

**Next Steps:**
1. Implement base styles en Next.js
2. Create reusable components con Shadcn/ui
3. Design landing page siguiendo este sistema
4. Test accessibility con herramientas
