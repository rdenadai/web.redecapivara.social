/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        capivara: {
          brown: "#7A5C3E",
          "sky-blue": "#4DA6FF",
          "off-white": "#F5F5F5",
          stone: "#444444",
          "green-lake": "#3DBB84",
        },
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
