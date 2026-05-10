/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#0C8CE9",
        grayCustom: "#6C6C6C",
      },
    },
  },
  plugins: [require("daisyui")],
};
