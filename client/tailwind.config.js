/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        primary: "#10b981",
        secondary: "#273549",
        tertiary: "#1B2533",
      },
    },
  },
  plugins: [],
};
