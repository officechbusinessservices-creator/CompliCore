# 02_DESIGN_SYSTEM.md

## Visual identity
- Dark enterprise dashboard
- Restrained blue primary
- Strong status-driven color semantics
- High contrast
- Clean geometry
- No startup gimmicks

## Color system
### Core palette
- Primary: #6EA8FE
- Primary hover: #8AB8FF
- Surface: #11182D
- Canvas: #0B1020
- Elevated surface: #16203A
- Border: #25314F
- Text primary: #F5F7FB
- Text secondary: #B8C1D9
- Success: #22C55E
- Warning: #F59E0B
- Danger: #EF4444

## Typography
- Font family: Inter, system-ui, sans-serif
- Weights: 400, 500, 600, 700

### Type scale
- 12 / caption
- 14 / small
- 16 / body
- 18 / body-large
- 20 / label-large
- 24 / h4
- 30 / h3
- 36 / h2
- 48 / h1

## Spacing system
- 8
- 16
- 24
- 32
- 40
- 48
- 64
- 80

## Radius
- 8 / small controls
- 12 / cards
- 16 / panels
- 20 / hero modules

## Shadows
- sm: 0 2px 8px rgba(0,0,0,.18)
- md: 0 8px 24px rgba(0,0,0,.24)
- lg: 0 16px 40px rgba(0,0,0,.28)

## Layout patterns
- Desktop: 12-column grid
- Tablet: 8-column grid
- Mobile: 4-column grid

### Breakpoints
- Mobile: 375px
- Tablet: 768px
- Desktop: 1440px

## Responsive rules
### Hero
- Desktop: two-column, copy left, live demo right
- Tablet: stacked with demo under copy
- Mobile: stacked, shortened copy, single CTA priority

### Navigation
- Desktop: horizontal
- Tablet/mobile: hamburger → drawer

### Pricing
- Desktop: 3-column pricing grid
- Tablet: 2 + 1 stacked
- Mobile: stacked cards

### Flow section
- Desktop: 3 cards in row
- Tablet: 2 + 1
- Mobile: single-column cards or accordion

### Dashboard preview
- Desktop: KPI strip + split panels
- Tablet: stacked
- Mobile: tabs or vertical cards

### Typography scaling
- H1: 48 / 40 / 30
- H2: 36 / 30 / 24
- Body: 16 / 16 / 14

### Section padding
- Desktop: 96
- Tablet: 72
- Mobile: 48

## Component states
### Button
- default
- hover
- focus-visible
- disabled
- loading

### Pricing card
- default
- selected
- hover
- disabled

### Flow card
- active
- paused
- error
- inactive

### Form field
- default
- focus
- valid
- invalid
- disabled

### Nav item
- default
- hover
- active

### KPI stat card
- default
- loading
- error

## Motion rules
- Page load: navbar fades in over 250ms
- Hero headline: fade-up from 16px below over 500ms
- Subheadline: 100ms stagger after hero headline
- CTAs: fade in last
- Navbar shrink on scroll: 80px to 64px over 300ms
- Timeline event append: 180ms stagger
- Card hover: lift 2px over 180ms
- CTA hover: arrow shifts right 4px over 160ms
- Pricing card select: blue outline + elevated shadow over 200ms
- FAQ open: height + opacity over 220ms
- Mobile drawer: slide from left over 240ms
- KPI refresh: opacity pulse over 300ms
- Use GPU-friendly transforms only

## Accessibility rules
- WCAG 2.2 AA minimum
- Visible focus states
- Semantic landmarks
- Sufficient contrast
- Keyboard complete
- Touch targets at least 44px
- Motion must respect reduced-motion preferences

## Figma-ready component notes
- Cards use elevated-surface fill with border token
- Primary actions use blue fill with white text
- KPI cards prioritize large numeric value and compact label
- Dashboard panels use nested surface hierarchy for depth
- Avoid decorative graphics that do not support product proof
