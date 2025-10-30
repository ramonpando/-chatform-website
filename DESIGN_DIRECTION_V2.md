# ChatForm Design System v2.0 - Soft Modern Premium

## 🎨 Visual Direction

### Inspiración
- **Linear** - Feature bento grids
- **Productlane** - UI mockups en cards
- **VestDesk** - Fondos gradient suaves
- **Meta Ads** - Hero con gradient background

### Personalidad de Marca
- **Profesional pero accesible**
- **Moderno sin ser frío**
- **Premium pero no intimidante**
- **Tech-forward con toque humano**

---

## 🎨 Nueva Paleta de Colores

### Primary Colors
```css
--color-primary: #2563EB        /* Blue 600 - Professional */
--color-primary-light: #3B82F6  /* Blue 500 - Hover */
--color-primary-dark: #1E40AF   /* Blue 700 - Pressed */

--color-accent: #EC4899         /* Pink 500 - CTAs destacados */
--color-accent-light: #F472B6   /* Pink 400 */

--color-success: #10B981        /* Green 500 - Success states */
```

### Background Pastels (Bento Cards)
```css
--bg-lavender: #F3F4FF          /* Lavanda suave */
--bg-mint: #ECFDF5              /* Menta clara */
--bg-peach: #FFF7ED             /* Durazno */
--bg-blue: #EFF6FF              /* Azul cielo */
--bg-pink: #FDF2F8              /* Rosa claro */
--bg-yellow: #FFFBEB            /* Amarillo suave */
```

### Gradients
```css
--gradient-hero: linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 50%, #FDF2F8 100%);
--gradient-blue-pink: linear-gradient(135deg, #3B82F6 0%, #EC4899 100%);
--gradient-purple: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
```

### Neutrals
```css
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-200: #E5E7EB
--gray-300: #D1D5DB
--gray-600: #4B5563
--gray-900: #111827             /* Texto principal */
```

---

## 📐 Layout System

### Bento Grid Pattern
```
┌─────────────────────────────────────┐
│  Sección con título centrado       │
├──────────────┬──────────────────────┤
│   Card 1     │     Card 2          │
│   (tall)     │     (tall)          │
│              │                      │
├──────────────┼──────────────────────┤
│   Card 3     │     Card 4          │
│   (tall)     │     (tall)          │
│              │                      │
└──────────────┴──────────────────────┘
```

### Card Specs
- **Border radius**: 24px (muy redondeado)
- **Padding**: 40px interno
- **Gap**: 24px entre cards
- **Shadow**: 0 8px 24px rgba(0,0,0,0.06)
- **Hover**: translateY(-4px) + shadow xl

---

## 🎯 Componentes Clave

### 1. Hero Section (Nueva Estructura)

```tsx
<section className="hero-gradient min-h-screen">
  <nav>...</nav>

  <div className="hero-content">
    <h1 className="text-6xl font-bold">
      Convierte conversaciones
      <br/>
      en <span className="gradient-text">insights accionables</span>
    </h1>

    <p className="text-xl text-gray-600">
      Encuestas por WhatsApp con análisis automático de IA.
      De feedback a acción en minutos.
    </p>

    {/* Bento Grid con mockups */}
    <div className="bento-grid-4">
      <BentoCard bg="lavender">
        <MockupWhatsAppChat />
        <h3>Conversational</h3>
        <p>Natural como hablar con un amigo</p>
      </BentoCard>

      <BentoCard bg="mint">
        <MockupDashboard />
        <h3>AI Analytics</h3>
        <p>NPS, CSAT, Sentiment en <30s</p>
      </BentoCard>

      <BentoCard bg="peach">
        <MetricCard value="78%" label="Response Rate" />
        <h3>High Engagement</h3>
        <p>5-10x más que email</p>
      </BentoCard>

      <BentoCard bg="blue">
        <IllustrationChart />
        <h3>Real-time Insights</h3>
        <p>Dashboard actualizado al instante</p>
      </BentoCard>
    </div>

    <button className="cta-primary">
      Comenzar gratis
    </button>
  </div>
</section>
```

### 2. Features Section (Bento Grid)

