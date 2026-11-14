/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f9f4',
          100: '#e1f2e6',
          200: '#c3e4cd',
          300: '#96d0a7',
          400: '#62b57b',
          500: '#3e9959',
          600: '#2f7c45',
          700: '#276239',
          800: '#234e30',
          900: '#1e4129',
          950: '#0c2314',
        },
        earth: {
          50: '#faf6f0',
          100: '#f2e9dc',
          200: '#e5d4bb',
          300: '#d4b793',
          400: '#c2966c',
          500: '#b47c4e',
          600: '#9d6340',
          700: '#804c35',
          800: '#693f30',
          900: '#563529',
        },
        sunshine: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
