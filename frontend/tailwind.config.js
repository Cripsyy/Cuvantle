/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        correct: '#6aaa64',
        present: '#c9b458',
        absent: '#787c7e',
        'key-bg': '#d3d6da',
        'key-evaluated-bg': '#818384'
      },
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'bounce-in': 'bounceIn 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(-90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
    },
  },
  plugins: [],
}
