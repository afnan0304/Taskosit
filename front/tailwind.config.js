/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f7fe',
          100: '#e9effe',
          200: '#d4deff',
          300: '#b0c1ff',
          400: '#869bff',
          500: '#4c6fff',
          600: '#3355ff',
          700: '#1729e5',
          800: '#1523bd',
          900: '#162096',
          950: '#0f1257',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '2.375rem', letterSpacing: '-0.02em' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
      },
      boxShadow: {
        'soft-sm': '0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)',
        'soft': '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        'soft-md': '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        'soft-lg': '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        'soft-xl': '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        'soft-2xl': '0px 24px 48px -12px rgba(16, 24, 40, 0.18)',
        'soft-3xl': '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      },
      maxWidth: {
        '8xl': '88rem',
        'content': '72rem',
      },
      backgroundImage: {
        'gradient-surface': 'linear-gradient(180deg, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    formsPlugin,
  ],
}