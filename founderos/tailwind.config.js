/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      animation: {
        fadeIn:  'fadeIn 0.25s ease both',
        slideUp: 'slideUp 0.3s ease both',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0, transform: 'translateY(6px)'  }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
