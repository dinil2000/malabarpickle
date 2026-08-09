/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#7A0000',
          red: '#A81010',
          crimson: '#C81E1E',
          accent: '#E65100',
          gold: '#D4AF37',
          amber: '#F59E0B',
          green: '#1B4332',
          cream: '#FFFBEF',
          surface: '#FDFBF7',
          darkbg: '#121212',
          card: '#1E1E1E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
