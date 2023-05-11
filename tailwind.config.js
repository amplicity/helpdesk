/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx, html}",
    "./node_modules/tw-elements/dist/js/**/*.js",
    "./pages/**.{js,jsx,ts,tsx, html}"],
  theme: {
    extend: {
      colors: {
        "space": "#253237",
        "code-400": "#fefcf9",
        "code-600": "#3c455b",
        "organyze-blue": "DodgerBlue",
        "organyze-green": "green",
        "organyze-coral": "coral",
        "organyze-purple": "purple",
      },
      main: "#F3705B",
      primary: colors.red,
      secondary: colors.emerald,
      tertiary: colors.gray,
      danger: colors.red,

    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require('tw-elements/dist/plugin'),
  ],
}
