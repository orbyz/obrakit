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
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",

        secondary: "var(--secondary)",
        "secondary-light": "var(--secondary-light)",

        background: "var(--background)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",

        foreground: "var(--foreground)",
        text: "var(--text)",
        muted: "var(--muted)",
        "muted-light": "var(--muted-light)",

        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",

        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        input: "var(--input)",
        ring: "var(--ring)",

        accent: "var(--primary)",
        "accent-hover": "var(--primary-hover)",
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
