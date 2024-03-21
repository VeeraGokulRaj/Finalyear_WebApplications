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
        x: "10px 0 10px rgba(0, 0, 0, 0.1), -10px 0 10px rgba(0, 0, 0, 0.1)", // Shadow on both left and right sides
        xs: "7px 0 10px rgba(0, 0, 0, 0.1), -10px 0 10px rgba(0, 0, 0, 0.1)"
      },
      height: {
        "0.1": ".115rem"
      },
      padding: {
        "0.1": ".05rem"
      },
      width: {
        "15": "17.5%",
        "85": "82.5%",
        "200": "200%",
        "16.6": "16.66%"
      },
      fontSize: {
        basePlus: "1.15rem",
        extraSmall: "0.5rem",
        extraSmallPlus: "0.65rem"
      },
      fontWeight: {
        buttons: "450"
      },
      borderRadius: {
        btr: "10px", // border-top-right-radius: 10px
        bbl: "10px" // border-bottom-left-radius: 10px
      }
    }
  },
  plugins: []
};
