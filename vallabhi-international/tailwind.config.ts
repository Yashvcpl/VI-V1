import type { Config } from "tailwindcss";

/**
 * Design tokens for Vallabhi International.
 *
 * Retuned to match the approved homepage UI: a rich navy for headings and
 * the Advisory Process band, a forest green for CTAs/accents (from the
 * logo), pill-shaped buttons, and softly rounded cards - a friendlier,
 * more consumer-facing register than the earlier "statement/ledger" pass.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ledger: {
          DEFAULT: "#0E3A5C",
          50: "#EAF1F6",
          100: "#CFDFEA",
          300: "#5C88A3",
          500: "#1D5478",
          700: "#0A2C46",
          900: "#061D30",
        },
        growth: {
          DEFAULT: "#1F7A4C",
          100: "#DCEFDF",
          300: "#5CAF7B",
          500: "#1F7A4C",
          700: "#155C39",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          dim: "#F3F7F5",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-source-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      maxWidth: {
        content: "1240px",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
