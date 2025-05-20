/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4E4456',
          light: '#9C8AA5',
          dark: '#3A3340',
        },
        secondary: {
          DEFAULT: '#36B3C2',
          light: '#7FD1DB',
          dark: '#2A8A95',
        },
        accent: {
          DEFAULT: '#FFB547',
          light: '#FFCF85',
          dark: '#E09A30',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}