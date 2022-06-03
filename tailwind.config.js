module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["GabrielSans", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        "primary-light": "#EFEFEF",
        "secondary-light": "#E5E5E5",
        "tertiary-light": "#A1A1A1",

        "primary-dark": "#141414",
        "secondary-dark": "#1C1C1C",
        "tertiary-dark": "#676767",

        "brand-blue": "#1973B6",

        black: "#141414",
      },
      animation: {
        "spin-slow": "spin 10s linear infinite",
        "pulse-slow": "pulse 7s linear infinite",
        "spin-cool": "spin 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ["hover", "focus"],
      display: ["group-hover"],
    },
  },
  plugins: [],
};
