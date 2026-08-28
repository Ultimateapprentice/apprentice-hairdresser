import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Figtree", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
