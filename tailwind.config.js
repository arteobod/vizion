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
        // Public site — light palette.
        // Channel form + <alpha-value> is what makes opacity modifiers
        // (bg-vz-blue/40, border-vz-blue/30) actually resolve.
        vz: {
          bg: 'rgb(var(--vz-bg) / <alpha-value>)',
          soft: 'rgb(var(--vz-bg-soft) / <alpha-value>)',
          tint: 'rgb(var(--vz-bg-tint) / <alpha-value>)',
          border: 'rgb(var(--vz-border) / <alpha-value>)',
          'border-strong': 'rgb(var(--vz-border-strong) / <alpha-value>)',
          text: 'rgb(var(--vz-text) / <alpha-value>)',
          body: 'rgb(var(--vz-text-body) / <alpha-value>)',
          muted: 'rgb(var(--vz-text-muted) / <alpha-value>)',
          blue: 'rgb(var(--vz-blue) / <alpha-value>)',
          'blue-deep': 'rgb(var(--vz-blue-deep) / <alpha-value>)',
          'blue-soft': 'rgb(var(--vz-blue-soft) / <alpha-value>)',
          orange: 'rgb(var(--vz-orange) / <alpha-value>)',
          'orange-deep': 'rgb(var(--vz-orange-deep) / <alpha-value>)',
          'orange-soft': 'rgb(var(--vz-orange-soft) / <alpha-value>)',
          white: 'rgb(var(--vz-white) / <alpha-value>)',
          ink: 'rgb(var(--vz-ink) / <alpha-value>)',
        },
        // Admin panel — dark palette (internal pages only)
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
        display: ['var(--font-nunito)', 'Nunito', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
        // System monospace, for the public site's few tabular labels — the
        // window chapter captions and the nav's row numbers. Deliberately not
        // `font-mono`: that is the webfont, and pulling 31KB of JetBrains Mono
        // for a caption and six two-digit numbers was landing on phones. The
        // admin panel keeps the webfont, where the monospace look is the design.
        tag: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes — soft, large, never shouty
        'mega': ['clamp(2.75rem, 8.5vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'hero': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.625rem, 3vw, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'h3': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'lead': ['clamp(1.0625rem, 1.5vw, 1.25rem)', { lineHeight: '1.6' }],
      },
      borderRadius: {
        // "Soft corners" — the core ask from the brief
        'soft': '10px',
        'card': '12px',
        'xl2': '20px',
      },
      boxShadow: {
        'soft-sm': 'var(--vz-shadow-sm)',
        'soft': 'var(--vz-shadow)',
        'soft-lg': 'var(--vz-shadow-lg)',
        window: 'var(--vz-shadow-window)',
        'cta': 'var(--vz-shadow-orange)',
        'cta-blue': 'var(--vz-shadow-blue)',
      },
      maxWidth: {
        content: '1200px',
        window: '95rem',
        prose: '68ch',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Ambient drift for the background browser panes: position and rotation
        // in one animation, on one element.
        //
        // These used to be two animations on two nested elements, given
        // different periods so position and rotation never came back into sync.
        // That mismatch is worth keeping, but it was costing an animated element
        // per pane - twelve in total, and the compositor does not always take
        // them. When it declines, all twelve run on the main thread and
        // recalculate style every frame for as long as the page is open;
        // measured over one pass down the home page that was the difference
        // between ~550ms and ~1450ms of renderer time.
        //
        // Merging them keeps the effect and halves the element count: translate
        // peaks at 50% of the cycle, rotation at 33% and again at 72%, so the
        // two still never line up inside a single period.
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(-0.9deg)' },
          '33%': { transform: 'translate3d(6px, -18px, 0) rotate(0.9deg)' },
          '50%': { transform: 'translate3d(10px, -30px, 0) rotate(0.35deg)' },
          '72%': { transform: 'translate3d(4px, -14px, 0) rotate(-0.6deg)' },
        },
      },
      animation: {
        'float': 'floatY 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'drift': 'drift 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
