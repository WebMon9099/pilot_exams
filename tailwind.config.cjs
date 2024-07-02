/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        title: ['3rem', '1'],
        'small-title': ['1.5rem', '2rem'],
        small: ['0.875rem', '1.25rem'],
        'extra-small': ['0.75rem', '1rem'],
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'theme-blue': '#00acdd',
        'theme-dark-blue': '#1b8ac0',
        'theme-green': '#74d813',
        'theme-red': '#d33167',
        'theme-border': '#e0e0e0',
        'theme-light-gray': '#c6c6c6',
        'theme-medium-gray': '#8e8e8e',
        'theme-dark-gray': '#6b6b6b',
        'theme-extra-dark-gray': '#3d3d3d',
      },
      screens: {
        '2xs': '400px',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
