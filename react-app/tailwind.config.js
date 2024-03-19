/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms"
      },
      boxShadow: {
        x: "10px 0 10px rgba(0, 0, 0, 0.1), -10px 0 10px rgba(0, 0, 0, 0.1)" // Shadow on both left and right sides
      }
    }
  },
  plugins: []
};
