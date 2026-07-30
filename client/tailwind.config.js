/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rocket: {
          pink: '#ff2a75',
          purple: '#a855f7',
          dark: '#0d0118',
        },
      },
    },
  },
  plugins: [],
}