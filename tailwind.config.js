/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF3E0',
        primary: '#2C3E50',
        secondary: '#9B59B6',
        accent: '#E74C3C',
      },
      boxShadow: {
        'paper': '0 1px 3px rgba(0, 0, 0, 0.06)',
        'card': '0 2px 6px rgba(0, 0, 0, 0.08)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
