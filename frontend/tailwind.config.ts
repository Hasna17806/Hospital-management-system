import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F2438",        // deep navy — headings, sidebar
        teal: "#0E7C7B",       // primary accent
        "teal-light": "#E4F3F2",
        coral: "#E8623D",      // urgent / cancelled
        amber: "#D99A2B",      // scheduled
        leaf: "#3F9142",       // completed / success
        canvas: "#F5F7F8",     // page background
        line: "#E4E9EC",       // borders
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 36, 56, 0.04), 0 8px 24px rgba(15, 36, 56, 0.06)",
        "card-hover": "0 4px 10px rgba(15, 36, 56, 0.08), 0 16px 32px rgba(15, 36, 56, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
