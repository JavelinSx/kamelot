// tailwind.config.js - Конфигурация Tailwind CSS
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        gray: {
          950: "#0a0a0a",
          900: "#111111",
          850: "#1a1a1a",
          800: "#1f1f1f",
          750: "#262626",
          700: "#404040",
          600: "#525252",
          500: "#737373",
          400: "#a3a3a3",
          300: "#d4d4d4",
          200: "#e5e5e5",
          100: "#f5f5f5",
          50: "#fafafa",
        },
        red: {
          950: "#450a0a",
          900: "#7f1d1d",
          800: "#991b1b",
          700: "#b91c1c",
          600: "#dc2626",
          500: "#ef4444",
          400: "#f87171",
          300: "#fca5a5",
          200: "#fecaca",
          100: "#fee2e2",
          50: "#fef2f2",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      animation: {
        "pulse-red": "pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      boxShadow: {
        red: "0 10px 15px -3px rgb(220 38 38 / 0.1), 0 4px 6px -2px rgb(220 38 38 / 0.05)",
        "red-lg": "0 25px 50px -12px rgb(220 38 38 / 0.25)",
        dark: "0 25px 50px -12px rgb(0 0 0 / 0.5)",
        "inner-red": "inset 0 2px 4px 0 rgb(220 38 38 / 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-red": "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
        "gradient-red-dark":
          "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)",
        "gradient-black": "linear-gradient(135deg, #111111 0%, #000000 100%)",
        "gradient-radial":
          "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      scale: {
        102: "1.02",
        103: "1.03",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    // Кастомный плагин для дополнительных утилит
    function ({ addUtilities, addComponents, theme }) {
      // Утилиты для текстовых градиентов
      addUtilities({
        ".text-gradient-red": {
          "background-image":
            "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
          "background-clip": "text",
          "-webkit-background-clip": "text",
          color: "transparent",
        },
        ".text-shadow-red": {
          "text-shadow": "0 0 10px rgba(220, 38, 38, 0.5)",
        },
        ".text-shadow-white": {
          "text-shadow": "0 0 10px rgba(255, 255, 255, 0.5)",
        },
      });

      // Компоненты для боевых единоборств
      addComponents({
        ".martial-arts-card": {
          "@apply bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-600 transition-all duration-300 group hover-lift hover-glow":
            {},
        },
        ".fighter-badge": {
          "@apply inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white":
            {},
        },
        ".difficulty-badge": {
          "&.beginner": {
            "@apply bg-green-600 text-white": {},
          },
          "&.intermediate": {
            "@apply bg-yellow-500 text-black": {},
          },
          "&.advanced": {
            "@apply bg-red-600 text-white": {},
          },
        },
        ".category-icon": {
          "@apply w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-2xl":
            {},
        },
      });
    },
  ],
};
