import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EEF2F0",     // page background — clinical grey-mint
        ink: "#17242B",       // primary text
        "ink-soft": "#4B5A60",
        line: "#C7D2CE",      // hairlines, chart-grid, borders
        chart: "#2B5F82",     // primary interactive accent
        "chart-soft": "#E4EDF2",
        vital: "#B3271F",     // cancelled / danger
        "vital-soft": "#F5E4E2",
        mend: "#21694A",      // completed / success
        "mend-soft": "#E2EEE7",
        watch: "#B4791F",     // scheduled / warning
        "watch-soft": "#F3EBDC",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      borderRadius: {
        chart: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
