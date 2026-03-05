/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          intel: '#e8001e',
          dim: '#8a0012',
          glow: 'rgba(232,0,30,0.25)'
        },
        ink: {
          900: '#030303',
          800: '#080808',
          700: '#0d0d0d',
          600: '#141414',
          500: '#1c1c1c',
          400: '#2a2a2a',
          300: '#444',
          200: '#666',
          100: '#999'
        }
      },
      fontFamily: {
        mono: ['"Share Tech Mono"', 'monospace'],
        cond: ['"Barlow Condensed"', 'sans-serif'],
        body: ['Barlow', 'sans-serif']
      }
    }
  },
  plugins: []
}
