/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0b",
          900: "#101113",
          800: "#17181b",
        },
        graphite: "#3a3d44",
        mist: "#6b6f76",
        haze: "#9aa0a8",
        line: "rgba(10,10,11,0.08)",
        paper: "#f7f7f5",
        accent: {
          DEFAULT: "#3b6cf6",
          soft: "#5b82f7",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      letterSpacing: {
        label: "0.22em",
        tightish: "-0.02em",
        tighter2: "-0.035em",
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "28px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,10,11,0.04), 0 12px 40px -12px rgba(10,10,11,0.12)",
        lift: "0 2px 4px rgba(10,10,11,0.04), 0 24px 64px -20px rgba(10,10,11,0.22)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.6), 0 8px 30px -10px rgba(10,10,11,0.18)",
      },
      maxWidth: {
        content: "1180px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "line-pan": {
          "0%": { transform: "translateX(-30%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(130%)", opacity: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        "line-pan": "line-pan 7s cubic-bezier(0.22,1,0.36,1) infinite",
        float: "float 9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
