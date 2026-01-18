/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vibrant color palette
        'canvas': '#F9FAFB',
        'canvas-alt': '#F3F4F6',
        'ink': '#111827',
        'ink-muted': '#4B5563',
        'ink-faint': '#9CA3AF',
        'border': '#E5E7EB',
        'border-strong': '#D1D5DB',
        // Accent - vibrant indigo
        'accent': '#4F46E5',
        'accent-hover': '#4338CA',
        'accent-muted': 'rgba(79, 70, 229, 0.1)',
        // Secondary colors for variety
        'pastel-lavender': '#818CF8',
        'pastel-mint': '#34D399',
        'pastel-peach': '#FBBF24',
        'pastel-sky': '#60A5FA',
        'pastel-lemon': '#FCD34D',
        // Status colors - vibrant
        'status-live': '#10B981',
        'status-live-bg': 'rgba(16, 185, 129, 0.1)',
        'status-upcoming': '#3B82F6',
        'status-upcoming-bg': 'rgba(59, 130, 246, 0.1)',
        'status-closed': '#6B7280',
        'status-closed-bg': 'rgba(107, 114, 128, 0.1)',
        'status-error': '#EF4444',
        'status-error-bg': 'rgba(239, 68, 68, 0.1)',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
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
