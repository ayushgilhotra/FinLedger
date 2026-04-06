/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--color-bg-base)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          border: 'var(--color-border)',
          'border-active': 'var(--color-border-active)',
        },
        accent: {
          teal: 'var(--color-accent-teal)',
          green: 'var(--color-accent-green)',
          blue: 'var(--color-accent-blue)',
          purple: 'var(--color-accent-purple)',
          amber: 'var(--color-accent-amber)',
          red: 'var(--color-accent-red)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          dim: 'var(--color-text-dim)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '12px',
        'btn': '8px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0,0,0,0.6)',
        'teal-glow': '0 0 40px rgba(0, 212, 170, 0.12)',
        'blue-glow': '0 0 30px rgba(78, 163, 227, 0.1)',
        'hero-lift': '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0,212,170,0.08)',
      },
      transitionProperty: {
        'lift': 'transform, box-shadow',
      },
      backgroundImage: {
        'gradient-teal': 'var(--gradient-teal)',
        'gradient-blue': 'var(--gradient-blue)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-glow': 'var(--gradient-glow-teal)',
      },
    },
  },
  plugins: [],
}
