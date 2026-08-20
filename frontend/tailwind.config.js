/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        soft: {
          bg: '#FAFAFA',
          surface: '#FFFFFF',
          border: 'rgba(0, 0, 0, 0.04)',
          text: '#111111',
          muted: '#888888',
          accent: '#111111',
        },
      },
      boxShadow: {
        'soft-ambient': '0 4px 40px -4px rgba(0,0,0,0.03), 0 16px 56px -8px rgba(0,0,0,0.04)',
        'soft-inner': 'inset 0 1px 1px rgba(255,255,255,0.8), inset 0 0 0 1px rgba(0,0,0,0.02)',
      },
      transitionTimingFunction: {
        'fluid': 'cubic-bezier(0.32, 0.72, 0, 1)',
      }
    },
  },
  plugins: [],
}
