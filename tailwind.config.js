/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: "var(--color-theme)",
        "theme-accent": "var(--color-theme-accent)",
        "theme-gradient": "var(--color-theme-gradient)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        montserrat: ["var(--font-montserrat)"],
      },
    },
  },
  plugins: [],
};
