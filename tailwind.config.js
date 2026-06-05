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
        'fv-black': 'var(--fv-black)',
        'fv-dark': 'var(--fv-dark)',
        'fv-surface': 'var(--fv-surface)',
        'fv-border': 'var(--fv-border)',
        'fv-border-light': 'var(--fv-border-light)',
        'fv-text': 'var(--fv-text)',
        'fv-text-dim': 'var(--fv-text-dim)',
        'fv-text-muted': 'var(--fv-text-muted)',
        'fv-orange': 'var(--fv-orange)',
        'fv-orange-dim': 'var(--fv-orange-dim)',
        'fv-blue': 'var(--fv-blue)',
        'fv-blue-dim': 'var(--fv-blue-dim)',
        'fv-white': 'var(--fv-white)',
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
