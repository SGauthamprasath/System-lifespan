/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kronos: {
          bg: "#050508",
          card: "rgba(19,19,23,0.8)",
          primary: "#00FFD1", // electric teal
          secondary: "#7B61FF", // holographic purple
          secondaryLight: "#c9bfff",
          warning: "#ffba26", // amber gold
          critical: "#ffb4ab", // error red
          muted: "#1A1A2E" // grid dots/lines
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        'hud-grid': 'radial-gradient(rgba(26, 26, 46, 0.4) 1px, transparent 1px)',
      },
      animation: {
        'scanline': 'scan 6s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(0, 255, 209, 0.2)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 2px rgba(0, 255, 209, 0.1)' }
        }
      }
    },
  },
  plugins: [],
}
