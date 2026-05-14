/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#22C55E",
        danger: "#EF4444",
        background: "#F8FAFC",
        card: "#FFFFFF",
        "text-main": "#0F172A",
        "text-muted": "#64748B",
        border: "#E2E8F0",
      },
      borderRadius: {
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}