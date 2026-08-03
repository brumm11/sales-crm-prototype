/** @type {import('tailwindcss').Config} */
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
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Single restrained accent (Linear/Stripe-style near-neutral UI + one indigo accent)
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        ink: {
          DEFAULT: '#0b0f19',
          soft: '#3a4152',
          muted: '#6b7280',
          faint: '#9aa1af',
        },
      },
      fontSize: {
        // Tight, deliberate mobile type scale
        '2xs': ['11px', { lineHeight: '14px', letterSpacing: '0.01em' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '22px' }],
        lg: ['17px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '26px', letterSpacing: '-0.01em' }],
        '2xl': ['24px', { lineHeight: '30px', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,15,25,0.04), 0 1px 3px rgba(11,15,25,0.06)',
        pop: '0 8px 30px rgba(11,15,25,0.12)',
        sheet: '0 -8px 40px rgba(11,15,25,0.18)',
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