```tsx
<section className="features-bento">
  <h2>Todo lo que necesitas</h2>

  <div className="bento-grid-6">
    {/* Card grande izquierda */}
    <BentoCard span="2x2" bg="lavender">
      <MockupFormBuilder />
      <h3>Form Builder</h3>
      <p>Drag & drop. Sin código.</p>
    </BentoCard>

    {/* Cards pequeñas derecha */}
    <BentoCard bg="mint">
      <IconAI />
      <h3>AI Analysis</h3>
    </BentoCard>

    <BentoCard bg="peach">
      <MetricCircle value="50-80%" />
      <h3>High Response</h3>
    </BentoCard>

    <BentoCard bg="blue">
      <IllustrationNotifications />
      <h3>Real-time Alerts</h3>
    </BentoCard>

    <BentoCard bg="pink">
      <IconIntegrations />
      <h3>Integrations</h3>
    </BentoCard>
  </div>
</section>
```

### 3. Pricing (Cards Elevados)

```tsx
<div className="pricing-cards">
  <PricingCard tier="starter">
    <div className="price">$19/mo</div>
    <ul>...</ul>
    <button className="btn-outline">Start Free</button>
  </PricingCard>

  <PricingCard tier="pro" featured>
    <div className="badge">Most Popular</div>
    <div className="price">$49/mo</div>
    <ul>...</ul>
    <button className="btn-primary">Get Started</button>
  </PricingCard>

  <PricingCard tier="enterprise">
    <div className="price">Custom</div>
    <ul>...</ul>
    <button className="btn-outline">Contact Sales</button>
  </PricingCard>
</div>
```

---

## ✨ Efectos y Animaciones

### Hover Effects
```css
.bento-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, #2563EB 0%, #EC4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glassmorphism (opciones)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

---

## 🔤 Tipografía

### Font Stack
```css
--font-display: 'Cal Sans', 'Inter', sans-serif;  /* Headlines */
--font-body: 'Inter', sans-serif;                  /* Body text */
```

### Hierarchy
```css
/* Hero Headline */
.text-display {
  font-size: 72px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Section Titles */
.text-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
}

/* Card Titles */
.text-card-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
}

/* Body */
.text-body {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--gray-600);
}
```

---

## 🎭 Mockups y Assets Necesarios

### Screenshots a crear:
1. **WhatsApp Chat UI** - Conversación de encuesta
2. **Dashboard View** - Gráficas y métricas
3. **Form Builder** - Editor drag & drop
4. **Analytics Panel** - NPS/CSAT scores

### Ilustraciones minimalistas:
1. Gráfica de líneas (growth)
2. Donut chart (NPS distribution)
3. Progress bars
4. Notification icons
5. Integration logos

---

## 📱 Responsive

### Mobile First
```css
/* Mobile (375px) */
.bento-grid-4 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet (768px) */
@media (min-width: 768px) {
  .bento-grid-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .bento-grid-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}
```

---

## 🚀 Implementation Priority

### Phase 1: Foundation (Day 1)
1. ✅ Crear nueva paleta de colores
2. ✅ Setup tipografía (Inter + Cal Sans fallback)
3. ✅ Crear componente BentoCard base
4. ✅ Implementar gradientes

### Phase 2: Hero (Day 1-2)
1. Hero con gradient background
2. Bento grid 2x2 con mockups
3. CTA button nuevo estilo
4. Animaciones hover

### Phase 3: Features (Day 2)
1. Features bento grid 6 cards
2. Mockups dentro de cards
3. Ilustraciones minimalistas

### Phase 4: Polish (Day 3)
1. Pricing cards elevados
2. Testimonials con avatars
3. Footer limpio
4. Micro-interacciones

---

## 🎯 Success Metrics

### Visual Quality
- Looks premium como Linear/Stripe
- Se diferencia completamente de WhatsApp
- Tiene identidad visual única
- Screenshots lucen profesionales

### User Experience
- Hero comunica valor en 3 segundos
- Bento grid hace browsing fácil
- Mockups muestran producto real
- CTAs claros y atractivos

---

## 📚 Referencias de Código

### Ejemplo Bento Card
```tsx
<div className="bento-card bg-lavender rounded-3xl p-10 hover:translate-y-[-4px] transition-all duration-300 shadow-lg hover:shadow-2xl">
  <div className="mockup-container mb-6">
    <img src="/mockup-chat.png" className="w-full rounded-2xl shadow-xl"/>
  </div>
  <h3 className="text-2xl font-semibold mb-2">Conversational</h3>
  <p className="text-gray-600">Natural como hablar con un amigo</p>
</div>
```

---

**Status:** Ready to implement
**Timeline:** 2-3 days para landing completo
**Next:** Crear componentes base y nuevo Hero
