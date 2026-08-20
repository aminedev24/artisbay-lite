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
        primary: '#0f4c5c',
        brand: {
          navy: '#0f4c5c',
          'navy-dark': '#0a3641',
          charcoal: '#16232a',
          sky: '#2a9d8f',
          orange: '#e8622c',
          'orange-hover': '#d1531f',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', '"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
