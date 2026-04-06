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
          base: '#080c14',
          surface: '#0e1420',
          elevated: '#161d2e',
          border: 'rgba(255,255,255,0.07)',
        },
        accent: {
          DEFAULT: '#0dd9c4',
          dim: '#0aa896',
          glow: 'rgba(13, 217, 196, 0.15)',
        },
        income: '#00d4a0',
        expense: '#ff4d6d',
        warning: '#f5a623',
        info: '#4a9eff',
        text: {
          primary: '#e8edf5',
          secondary: '#8896a8',
          muted: '#4a5568',
        },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(13, 217, 196, 0.15)',
      },
    },
  },
  plugins: [],
}
