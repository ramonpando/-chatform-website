# ChatForm Design System v3.0

## Overview
Modern, clean design system with square corners and subtle gradients. Inspired by Linear, Stripe, and Vercel.

---

## Colors

### Primary Palette
- **Blue**: `#2563eb` (blue-600) - Primary actions
- **Cyan**: `#06b6d4` (cyan-500) - Accent color
- **Slate**: `#0f172a` (slate-900) - Text and buttons

### Gradients
```css
/* Primary gradient (blue to cyan) */
background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
```

### Text Colors
- **Primary**: `#0f172a` (slate-900)
- **Secondary**: `#64748b` (slate-500)
- **Tertiary**: `#94a3b8` (slate-400)

---

## Typography

### Font Sizes
- **Hero Title**: 72px (text-7xl) on desktop, 60px on tablet
- **Section Title**: 48-60px (text-5xl to text-6xl)
- **Body Large**: 20px (text-xl)
- **Body**: 16px (text-base)
- **Small**: 14px (text-sm)
- **Extra Small**: 12px (text-xs)
- **Micro**: 10px (text-[10px])

### Font Weights
- **Headings**: 700 (bold)
- **Buttons**: 600 (semibold)
- **Body**: 400 (normal)
- **Badges/Labels**: 400 (normal) - Changed from 600

---

## Border Radius

### Button & Input Radius
```css
--radius-md: 0.375rem; /* 6px - PRIMARY for buttons */
```

### Card Radius
```css
--radius-xl: 1rem;     /* 16px */
--radius-2xl: 1.5rem;  /* 24px */
--radius-3xl: 2rem;    /* 32px */
```

### Usage
- **Buttons**: `rounded-md` (6px) - More square, modern
- **Cards**: `rounded-2xl` or `rounded-3xl` (24-32px)
- **Badges**: `rounded-full`
- **Small cards**: `rounded-xl` (16px)

---

## Buttons

### Primary Button (with gradient glow)
```html
<div class="relative group">
  <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
  <a href="#" class="relative inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-md font-semibold text-lg hover:bg-slate-800 transition-all">
    Button Text
  </a>
</div>
```

### Secondary Button
```html
<a href="#" class="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-900 rounded-md font-semibold hover:bg-slate-200 transition-all">
  Button Text
</a>
```

### Outline Button
```html
<a href="#" class="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-md font-semibold hover:border-slate-300 hover:bg-slate-50 transition-all">
  Button Text
</a>
```

### Navbar Button (small)
```html
<div class="relative group">
  <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-md opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
  <a href="#" class="relative inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-all">
    Button Text
  </a>
</div>
```

---

## Badges

### Small & Clean Design
```html
<!-- Primary badge -->
<div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 text-blue-600 text-xs font-normal">
  <span>Badge text</span>
</div>

<!-- With pulse dot -->
<div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100/50 text-blue-600 text-xs font-normal">
  <span class="relative flex h-1.5 w-1.5">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
  </span>
  Badge text
</div>
```

### Key Properties
- **Font size**: `text-xs` (12px)
- **Font weight**: `font-normal` (400) - Not bold!
- **Padding**: `px-3 py-1.5` (12px 6px)
- **Border**: Semi-transparent border for depth
- **Background**: Semi-transparent with `/80` opacity

---

## Cards

### Pricing Card
```html
<div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl transition-all">
  <!-- Content -->
</div>
```

### Feature Card (Bento Grid)
```html
<div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-100 hover:shadow-2xl transition-all">
  <!-- Content -->
</div>
```

### Floating Card (Hero section)
```html
<div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
  <!-- Content -->
</div>
```

---

## Trust Indicators / Checkmarks

### Small & Clean
```html
<div class="flex items-center gap-2 text-xs text-slate-500">
  <CheckCircle class="w-3.5 h-3.5 text-green-500" />
  <span>Trust indicator text</span>
</div>
```

---

## Spacing

### Section Padding
- **Default**: `py-24 md:py-32` (96px to 128px)
- **Container**: `px-6 lg:px-8`
- **Max width**: `max-w-7xl mx-auto`

### Component Gaps
- **Small gap**: `gap-4` (16px)
- **Medium gap**: `gap-6` (24px)
- **Large gap**: `gap-8` (32px)

---

## Background Effects

### Subtle Gradient Orbs
```html
<section class="relative bg-white">
  <div class="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl" />
  <div class="absolute bottom-20 right-10 w-[600px] h-[600px] bg-slate-50/40 rounded-full blur-3xl" />
  <!-- Content -->
</section>
```

---

## Icons

### Sizes
- **Large**: `w-6 h-6` or `w-7 h-7`
- **Medium**: `w-5 h-5`
- **Small**: `w-4 h-4`
- **Micro**: `w-3.5 h-3.5` or `w-3 h-3`

---

## Key Design Principles

1. **Square Corners**: Buttons use `rounded-md` (6px) for a modern, less rounded look
2. **Clean Typography**: Small text uses `font-normal` instead of `font-semibold`
3. **Subtle Gradients**: Very soft background orbs with low opacity
4. **Gradient Glow**: Primary CTAs have animated gradient border glow
5. **White Base**: Clean white backgrounds, not vibrant colors
6. **Slate Text**: Dark text on light backgrounds (slate-900, slate-600, slate-500)
7. **Consistent Spacing**: Generous padding and margins throughout

---

## Usage in App

### Import Design System
```tsx
import "./design-system-v2.css"
```

### Use CSS Variables
```tsx
<button className="btn-primary btn-sm">
  Click me
</button>

<div className="badge badge-primary">
  New
</div>
```

---

## Migration Checklist

- [ ] Update all buttons from `rounded-lg` to `rounded-md`
- [ ] Change badge font-weight from 600 to 400
- [ ] Use slate colors instead of custom variables
- [ ] Add gradient glow to primary CTAs
- [ ] Update icon sizes (check for w-5 vs w-3.5)
- [ ] Replace vibrant backgrounds with subtle orbs
- [ ] Ensure consistent spacing (py-24 md:py-32)

---

## Examples

See the website landing page for reference implementations:
- `/website/components/sections/hero-v2.tsx` - Hero with gradient glow buttons
- `/website/components/sections/features.tsx` - Bento grid with pastel cards
- `/website/components/sections/pricing.tsx` - Modern pricing cards
- `/website/components/navigation.tsx` - Clean navbar with gradient CTA
