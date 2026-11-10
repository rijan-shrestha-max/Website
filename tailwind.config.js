/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg': {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        'text': {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        'accent': {
          DEFAULT: 'var(--accent)',
          glow: 'var(--accent-glow)',
          subtle: 'var(--accent-subtle)',
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        'expo-out': 'var(--ease-out-expo)',
        'in-out': 'var(--ease-in-out)',
      },
      backgroundColor: {
        'accent-glow': 'var(--accent-glow)',
        'accent-subtle': 'var(--accent-subtle)',
      },
      backdropBlur: {
        xl: '20px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
