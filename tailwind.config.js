/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fv-black': '#080808',
        'fv-dark': '#121212',
        'fv-surface': '#1A1A1A',
        'fv-border': '#333333',
        'fv-border-light': '#444444',
        'fv-text': '#E0E0E0',
        'fv-text-dim': '#888888',
        'fv-text-muted': '#555555',
        'fv-orange': '#FF4500',
        'fv-orange-dim': '#CC3700',
      },
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3.5rem, 10vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(2rem, 5vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'label': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        'micro': ['0.5625rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'line-draw': 'lineDraw 1.5s ease-out forwards',
        'marquee': 'marquee linear infinite',
        'marquee-reverse': 'marquee-reverse linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        lineDraw: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
}
