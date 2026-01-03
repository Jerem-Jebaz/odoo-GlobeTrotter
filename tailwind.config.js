/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: '#F9F7F2',
        moss: '#2D332D',
        sienna: '#A0522D',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      boxShadow: {
        glass: '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
