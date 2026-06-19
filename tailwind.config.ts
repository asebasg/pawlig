import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        role: {
          admin: "var(--role-admin)",
          shelter: "var(--role-shelter)",
          vendor: "var(--role-vendor)",
          adopter: "var(--role-adopter)",
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#7C3AED",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "var(--foreground)",
            a: {
              color: "var(--primary)",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            blockquote: {
              borderLeftColor: "var(--primary)",
              color: "var(--foreground)",
              opacity: 0.8,
            },
            "ol > li::marker": {
              color: "var(--primary)",
            },
            "ul > li::marker": {
              color: "var(--primary)",
            },
            code: {
              color: "var(--primary)",
            },
            p: {
              color: "var(--foreground)",
              opacity: 0.85,
            },
            li: {
              color: "var(--foreground)",
              opacity: 0.85,
              whiteSpace: "pre-line",
            },
            "--tw-prose-headings": "var(--primary)",
            "--tw-prose-links": "var(--primary)",
            "--tw-prose-bullets": "var(--primary)",
            "--tw-prose-counters": "var(--primary)",
            h1: { color: "var(--foreground)" },
            h2: {
              color: "var(--foreground)",
              borderBottomWidth: "2px",
              borderBottomColor: "var(--primary)",
              paddingBottom: "0.3rem",
            },
            h3: { color: "var(--foreground)" },
            h4: { color: "var(--foreground)" },
          },
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
