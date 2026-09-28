import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#FAF7F2",
          100: "#F4EDE2",
          200: "#E7D8C1",
          300: "#D6BF9B",
          400: "#C4A474",
          500: "#B58E55",
          600: "#9C7641",
          700: "#7F5E32",
          800: "#65492A",
          900: "#4D3720",
        },
        luxury: {
          black: "#0D0D0E",
          dark: "#141416",
          card: "#1C1C20",
          charcoal: "#26262B",
          muted: "#7A7A85",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
