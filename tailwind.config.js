/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        holo: {
          50: '#e0faff',
          100: '#b3f4ff',
          200: '#80edff',
          300: '#4de6ff',
          400: '#26e0ff',
          500: '#00d9ff', // Neon Cyan
          600: '#00addc',
          700: '#0081a7',
          800: '#005670',
          900: '#002b38',
        },
        space: {
          900: '#050b14', // Deep background
          800: '#0a1525', // Card background
          700: '#11223d',
        },
        neon: {
          pink: '#ff00ff',
          purple: '#bc13fe',
          green: '#00ff9d',
        }
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.holo.500"), 0 0 20px theme("colors.holo.500")',
        'neon-pink': '0 0 5px theme("colors.neon.pink"), 0 0 20px theme("colors.neon.pink")',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #11223d 1px, transparent 1px), linear-gradient(to bottom, #11223d 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
