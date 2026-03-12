import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:     '#F04E1F',
          orangeLight:'#FF6B3D',
          orangeDark: '#C73D0E',
          peach:      '#FFA07D',
          cream:      '#FFF4F0',
        },
        sidebar: {
          bg:         '#FAFAF9',
          border:     '#F0EDE8',
          hover:      '#F5F2EE',
          active:     '#EDEAE5',
          text:       '#6B6560',
          textActive: '#1A1714',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle:  '#FAFAF9',
          muted:   '#F5F2EE',
        },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)',
        'login':   '0 20px 60px -10px rgba(240,78,31,0.15), 0 8px 25px -5px rgba(0,0,0,0.08)',
        'btn':     '0 2px 8px rgba(240,78,31,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'wave':    'wave 10s ease-in-out infinite',
        'wave-r':  'wave 14s ease-in-out infinite reverse',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config