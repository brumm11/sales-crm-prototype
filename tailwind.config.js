/** @type {import('tailwindcss').Config} */
// ---------------------------------------------------------------------------
// Warm, editorial palette (cream canvas, warm brown-grays, terracotta accent,
// olive/gold semantics) — reskinned to match the reference "Deals App" look.
// Colour is remapped centrally here so the whole app warms up without touching
// component markup: Tailwind's cool `neutral`/`emerald`/`amber`/`rose`/`violet`
// scales are overridden with warm equivalents in the exact shades components use.
// ---------------------------------------------------------------------------
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      spacing: {
        // Used by 18px icons (h-4.5/w-4.5) — not in Tailwind's default scale.
        '4.5': '1.125rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Terracotta brand accent.
        accent: {
          50: '#fdf3ec',
          100: '#fbe1d0',
          200: '#f5c3a1',
          500: '#f0925e',
          600: '#e8763a',
          700: '#cc5c26',
        },
        // Warm near-black "ink" ramp for text.
        ink: {
          DEFAULT: '#2a2420',
          soft: '#4a423b',
          muted: '#6b6155',
          faint: '#9a9082',
        },
        // Warm neutral ramp — overrides Tailwind's cool default `neutral`, which
        // every surface/border/label uses.
        neutral: {
          50: '#f7f3ec',
          100: '#f0eae0',
          200: '#e6ddce',
          300: '#d3c8b7',
          400: '#b3a99b',
          500: '#8e877d',
          600: '#6b6155',
          700: '#4a423b',
          800: '#372f29',
          900: '#2a2420',
          950: '#221e1a',
        },
        // Warm-red — priority "High", negative sentiment, urgent reasons.
        rose: {
          50: '#fbece8',
          100: '#f6d8cf',
          200: '#eeb6a6',
          500: '#d75c43',
          600: '#c24a32',
          700: '#a03a27',
        },
        // Gold — priority "Medium", warnings, pending docs.
        amber: {
          50: '#f9f1df',
          100: '#f2e4c6',
          200: '#e8d0a0',
          400: '#d3a24e',
          500: '#c1912f',
          600: '#a97d2b',
          700: '#8a5f17',
        },
        // Olive — positive sentiment, success, "responded".
        emerald: {
          50: '#eef3e6',
          100: '#dde9cd',
          400: '#7faa5e',
          500: '#5e9147',
          600: '#4f7d3b',
          700: '#3f7a36',
        },
        // Dusty plum — the "On hold" / paused state (distinct from neutral Low).
        violet: {
          50: '#f3eef1',
          100: '#e7dde3',
          200: '#d4c3cd',
          600: '#8a6e7f',
          700: '#6f5566',
        },
        // Muted teal — used only for the .doc file-type icon tint.
        blue: {
          50: '#edf1f0',
          600: '#4f7d7d',
        },
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '14px', letterSpacing: '0.01em' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '22px' }],
        lg: ['17px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
        xl: ['20px', { lineHeight: '26px', letterSpacing: '-0.02em' }],
        '2xl': ['24px', { lineHeight: '30px', letterSpacing: '-0.03em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.035em' }],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        // Signature warm, soft card shadow (brown-tinted, not gray). The hairline
        // edge comes from each card's existing warm `ring-1`.
        card: '0 4px 20px rgba(90,70,45,0.06)',
        pop: '0 12px 34px rgba(90,70,45,0.14)',
        sheet: '0 -10px 44px rgba(42,36,32,0.18)',
      },
      keyframes: {
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'count-pulse': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 0.32s cubic-bezier(0.22,1,0.36,1)',
        'fade-in': 'fade-in 0.2s ease-out',
        'toast-in': 'toast-in 0.28s cubic-bezier(0.22,1,0.36,1)',
        'pop-in': 'pop-in 0.24s cubic-bezier(0.22,1,0.36,1)',
        'count-pulse': 'count-pulse 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
