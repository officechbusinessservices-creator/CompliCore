# CompliCore+ — Design System Spec

## Principles
- Status over decoration
- Clarity over density
- System over styling
- Consistency over creativity

---

## 1. Color Tokens

### Background
| Token | Value | Usage |
|---|---|---|
| bg-canvas | #0B1020 | Page background |
| bg-surface | #11182D | Card background |
| bg-elevated | #16203A | Elevated card |
| bg-muted | #0F1528 | Muted section |

### Text
| Token | Value | Usage |
|---|---|---|
| text-primary | #F5F7FB | Body text |
| text-secondary | #B8C1D9 | Labels, subtitles |
| text-tertiary | #8A95B2 | Placeholders |

### Brand
| Token | Value | Usage |
|---|---|---|
| brand-primary | #6EA8FE | Primary action |
| brand-hover | #8AB8FF | Hover state |
| brand-active | #4F93FA | Pressed state |
| brand-soft | rgba(110,168,254,0.16) | Soft backgrounds |

### Semantic
| Token | Value | Usage |
|---|---|---|
| success | #22C55E | Active, paid |
| warning | #F59E0B | Pending, at-risk |
| danger | #EF4444 | Error, failed |
| info | #38BDF8 | Informational |

### Border
| Token | Value |
|---|---|
| border-default | #25314F |
| border-strong | #33426A |
| border-focus | #6EA8FE |

---

## 2. Typography

**Font:** Inter (system-ui fallback)

| Level | Size | Weight | Usage |
|---|---|---|---|
| xs | 12px | 500 | Labels, badges |
| sm | 14px | 500 | Secondary body |
| base | 16px | 500 | Primary body |
| lg | 18px | 600 | Emphasized text |
| xl | 20px | 600 | Section titles |
| 2xl | 24px | 600 | Headers |
| 3xl | 30px | 700 | Hero secondary |
| 4xl | 36px | 700 | Main headers |
| 5xl | 48px | 700 | Hero headline |

**Rules:**
- No mixed font families
- Hierarchy through size and weight only
- No decorative fonts

---

## 3. Spacing (8px grid)

| Token | Value |
|---|---|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 80px |

**Section padding:** 96px / 72px / 48px (desktop/tablet/mobile)

---

## 4. Radius + Shadow

| Token | Value |
|---|---|
| radius-sm | 8px |
| radius-md | 12px |
| radius-lg | 16px |
| radius-xl | 24px |

| Token | Value |
|---|---|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.18) |
| shadow-md | 0 8px 24px rgba(0,0,0,0.22) |
| shadow-lg | 0 16px 40px rgba(0,0,0,0.28) |

---

## 5. Grid

| Breakpoint | Columns | Max Width | Gutter |
|---|---|---|---|
| Desktop (1440px) | 12 | 1200px | 24px |
| Tablet (768px) | 8 | — | 20px |
| Mobile (375px) | 4 | — | 16px |

---

## 6. Responsive Typography

| Element | Desktop | Tablet | Mobile |
|---|---|---|---|
| H1 | 48px | 40px | 30px |
| H2 | 36px | 30px | 24px |
| H3 | 24px | 22px | 20px |
| Body | 16px | 16px | 14px |

---

## 7. Motion

| Token | Value |
|---|---|
| fast | 120ms |
| base | 180ms |
| slow | 240ms |
| easing | cubic-bezier(0.2, 0.8, 0.2, 1) |

**Rules:**
- GPU-friendly transforms only (translate, opacity, scale)
- No heavy blur animations
- Max 240ms for standard interactions

**Key animations:**
- Hero text: fade-up from 16px below, 500ms
- Cards: hover lift 2px + border brighten, 180ms
- Timeline items: slide-up stagger, 150ms each
- Navbar: shrink 80→64px on scroll, 300ms
- Drawer: slide from right, 240ms
- FAQ: height + opacity expand, 220ms

---

## 8. Component Specs

### Button
- Min height: 44px
- Radius: 12px
- Variants: primary, secondary, ghost, danger
- States: default, hover, active, disabled, loading

### Status Pill
- Structure: icon + label + soft colored background
- Types: inactive (gray), active (green), pending (yellow), past_due (red)

### KPI Card
- Value: 30px+ font, 700 weight
- Label: text-secondary
- No charts in initial version

### Flow Card
- Name + StatusPill + billing state + last run
- Actions: toggle, view details

---

## 9. Accessibility (WCAG 2.2 AA)
- Minimum contrast 4.5:1 for body text
- 3:1 allowed for large text (KPI values)
- Full keyboard navigation
- Visible focus states on all interactive elements
- ARIA live regions for timeline events
- `aria-expanded` on accordions
- `aria-busy` on loading states
- Touch targets minimum 44px

---

## 10. Tailwind Quick Reference

```tsx
// Page background
<body className="bg-[#0B1020] text-[#F5F7FB]">

// Card
<div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-6 shadow-sm">

// Primary button
<button className="bg-[#6EA8FE] hover:bg-[#8AB8FF] text-[#0B1020] font-semibold rounded-xl h-11 px-6 transition-colors duration-[180ms]">

// Status pill — active
<span className="inline-flex items-center gap-1.5 bg-green-500/16 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full">

// Section container
<section className="max-w-[1200px] mx-auto px-6 py-24">
```
