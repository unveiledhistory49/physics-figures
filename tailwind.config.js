/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Times New Roman'", 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#111827',
          800: '#1f2937',
          700: '#374151',
          500: '#6b7280',
          300: '#d1d5db',
          100: '#f3f4f6',
        }
      }
    },
  },
  plugins: [],
}
