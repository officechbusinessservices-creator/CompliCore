import type { Config } from 'tailwindcss'

/**
 * Design tokens mapped from design-tokens.json / design-tokens.css.
 * All colours, radii, shadows, and motion durations are sourced from the
 * locked design system — do not add values that are not in the token files.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],

  theme: {
    // ── Colours ─────────────────────────────────────────────────────────────
    // Replace Tailwind defaults entirely so no off-palette colours slip in.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      primary: {
        DEFAULT: '#6EA8FE',  // --color-primary
        hover:   '#8AB8FF',  // --color-primary-hover
      },

      canvas:  '#0B1020',    // --color-canvas
      surface: {
        DEFAULT:  '#11182D', // --color-surface
        elevated: '#16203A', // --color-surface-elevated
      },

      line:    '#25314F',    // --color-border  (named "line" to avoid
                             // collision with Tailwind's border utilities)

      tp:      '#F5F7FB',    // --color-text-primary
      ts:      '#B8C1D9',    // --color-text-secondary

      success: '#22C55E',    // --color-success
      warning: '#F59E0B',    // --color-warning
      danger:  '#EF4444',    // --color-danger
    },

    // ── Typography ───────────────────────────────────────────────────────────
    fontFamily: {
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    },

    // Scale is the full locked set — no intermediate sizes.
    fontSize: {
      '12': ['12px', { lineHeight: '1.5',  letterSpacing: '0' }],
      '14': ['14px', { lineHeight: '1.5',  letterSpacing: '0' }],
      '16': ['16px', { lineHeight: '1.6',  letterSpacing: '0' }],
      '18': ['18px', { lineHeight: '1.6',  letterSpacing: '0' }],
      '20': ['20px', { lineHeight: '1.4',  letterSpacing: '-0.01em' }],
      '24': ['24px', { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
      '30': ['30px', { lineHeight: '1.2',  letterSpacing: '-0.02em' }],
      '36': ['36px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      '48': ['48px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
    },

    fontWeight: {
      normal:    '400',
      medium:    '500',
      semibold:  '600',
      bold:      '700',
    },

    // ── Spacing — 8px grid ───────────────────────────────────────────────────
    // Tailwind's default 4px scale is kept intact; these named tokens add the
    // semantic spacing values from the spec without overriding standard utils.
    spacing: {
      px:  '1px',
      '0': '0px',
      // 8px grid (spec tokens)
      '1':  '8px',   // --space-1
      '2':  '16px',  // --space-2
      '3':  '24px',  // --space-3
      '4':  '32px',  // --space-4
      '5':  '40px',  // --space-5
      '6':  '48px',  // --space-6
      '7':  '64px',  // --space-7
      '8':  '80px',  // --space-8
      '12': '96px',  // section padding desktop
      // Fractional tokens for fine-grain layout
      '0.5': '4px',
      '1.5': '12px',
      '2.5': '20px',
      '3.5': '28px',
      // Standard larger values
      '16': '128px',
      '20': '160px',
      '24': '192px',
      // Viewport-relative helpers
      'full': '100%',
      'screen': '100vw',
    },

    // ── Border radius ────────────────────────────────────────────────────────
    borderRadius: {
      none: '0',
      sm:   '8px',   // --radius-sm (small controls)
      DEFAULT: '8px',
      md:   '12px',  // --radius-md (cards)
      lg:   '16px',  // --radius-lg (panels)
      xl:   '20px',  // --radius-xl (hero modules)
      full: '9999px',
    },

    // ── Shadows ──────────────────────────────────────────────────────────────
    boxShadow: {
      none: 'none',
      sm:   '0 2px 8px rgba(0,0,0,.18)',   // --shadow-sm
      DEFAULT: '0 8px 24px rgba(0,0,0,.24)',
      md:   '0 8px 24px rgba(0,0,0,.24)',  // --shadow-md
      lg:   '0 16px 40px rgba(0,0,0,.28)', // --shadow-lg
    },

    // ── Breakpoints (spec §02) ────────────────────────────────────────────────
    screens: {
      sm:  '375px',   // mobile
      md:  '768px',   // tablet
      lg:  '1024px',  // intermediate
      xl:  '1440px',  // desktop
    },

    extend: {
      // ── Motion durations (spec §02) ────────────────────────────────────────
      transitionDuration: {
        '160': '160ms',
        '180': '180ms',  // --motion-standard (card hover, button hover)
        '220': '220ms',  // --motion-medium   (FAQ open, pricing select)
        '240': '240ms',  // mobile drawer
        '300': '300ms',  // --motion-slow     (nav shrink, KPI refresh)
        '500': '500ms',  // --motion-hero     (headline fade-up)
      },

      // ── Max widths ─────────────────────────────────────────────────────────
      maxWidth: {
        site:    '1440px',
        content: '720px',
        prose:   '640px',
      },

      // ── Min heights / widths for touch targets ──────────────────────────────
      minHeight: { touch: '44px' },
      minWidth:  { touch: '44px' },

      // ── Height tokens for nav ─────────────────────────────────────────────
      height: {
        'nav-default': '80px',
        'nav-scrolled': '64px',
      },
    },
  },

  plugins: [],
}

export default config
