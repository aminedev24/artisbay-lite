/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        md2: '720px',
      },
      colors: {
        primary: '#1e3a8a',
        accent: '#C0392B',
        'sky-blue': '#5D9CEC',
        'warm-orange': '#E67E22',
        'bg-light': '#f3f4f6',
        'text-slate': '#1e293b',
        'footer-dark': '#0f172a',
        'btn-yellow': '#F5B041',
        'btn-green': '#16a34a',
        brand: {
          navy: '#1e3a8a',
          sky: '#1da1f2',
          orange: '#f1892b',
          'orange-hover': '#ec971f',
        },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        'serif-display': ['"DM Serif Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
