import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0B1020',
        surface: '#11182D',
        elevated: '#16203A',
        muted: '#0F1528',
        brand: {
          DEFAULT: '#6EA8FE',
          hover: '#8AB8FF',
          active: '#4F93FA',
        },
        border: {
          DEFAULT: '#25314F',
          strong: '#33426A',
          focus: '#6EA8FE',
        },
        text: {
          primary: '#F5F7FB',
          secondary: '#B8C1D9',
          tertiary: '#8A95B2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '5xl': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        '4xl': ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        '3xl': ['30px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      spacing: {
        section: '96px',
        'section-md': '72px',
        'section-sm': '48px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.22)',
        elevated: '0 16px 40px rgba(0,0,0,0.28)',
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'slide-in': 'slideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionDuration: {
        fast: '120ms',
        base: '180ms',
        slow: '240ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

export default config
