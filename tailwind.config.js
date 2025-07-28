module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0A1733",
        primary: "#0090FF",
        accent: "#00B5B5",
        cta: "#FFAA00",
        light: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
