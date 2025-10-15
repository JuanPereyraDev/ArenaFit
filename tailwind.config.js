/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'arena-yellow': '#FFD600',
        'arena-green': '#00FF7F',
        'arena-red': '#FF4C4C',
        'arena-bg': '#0e0e0e'
      }
    },
  },
  plugins: [],
}
