/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        base: '#0a0a0f',
        surface: '#0f0f1a',
        card: '#13131f',
        border: '#1e1e30',
        accent: {
          purple: '#6c63ff',
          cyan: '#00d4ff',
        },
        muted: '#6b7280',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #6c63ff, #00d4ff)',
        'gradient-hero': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(108,99,255,0.25), transparent)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'bar-grow': 'barGrow 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        barGrow: {
          from: { width: '0%' },
          to: { width: 'var(--bar-width)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
