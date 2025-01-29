import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to bottom left, var(--color-gradient), var(--color-accent))',
      },
      boxShadow: {
        'custom-right-down': '5px 5px 0 var(--color-text)',
        'custom-right-down-hover-7': '7px 7px 0 var(--color-text)',
        'custom-right-down-hover': '10px 10px 0 var(--color-text)',
      },
    },
  },
  plugins: [],
} satisfies Config;
