import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#120b08",
          900: "#1c1410",
          800: "#2a1f1a"
        },
        parchment: {
          50: "#f7f2ef",
          100: "#efe7e1",
          200: "#d9cec6",
          300: "#c5b7ad"
        },
        stoneglass: {
          50: "#f6f4f2",
          100: "#e9e2de",
          200: "#cbbfb6"
        },
        night: {
          950: "#0b0b0f",
          900: "#15131b",
          800: "#1f1b28"
        },
        bloom: {
          100: "#f2e4e6",
          200: "#ebc9d4",
          300: "#e5a8b8"
        },
        lavender: {
          100: "#ded7ea",
          200: "#c4b5d8",
          300: "#aa96c9"
        }
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 20px 50px rgba(16, 8, 6, 0.25)",
        soft: "0 10px 30px rgba(0, 0, 0, 0.12)"
      },
      backdropBlur: {
        glass: "18px"
      },
      keyframes: {
        mesh: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(4%, -2%, 0)" }
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        mesh: "mesh 18s ease-in-out infinite",
        floaty: "floaty 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
