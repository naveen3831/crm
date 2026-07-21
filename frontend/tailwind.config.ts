import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand dark (replaces navy)
        navy: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#d97706",
          800: "#92400e",
          850: "#78350f",
          900: "#451a03",
          950: "#1a0f00",
        },
        // Orange accent (replaces blue)
        orange: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#d97706",
          800: "#c2410c",
          900: "#9a3412",
        },
        pipeline: {
          red: {
            100: "#FCE4E6",
            500: "#EE4047",
            600: "#D92E35",
          },
          amber: {
            100: "#FFF1D5",
            400: "#FFB726",
            500: "#FF9F0A",
            600: "#E38B00",
          },
          green: {
            100: "#DEF8E7",
            500: "#27C15A",
            600: "#169B45",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-manrope)", "sans-serif"],
      },
      boxShadow: {
        glass:    "0 8px 32px 0 rgba(26, 15, 0, 0.08)",
        card:     "0 14px 38px rgba(26, 15, 0, 0.08), 0 3px 10px rgba(26, 15, 0, 0.04)",
        elevated: "0 20px 55px rgba(26, 15, 0, 0.10)",
        product:  "0 38px 100px rgba(26, 15, 0, 0.20), 0 14px 36px rgba(249, 115, 22, 0.12)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
