/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        primary: '#7C3AED',
        secondary: '#A855F7',
        accent: '#06B6D4',
        pink: '#EC4899',
        orange: '#F97316',
      },
    },
  },
  plugins: [],
}
