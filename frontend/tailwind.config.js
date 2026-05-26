export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        border: "var(--border)",
        navy: "var(--navy)",
        "navy-deep": "var(--navy-deep)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        map: "var(--map)",
        "map-line": "var(--map-line)",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Source Sans 3", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(26, 26, 26, 0.08)",
        card: "0 4px 16px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
  plugins: [],
};
