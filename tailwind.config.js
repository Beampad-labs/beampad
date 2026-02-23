/** @type {import('tailwindcss').Config} */
const withOpacity = (cssVariable) => `rgb(var(${cssVariable}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware core palette
        'canvas': withOpacity('--color-canvas'),
        'canvas-alt': withOpacity('--color-canvas-alt'),
        'ink': withOpacity('--color-ink'),
        'ink-muted': withOpacity('--color-ink-muted'),
        'ink-faint': withOpacity('--color-ink-faint'),
        'border': withOpacity('--color-border'),
        'border-strong': withOpacity('--color-border-strong'),
        // Accent
        'accent': withOpacity('--color-accent'),
        'accent-hover': withOpacity('--color-accent-hover'),
        'accent-foreground': withOpacity('--color-accent-foreground'),
        'accent-muted': 'rgb(var(--color-accent) / 0.16)',
        // Secondary colors for variety
        'pastel-lavender': '#818CF8',
        'pastel-mint': '#34D399',
        'pastel-peach': '#FBBF24',
        'pastel-sky': '#60A5FA',
        'pastel-lemon': '#FCD34D',
        // Status colors - vibrant
        'status-live': withOpacity('--color-status-live'),
        'status-live-bg': 'rgb(var(--color-status-live) / 0.16)',
        'status-upcoming': withOpacity('--color-status-upcoming'),
        'status-upcoming-bg': 'rgb(var(--color-status-upcoming) / 0.16)',
        'status-closed': withOpacity('--color-status-closed'),
        'status-closed-bg': 'rgb(var(--color-status-closed) / 0.16)',
        'status-error': withOpacity('--color-status-error'),
        'status-error-bg': 'rgb(var(--color-status-error) / 0.16)',
      },
      fontFamily: {
        display: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '400' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '400' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '400' }],
        'display-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'body': ['0.9375rem', { lineHeight: '1.6', letterSpacing: '-0.005em' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'label': ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.02)',
        'elevated': '0 12px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.04)',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'progress': 'progress 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        progress: {
          '0%': { strokeDashoffset: '283' },
          '100%': { strokeDashoffset: 'var(--progress-target)' },
        },
      },
    },
  },
  plugins: [],
}
