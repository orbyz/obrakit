import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F2747",
        "primary-light": "#173A69",

        accent: "#F5B301",
        "accent-hover": "#E5A500",

        background: "#F8FAFC",
        surface: "#FFFFFF",

        text: "#1E293B",
        muted: "#64748B",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",

        border: "#E2E8F0",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        card: "0 4px 12px rgba(15,39,71,0.08)",
        elevated: "0 8px 24px rgba(15,39,71,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
