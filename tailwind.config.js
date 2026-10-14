/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zenith: {
          green: {
            DEFAULT: '#044e29',
            light: '#0a6b3b',
            dark: '#02331b',
            accent: '#10b981',
          },
          gold: {
            DEFAULT: '#d4af37',
            light: '#f5d77f',
            dark: '#aa8c2c',
          },
          dark: '#0c130f',
          surface: '#151e18',
          border: '#223328',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['"Montserrat"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'emerald-glow': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
