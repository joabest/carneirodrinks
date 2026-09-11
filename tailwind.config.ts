import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        carneiro: {
          black: "#0a0605",
          panel: "#130d0d",
          panel2: "#1b1011",
          wine: "#2c050a",
          red: "#d0102f",
          red2: "#a70018",
          white: "#fff7f7"
        }
      },
      boxShadow: { glow: "0 0 35px rgba(208,16,47,.22)" }
    }
  },
  plugins: []
};

export default config;
