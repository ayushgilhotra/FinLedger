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
          base: '#000511',
          surface: '#050a1b',
          elevated: '#0a1024',
          border: 'rgba(255,255,255,0.05)',
        },
        accent: {
          DEFAULT: '#00C2E0',
          hover: '#009bb3',
          glow: 'rgba(0, 194, 224, 0.2)',
        },
        income: '#00d4a0',
        expense: '#ff4d6d',
        warning: '#f5a623',
        info: '#00C2E0',
        text: {
          primary: '#ffffff',
          secondary: '#94a3b8',
          muted: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      boxShadow: {
        'neon': '0 0 40px rgba(0, 194, 224, 0.15)',
        'card-elevated': '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
