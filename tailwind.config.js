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
        brand: {
          navy: '#1e3a8a',
          'navy-dark': '#16305f',
          charcoal: '#1c1f33',
          sky: '#1da1f2',
          orange: '#f1892b',
          'orange-hover': '#ec971f',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', '"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
