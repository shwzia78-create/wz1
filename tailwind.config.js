/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        polaris: {
          bg: "#f6f6f7",
          surface: "#ffffff",
          border: "#e1e3e5",
          text: "#202223",
          brand: "#008060",
        },
      },
    },
  },
  plugins: [],
};
