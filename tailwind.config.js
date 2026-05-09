/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': 'var(--color-bg-dark)',
        'accent': 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'whatsapp': 'var(--color-whatsapp)',
        'glass-border': 'var(--color-glass-border)',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
