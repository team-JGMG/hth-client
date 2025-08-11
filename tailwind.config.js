/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './public/**/*.html'],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOutUp: {
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.22s ease-out',
        fadeOutUp: 'fadeOutUp 0.22s ease-in forwards',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
}

export default config
