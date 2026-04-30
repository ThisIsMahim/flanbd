/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand (Crimson)
        brand: {
          50: "var(--brand-50)",
          100: "var(--brand-100)",
          200: "var(--brand-200)",
          300: "var(--brand-300)",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
          700: "var(--brand-700)",
          800: "var(--brand-800)",
          900: "var(--brand-900)",
        },
        // Luxury Accent (Gilded Gold)
        gold: {
          50: "var(--gold-50)",
          100: "var(--gold-100)",
          200: "var(--gold-200)",
          300: "var(--gold-300)",
          400: "var(--gold-400)",
          500: "var(--gold-500)",
          600: "var(--gold-600)",
          700: "var(--gold-700)",
          800: "var(--gold-800)",
          900: "var(--gold-900)",
        },
        // Deep Neutrals (Ink)
        ink: {
          800: "var(--ink-800)",
          900: "var(--ink-900)",
          950: "var(--ink-950)",
        },
        // Semantic Mappings
        accent: "var(--brand-500)",
        surface: "var(--ink-950)",
        border: "var(--glass-border)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "cursive"],
      },
      animation: {
        "shimmer-gold": "shimmer 3s infinite linear",
        "pulse-brand": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
