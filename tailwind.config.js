/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        labsMono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      colors: {
        labs: {
          bg: "#e4eaf1",
          panel: "rgba(255, 255, 255, 0.92)",
          panel2: "#f1f5f9",
          border: "#e2e8f0",
          accent: "#059669",
          accentMuted: "#10b981",
          glow: "#047857",
          text: "#0f172a",
          textMuted: "#475569",
          danger: "#dc2626",
          warning: "#d97706",
          ok: "#16a34a",
        },
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          400: '#34d399',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
    },
  },
  plugins: [],
}