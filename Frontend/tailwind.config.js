/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#70C6D7",
        secondary: "#E5A844",
        accent: "#FCA06E",
        danger: "#A93321",
        background: "#F5FAFA",
        card: "#FFFFFF",
        "text-main": "#234954",
        "text-muted": "#688A94",
        border: "#2349541A",
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