/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors - Can be customized based on your brand
        primary: {
          50: "var(--primary-50, #eff6ff)",
          100: "var(--primary-100, #dbeafe)",
          200: "var(--primary-200, #bfdbfe)",
          300: "var(--primary-300, #93c5fd)",
          400: "var(--primary-400, #60a5fa)",
          500: "var(--primary-500, #3b82f6)",
          600: "var(--primary-600, #2563eb)",
          700: "var(--primary-700, #1d4ed8)",
          800: "var(--primary-800, #1e40af)",
          900: "var(--primary-900, #1e3a8a)",
        },
        // Import other color variables from theme.css
        success: {
          50: "var(--success-50)",
          500: "var(--success-500)",
          600: "var(--success-600)",
        },
        error: {
          50: "var(--error-50)",
          500: "var(--error-500)",
          600: "var(--error-600)",
        },
        warning: {
          50: "var(--warning-50)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
        },
        info: {
          50: "var(--info-50)",
          500: "var(--info-500)",
          600: "var(--info-600)",
        },
      },
    },
  },
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
};
