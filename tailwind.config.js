/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Asymmetric Forest Palette
        primary: "#064E3B", // Forest Green
        "primary-dark": "#022C22",
        accent: "#BEF264", // Neon Lime
        "accent-dark": "#A3E635",
        "accent-light": "#D9F99D",
        base: "#F8FAFC", // Slate 50
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
