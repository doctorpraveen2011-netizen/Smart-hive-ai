/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#060B14",
        panel: "#0B132B",
        card: "#0D1836",
        surface: "#111C3D",
        border: "rgba(0, 240, 255, 0.15)",
        cyan: {
          400: "#38BDF8",
          500: "#00F0FF",
          600: "#0284C7",
        },
        navy: {
          950: "#040810",
          900: "#060B14",
          850: "#09101F",
          800: "#0D1527",
          700: "#14213D",
          600: "#1E2F54",
        },
        threat: {
          critical: "#EF4444",
          high: "#F97316",
          medium: "#EAB308",
          low: "#10B981",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 240, 255, 0.2)',
        'red-glow': '0 0 15px rgba(239, 68, 68, 0.25)',
        'blue-glow': '0 0 15px rgba(59, 130, 246, 0.25)',
      },
    },
  },
  plugins: [],
}
