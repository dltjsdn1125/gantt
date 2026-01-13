import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5B4FFF",
          foreground: "#ffffff",
        },
        background: {
          light: "#F6F7FB",
          dark: "#0B0E14",
          DEFAULT: "#F6F7FB",
        },
        success: "#00C875",
        warning: "#FDAB3D",
        danger: "#E2445C",
        border: {
          light: "#E2E8F0",
          dark: "#2D3748",
        },
        sidebar: {
          light: "#FFFFFF",
          dark: "#181A1F",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
